export const CLASS_TYPE = {
  CENTRAL_TOPIC: 'centralTopic',
  MAIN_TOPIC: 'mainTopic',
  SUB_TOPIC: 'subTopic',
  SUMMARY_TOPIC: 'summaryTopic',
  CALLOUT_TOPIC: 'calloutTopic',
  FLOATING_TOPIC: 'floatingTopic',
  BOUNDARY: 'boundary',
  SUMMARY: 'summary',
  RELATIONSHIP: 'relationship',
  MAP: 'map'

  /**
   * @deprecated
   */
}

export const STYLED_TOPIC_TYPE = {
  CENTRAL: 'centralTopic',
  SUMMARY: 'summaryTopic',
  FLOATING: 'floatingTopic',
  CALLOUT: 'calloutTopic',
  MAIN: 'mainTopic',
  SUB: 'subTopic'
}

export const STYLE_KEYS = {
  FONT_FAMILY: 'fo:font-family',
  FONT_STYLE: 'fo:font-style',
  FONT_WEIGHT: 'fo:font-weight',
  FONT_SIZE: 'fo:font-size',
  TEXT_COLOR: 'fo:color',
  TEXT_ALIGN: 'fo:text-align',
  TEXT_BULLET: 'fo:text-bullet',
  TEXT_TRANSFORM: 'fo:text-transform',
  TEXT_DECORATION: 'fo:text-decoration',
  TEXT_BACKGROUND_COLOR: 'fo:background-color',

  MARGIN_LEFT: 'fo:margin-left',
  MARGIN_RIGHT: 'fo:margin-right',
  MARGIN_TOP: 'fo:margin-top',
  MARGIN_BOTTOM: 'fo:margin-bottom',
  SPACING_MAJOR: 'spacing-major',
  SPACING_MINOR: 'spacing-minor',

  SHAPE_CLASS: 'shape-class',
  SHAPE_CORNER: 'shape-corner',

  LINE_CORNER: 'line-corner',
  LINE_COLOR: 'line-color',
  LINE_CLASS: 'line-class',
  LINE_WIDTH: 'line-width',
  LINE_PATTERN: 'line-pattern',
  LINE_TAPERED: 'line-tapered',

  BORDER_LINE_COLOR: 'border-line-color',
  BORDER_LINE_WIDTH: 'border-line-width',

  CALLOUT_FILL_COLOR: 'callout-fill-color',
  CALLOUT_LINE_CLASS: 'callout-line-class',
  CALLOUT_LINE_CORNER: 'callout-line-corner',
  CALLOUT_LINE_PATTERN: 'callout-line-pattern',
  CALLOUT_LINE_WIDTH: 'callout-line-width',
  CALLOUT_SHAPE_CLASS: 'callout-shape-class',
  CALLOUT_LINE_COLOR: 'callout-line-color',

  OPACITY: 'svg:opacity',
  FILL_COLOR: 'svg:fill',
  BACKGROUND: 'background',

  ARROW_END_CLASS: 'arrow-end-class',
  ARROW_BEGIN_CLASS: 'arrow-begin-class',

  ALLOW_OVERLAP: 'allow-overlap',
  ALLOW_FREE_POSITION: 'allow-free-position',
  GRADIENT_COLOR: 'color-gradient',
  MULTI_LINE_COLORS: 'multi-line-colors',
  CJK_FONT_FAMILY: 'cjk-font-family',
  STRUCTURE_CLASS: 'structure-class',

  FILL_GRADIENT: 'fill-gradient',
  BORDER_GRADIENT: 'border-gradient'
}

export const STYLE_VALUES = {
  SYSTEM_FONT: '$system$'
}

export const STYLE_PARENT_GROUP = {
  BEFORE_CLASS_GROUP: 'beforeClassGroup',
  BEFORE_THEME_GROUP: 'beforeThemeGroup',
  BEFORE_DEFAULT_GROUP: 'beforeDefaultGroup'
}

export const STYLE_LAYER = {
  BEFORE_USER: 'beforeUser',
  BEFORE_CLASS: 'beforeClass',
  BEFORE_THEME: 'beforeTheme',
  BEFORE_DEFAULT: 'beforeDefault',
  BEFORE_PARENT: 'beforeParent'
}

