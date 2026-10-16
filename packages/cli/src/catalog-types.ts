export interface LocaleText {
  en: string
  zh: string
}

export interface TableRow {
  name: string
  type?: string
  default?: string
  payload?: string
  description?: string
}

export interface TableGroup {
  heading: string
  rows: TableRow[]
}

export interface Practice {
  guidance: string
  text: string
}

export interface Note {
  heading: string
  text: string
}

export interface AnatomyPart {
  name: string
  description: string
}

export interface AccessibilityItem {
  name: string
  category: string
  criterion: string
  requirement: string
  states: string[]
  description: string
}

export interface ComponentRecord {
  slug: string
  /** PascalCase identifier used by `component <Name>`. */
  name: string
  title: LocaleText
  group: string
  groupTitle: LocaleText
  importPath: string | null
  exportName: string | null
  summary: LocaleText
  usage: LocaleText
  practices: { en: Practice[], zh: Practice[] }
  props: { en: TableGroup[], zh: TableGroup[] }
  slots: { en: TableGroup[], zh: TableGroup[] }
  events: { en: TableGroup[], zh: TableGroup[] }
  notes: { en: Note[], zh: Note[] }
  anatomy: { en: AnatomyPart[], zh: AnatomyPart[] }
  accessibility: { en: AccessibilityItem[], zh: AccessibilityItem[] }
  docsUrl: LocaleText
}

export interface TopicRecord {
  id: string
  kind: 'guide' | 'theme'
  title: LocaleText
  summary: LocaleText
  headings: { en: string[], zh: string[] }
  keywords: { en: string[], zh: string[] }
  docsUrl: LocaleText
}

export interface Catalog {
  generator: string
  description: string
  packageName: '@astryx-vue/core'
  themesPackage: '@astryx-vue/themes'
  conventions: { en: string[], zh: string[] }
  components: ComponentRecord[]
  topics: TopicRecord[]
}

export interface CatalogEntryInput {
  slug: string
  group: string
  en: string
  zh: string
}
