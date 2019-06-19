import BaseComponent from './base-component'
import { COMPONENT_TYPE } from '../common/constants'

const PROVIDER_KEY = 'provider'

export interface _ExtensionData_TextNode {
  provider: string ///"<TYPE:TOPIC_EXTENSION_PROVIDER>",
  content: string /// "<STRING>"  // text node
}
export interface _ExtensionData_ChildNode {
  provider: string ///"<TYPE:TOPIC_EXTENSION_PROVIDER>",
  content: [     // child nodes
    Object  ///"<ATTR_NAME>": "<ATTR_VALUE>",
  ]
  resourceRefs: [
    string ///"xap:resources/<HASH>.pdf",
  ]
}

export type ExtensionData = _ExtensionData_TextNode | _ExtensionData_ChildNode

export default class Extension extends BaseComponent<ExtensionData> {

  componentType = COMPONENT_TYPE.EXTENSION

  getProvider(): string {
    return this._data.commit("get", PROVIDER_KEY)
  }
}
