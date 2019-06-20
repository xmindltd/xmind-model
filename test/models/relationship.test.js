const { patchRelationship } = require('../../dist/models/utils/patch')
const { isEqualPoint } = require('../../dist/common/utils')
const { deepClone, generateBaseModel } = require('../testutils')
const { expect } = require('chai')

const sheetData = {
  "relationships": [
    {
      "end1Id": "2a7debe7-2240-4bb0-965d-e6d96dcdc885",
      "end2Id": "d8d8ef03-bf69-4063-8eaa-2fc2a360f39f",
      "id": "c85833c4-50ae-482e-8626-1237f12409a8",
      "controlPoints": {
        "0": {
          "x": 0.3,
          "y": 0.2617993877991494
        },
        "1": {
          "x": 0.3,
          "y": 0.2617993877991494
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
    "id": "593682bd-96da-4988-a01c-edab5d78b0b3",
    "title": "Central Topic"
  },
  "id": "f6d27d69-577d-43ee-984c-0746b8a22f0e"
}

describe('relationship model test', () => {

})

describe('relationship model patch test', () => {
  const oldRelationshipDataCopy = deepClone(sheetData.relationships[0])

  const newRelationshipData = {
    "id":"ea770839-3ca2-4a30-9495-2bdb4bb3cd90",
    "title": "hello new relationship title",
    "end1Id":"593682bd-96da-4988-a01c-edab5d78b0b3",
    "end2Id":"d102eb8b-6c68-4311-90e8-055dffecc1a0",
    "controlPoints":{
      "0": {
        "x":-42.55062372191395,
        "y":-287.12599854649284
      },
      "1":{
        "x":-114.92593877808605,"y":-359.2179112803856
      }
    },
    "style":{
      "id":"06a1572f-8447-4eef-a7df-e4b49038d7a3",
      "properties":{
        "shape-class":"org.xmind.relationshipShape.straight",
        "arrow-begin-class":"org.xmind.arrowShape.dot",
        "arrow-end-class":"org.xmind.arrowShape.herringbone",
        "line-pattern":"dash-dot",
        "line-width":"1pt"
      }
    }
  }

  const { relationship } = generateBaseModel(sheetData)

  patchRelationship(relationship, newRelationshipData)

  it ('title has changed', () => {
    expect(relationship.getTitle() === newRelationshipData.title).to.be.true

    // try undo
    relationship.getUndo().undo()
    expect(relationship.getTitle() === oldRelationshipDataCopy.title).to.be.true

    // try redo
    relationship.getUndo().redo()
    expect(relationship.getTitle() === newRelationshipData.title).to.be.true
  })

  it ('end ids has changed', () => {
    expect(relationship.getEnd1Id() === newRelationshipData.end1Id).to.be.true
    expect(relationship.getEnd2Id() === newRelationshipData.end2Id).to.be.true

    // try undo
    relationship.getUndo().undo()
    expect(relationship.getEnd1Id() === oldRelationshipDataCopy.end1Id).to.be.true
    expect(relationship.getEnd2Id() === oldRelationshipDataCopy.end2Id).to.be.true

    // try redo
    relationship.getUndo().redo()
    expect(relationship.getEnd1Id() === newRelationshipData.end1Id).to.be.true
    expect(relationship.getEnd2Id() === newRelationshipData.end2Id).to.be.true
  })

  it ('control points has changed', () => {
    expect(isEqualPoint(relationship.getControlPoint0(), newRelationshipData.controlPoints[0])).to.be.true
    expect(isEqualPoint(relationship.getControlPoint1(), newRelationshipData.controlPoints[1])).to.be.true

    // try undo
    relationship.getUndo().undo()
    expect(isEqualPoint(relationship.getControlPoint0(), oldRelationshipDataCopy.controlPoints[0])).to.be.true

    // try redo
    relationship.getUndo().redo()
    expect(isEqualPoint(relationship.getControlPoint0(), newRelationshipData.controlPoints[0])).to.be.true
    expect(isEqualPoint(relationship.getControlPoint1(), newRelationshipData.controlPoints[1])).to.be.true
  })
})
