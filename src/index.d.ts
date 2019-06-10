// global namespace
declare namespace core {

  /**
   * @default Base Event extends from Backbone
   */
  export class BaseEvent {
    /**
     * @description Listener
     */
    listenTo(): any;

    /**
     * @description trigger
     */
    trigger(): any;
  }

  /**
   * @description Base Model that includes a few common methods
   * @extends BaseEvent
   */
  export class BaseModel extends BaseEvent {

    toString(): string;

    toJSON(): Object;

    getConfig(): any;

    getId(): string;

    remove(): void;

    get(key: string): any;

    set(key: string, value: any): void;
  }

  export class Component extends BaseModel {

    /**
     * @description Get workbook
     * @param {Workbook} workbook 
     */
    ownerWorkbook (workbook: Workbook | void): Workbook;

    /**
     * @description Get sheet
     * @param {Sheet} sheet 
     */
    ownerSheet(sheet: Sheet): Sheet;

    /**
     * @description Get parent of current component
     * @param {Component} [parent]
     * @return {R}
     */
    parent<R extends Topic>(parent?: Component): R;

    /**
     * @description Check current component's relationships
     */
    isOrphan (): boolean;
  }


  export class Topic extends Component {
    /**
     * @description Get type of the topic
     * @return {String}
     */
    getType(): String;

    /**
     * @description Get children by type
     * @param {String | Array<String>} type - allow use single type or an array of types
     * @return {Array<Child>}
     */
    getChildrenByType<Child>(type: string | Array<string>): Array<Child>;

    /**
     * @description Get summaries
     */
    getSummaries<Summary>(): Array<Summary>;

    /**
     * @description Add a child topic on current topic
     * @param {T} childTopic 
     * @param {Object} [options]
     * @return {R}
     */
    addChildTopic<T, R>(childTopic: T, options?: Object): R;

    /**
     * @description Remove child topic
     * @param {T} childTopic
     * @return {void}
     */
    removeChildTopic<T>(childTopic: T): void;

    /**
     * @description Moving the child topic
     * @param {Number} from 
     * @param {Number} to
     * @return {boolean}
     */
    moveChildTopic(from: number, to: number): boolean;

    /**
     * @description Add summary with a range
     * @param {S} summary 
     * @param {T} topic 
     * @param {Object} [options]
     * @return {R}
     */
    addSummary<S, T, R>(summary: S, topic: T, options?: Object): R;

    /**
     * @description Remove summary
     * @param {S} summary 
     */
    removeSummary<S>(summary: S): void;

    /**
     * @description Get markers
     * @return {Array<M>}
     */
    getMarkers<M>(): Array<M>;

    /**
     * @description Add marker
     * @param {M} marker
     * @param {Object} [options]
     * @return {R}
     */
    addMarker<M, R>(marker: M, options?: Object): R;

    /**
     * @description Remove marker
     * @param {Marker} marker 
     */
    removeMarker<Marker>(marker: Marker): void;

    /**
     * @description Get notes
     * @return {R}
     */
    getNotes<R>(): R;

    /**
     * @description Add note
     * @param {N} note
     * @param {Object} [options]
     * @return {R}
     */
    addNotes<N, R>(note: N, options?: object): R;

    /**
     * @description Remove notes
     */
    removeNotes(): void;

    /**
     * @description Check topic is or not root topic
     * @return {Boolean}
     */
    isRootTopic (): boolean;

    /**
     * @description Get topic title
     * @return {String}
     */
    getTitle(): string;

    /**
     * @description Update topic title
     * @param title 
     */
    changeTitle(title: string): void;
  }

  /**
   * @description The Sheet class
   */
  export class Sheet extends Component {

    /**
     * @description Get intance of Theme
     * @return {T}
     */
    getTheme<T>(): T;

    /**
     * @description Change theme background
     * @param {T} themeData
     * @param {Object} options
     * @return {void}
     */
    changeTheme<T>(themeData: T, options?: Object): void;

    /**
     * @description Create component
     * @param {T} data
     * @param {Object} [options]
     * @return {void}
     */
    createComponent<T, R extends Topic, Component>(data: T, options?: Object): R;

    /**
     * @description Generate an unique componentId
     * @return {String}
     */
    generateComponentId(): string;

    /**
     * @description Find component by id
     * @param {String} id
     * @return {R}
     */
    findComponentById<R extends Topic, Component>(id: string): R;

    /**
     * @description Change sheet title
     * @param {String} title 
     * @return {void}
     */
    changeTitle(title: string): void;

    /**
     * @description Get sheet title
     * @return {String}
     */
    getTitle(): string;

    /**
     * @description Get root topic
     * @return {Topic}
     */
    getRootTopic(): Topic;
  }

  type WorkbookOption = {
    id: string;
    sheetTitle: string;
    rootTopic: {
      id: string;
      title: string;
    }
  };

  export type WorkbookOptions = Array<WorkbookOption>;

  export class Workbook extends BaseModel {
    
    constructor(options: WorkbookOptions);

    /**
     * @description Add a sheet on current workbook
     * @param {Sheet} sheetData 
     * @param {Object} [options] 
     */
    addSheet(sheetData: Sheet, options?: object): Sheet;

    /**
     * @description Remove a sheet from current workbook
     * @param {String} sheetId 
     */
    removeSheet(sheetId: string): boolean;

    /**
     * @description Get a sheet instance
     * @param {String} sheetId 
     */
    getSheetById(sheetId: string): Sheet;

    /**
     * @description Get all sheets from current workbook
     */
    getSheets(): Array<Sheet>;
  }

  namespace Core {}
}

export = core;