

import * as Core from '../src';

const wb = new Core.Workbook([{id: '1', sheetTitle: '123', rootTopic: {id: '2', title: 'roottopic'}}]);
const sheet = wb.getSheetById('1');

const topic = sheet.getRootTopic();

topic.addChildTopic({title: '123123', id: 'asdada-asdasdd-lkj-sdfg-dskfhsj'});

console.info(wb.toString());

console.info('\n\n');

console.info(wb.toJSON());

console.info('\n\n');
console.info(wb.toJSON()[0].rootTopic.children);