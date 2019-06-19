const { COMPONENT_TYPE, TOPIC_TYPE, MASTER_RANGE } = require('../../dist/common/constants')
const { patchTopic } = require('../../dist/models/utils/patch')
const { deepClone, generateBaseModel } = require('../testutils')
const { expect } = require('chai')

// todo 需要更多数据参与测试
// todo 最好能想办法让test/data下面的数据全部参与测试
const simpleTopicData = {
  "title": 'Main Topic 1'
}

const sheetData = {
  "relationships": [
    {
      "end1Id": "2a7debe7-2240-4bb0-965d-e6d96dcdc885",
      "end2Id": "d8d8ef03-bf69-4063-8eaa-2fc2a360f39f",
      "id": "c85833c4-50ae-482e-8626-1237f12409a8",
      "controlPoints": {
        "0": {
          "amount": 0.3,
          "angle": 0.2617993877991494
        },
        "1": {
          "amount": 0.3,
          "angle": 0.2617993877991494
        }
      }
    }
  ],
  "rootTopic": {
    "extensions": [
      {
        "provider": "org.xmind.ui.map.unbalanced",
        "content": [
          {
            "name": "right-number",
            "content": "1"
          }
        ]
      }
    ],
    "structureClass": "org.xmind.ui.map.unbalanced",
    "children": {
      "attached": [
        {
          "structureClass": "org.xmind.ui.spreadsheet",
          "children": {
            "summary": [],
            "attached": [
              {
                "children": {
                  "attached": [
                    {
                      "children": {
                        "attached": [
                          {
                            "children": {},
                            "id": "ee6380ab-78f7-4afe-95c1-f46e53f5c655",
                            "title": "Subtopic 1.1.1"
                          }
                        ]
                      },
                      "id": "7699c1e8-a2fe-42b1-bff2-3c141ba14ea3",
                      "title": "Subtopic 1.1",
                      "labels": [
                        "ss"
                      ]
                    },
                    {
                      "children": {
                        "attached": [
                          {
                            "children": {},
                            "id": "d8d8ef03-bf69-4063-8eaa-2fc2a360f39f",
                            "title": "Subtopic 1.2.1"
                          }
                        ]
                      },
                      "id": "1a496cab-ff86-4613-a217-31b1cd5d0c1a",
                      "title": "Subtopic 1.2",
                      "labels": [
                        "ss"
                      ]
                    }
                  ]
                },
                "id": "b1c87245-3562-4ee9-aecd-336c299f673d",
                "title": "Subtopic 1"
              }
            ]
          },
          "id": "0cdda9f7-597f-4a4b-9709-43be7ca278dc",
          "title": "Main Topic 1"
        }
      ]
    },
    "id": "01429vt8j82vct02ebj16r69sa",
    "title": "Central Topic"
  },
  "id": "f6d27d69-577d-43ee-984c-0746b8a22f0e"
}

