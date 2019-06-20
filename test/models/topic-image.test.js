const { generateBaseModel } = require('../testutils')
const { expect } = require('chai')

const sheetData = {
  "rootTopic": {
    "id": "593682bd-96da-4988-a01c-edab5d78b0b3",
    "title": "Central Topic",
    "image": {
      "src": "http://www.bing.com"
    }
  },
  "id": "f6d27d69-577d-43ee-984c-0746b8a22f0e"
}

describe('topic image model', () => {

  it ('topic image init', () => {
    const { topic } = generateBaseModel(sheetData)

    expect(topic.getImage().parent() === topic).to.be.true
    expect(topic.getImage().getSrc() === 'http://www.bing.com').to.be.true
    expect(topic.getImage().getWidth() === undefined).to.be.true
  })

  it ('topic image change size', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    topic.getImage().resize({ width: 200, height: 400 })
    expect(topic.getImage().getWidth() === 200).to.be.true
    expect(topic.getImage().getHeight() === 400).to.be.true

    sheet.getUndo().undo()
    expect(topic.getImage().getWidth() === undefined).to.be.true
    expect(topic.getImage().getHeight() === undefined).to.be.true

    sheet.getUndo().redo()
    expect(topic.getImage().getWidth() === 200).to.be.true
    expect(topic.getImage().getHeight() === 400).to.be.true

    expect(topic.toJSON().image).to.be.deep.equal({ src: "http://www.bing.com", width: 200, height: 400 })
  })

  it ('topic image change align', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    topic.getImage().align('left')
    expect(topic.getImage().getAlign() === 'left').to.be.true

    sheet.getUndo().undo()
    expect(topic.getImage().getAlign() === undefined).to.be.true

    sheet.getUndo().redo()
    expect(topic.getImage().getAlign() === 'left').to.be.true
  })

  it ('topic image remove self', () => {
    const { topic, sheet } = generateBaseModel(sheetData)

    const imageModel = topic.getImage()
    imageModel.removeSelf()

    expect(imageModel.parent() === null).to.be.true
    expect(topic.getImage() === null).to.be.true

    sheet.getUndo().undo()
    expect(imageModel.toJSON()).to.be.deep.equal(topic.getImage().toJSON())
  })
})