export const COMMON_FONT_FAMILY = 'Helvetica, "Nunito Sans", "Microsoft JhengHei", "Microsoft Yahei", sans-serif'

export const TOPICSHAPE = {
  "ROUNDEDRECT": "org.xmind.topicShape.roundedRect",
  "RECT": "org.xmind.topicShape.rect",
  "ELLIPSE": "org.xmind.topicShape.ellipse",
  "DIAMOND": "org.xmind.topicShape.diamond",
  "UNDERLINE": "org.xmind.topicShape.underline",
  "NOBORDER": "org.xmind.topicShape.noBorder",
  "CIRCLE": "org.xmind.topicShape.circle",
  "PARALLELOGRAM": "org.xmind.topicShape.parallelogram",
  "CLOUD": "org.xmind.topicShape.cloud",
  "ELLIPSERECT": "org.xmind.topicShape.ellipserect",

  // deprecated
  '_ELLIPSE': 'org.xmind.topicShape.callout.ellipse',
  '_ROUNDEDRECT': 'org.xmind.topicShape.callout.roundedRect',
  '_RECT': 'org.xmind.topicShape.callout.rect',

  //new shape
  "HEXAGON": "org.xmind.topicShape.hexagon",
  // "PEAKRECT": "org.xmind.topicShape.peakrect",
  // "CONVEXRECT":"org.xmind.topicShape.convexrect",
  "ROUNDEDHEXAGON": "org.xmind.topicShape.roundedhexagon",
  "ELLIPTICRECTANGLE": "org.xmind.topicShape.ellipticrectangle",
  "SINGLEBREAKANGLE": "org.xmind.topicShape.singlebreakangle",
  "SINGLEBREAKANGLEWITHLINE": "org.xmind.topicShape.singlebreakanglewithline",
  "DOUBLEROUNDEDANGLE": "org.xmind.topicShape.doubleroundedangle",
  "DOUBLEUNDERLINE": "org.xmind.topicShape.doubleunderline",
  "LEAF": "org.xmind.topicShape.leaf",
  "NEWCLOUD": "org.xmind.topicShape.newcloud",
  "STACK": "org.xmind.topicShape.stack",

  //private defined
  "MATRIXMAIN": "org.xmind.topicShape.matrixMain",
  "FISHHEADTORIGHT": "org.xmind.topicShape.fishHeadToRight",
  "FISHHEADTOLEFT": "org.xmind.topicShape.fishHeadToLeft",
  "FISHBONEROATEDNW": "org.xmind.topicShape.fishbone.NW.rotated",
  "FISHBONEROATEDNE": "org.xmind.topicShape.fishbone.NE.rotated",
  "FISHBONEROATEDSW": "org.xmind.topicShape.fishbone.SW.rotated",
  "FISHBONE_NE_UNDERLINE": "fishbone_ne_underline",
  "FISHBONE_NW_UNDERLINE": "fishbone_nw_underline",
  "FISHBONEROATEDSE": "org.xmind.topicShape.fishbone.SE.rotated"
}

export const CALLOUTSHAPE = {
  "ELLIPSE": "org.xmind.calloutTopicShape.balloon.ellipse",
  "ROUNDEDRECT": "org.xmind.calloutTopicShape.balloon.roundedRect",
  "RECT": "org.xmind.calloutTopicShape.balloon.rectangle"
}

export const BOUNDARYSHAPE = {
  "RECT": "org.xmind.boundaryShape.rect",
  "ROUNDEDRECT": "org.xmind.boundaryShape.roundedRect",
  "SCALLOPS": "org.xmind.boundaryShape.scallops",
  "WAVES": "org.xmind.boundaryShape.waves",
  "TENSION": "org.xmind.boundaryShape.tension",
  "POLYGON": "org.xmind.boundaryShape.polygon",
  "ROUNDEDPOLYGON": "org.xmind.boundaryShape.roundedPolygon",
  // new boundary shapes
  "NEWBOUNDARY1": "org.xmind.boundaryShape.newboundary1",
  "NEWBOUNDARY2": "org.xmind.boundaryShape.newboundary2",
  "NEWBOUNDARY3": "org.xmind.boundaryShape.newboundary3",

  "FOCUS": "org.xmind.boundaryShape.focus",
  "CROSS": "org.xmind.boundaryShape.cross"
}

