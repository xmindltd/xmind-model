import { CONFIG, LANGS, INFO_ITEM_STYLE_TYPE } from './constants/index'
import { isUndefined, isObject } from './utils'

const defaultConfigData = {
  [CONFIG.XAP_LOADER]: () => {
    return Promise.resolve('')
  },

  [CONFIG.URL_PREFIX]: '',
  [CONFIG.FONT_URL_PREFIX]: '',
  // [CONFIG.FONT_FACE_GENERATOR]: fontFamily => {
  //   return new Promise((resolve) => {
  //     let fontFace = embeddedFonts[fontFamily]
  //     resolve(fontFace ? [fontFace] : [])
  //   })
  // },
  [CONFIG.LANGUAGE]: LANGS.EN_US,
  [CONFIG.MAX_SCALE]: Infinity,
  [CONFIG.MIN_SCALE]: 0,
  [CONFIG.NO_KEYBIND]: false,
  [CONFIG.KEYBINDING_SERVICE]: function getCommand(keyCode, modifier) {
    return null
  },
  [CONFIG.NO_EDIT_RECEIVER]: false,
  [CONFIG.READONLY]: false,
  [CONFIG.HIDE_COLLAPSE_BTN]: true,
  [CONFIG.NO_TOPIC_CUSTOM_WIDTH_BTN]: true,
  [CONFIG.INFO_ITEM_STYLE]: INFO_ITEM_STYLE_TYPE.FASHION,
  [CONFIG.CLIPBOARD_READER]: function () {
    return null;
  },
  // [CONFIG.DEFERED_EVENTS]: [
  //   EVENTS.UNDO_STATE_CHANGE,
  //   EVENTS.AFTER_ADD_TOPIC,
  //   EVENTS.AFTER_REMOVE_TOPIC,
  //   EVENTS.SELECTION_CHANGED,
  //   EVENTS.SCALE_CHANGED
  // ],
  [CONFIG.PADDING_FACTOR]: 1,
  // [CONFIG.DEFERED_TIME]: 250,
  [CONFIG.FAKE_IMAGE]: false,
  [CONFIG.LOGGER]: {
    /*eslint-disable no-console*/
    info: process.env.NODE_ENV === 'development' ? console.info.bind(console) : op,
    warn: process.env.NODE_ENV === 'development' ? console.warn.bind(console) : op,
    error: process.env.NODE_ENV === 'development' ? console.error.bind(console) : op,
    debug: process.env.NODE_ENV === 'development' ? console.debug.bind(console) : op,
    /*eslint-enable no-console*/
  },
  [CONFIG.INPUT_HANDLER]: function (e) {
    return Promise.resolve('')
  },
  /// true: continue to do other things
  /// false: stop
  [CONFIG.LIMITED_OPERATION_HANDLER]: function (operation) {
    return Promise.resolve(true) //SUPPORTED_LIMITED_OPERATIONS.includes(operation) ? Promise.resolve(false) : Promise.resolve(true)
  },

  [CONFIG.AUTO_ACTION_STATUS]: false,
}

function op () { }

export class Config {

  private data: any
  private _parent: Config

  constructor(configData: any = {}) {
    this.data = Object.assign({}, configData)
  }

  parent(parentConfigInstance?: Config) {
    if (parentConfigInstance instanceof Config) {
      this._parent = parentConfigInstance
    }
    return this._parent || (this !== defaultConfig ? defaultConfig : null)
  }

  get(key) {
    let value = this.data[key]
    if (isUndefined(value)) {
      let p = this.parent()
      value = p && p.get(key)
    }
    return value
  }

  set(...args) {
    if (isObject(args[0])) {
      let d = args[0]
      for (let attr in d) {
        this.set(attr, d[attr])
      }
    } else if (args.length === 2) {
      let key = args[0];
      let value = args[1];
      this.data[key] = value
    } else {
      this.get(CONFIG.LOGGER).error('Illegal arguments for Config: ', args)
    }
  }

}

export const defaultConfig = new Config(defaultConfigData)
