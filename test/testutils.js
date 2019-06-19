const Sheet = require('../dist/models/sheet').default

const baseSheetData = {
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

function deepClone(source) {
  return JSON.parse(JSON.stringify(source))
}

function generateBaseModel(sheetData = baseSheetData) {
  const _sheetData = deepClone(sheetData)

  const sheet = new Sheet(_sheetData)

  const topic = sheet.getRootTopic()

  const legend = sheet.getLegend()

  const relationship = sheet.getRelationships()[0]

  return { sheet, topic, legend, relationship }
}

module.exports = {
  deepClone,
  generateBaseModel
}
