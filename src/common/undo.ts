import { EVENTS } from './constants/index'
import { EventEmitter } from 'events'

type OperateType = 'undo' | 'redo' | 'custom'

const EXECUTOR_RESULT_NEXT = 'next'
const EXECUTOR_RESULT_BREAK = 'break'
type ExecutorResult = (typeof EXECUTOR_RESULT_NEXT) | (typeof EXECUTOR_RESULT_BREAK)

export interface Task {
  type?: any
  undo?(): any
  redo?(): any
}

const DEFAULT_LIMITED_LENGTH = 20

const DEFAULT_GROUP_NAME = '__default__'

const DEFAULT_EXECUTOR = function(operateType, tasks: Task[]) {
  const length = tasks.length
  if (operateType === 'undo') {
    for (let i = length - 1; i >= 0; i--) {
      const task = tasks[i]
      if (task.undo) task.undo()
    }
  } else if (operateType === 'redo') {
    for (let i = 0; i < length; i++) {
      const task = tasks[i]
      if (task.redo) task.redo()
    }
  }
  return EXECUTOR_RESULT_BREAK
}

class Group {

  private _identifier: string
  private _executor: Function
  private _tasks: Task[]
  
  constructor (identifier: string, executor?: Function) {
    this._identifier = identifier
    this._executor = executor

    this._tasks = []
  }

  getName() {
    return this._identifier
  }

  push(task: Task) {
    this._tasks.push(task)
  }

  pop() {
    this._tasks.pop()
  }

  execute(operateType: OperateType): ExecutorResult {
    let executorResult = EXECUTOR_RESULT_BREAK
    const executor = this._executor ? this._executor : DEFAULT_EXECUTOR
    const newTasks = Array.from(this._tasks)
    const result = executor(operateType, newTasks)
    if (!result) executorResult = EXECUTOR_RESULT_NEXT
    return executorResult as ExecutorResult
  }

}

interface UndoManagerOption {
  limit?: number
}

class UndoManager extends EventEmitter {

  private _undoStack: Group[] = []
  private _redoStack: Group[] = []
  private _standbyGroup: Group

  private _limitedLength = DEFAULT_LIMITED_LENGTH

  private _canRecord = true
  private _blocking = false
  private _allInOne = false

  private _nameToTagGroup: Map<string, Group> = new Map()

  private TIMEOUT_ID: any

  constructor(options: UndoManagerOption = { limit: DEFAULT_LIMITED_LENGTH }) {
    super()
    this.setStackLimitedLength(options.limit)
  }

  setRecordState(canRecord: boolean) {
    this._canRecord = canRecord
  }

  keepAllInOne(allInOne: boolean) {
    if (this._allInOne !== allInOne) {
      this._allInOne = allInOne
      if (!allInOne) {
        this._resetStandbyGroup()
      }
    }
  }

  setStackLimitedLength(length: number) {
    this._limitedLength = length

    const undoStackLength = this._undoStack.length
    const redoStackLength = this._redoStack.length

    if (this._limitedLength < undoStackLength) {
      this._undoStack.slice(undoStackLength - this._limitedLength, undoStackLength)
    } else if (this._limitedLength < undoStackLength + redoStackLength) {
      this._redoStack.slice(redoStackLength + undoStackLength - this._limitedLength, this._limitedLength - undoStackLength)
    }
  }

  _genNewGroup(name: string, executor?: Function) {
    const newGroup = new Group(name, executor)
    this._changeUndoStack(newGroup)
    this._redoStack.length = 0
    if (this._undoStack.length + this._redoStack.length > this._limitedLength) {
      this._undoStack = this._undoStack.slice(1, this._limitedLength)
    }
    return newGroup
  }

  _autoStandbyGroup() {
    clearTimeout(this.TIMEOUT_ID)
    this.TIMEOUT_ID = setTimeout(() => {
      if (this._allInOne) return
      this._resetStandbyGroup()
    }, 0)
    const newGroup = this._genNewGroup(DEFAULT_GROUP_NAME)
    return newGroup
  }

  add(task: Task, type?: any) {
    this.push(task, type)
  }

  push(task: Task, type?: any) {
    if (!this._canRecord) return

    if (this._blocking) return

    task.type = type

    if (!this._standbyGroup) {
      this._standbyGroup = this._autoStandbyGroup()
    }
    this._standbyGroup.push(task)
  }

  pop() {
    const group = this._changeUndoStack()
    this._redoStack.length = 0
    this._nameToTagGroup.delete(group && group.getName())
    this._resetStandbyGroup()
    return group
  }

  /**
   * Append to last group which is not tag group
   * @param {*} task
   * @param {*} type
   */
  append(task: Task, type: any) {
    if (!this._canRecord) return

    if (this._blocking) return

    task.type = type

    let lastGroup = this.getLastGroup()
    if (!lastGroup || this.isTagGroup(lastGroup)) {
      lastGroup = this._genNewGroup(DEFAULT_GROUP_NAME)
    }
    lastGroup.push(task)
  }

  getLastGroup() {
    return this._undoStack[this._undoStack.length - 1]
  }

  isTagGroup(group: Group) {
    return this._nameToTagGroup.has(group.getName())
  }

  pushTag(tagName: string, executor?: Function) {
    if (!this._canRecord) return

    if (this._blocking) return

    if (this._nameToTagGroup.has(tagName)) return

    this._resetStandbyGroup()

    const newGroup = this._genNewGroup(tagName, executor)
    this._nameToTagGroup.set(tagName, newGroup)
  }

  popTag(tagName: string) {
    this._resetStandbyGroup()

    const group = this._nameToTagGroup.get(tagName)
    const indexForUndo = this._undoStack.indexOf(group)
    if (indexForUndo > -1) {
      this._undoStack.splice(indexForUndo, 1)
    }
    const indexForRedo = this._redoStack.indexOf(group)
    if (indexForRedo > -1) {
      this._redoStack.splice(indexForRedo, 1)
    }
    this._nameToTagGroup.delete(tagName)
    return group
  }

  undo() {
    this._blocking = true
    this._resetStandbyGroup()
    const currentGroup = this._changeUndoStack()
    if (currentGroup) {
      this._redoStack.push(currentGroup)
      const result = currentGroup.execute('undo')
      if (result === EXECUTOR_RESULT_NEXT) {
        this.undo()
      }
    }
    this._blocking = false
  }

  redo() {
    this._blocking = true
    this._resetStandbyGroup()
    const currentGroup = this._redoStack.pop()
    if (currentGroup) {
      this._changeUndoStack(currentGroup)
      const result = currentGroup.execute('redo')
      if (result === EXECUTOR_RESULT_NEXT) {
        this.redo()
      }
    }
    this._blocking = false
  }

  _resetStandbyGroup() {
    this._standbyGroup = null
  }

  _changeUndoStack(group?: Group) {
    let result = group ? (this._undoStack.push(group), group) : this._undoStack.pop()
    Promise.resolve().then(() => {
      this.emit(EVENTS.UNDO_STATE_CHANGE, { canUndo: this.canUndo(), canRedo: this.canRedo() })
    })
    return result
  }

  isExecuting() {
    return this._blocking === true
  }

  canUndo() {
    return this._undoStack.length > 0
  }

  canRedo() {
    return this._redoStack.length > 0
  }

  clearRedo() {
    this._redoStack.length = 0
  }

  getIndex() {
    return this._undoStack.length - 1
  }

}

export default UndoManager
