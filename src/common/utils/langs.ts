import {
  LANGS,
  CONFIG
} from '../../common/constants'
import { defaultConfig } from '../../common/config'

const langs = {
  [LANGS.EN_US]: {
    DEFAULT_CALLOUT_TOPIC_TITLE: "Callout",
    DEFAULT_FLOATING_TOPIC_TITLE: "Floating Topic",
    DEFAULT_MAIN_TOPIC_TITLE: "Main Topic",
    DEFAULT_SUBTOPIC_TITLE: "Subtopic",
    DEFAULT_SUMMARY_TOPIC_TITLE: "Summary",
    DEFAULT_RELATIONSHIP_TITLE: "Relationship",
    LEGEND_TITLE: "Legend",
    LABEL_TITLE: "Label",
    RECORD_TITLE_PREFIX: "Record"
  },
  [LANGS.ZH_CN]: {
    DEFAULT_CALLOUT_TOPIC_TITLE: "标注",
    DEFAULT_FLOATING_TOPIC_TITLE: "自由主题",
    DEFAULT_MAIN_TOPIC_TITLE: "分支主题",
    DEFAULT_SUBTOPIC_TITLE: "子主题",
    DEFAULT_SUMMARY_TOPIC_TITLE: "概要",
    DEFAULT_RELATIONSHIP_TITLE: "联系",
    LEGEND_TITLE: "图例",
    LABEL_TITLE: "标签",
    RECORD_TITLE_PREFIX: '录音'
  },
  [LANGS.ZH_HK]: {
    DEFAULT_CALLOUT_TOPIC_TITLE: "標註",
    DEFAULT_FLOATING_TOPIC_TITLE: "自由主題",
    DEFAULT_MAIN_TOPIC_TITLE: "分支主題",
    DEFAULT_SUBTOPIC_TITLE: "子主題",
    DEFAULT_SUMMARY_TOPIC_TITLE: "總結",
    DEFAULT_RELATIONSHIP_TITLE: "聯繫",
    LEGEND_TITLE: "圖例",
    LABEL_TITLE: "標籤",
    RECORD_TITLE_PREFIX: '錄音'
  },
  [LANGS.ZH_TW]: {
    DEFAULT_CALLOUT_TOPIC_TITLE: "標註",
    DEFAULT_FLOATING_TOPIC_TITLE: "自由主題",
    DEFAULT_MAIN_TOPIC_TITLE: "分支主題",
    DEFAULT_SUBTOPIC_TITLE: "子主題",
    DEFAULT_SUMMARY_TOPIC_TITLE: "總結",
    DEFAULT_RELATIONSHIP_TITLE: "聯繫",
    LEGEND_TITLE: "圖例",
    LABEL_TITLE: "標籤",
    RECORD_TITLE_PREFIX: '錄音'
  },
  [LANGS.JA_JP]: {
    DEFAULT_CALLOUT_TOPIC_TITLE: "コメント",
    DEFAULT_FLOATING_TOPIC_TITLE: "フリートピック",
    DEFAULT_MAIN_TOPIC_TITLE: "メイントピック",
    DEFAULT_SUBTOPIC_TITLE: "サブトピック",
    DEFAULT_SUMMARY_TOPIC_TITLE: "概要",
    DEFAULT_RELATIONSHIP_TITLE: "関連性",
    LEGEND_TITLE: "図例",
    LABEL_TITLE: "ラベル",
    RECORD_TITLE_PREFIX: '録音'
  },
  [LANGS.DE_DE]: {
    DEFAULT_CALLOUT_TOPIC_TITLE: "Anmerkung",
    DEFAULT_FLOATING_TOPIC_TITLE: "Freitext",
    DEFAULT_MAIN_TOPIC_TITLE: "Hauptknoten",
    DEFAULT_SUBTOPIC_TITLE: "Unterknoten",
    DEFAULT_SUMMARY_TOPIC_TITLE: "Zusammenfassung",
    DEFAULT_RELATIONSHIP_TITLE: "Verbindung",
    LEGEND_TITLE: "Legende",
    LABEL_TITLE: "Beschriftung",
    RECORD_TITLE_PREFIX: 'Aufnahme'
  },
  [LANGS.FR_FR]: {
    DEFAULT_CALLOUT_TOPIC_TITLE: "Bulle",
    DEFAULT_FLOATING_TOPIC_TITLE: "Sujet Flottant",
    DEFAULT_MAIN_TOPIC_TITLE: "Sujet principal",
    DEFAULT_SUBTOPIC_TITLE: "Sous-sujet",
    DEFAULT_SUMMARY_TOPIC_TITLE: "Résumé",
    DEFAULT_RELATIONSHIP_TITLE: "Relation",
    LEGEND_TITLE: "Légende",
    LABEL_TITLE: "Etiquette",
    RECORD_TITLE_PREFIX: 'Enregistrement Audio'
  },
}

export default {
  translate(langType: string, key: string) {
    const lang = langs[langType]
    if (!lang) {
      throw new Error(`unsupported language: ${langType}`)
    } else {
      const result = lang[key]
      if (!result) {
        defaultConfig.get(CONFIG.LOGGER).warn(`word '${key}' of language '${langType}' hasn't been translated`)
        return key
      } else {
        return result
      }
    }
  }
}
