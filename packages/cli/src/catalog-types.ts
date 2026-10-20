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

/** One example written for one language, which is what the CLI prints. */
export interface ExampleRecord {
  title: string
  description: string
  /** Vue source of the docs demo. Empty when the page has no demo binding. */
  code: string
}

/**
 * One example as the catalog stores it. The title and description are written
 * once per language, but the demo source is the same file on both pages, so the
 * code is kept once.
 */
export interface ExampleEntry {
  title: LocaleText
  description: LocaleText
  /** Vue source of the docs demo. Empty when the page has no demo binding. */
  code: string
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

export type ComponentKind = 'component' | 'composable'

export interface ComponentRecord {
  slug: string
  /** PascalCase identifier used by `component <Name>`. */
  name: string
  /** `composable` entries are the functions the docs list under Utility. They have no demo. */
  kind: ComponentKind
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
  examples: ExampleEntry[]
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
  /** Page markdown without frontmatter, scripts, and docs-site component tags. */
  body: LocaleText
  docsUrl: LocaleText
}

/** Pages are full screens. Blocks are page sections, and none exist yet. */
export type TemplateKind = 'page' | 'block'

export interface TemplateRecord {
  slug: string
  title: LocaleText
  /** One sentence, written by hand in `generate/template-meta.ts`. */
  description: LocaleText
  /** Words a person would type when asking `build` for this page. */
  keywords: { en: string[], zh: string[] }
  category: LocaleText
  kind: TemplateKind
  /** Component names imported from `@astryx-vue/core`, in source order. */
  componentsUsed: string[]
  /** False when the page imports something a project without the playground cannot install. */
  isReady: boolean
  notReadyReason?: LocaleText
  /** The `.vue` file, unchanged. One copy, shared by both locales. */
  source: string
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
  templates: TemplateRecord[]
}

export interface CatalogEntryInput {
  slug: string
  group: string
  en: string
  zh: string
}
