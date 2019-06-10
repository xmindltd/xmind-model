
import Core from '../src';
// or
// import * as Core from '../src';

const wb = new Core.Workbook([{id: '1', sheetTitle: '123', rootTopic: {id: '2', title: 'roottopic'}}]);
const sheet = wb.getSheetById('1');

const topic = sheet.getRootTopic()

topic.addChildTopic({title: '123123', id: 'asdada-asdasdd-lkj-sdfg-dskfhsj'});