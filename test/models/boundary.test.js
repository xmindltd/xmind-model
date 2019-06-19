const { generateBaseModel } = require('../testutils')
const { expect } = require('chai')

const sheetData = {
  "rootTopic": {
    "id": "593682bd-96da-4988-a01c-edab5d78b0b3",
    "title": "Central Topic",
    "boundaries": [
      {
        "title": "boundaryTitle",
        "range": "(0, 0)"
      }
    ],
    "children": {
      "attached": [
        {
          "id": "attached-id",
          "title": "test-attached-topic"
        },

        {
          "id": "attached-id-2",
          "title": "test-attached-topic"
        }
      ]
    }
  },
  "id": "f6d27d69-577d-43ee-984c-0746b8a22f0e"
}

describe('boundary model', () => {

  it ('boundary change title', () => {
    const { topic } = generateBaseModel(sheetData)

    const boundary = topic.getBoundaries()[0]

    const newTitle = 'new boundary title'

    boundary.changeTitle(newTitle)

    expect(boundary.getTitle() === newTitle).to.be.true

    boundary.getUndo().undo()

    expect(boundary.getTitle() === 'boundaryTitle').to.be.true

    boundary.getUndo().redo()

    expect(boundary.getTitle() === newTitle).to.be.true
  })


  it ('boundary change range', () => {
    const { topic } = generateBaseModel(sheetData)

    const boundary = topic.getBoundaries()[0]
    
    expect(boundary.rangeStart === 0).to.be.true
    expect(boundary.rangeEnd === 0).to.be.true

    boundary.setRange('(0, 1)')

    expect(boundary.rangeStart === 0).to.be.true
    expect(boundary.rangeEnd === 1).to.be.true

    boundary.getUndo().undo()

    expect(boundary.rangeStart === 0).to.be.true
    expect(boundary.rangeEnd === 0).to.be.true
  })


})
