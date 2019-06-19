const { TOPIC_TYPE } = require('../../dist/common/constants')
const { generateBaseModel } = require('../testutils')
const { expect } = require('chai')

const sheetData = {
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
                "title": "Subtopic 1",
                "markers": [
                  {
                    "markerId": "flag-red"
                  },
                ],
              }
            ]
          },
          "id": "0cdda9f7-597f-4a4b-9709-43be7ca278dc",
          "title": "Main Topic 1",
          "markers": [
            {
              "markerId": "arrow-up-left"
            },
            {
              "markerId": "month-jul"
            },
            {
              "markerId": "7fm03m2il6sucltcgir4hg1v7p"
            }
          ],
        }
      ]
    },
    "id": "593682bd-96da-4988-a01c-edab5d78b0b3",
    "title": "Central Topic",
    "markers": [
      {
        "markerId": "flag-red"
      },
      {
        "markerId": "month-jul"
      }
    ],
  },
  "id": "f6d27d69-577d-43ee-984c-0746b8a22f0e",
  "legend": {
    "markers": {
      "smiley-angry": { "name": "I'm angry!" },
      "7fm03m2il6sucltcgir4hg1v7p": {
        "resource": "xap:resources/xmind.png",
        "name": "face plain.jpeg"
      }
    },
    "visibility": "visible",
    "groups": {
      "26n2ag7c5ujskgm6sgqo6hdn10": {
        "name": "define",
        "markers": ["7fm03m2il6sucltcgir4hg1v7p"]
      }
    }
  },
}

describe('legend model', () => {

  it ('legend should init while there is no legend data', () => {
    const noLegendSheetData = {
      "rootTopic": {
        "id": "593682bd-96da-4988-a01c-edab5d78b0b3",
        "title": "Central Topic",
      },
      "id": "f6d27d69-577d-43ee-984c-0746b8a22f0e"
    }

    const { legend } = generateBaseModel(noLegendSheetData)

    expect(legend.toJSON()).to.be.deep.equal({})
  })

  const { legend, topic } = generateBaseModel(sheetData)

  it ('init live marker map success!', () => {
    const liveMarkerMap = legend.getLiveMarkerMap()

    expect(liveMarkerMap).to.have.property('flag-red')
    expect(liveMarkerMap).to.have.property('arrow-up-left')
    expect(liveMarkerMap).to.have.property('7fm03m2il6sucltcgir4hg1v7p')

    expect(liveMarkerMap['flag-red'] === 2).to.be.true
    expect(liveMarkerMap['7fm03m2il6sucltcgir4hg1v7p'] === 1).to.be.true
  })

  it ('add same marker in different topic', () => {
    const firstMainTopic = topic.getChildrenByType(TOPIC_TYPE.ATTACHED)[0]

    firstMainTopic.addMarker({ markerId: 'flag-red' })

    const liveMarkerMap = legend.getLiveMarkerMap()
    expect(liveMarkerMap['flag-red'] === 3).to.be.true

  })

  it ('add new marker', () => {
    expect(legend.getLiveMarkerMap()['test-marker'] === undefined).to.be.true

    topic.addMarker({ markerId: 'test-marker' })
    expect(legend.getLiveMarkerMap()['test-marker'] === 1).to.be.true
  })

  it ('remove marker', () => {
    topic.removeMarker({ markerId: 'test-marker' })
    expect(legend.getLiveMarkerMap()['test-marker'] === undefined).to.be.true
  })

  it ("change legend's display", () => {
    expect(legend.isVisible()).to.be.true

    legend.setVisible(false)

    expect(legend.isVisible()).to.be.false

    legend.getUndo().undo()

    expect(legend.isVisible()).to.be.true
  })

  it ("change legend's position", () => {
    expect(legend.getPosition() === undefined).to.be.true

    legend.setPosition({ x: 200, y: 400 })

    expect(legend.getPosition()).to.be.deep.equal({ x: 200, y: 400 })

    legend.getUndo().undo()

    expect(legend.getPosition() === undefined).to.be.true
  })

  it ('set user marker description', () => {

  })
})
