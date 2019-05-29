'use strict';

exports.__esModule = true;
exports.patchStyle = exports.patchTopic = exports.patchRelationship = exports.patchTheme = exports.patchLegend = exports.patchSheet = undefined;

var _utils = require('../../common/utils');

var _constants = require('../../common/constants');

function patchSheet(sheet, newData) {

  if (!sheet || !newData) return;

  // title
  if (!(0, _utils.isEqual)(sheet.getTitle(), newData.title)) {
    sheet.changeTitle(newData.title);
  }

  // topicPositioning
  if (!(0, _utils.isEqual)(sheet.isFreePosition(), newData.topicPositioning === 'free')) {
    sheet.changeFreePosition(newData.topicPositioning === 'free');
  }

  // topicOverlapping
  if (!(0, _utils.isEqual)(sheet.isTopicOverlapping(), newData.topicOverlapping === 'overlap')) {
    sheet.changeOverlap(newData.topicOverlapping);
  }

  // theme
  patchTheme(sheet.getTheme(), newData.theme);

  // style
  patchStyle(sheet.getStyle(), newData.style);

  // todo need to complete legend model
  patchLegend(sheet.getLegend(), newData.legend);

  // relationships
  var newMapForIdToRelationshipData = {};
  newData.relationships && newData.relationships.forEach(function (relationshipData) {
    newMapForIdToRelationshipData[relationshipData.id] = relationshipData;
  });

  var oldMapIdToRelationship = {};
  Array.from(sheet.getRelationships()).forEach(function (relationship) {
    if (!(relationship.getId() in newMapForIdToRelationshipData)) {
      sheet.removeRelationship(relationship);
    } else {
      oldMapIdToRelationship[relationship.getId()] = relationship;
    }
  });

  Object.keys(newMapForIdToRelationshipData).forEach(function (relationshipId) {
    var newRelationshipData = newMapForIdToRelationshipData[relationshipId];
    if (!(relationshipId in oldMapIdToRelationship)) {
      sheet.addRelationship(newRelationshipData);
    } else {
      patchRelationship(oldMapIdToRelationship[relationshipId], newRelationshipData);
    }
  });

  // check root topic

  // rootTopic
  patchTopic(sheet.getRootTopic(), newData.rootTopic);

  // settings

}

function patchTheme(theme, newData) {
  var sheet = theme.ownerSheet();
  if (!newData || theme.getId() !== newData.id) {
    return sheet.changeTheme(newData);
  }

  theme.changeTitle(newData.title);

  var newClassNames = Object.keys(newData).filter(function (key) {
    return key !== 'id' || key !== 'title';
  });
  var oldClassNames = Object.keys(theme.getAllClassNames());

  new Set(newClassNames.concat(oldClassNames)).forEach(function (className) {
    theme.changeClass(className, newData[className]);
  });
}

function patchStyle(style, newData) {
  if (!newData) {
    return style.removeKey();
  }

  Object.keys(newData['properties']).forEach(function (k) {
    style.setValue(k, newData['properties'][k]);
  });

  style.keys().forEach(function (k) {
    if (!(k in newData['properties'])) {
      style.removeKey(k);
    }
  });
}

function patchLegend(legend, newData) {}

function patchRelationship(relationship, newData) {
  // patch title
  relationship.changeTitle(newData.title);

  // patch end points
  relationship.changeEndPoints({ end1Id: newData.end1Id, end2Id: newData.end2Id });

  // patch control points
  relationship.changeControlPoints(newData.controlPoints);

  // patch style
  patchStyle(relationship.getStyle(), newData.style);
}

function patchTopic(topic, newData) {
  if (topic.isRootTopic() && topic.getId() !== newData.id) {
    return topic.parent().replaceRootTopic(newData);
  }

  // patch title
  topic.changeTitle(newData.title);

  // patch structure class
  topic.changeStructureClass(newData.structureClass);

  // patch position
  topic.changePosition(newData.position);

  // patch branch state
  if (newData.branch === 'folded') {
    topic.collapseTopic();
  } else {
    topic.extendTopic();
  }

  // patch width
  topic.changeCustomWidth(newData.width);

  // patch labels
  topic.removeLabel();
  if (newData.labels) {
    topic.addLabel(newData.labels);
  }

  // patch numbering
  topic.addNumbering(newData.numbering);

  // patch href
  newData.href ? topic.addHref(newData.href) : topic.removeHref();

  // patch notes
  newData.notes ? topic.addNotes(newData.notes) : topic.removeNotes();

  // patch image
  newData.image ? topic.addImage(newData.image) : topic.removeImage();

  // patch markers
  // remove all exist markers first
  var existMarkers = topic.getMarkers();
  if (existMarkers.length) existMarkers.forEach(function (marker) {
    return topic.removeMarker(marker);
  });
  // then patch new markers
  if (newData.markers && newData.markers.length) {
    newData.markers.forEach(function (markerData) {
      return topic.addMarker(markerData);
    });
  }

  // patch boundaries
  // remove all boundaries first
  var existBoundaries = topic.getBoundaries();
  if (existBoundaries.length) existBoundaries.forEach(function (boundary) {
    return topic.removeBoundary(boundary);
  });
  if (newData.boundaries && newData.boundaries.length) {
    newData.boundaries.forEach(function (boundaryData) {
      return topic.addBoundary(boundaryData);
    });
  }

  // patch summaries
  var existSummaries = topic.getSummaries();
  if (existSummaries.length) existSummaries.forEach(function (summary) {
    return topic.removeSummary(summary);
  });
  if (newData.summaries && newData.summaries.length) {
    newData.summaries.forEach(function (summaryData) {
      return topic._addSummary(summaryData);
    });
  }

  // patch extensions
  var existExtensions = topic.getExtensions();
  if (existExtensions.length) existExtensions.forEach(function (extension) {
    return topic.removeExtension(extension.getProvider());
  });

  // patch style
  patchStyle(topic.getStyle(), newData.style);

  // else is normal topic
  var allTopicTypes = [_constants.TOPIC_TYPE.ATTACHED, _constants.TOPIC_TYPE.DETACHED, _constants.TOPIC_TYPE.SUMMARY, _constants.TOPIC_TYPE.CALLOUT];

  var allChildren = topic.getChildrenByType(allTopicTypes);
  if (!newData.children) {
    allChildren.forEach(function (child) {
      return topic.removeChildTopic(child);
    });
  } else {
    // patch attached
    allTopicTypes.forEach(function (topicType) {
      var oldChildrenMap = {};
      topic.getChildrenByType(topicType).forEach(function (child) {
        oldChildrenMap[child.getId()] = child;
      });

      var newChildDataMap = {};
      (newData.children[topicType] || []).forEach(function (childData) {
        newChildDataMap[childData.id] = childData;
      });

      Object.keys(oldChildrenMap).forEach(function (oldChildId) {
        if (!(oldChildId in newChildDataMap)) {
          topic.removeChildTopic(oldChildrenMap[oldChildId]);
        }
      });

      Object.keys(newChildDataMap).forEach(function (newChildId) {
        if (newChildId in oldChildrenMap) {
          patchTopic(oldChildrenMap[newChildId], newChildDataMap[newChildId]);
        } else {
          topic.addChildTopic(newChildDataMap[newChildId], {
            type: topicType
          });
        }
      });
    });
  }
}

exports.patchSheet = patchSheet;
exports.patchLegend = patchLegend;
exports.patchTheme = patchTheme;
exports.patchRelationship = patchRelationship;
exports.patchTopic = patchTopic;
exports.patchStyle = patchStyle;
