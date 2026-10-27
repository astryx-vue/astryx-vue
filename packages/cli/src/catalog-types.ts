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
  /** The npm package that owns this component, e.g. `@astryx-vue/core` or `@astryx-vue/lab`. */
  package: string
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
  /**
   * The package a reader gets this page from. The CLI carries the playground
   * pages, so copying one needs nothing but the CLI.
   */
  package: string
  title: LocaleText
  /** One sentence, written by hand under `generate/template-meta/`. */
  description: LocaleText
  /** Words a person would type when asking `build` for this page. */
  keywords: { en: string[], zh: string[] }
  category: LocaleText
  kind: TemplateKind
  /** Component names imported from `@astryx-vue/core`, in source order. */
  componentsUsed: string[]
  /**
   * npm packages the source imports, sorted. A ready template names only `vue`
   * and `@astryx-vue/core`, which is everything a page needs to run.
   */
  dependencies: string[]
  /** False when the page imports something a project without the playground cannot install. */
  isReady: boolean
  notReadyReason?: LocaleText
  /** The `.vue` file, unchanged. One copy, shared by both locales. */
  source: string
  docsUrl: LocaleText
}

/** One package the catalog covers, so a result can say where a record comes from. */
export interface CatalogPackage {
  name: string
  /** Repo-relative directory, e.g. `packages/core`. */
  directory: string
  /** The version this catalog was generated from: what `upgrade` compares against. */
  version: string
  /** The package's own one-line description, as it publishes it. */
  description: string
  /** True when the package is published only under the `canary` dist-tag. */
  canary: boolean
  /**
   * True when npm can serve this package today. A `private` package has no
   * published version, so nothing may print an install command for it.
   */
  published: boolean
}

/** One theme, as its own docs page describes it. */
export interface ThemeRecord {
  slug: string
  title: LocaleText
  summary: LocaleText
  /** The stylesheet the app entry imports, e.g. `@astryx-vue/themes/butter.css`. */
  cssImport: string
  /** The value `data-astryx-theme` takes on the element that should use the theme. */
  attributeValue: string
  /** The whole theme page, without frontmatter or docs-site tags. */
  body: LocaleText
  docsUrl: LocaleText
}

/** What `init` hands an AI assistant, read from the docs pages. */
export interface SetupGuide {
  installPackages: string[]
  themeImport: LocaleText
  localeCode: LocaleText
}

/** One section of the upgrade guide. */
export interface UpgradeSection {
  title: string
  body: string
}

/** An old name the upgrade guide replaces. */
export interface UpgradeRename {
  from: string
  to: string
}

/** `upgrade` prints these sections and searches the project for these names. */
export interface UpgradeRecord {
  sections: { en: UpgradeSection[], zh: UpgradeSection[] }
  renames: UpgradeRename[]
  guideUrl: LocaleText
  changelogUrl: LocaleText
}

export interface Catalog {
  generator: string
  description: string
  /** Every package the catalog covers, in reading order: core first, then the rest. */
  packages: CatalogPackage[]
  conventions: { en: string[], zh: string[] }
  components: ComponentRecord[]
  topics: TopicRecord[]
  templates: TemplateRecord[]
  themes: ThemeRecord[]
  /** Paragraphs from the themes index page that explain loading and scoping a theme. */
  themeScope: { en: string[], zh: string[] }
  setup: SetupGuide
  upgrade: UpgradeRecord
}

export interface CatalogEntryInput {
  slug: string
  group: string
  en: string
  zh: string
}