export const ARROWSHAPE = {
  "NORMAL": "org.xmind.arrowShape.normal",
  "SPEARHEAD": "org.xmind.arrowShape.spearhead",
  "DOT": "org.xmind.arrowShape.dot",
  "TRIANGLE": "org.xmind.arrowShape.triangle",
  "SQUARE": "org.xmind.arrowShape.square",
  "DIAMOND": "org.xmind.arrowShape.diamond",
  "HERRINGBONE": "org.xmind.arrowShape.herringbone",
  "NONE": "org.xmind.arrowShape.none",
  "RING": "org.xmind.arrowShape.ring",
  "EYE": "org.xmind.arrowShape.eye",
  // "HALFTRIANGLE": 'org.xmind.arrowShape.halftriangle',
  "DOUBLEARROW": 'org.xmind.arrowShape.doublearrow',
  "SQUARERING": 'org.xmind.arrowShape.squarering',
  // "KNOT": 'org.xmind.arrowShape.knot',
  // "TRIANGLERING": 'org.xmind.arrowShape.trianglering',
  "ANTITRIANGLE": 'org.xmind.arrowShape.antiTriangle',
  "ATTACHED": 'org.xmind.arrowShape.attached',
  "HOOK": 'org.xmind.arrowShape.hook'
}

export const RELATIONSHIPSHAPE = {
  "CURVED": "org.xmind.relationshipShape.curved",
  "ANGLED": "org.xmind.relationshipShape.angled",
  "STRAIGHT": "org.xmind.relationshipShape.straight",
  "ZIGZAG": "org.xmind.relationshipShape.zigzag"
}

export const SUMMARYCONNECTION = {
  "CURLY": "org.xmind.summaryShape.curly",
  "ANGLE": "org.xmind.summaryShape.angle",
  "SQUARE": "org.xmind.summaryShape.square",
  "ROUND": "org.xmind.summaryShape.round",
  "BRACKET": "org.xmind.summaryShape.bracket",
  "SHARP": "org.xmind.summaryShape.sharp",
  "FOLD": "org.xmind.summaryShape.fold",
  "STRAIGHT": "org.xmind.summaryShape.straight"
}

export const BRANCHCONNECTION = {
  "ROUNDEDELBOW": "org.xmind.branchConnection.roundedElbow",
  "STRAIGHT": "org.xmind.branchConnection.straight",
  "CURVE": "org.xmind.branchConnection.curve",
  "ARROWEDCURVE": "org.xmind.branchConnection.arrowedCurve",
  "FOLD": "org.xmind.branchConnection.fold",
  "FOLD2": "org.xmind.branchConnection.fold2",
  "ROUNDEDFOLD": "org.xmind.branchConnection.roundedfold",
  "BIGHT": "org.xmind.branchConnection.bight",
  // "SKEWELBOW": "org.xmind.branchConnection.skewElbow",
  // "SKEWELBOW2": "org.xmind.branchConnection.skewElbow2",
  // "HORN": "org.xmind.branchConnection.horn",
  // "SINUS": "org.xmind.branchConnection.sinus",
  "ELBOW": "org.xmind.branchConnection.elbow",
  "HORIZONTAL": "org.xmind.branchConnection.timeline.horizontal",
  "NONE": "org.xmind.branchConnection.none",

  CALLOUTLINE: 'calloutLine'
}

export const ARROWLINEPATTERN = {
  "DASH": "dash",
  "DASHDOT": "dash-dot",
  "DASHDOTDOT": "dash-dot-dot",
  "DOT": "dot",
  "SOLID": "solid",
  'ROUNDDOT': "round-dot"
}

export const TEXTTRANSFORM = {
  "MANUAL": "manual",
  "CAPITALIZE": "capitalize",
  "UPPERCASE": "uppercase",
  "LOWERCASE": "lowercase"
}