describe('topic model', () => {

  it('init works', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    // has owner sheet
    expect(topic.ownerSheet() === sheet).to.be.true

    expect(topic.isRootTopic()).to.be.true

    // init boundaries

  })

  it('getType works', () => {
    const _simpleTopicData = deepClone(simpleTopicData)

    const { topic, sheet } = generateBaseModel(sheetData)

    expect(topic.getType()).to.be.a('string')

    expect(sheet.createComponent(COMPONENT_TYPE.TOPIC, _simpleTopicData, {
      type: TOPIC_TYPE.ATTACHED
    }).getType()).to.equal(TOPIC_TYPE.ATTACHED)

    expect(sheet.createComponent(COMPONENT_TYPE.TOPIC, _simpleTopicData, {
      type: TOPIC_TYPE.DETACHED
    }).getType()).to.equal(TOPIC_TYPE.DETACHED)
  })

  it('getChildrenByType works', () => {

    const { topic } = generateBaseModel(sheetData)

    expect(Array.isArray(topic.getChildrenByType(TOPIC_TYPE.ATTACHED))).to.be.true

    expect(Array.isArray(topic.getChildrenByType([TOPIC_TYPE.ATTACHED, TOPIC_TYPE.DETACHED]))).to.be.true

    // 对返回值做修改不会影响到原数据
    const childrenList = topic.getChildrenByType(TOPIC_TYPE.ATTACHED)
    childrenList.splice(0, 1)
    expect(childrenList.length !== topic.getChildrenByType(TOPIC_TYPE.ATTACHED).length).to.be.true
  })

  it('addChildTopic removeChildTopic works', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    const originChildrenList = topic.getChildrenByType(TOPIC_TYPE.ATTACHED)
    const originJSON = topic.toJSON()

    const newTopicModel = topic.addChildTopic(simpleTopicData, { type: TOPIC_TYPE.ATTACHED })

    // childrenMap更新
    expect(topic.getChildrenByType(TOPIC_TYPE.ATTACHED).pop() === newTopicModel).to.be.true

    // topic._data更新
    expect(topic.toJSON().children[TOPIC_TYPE.ATTACHED].pop().title === simpleTopicData.title).to.be.true

    // parent正确设置
    expect(newTopicModel.parent() === topic).to.be.true

    // 调用undo，正常回退
    sheet.getUndo().undo()
    expect(originChildrenList).to.eql(topic.getChildrenByType(TOPIC_TYPE.ATTACHED))
    // todo 这项不一定非要为真，因为removeTopic之后可能会删除data中的children项，只要children项为空
    expect(originJSON).to.eql(topic.toJSON())

    // 调用redo，正常重新执行
    sheet.getUndo().redo()
    expect(topic.getChildrenByType(TOPIC_TYPE.ATTACHED).pop().toJSON().title === simpleTopicData.title).to.be.true
    expect(topic.toJSON().children[TOPIC_TYPE.ATTACHED].pop().title === simpleTopicData.title).to.be.true
  })

  it('moveChildTopic works', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    const originPlaceModel = topic.getChildrenByType(TOPIC_TYPE.ATTACHED)[0]
    topic.moveChildTopic(0, 1)
    let newPlaceModel
    const childrenList = topic.getChildrenByType(TOPIC_TYPE.ATTACHED)
    if (childrenList.length > 1) {
      newPlaceModel = childrenList[1]
      expect(originPlaceModel === newPlaceModel).to.be.true
    } else {
      newPlaceModel = childrenList[0]
    }

    // undo
    sheet.getUndo().undo()
    expect(newPlaceModel === topic.getChildrenByType(TOPIC_TYPE.ATTACHED)[0]).to.be.true
  })

  it('addBoundary removeBoundary works', () => {
    const boundaryData = {
      title: 'new boundary',
      range: '(0,1)'
    }

    const { topic, sheet } = generateBaseModel({
      "rootTopic": {
        "id": "593682bd-96da-4988-a01c-edab5d78b0b3",
        "title": "Central Topic",
      },
      "id": "f6d27d69-577d-43ee-984c-0746b8a22f0e"
    })

    const newBoundaryModel = topic.addBoundary(boundaryData)
    // boundaries updated
    expect(topic.getBoundaries().pop() === newBoundaryModel).to.be.true
    // boundariesData updated
    expect(topic.toJSON().boundaries.pop().id === newBoundaryModel.getId()).to.be.true
    expect(newBoundaryModel.rangeStart === 0).to.be.true
    expect(newBoundaryModel.rangeEnd === 1).to.be.true

    // undo
    sheet.getUndo().undo()
    // boundaries updated
    expect(topic.getBoundaries().indexOf(newBoundaryModel) === -1).to.be.true
    // boundariesData updated
    if (topic.getBoundaries().length === 0) {
      expect(topic.toJSON().boundaries === undefined).to.be.true
    } else {
      expect(topic.toJSON().boundaries.findIndex(boundaryData => boundaryData.id === newBoundaryModel.getId()) === -1).to.be.true
    }

    sheet.getUndo().redo()
    expect(topic.getBoundaries().pop().toJSON()).to.be.deep.equal(boundaryData)

    // add floating topic
    const newFloatingTopic = topic.addChildTopic({ title: 'floating topic' }, { type: TOPIC_TYPE.DETACHED })

    const masterRangeBoundary = {
      title: 'new boundary',
      range: MASTER_RANGE
    }

    const newMasterRangeBoundary = newFloatingTopic.addBoundary(masterRangeBoundary)
    expect(newMasterRangeBoundary.getRange() === MASTER_RANGE).to.be.true
    expect(newMasterRangeBoundary.rangeStart === -1).to.be.true
    expect(newMasterRangeBoundary.rangeEnd === -1).to.be.true
  })

  it('addSummary removeSummary works', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    const summaryData = {
      range: '(0,0)'
    }

    const summaryTopicData = {
      title: 'hello summary topic'
    }

    expect(topic.getSummaries().length === 0).to.be.true

    topic.addSummary(summaryData, summaryTopicData)
    const newSummaryModel = topic.getSummaries()[0]
    const newSummaryTopicModel = newSummaryModel.getSummaryTopic()

    expect(newSummaryModel.getRange() === summaryData.range).to.be.true
    expect(newSummaryTopicModel.getTitle() === summaryTopicData.title).to.be.true

    sheet.getUndo().undo()
    expect(topic.getSummaries().length === 0).to.be.true
    expect(topic.getChildrenByType(TOPIC_TYPE.SUMMARY).length === 0).to.be.true

    sheet.getUndo().redo()
    const newSummaryModel_1 = topic.getSummaries()[0]
    const newSummaryTopicModel_1 = newSummaryModel_1.getSummaryTopic()

    expect(newSummaryModel_1.getRange() === summaryData.range).to.be.true
    expect(newSummaryTopicModel_1.getTitle() === summaryTopicData.title).to.be.true
  })

  it('extendTopic collapseTopic works', () => {
    // todo
    const { topic, sheet } = generateBaseModel(sheetData)

    expect(topic._canCollapse()).to.be.false

    const firstMainTopic = topic.getChildrenByType(TOPIC_TYPE.ATTACHED)[0]

    firstMainTopic.collapseTopic()

    expect(firstMainTopic.isFolded()).to.be.true

    sheet.getUndo().undo()

    expect(firstMainTopic.isFolded()).to.be.false
  })

  it('addMarker changeMarker removeMarker', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    const markerData1 = {
      groupId: 'priorityMarkers',
      markerId: 'priority-1'
    }

    const markerData2 = {
      groupId: 'priorityMarkers',
      markerId: 'priority-2'
    }

    const markerData3 = {
      groupId: 'smileyMarkers',
      markerId: 'task-start'
    }

    topic.addMarker(markerData1)

    topic.addMarker(markerData2)
  })

  it('addImage removeImage works', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    const imageData_1 = {
      src: 'hello_1',
      width: 100,
      height: 100,
    }

    topic.addImage(imageData_1)
    // _image updated
    expect(topic.getImage().toJSON()).to.eql(imageData_1)
    // data updated
    expect(topic.toJSON().image).to.eql(imageData_1)

    sheet.getUndo().undo()
    // _image removed
    expect(topic.getImage() === null).to.be.true
    // data removed
    expect(topic.toJSON().image === undefined).to.be.true

    sheet.getUndo().redo()
    // re test
    expect(topic.getImage().toJSON()).to.eql(imageData_1)
    expect(topic.toJSON().image).to.eql(imageData_1)

    // use addImage to change image
    const imageData_2 = {
      src: 'hello_2',
      width: 200,
      height: 200,
    }
    topic.addImage(imageData_2)
    // _image updated
    expect(topic.getImage().toJSON()).to.eql(imageData_2)
    // data updated
    expect(topic.toJSON().image).to.eql(imageData_2)

    sheet.getUndo().undo()
    expect(topic.getImage().toJSON()).to.eql(imageData_1)
    expect(topic.toJSON().image).to.eql(imageData_1)

    sheet.getUndo().undo()
    expect(topic.getImage() === null).to.be.true
    expect(topic.toJSON().image === undefined).to.be.true

    sheet.getUndo().redo()
    sheet.getUndo().redo()
    expect(topic.getImage().toJSON()).to.eql(imageData_2)
    expect(topic.toJSON().image).to.eql(imageData_2)

    // todo add image1, change image1's attributes, undo, undo ,redo, redo
  })

  it('addLabel removeLabel works', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    // init empty labels
    expect(topic.getLabels()).to.eql([])

    const label_1 = 'hello'
    topic.addLabel(label_1, { index: 2 })
    expect(topic.getLabels()).to.eql([label_1])

    // undo
    sheet.getUndo().undo()
    expect(topic.getLabels()).to.eql([])
  })

  it('addNotes removeNotes works', () => {

    const notesData = {
      "html": {},
      "plain": {
        "class": "note",
        "content": "this is a note",
        "id": "1283164141897498124"
      },
      "preview": ""
    }

    const { topic } = generateBaseModel(sheetData)

    expect(topic.getNotes() === null).to.be.true

    topic.addNotes(notesData)

    expect(topic.getNotes().toJSON()).to.eql(notesData)

    topic.getUndo().undo()

    expect(topic.getNotes() === null).to.be.true
  })

  it('addHref removeHref works', () => {

    const { topic } = generateBaseModel(sheetData)

    const newHref = 'https://www.bing.com'

    topic.addHref(newHref)

    expect(topic.getHref() === newHref).to.be.true

    topic.getUndo().undo()

    expect(topic.getHref() === undefined).to.be.true
  })

  it('topic model patch test', () => {
    const newTopicData = {
      "id": "01429vt8j82vct02ebj16r69sa",
      "structureClass": "org.xmind.ui.map.unbalanced",
      "title": "具身认知",
      "width": 138,
      "style": {
        "type": "topic",
        "properties": {
          "border-line-width": "0",
          "fo:color": "#FFFFFF",
          "fo:font-family": "Roboto",
          "fo:font-size": "18",
          "fo:font-weight": "bold",
          "fo:text-transform": "capitalize",
          "shape-class": "org.xmind.topicShape.circle",
          "svg:fill": "#354567",
          "line-width": "1pt",
          "line-class": "org.xmind.branchConnection.straight"
        }
      },
      "extensions": [
        {
          "provider": "org.xmind.ui.map.unbalanced",
          "content": [{ "name": "right-number", "content": "1" }]
        }
      ],
      "children": {
        "detached": [
          {
            "id": "c04ac3ae-e0c1-42f8-b1c5-390e5703cf89",
            "title": "",
            "position": { "x": -3.9778016985121547, "y": -104.86246066237878 },
            "style": {
              "id": "38dbebd6-c087-4123-a14c-ae44f0bc23d5",
              "class": "style",
              "properties": { "svg:fill": "#FFFFFF" }
            }
          },
          {
            "id": "43ba8plk00f0ikf9jid4kmvcum",
            "title": "大脑",
            "numbering": { "numberFormat": "org.xmind.numbering.arabic" },
            "style": {
              "type": "topic",
              "properties": {
                "border-line-width": "0pt",
                "fo:color": "#FFFFFF",
                "fo:font-family": "Roboto",
                "fo:font-size": "18",
                "fo:font-style": "normal",
                "fo:font-weight": "bold",
                "line-class": "org.xmind.branchConnection.curve",
                "line-color": "#BDD199",
                "line-width": "0pt",
                "shape-class": "org.xmind.topicShape.circle",
                "svg:fill": "#8D6E63"
              }
            },
            "children": {},
            "position": { "x": -115.99083999583426, "y": -213.04079585113013 }
          },
          {
            "id": "4mrdf2uc2akocaomejui1q770j",
            "title": "身体",
            "numbering": { "numberFormat": "org.xmind.numbering.arabic" },
            "style": {
              "type": "topic",
              "properties": {
                "border-line-width": "0pt",
                "fo:color": "#FFFFFF",
                "fo:font-family": "Roboto",
                "fo:font-size": "18",
                "fo:font-style": "normal",
                "fo:font-weight": "bold",
                "line-class": "org.xmind.branchConnection.curve",
                "line-color": "#0D46AA",
                "line-width": "0pt",
                "shape-class": "org.xmind.topicShape.circle",
                "svg:fill": "#78909C"
              }
            },
            "children": {},
            "position": { "x": 132.57391454193862, "y": -211.93562677290404 }
          },
          {
            "id": "c2549805-2058-43fd-bd9e-4638c0a5527d",
            "title": "人在开心的时候会情不自禁地微笑，反过来，当你微笑的时候，你也会真的觉得开心。",
            "position": { "x": 8.207568806372393, "y": 200.77952131668064 },
            "style": {
              "properties": {
                "fo:font-weight": "bold",
                "fo:color": "#6EB5E2",
                "fo:font-family": "Nunito Sans",
                "fo:font-style": "italic",
                "fo:font-size": "14",
                "fo:text-decoration": "none",
                "shape-class": "org.xmind.topicShape.roundedRect",
                "svg:fill": "#FFFFFF",
                "line-class": "org.xmind.branchConnection.roundedElbow",
                "line-color": "#07284F",
                "multi-line-colors": "none",
                "line-width": "2pt",
                "fo:text-align": "center",
                "fo:text-transform": "manual",
                "border-line-color": "#52BAE2",
                "border-line-width": "0"
              },
              "id": "06b8fe5ef128037774a94aa7d0"
            }
          }
        ],
        "attached": [
          {
            "id": "b768b9b4-8c84-4e40-9ad1-6c666647ddc0",
            "title": "具身认知如何帮助我们",
            "style": {
              "properties": {
                "fo:font-weight": "bold",
                "fo:color": "#5E5D5B",
                "fo:font-family": "Nunito Sans",
                "fo:font-style": "italic",
                "fo:font-size": "14",
                "fo:text-decoration": "none",
                "shape-class": "org.xmind.topicShape.roundedRect",
                "svg:fill": "none",
                "line-class": "org.xmind.branchConnection.roundedElbow",
                "line-color": "#07284F",
                "multi-line-colors": "none",
                "line-width": "2pt",
                "fo:text-align": "center",
                "fo:text-transform": "manual",
                "border-line-color": "#5E5D5B",
                "border-line-width": "3pt"
              },
              "id": "79ebbb8a160bdb3f8f02dbbf24"
            },
            "children": {
              "attached": [
                {
                  "id": "cee4ad1a-94fd-459d-938c-41f59007e6d7",
                  "title": "复制行为，复制思维",
                  "style": {
                    "id": "578c3278-7434-4692-8722-4906946e9b56",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                },
                {
                  "id": "ad4deaf1-ab78-4f04-8a09-8450ae5b3c0b",
                  "title": "自拍让心情愉悦",
                  "style": {
                    "id": "dc722cb1-7c2a-4015-ba92-f30ff43f5be6",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                },
                {
                  "id": "20527ee5-66a6-46a4-85d1-3a76ac7ca2cc",
                  "title": "运动让大脑更活跃",
                  "style": {
                    "id": "eaf7df50-5488-4a03-8ecf-057845062e5f",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                }
              ]
            },
            "structureClass": "org.xmind.ui.logic.right"
          },
          {
            "id": "4d2bd3e0-94b7-4f77-9f6a-a4073e67b49a",
            "title": "身体影响大脑",
            "style": {
              "properties": {
                "fo:font-weight": "bold",
                "fo:color": "#5E5D5B",
                "fo:font-family": "Nunito Sans",
                "fo:font-style": "italic",
                "fo:font-size": "14",
                "fo:text-decoration": "none",
                "shape-class": "org.xmind.topicShape.roundedRect",
                "svg:fill": "none",
                "line-class": "org.xmind.branchConnection.roundedElbow",
                "line-color": "#07284F",
                "multi-line-colors": "none",
                "line-width": "2pt",
                "fo:text-align": "center",
                "fo:text-transform": "manual",
                "border-line-color": "#5E5D5B",
                "border-line-width": "3pt"
              },
              "id": "73fa4c5e-2cc9-4ab0-8585-e316b0c308b9"
            },
            "children": {
              "attached": [
                {
                  "id": "edb65f3c-8b34-4303-a0f3-7005d41a9196",
                  "title": "通过控制情绪来影响大脑",
                  "style": {
                    "id": "b2f9a61f-be0c-4da0-b32c-c7714b91284b",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                },
                {
                  "id": "c3eba09d-9322-4128-8506-b7bfaab768dd",
                  "title": "通过决定偏好来影响决策",
                  "style": {
                    "id": "a3990e23-37ea-4287-9a25-ca9fcab00326",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                },
                {
                  "id": "0e1e7c8e-f44f-402a-bfbd-bd3de0ed11d9",
                  "title": "影响大脑的掌控力和主动性",
                  "style": {
                    "id": "4899520f-49df-4e3e-bb58-a4ae3f6b2624",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                }
              ]
            },
            "structureClass": "org.xmind.ui.logic.left"
          },
          {
            "id": "7f45d123-e9a5-4d16-8a0d-60b7545d77ae",
            "title": "身体影响社交",
            "style": {
              "properties": {
                "fo:font-weight": "bold",
                "fo:color": "#5E5D5B",
                "fo:font-family": "Nunito Sans",
                "fo:font-style": "italic",
                "fo:font-size": "14",
                "fo:text-decoration": "none",
                "shape-class": "org.xmind.topicShape.roundedRect",
                "svg:fill": "none",
                "line-class": "org.xmind.branchConnection.roundedElbow",
                "line-color": "#07284F",
                "multi-line-colors": "none",
                "line-width": "2pt",
                "fo:text-align": "center",
                "fo:text-transform": "manual",
                "border-line-color": "#5E5D5B",
                "border-line-width": "3pt"
              },
              "id": "aa60abe6-dc93-4d38-b415-1c6c04c94513"
            },
            "children": {
              "attached": [
                {
                  "id": "a9989a03-a8e9-42a0-b225-f2353e10b8da",
                  "title": "身体温度影响对一个人的感觉",
                  "style": {
                    "id": "ea8dae92-3176-45fb-b4f9-cdd5f200e0ae",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                },
                {
                  "id": "68e499e2-7a01-4d86-b6ba-c8791bb26907",
                  "title": "行为影响知觉和判断",
                  "style": {
                    "id": "4b7a648c-1288-4783-82e1-8d81fd80ba82",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                },
                {
                  "id": "54b0fb22-2c62-4cc1-a1f8-e9c2a718362e",
                  "title": "通过身体举动解读他人内心",
                  "style": {
                    "id": "7c3f1dcf-e46a-43b2-acd7-ebe45c9eba60",
                    "class": "style",
                    "properties": { "fo:font-size": "12" }
                  }
                }
              ]
            },
            "structureClass": "org.xmind.ui.logic.left"
          }
        ]
      }
    }

    const { sheet, topic } = generateBaseModel(sheetData)

    patchTopic(topic, newTopicData)

    const firstAttachedChildJSON = sheet.getRootTopic().getChildrenByType(TOPIC_TYPE.ATTACHED)[0].toJSON()

    expect(firstAttachedChildJSON).to.eql(newTopicData.children.attached[0])
  })
})
