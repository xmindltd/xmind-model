const Workbook = require('../../dist/models/workbook').default
const { expect } = require('chai')

const workbookData = [
  {
    id: '1',
    title: 'sheet-1',
    rootTopic: {
      id: 't1'
    }
  },
  {
    id: '2',
    title: 'sheet-2',
    rootTopic: {
      id: 't2'
    }
  },
  {
    id: '3',
    title: 'sheet-3',
    rootTopic: {
      id: 't3'
    }
  }
]

describe('workbook model', () => {
  it ('init sheets data', () => {
    const workbookModel = new Workbook(workbookData)

    const sheetModelList = workbookModel.getSheets()

    sheetModelList.forEach((sheetModel, index) => {
      expect(sheetModel.getId() === workbookData[index].id).to.be.true
    })
  })

  it ('add and remove sheet', () => {
    const workbookModel = new Workbook(workbookData)

    const newSheetModel = workbookModel.addSheet({ id: '114514', title: '良いよこいよ', rootTopic: { id: 't4' } })
    expect(workbookModel.getSheets().indexOf(newSheetModel) === workbookModel.getSheets().length - 1).to.be.true

    workbookModel.getUndo().undo()

    expect(workbookModel.getSheets().indexOf(newSheetModel) === -1).to.be.true
    workbookModel.toJSON().forEach((sheetData, index) => {
      expect(sheetData.id === workbookData[index].id).to.be.true
    })

    workbookModel.getUndo().redo()
    expect(workbookModel.getSheets()[workbookModel.getSheets().length - 1].getId() === newSheetModel.getId()).to.be.true
  })

  it ('move sheet index', () => {
    const workbookModel = new Workbook(workbookData)

    expect(workbookModel.getSheets()[0].getId() === workbookData[0].id).to.be.true
    expect(workbookModel.getSheets()[1].getId() === workbookData[1].id).to.be.true
  })

  it ('create new empty sheet', () => {
    const workbookModel = new Workbook(workbookData)

    const newSheetModel = workbookModel.createEmptySheet('newSheetTitle', 'newRootTopicTitle')
    expect(newSheetModel.getTitle() === 'newSheetTitle').to.be.true
    expect(newSheetModel.getRootTopic().getTitle() === 'newRootTopicTitle').to.be.true
  })
})
