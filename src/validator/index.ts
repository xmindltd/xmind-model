import * as Ajv from 'ajv'
const Schema = require('../../schemas/schema.json')

const definitions = {
  boundary: require('../../schemas/boundary.json'),
  image: require('../../schemas/image.json'),
  marker: require('../../schemas/marker.json'),
  notes: require('../../schemas/notes.json'),
  numbering: require('../../schemas/numbering.json'),
  relationship: require('../../schemas/relationship.json'),
  sheet: require('../../schemas/sheet.json'),
  summary: require('../../schemas/summary.json'),
  theme: require('../../schemas/theme.json'),
  topic: require('../../schemas/topic.json')
}

const ajv = new Ajv({ allErrors: true })

function getValidator() {
  for (const key in definitions) {
    Schema.definitions[key] = definitions[key]
  }

  return ajv.compile(Schema)
}

export default function(data) {
  const validate = getValidator()
  const status = validate(data || {}) as boolean
  if (validate.errors) {
    return {status, errors: validate.errors}
  }

  return { status, errors: null }
}
