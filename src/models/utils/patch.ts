import { isEqual } from '../../common/utils'
import { TOPIC_TYPE } from '../../common/constants'
import Sheet, { SheetData } from '../sheet'
import Theme, { ThemeData } from '../theme'
import Style, { StyleData } from '../style'
import Legend, { LegendData } from '../legend'
import Relationship, { RelationshipData } from '../relationship'
import Topic, { TopicData } from '../topic'

export function patchSheet(sheet: Sheet, newData: SheetData) {

  if (!sheet || !newData) return

  // title
  if (!isEqual(sheet.getTitle(), newData.title)) {
    sheet.changeTitle(newData.title)
  }

  // topicPositioning
  if (!isEqual(sheet.isFreePosition(), newData.topicPositioning === 'free')) {
    sheet.changeFreePosition(newData.topicPositioning === 'free')
  }

  // topicOverlapping
  if (!isEqual(sheet.isTopicOverlapping(), newData.topicOverlapping === 'overlap')) {
    sheet.changeOverlap(newData.topicOverlapping)
  }

  // theme
  patchTheme(sheet.getTheme(), newData.theme)

  // style
  patchStyle(sheet.getStyle(), newData.style)

  // todo need to complete legend model
  patchLegend(sheet.getLegend(), newData.legend)

  // relationships
  let newMapForIdToRelationshipData = {}
  newData.relationships && newData.relationships.forEach(relationshipData => {
    newMapForIdToRelationshipData[relationshipData.id] = relationshipData
  })

  let oldMapIdToRelationship = {}
  Array.from(sheet.getRelationships()).forEach(relationship => {
    if (!(relationship.getId() in newMapForIdToRelationshipData)) {
      sheet.removeRelationship(relationship)
    } else {
      oldMapIdToRelationship[relationship.getId()] = relationship
    }
  })

  Object.keys(newMapForIdToRelationshipData).forEach(relationshipId => {
    let newRelationshipData = newMapForIdToRelationshipData[relationshipId]
    if (!(relationshipId in oldMapIdToRelationship)) {
      sheet.addRelationship(newRelationshipData)
    } else {
      patchRelationship(oldMapIdToRelationship[relationshipId], newRelationshipData)
    }
  })

  // check root topic

  // rootTopic
  patchTopic(sheet.getRootTopic(), newData.rootTopic)

  // settings

}

export function patchTheme(theme: Theme, newData: ThemeData) {
  const sheet = theme.ownerSheet()
  if (!newData || theme.getId() !== newData.id) {
    return sheet.changeTheme(newData)
  }

  theme.changeTitle(newData.title)

  const newClassNames = Object.keys(newData).filter(key => key !== 'id' && key !== 'title')
  const oldClassNames = Object.keys(theme.getAllClassNames())

  new Set(newClassNames.concat(oldClassNames)).forEach(className => {
    theme.changeClass(className, newData[className])
  })

}

export function patchStyle(style: Style, newData: StyleData) {
  if (!newData) {
    return style.removeKey()
  }

  Object.keys(newData['properties']).forEach(k => {
    style.setValue(k, newData['properties'][k])
  })

  style.keys().forEach(k => {
    if (!(k in newData['properties'])) {
      style.removeKey(k)
    }
  })

}

export function patchLegend(legend: Legend, newData: LegendData) {

}

export function patchRelationship(relationship: Relationship, newData: RelationshipData) {
  // patch title
  relationship.changeTitle(newData.title)

  // patch end points
  relationship.changeEndPoints({ end1Id: newData.end1Id, end2Id: newData.end2Id })

  // patch control points
  relationship.changeControlPoints(newData.controlPoints)

  // patch style
  patchStyle(relationship.getStyle(), newData.style)
}

export function patchTopic(topic: Topic, newData: TopicData) {
  if (topic.isRootTopic() && (topic.getId() !== newData.id)) {
    return (topic.parent() as Sheet).replaceRootTopic(newData)
  }

  // patch title
  topic.changeTitle(newData.title)

  // patch structure class
  topic.changeStructureClass(newData.structureClass)

  // patch position
  topic.changePosition(newData.position)

  // patch branch state
  if (newData.branch === 'folded') {
    topic.collapseTopic()
  } else {
    topic.extendTopic()
  }

  // patch width
  topic.changeCustomWidth(newData.width)

  // patch labels
  topic.removeLabel()
  if (newData.labels) {
    topic.addLabel(newData.labels)
  }

  // patch numbering
  topic.addNumbering(newData.numbering)

  // patch href
  newData.href ? topic.addHref(newData.href) : topic.removeHref()

  // patch notes
  newData.notes ? topic.addNotes(newData.notes) : topic.removeNotes()

  // patch image
  newData.image ? topic.addImage(newData.image) : topic.removeImage()

  // patch markers
  // remove all exist markers first
  const existMarkers = topic.getMarkers()
  if (existMarkers.length) existMarkers.forEach(marker => topic.removeMarker(marker.toJSON()))
  // then patch new markers
  if (newData.markers && newData.markers.length) {
    newData.markers.forEach(markerData => topic.addMarker(markerData))
  }

  // patch boundaries
  // remove all boundaries first
  const existBoundaries = topic.getBoundaries()
  if (existBoundaries.length) existBoundaries.forEach(boundary => topic.removeBoundary(boundary))
  if (newData.boundaries && newData.boundaries.length) {
    newData.boundaries.forEach(boundaryData => topic.addBoundary(boundaryData))
  }

  // patch summaries
  const existSummaries = topic.getSummaries()
  if (existSummaries.length) existSummaries.forEach(summary => topic.removeSummary(summary))
  if (newData.summaries && newData.summaries.length) {
    newData.summaries.forEach(summaryData => topic._addSummary(summaryData))
  }

  // patch extensions
  const existExtensions = topic.getExtensions()
  if (existExtensions.length) existExtensions.forEach(extension => topic.removeExtension(extension.getProvider()))

  // patch style
  patchStyle(topic.getStyle(), newData.style)

  // else is normal topic
  const allTopicTypes = [
    TOPIC_TYPE.ATTACHED, TOPIC_TYPE.DETACHED, TOPIC_TYPE.SUMMARY,
    TOPIC_TYPE.CALLOUT
  ]

  const allChildren = topic.getChildrenByType(allTopicTypes)
  if (!newData.children) {
    allChildren.forEach(child => topic.removeChildTopic(child))
  } else {
    // patch attached
    allTopicTypes.forEach(topicType => {
      const oldChildrenMap = {}
      topic.getChildrenByType(topicType).forEach(child => {
        oldChildrenMap[child.getId()] = child
      })

      const newChildDataMap = {};
      (newData.children[topicType] || []).forEach(childData => {
        newChildDataMap[childData.id] = childData
      })

      Object.keys(oldChildrenMap).forEach(oldChildId => {
        if (!(oldChildId in newChildDataMap)) {
          topic.removeChildTopic(oldChildrenMap[oldChildId])
        }
      })

      Object.keys(newChildDataMap).forEach(newChildId => {
        if (newChildId in oldChildrenMap) {
          patchTopic(oldChildrenMap[newChildId], newChildDataMap[newChildId])
        } else {
          topic.addChildTopic(newChildDataMap[newChildId], {
            type: topicType
          })
        }
      })
    })

  }
}