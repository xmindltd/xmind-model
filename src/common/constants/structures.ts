let _SIMILAR_STRUCTURE_MA

export const STRUCTURECLASS = {
  'LOGICRIGHT': 'org.xmind.ui.logic.right',
  'LOGICLEFT': 'org.xmind.ui.logic.left',
  'TREERIGHT': 'org.xmind.ui.tree.right',
  'TREELEFT': 'org.xmind.ui.tree.left',
  'ORGCHARTDOWN': 'org.xmind.ui.org-chart.down',
  'ORGCHARTUP': 'org.xmind.ui.org-chart.up',
  'MAPCLOCKWISE': 'org.xmind.ui.map.clockwise',
  'MAPANTICLOCKWISE': 'org.xmind.ui.map.anticlockwise',
  'MAP': 'org.xmind.ui.map',
  'MAPUNBALANCED': 'org.xmind.ui.map.unbalanced',
  'MAPFLOATING': 'org.xmind.ui.map.floating',
  'MAPFLOATINGCLOCKWISE': 'org.xmind.ui.map.floating.clockwise',
  'MAPFLOATINGANTICLOCKWISE': 'org.xmind.ui.map.floating.anticlockwise',
  'TIMELINEHORIZONTAL': 'org.xmind.ui.timeline.horizontal',
  'TIMELINEHORIZONTALUP': 'org.xmind.ui.timeline.horizontal.up',
  'TIMELINEHORIZONTALDOWN': 'org.xmind.ui.timeline.horizontal.down',
  'TIMELINEVERTICAL': 'org.xmind.ui.timeline.vertical',
  'FISHBONELEFTHEADED': 'org.xmind.ui.fishbone.leftHeaded',
  // 'LEFTHEADEDNEROTATED': 'org.xmind.ui.fishbone.structure.NE.rotated',
  'LEFTHEADEDNENORMAL': 'org.xmind.ui.fishbone.structure.NE.normal',
  // 'LEFTHEADEDSEROTATED': 'org.xmind.ui.fishbone.structure.SE.rotated',
  'LEFTHEADEDSENORMAL': 'org.xmind.ui.fishbone.structure.SE.normal',
  'FISHBONERIGHTHEADED': 'org.xmind.ui.fishbone.rightHeaded',
  // 'RIGHTHEADEDNWROTATED': 'org.xmind.ui.fishbone.structure.NW.rotated',
  'RIGHTHEADEDNWNORMAL': 'org.xmind.ui.fishbone.structure.NW.normal',
  // 'RIGHTHEADEDSWROTATED': 'org.xmind.ui.fishbone.structure.SW.rotated',
  'RIGHTHEADEDSWNORMAL': 'org.xmind.ui.fishbone.structure.SW.normal',
  'SPREADSHEET': 'org.xmind.ui.spreadsheet',
  'SPREADSHEETROW': 'org.xmind.ui.structure.spreadsheet.row',
  'COLUMNSPREADSHEET': 'org.xmind.ui.spreadsheet.column',
  'SPREADSHEETCOLUMN': 'org.xmind.ui.structure.column.spreadsheet',

  // 已废弃，为了兼容旧 structure
  'LOGICCHARTRIGHT': 'org.xmind.ui.logic-chart.right',
  'LOGICCHARTLEFT': 'org.xmind.ui.logic-chart.left'
}

export const EXPOSED_STRUCTURE = ['org.xmind.ui.logic.right', 'org.xmind.ui.logic.left', 'org.xmind.ui.tree.right', 'org.xmind.ui.tree.left', 'org.xmind.ui.org-chart.down', 'org.xmind.ui.org-chart.up', 'org.xmind.ui.map.clockwise', 'org.xmind.ui.map.anticlockwise', 'org.xmind.ui.map', 'org.xmind.ui.map.unbalanced', 'org.xmind.ui.timeline.horizontal', 'org.xmind.ui.timeline.vertical', 'org.xmind.ui.fishbone.leftHeaded', 'org.xmind.ui.fishbone.rightHeaded', 'org.xmind.ui.spreadsheet', 'org.xmind.ui.spreadsheet.column']

export const ATTACHED_EXPOSED_STRUCTURE = EXPOSED_STRUCTURE.filter(function(item) {
  var isMap = item.indexOf('org.xmind.ui.map') === 0
  return !isMap
})

export const LEFT_EXPOSED_STRUCTURE = ATTACHED_EXPOSED_STRUCTURE.filter(function(item) {
  var isLogicRight = item.indexOf('org.xmind.ui.logic.right') === 0
  var isFishLeft = item.indexOf('org.xmind.ui.fishbone.leftHeaded') === 0
  return !isLogicRight && !isFishLeft
})

export const RIGHT_EXPOSED_STRUCTURE = ATTACHED_EXPOSED_STRUCTURE.filter(function(item) {
  var isLogicLeft = item.indexOf('org.xmind.ui.logic.left') === 0
  var isFishRight = item.indexOf('org.xmind.ui.fishbone.rightHeaded') === 0
  return !isLogicLeft && !isFishRight
})

export const SIMILAR_STRUCTURE_MAP = (_SIMILAR_STRUCTURE_MA = {}, _SIMILAR_STRUCTURE_MA[STRUCTURECLASS.FISHBONELEFTHEADED] = STRUCTURECLASS.FISHBONERIGHTHEADED, _SIMILAR_STRUCTURE_MA[STRUCTURECLASS.FISHBONERIGHTHEADED] = STRUCTURECLASS.FISHBONELEFTHEADED, _SIMILAR_STRUCTURE_MA)

export const DEFAULT_STRUCTURE = STRUCTURECLASS.MAP