export const CONFIG = {
  'LOGGER': 'logger', // object like console
  'INPUT_HANDLER': 'inputHandler', // a function and return promise
  "XAP_LOADER": "xapLoader", //a function and return promise
  "XAP_GENERATOR": "xapGen", //a function receive a File object and return a promised xap.
  "URL_PREFIX": "urlPrefix", //indicate the url location of snowbrush's root directory
  "NO_ANIMATION": "noAimation", //whether no animation, true or false
  "LANGUAGE": "language", //see constant.LANGS
  "MAX_SCALE": "maxScale", //100 is no scaling, default Infinity
  "MIN_SCALE": "minScale", //100 is no scaling, default 0
  "NO_KEYBIND": "noKeybind",
  'KEYBINDING_SERVICE': 'KeyBinding_service',
  "INFO_ITEM_STYLE": "infoItemStyle",
  "READONLY": "readonly",
  "NO_EDIT_RECEIVER": "noEditReceiver",
  "CLIPBOARD_READER": "clipboardReader", //a function and return promise
  "CLIPBOARD_WRITER": "clipboardWriter",
  "DEFERED_EVENTS": "deferedEvents", //Deprecated
  "DEFERED_TIME": "deferedTime", // Deprecated
  "PADDING_FACTOR": 'paddingFactor',
  "FAKE_IMAGE": "fakeImage",
  'NO_LISTEN_RESIZE': 'noListenResize',
  'CJK_FONT_FAMILY': 'cjkFontFamily',
  'PLATFORM': 'platform',
  'FONT_URL_PREFIX': 'fontUrlPrefix',
  'FONT_FACE_GENERATOR': 'fontFaceGenerator',
  'HIDE_COLLAPSE_BTN': 'hideCollapseBtn',
  'NO_TOPIC_CUSTOM_WIDTH_BTN': 'noTopicCustomWidthBtn',
  'PRE_ACTIONS': 'preActions',
  'POST_ACTIONS': 'postActions',
  'AUTO_ACTION_STATUS': 'autoActionStatus',
  'LIMITED_OPERATION_HANDLER': 'limitedOperationHandler'
}