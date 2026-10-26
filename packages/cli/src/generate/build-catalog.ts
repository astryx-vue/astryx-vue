import type { AccessibilityItem, AnatomyPart, Catalog, CatalogEntryInput, ComponentKind, ComponentRecord, ExampleEntry, ExampleRecord, LocaleText, TemplateRecord, TopicRecord } from '../catalog-types.ts'
import type { PageExample } from './markdown.ts'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { cleanMarkdown, extractPage, extractTopic, paragraphContaining, pascalCase } from './markdown.ts'
import { TEMPLATE_META } from './template-meta.ts'

function mergeExtract(index: ReturnType<typeof extractPage>, props: ReturnType<typeof extractPage>): ReturnType<typeof extractPage> {
  return {
    summary: index.summary || props.summary,
    usage: index.usage || props.usage,
    practices: [...index.practices, ...props.practices],
    props: [...index.props, ...props.props],
    slots: [...index.slots, ...props.slots],
    events: [...index.events, ...props.events],
    notes: [...index.notes, ...props.notes],
    examples: [...index.examples, ...props.examples],
    importPath: index.importPath ?? props.importPath,
    exportName: index.exportName ?? props.exportName,
  }
}

/** PascalCase subpath exports. Lowercase entries such as `./icons` and `./locale` are not components. */
const COMPONENT_EXPORT = /^\.\/[A-Z][A-Za-z0-9]*$/

/**
 * Composables are the `use*` functions documented under Utility. They have no visual demo,
 * so their page has nothing to render and their meta.ts omits `demo`.
 */
export function componentKind(slug: string, group: string): ComponentKind {
  if (!slug.startsWith('use-'))
    return 'component'
  if (group !== 'Utility')
    throw new Error(`composable ${slug} must stay in the Utility group, found ${group}`)
  return 'composable'
}

export function componentExportsMissingDocs(exportKeys: readonly string[], importPaths: readonly (string | null)[]): string[] {
  const referenced = new Set(importPaths.filter((path): path is string => Boolean(path)))
  return exportKeys
    .filter(key => COMPONENT_EXPORT.test(key))
    .filter(key => !referenced.has(`@astryx-vue/core${key.slice(1)}`))
    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
}

const DOCS_ORIGIN = 'https://astryx-vue.pages.dev'

interface ReferencePart {
  name: string
  description: string
}

interface AccessibilitySource {
  name: string
  category: string
  criterion: string
  requirement: string
  states: string[]
  description: string
}

export async function buildCatalog(repoRoot: string, entries: readonly CatalogEntryInput[], groupTitles: { en: Record<string, string>, zh: Record<string, string> }, templates: readonly PlaygroundTemplateSummary[]): Promise<Catalog> {
  const corePackage = JSON.parse(await readFile(join(repoRoot, 'packages/core/package.json'), 'utf8')) as { exports?: Record<string, unknown> }
  const exportKeys = new Set(Object.keys(corePackage.exports ?? {}))
  const anatomy = {
    en: await readJson<Record<string, AnatomyPart[]>>(join(repoRoot, 'apps/docs/components/demo-infra/reference/anatomy.en.json')),
    zh: await readJson<Record<string, ReferencePart[]>>(join(repoRoot, 'apps/docs/components/demo-infra/reference/anatomy.zh.json')),
  }
  const accessibility = {
    en: await readJson<Record<string, AccessibilitySource[]>>(join(repoRoot, 'apps/docs/components/demo-infra/reference/accessibility.en.json')),
    zh: await readJson<Record<string, ReferencePart[]>>(join(repoRoot, 'apps/docs/components/demo-infra/reference/accessibility.zh.json')),
  }

  const missing: string[] = []
  const components: ComponentRecord[] = []
  const demoSourceCache = new Map<string, Promise<Map<string, string>>>()
  for (const entry of entries) {
    const name = pascalCase(entry.slug)
    const pages = {
      en: await readLocalePage(repoRoot, 'en', entry.slug),
      zh: await readLocalePage(repoRoot, 'zh', entry.slug),
    }
    const extracted = {
      en: mergeExtract(extractPage(pages.en.index, name), extractPage(pages.en.props, name)),
      zh: mergeExtract(extractPage(pages.zh.index, name), extractPage(pages.zh.props, name)),
    }
    const examples = {
      en: await resolveExamples(repoRoot, entry.slug, 'en', extracted.en.examples, demoSourceCache),
      zh: await resolveExamples(repoRoot, entry.slug, 'zh', extracted.zh.examples, demoSourceCache),
    }
    if (!extracted.en.summary)
      missing.push(`${entry.slug} (en summary)`)
    if (!extracted.zh.summary)
      missing.push(`${entry.slug} (zh summary)`)
    const imported = extracted.en.importPath
      ? extracted.en
      : extracted.zh.importPath
        ? extracted.zh
        : null
    const exportName = imported?.exportName ?? (exportKeys.has(`./${name}`) ? name : null)
    const importPath = imported?.importPath ?? (exportName ? `@astryx-vue/core/${exportName}` : null)
    components.push({
      slug: entry.slug,
      name,
      kind: componentKind(entry.slug, entry.group),
      title: { en: entry.en, zh: entry.zh },
      group: entry.group,
      groupTitle: {
        en: groupTitles.en[entry.group] ?? entry.group,
        zh: groupTitles.zh[entry.group] ?? entry.group,
      },
      importPath,
      exportName,
      summary: { en: extracted.en.summary, zh: extracted.zh.summary },
      usage: { en: extracted.en.usage, zh: extracted.zh.usage },
      practices: { en: extracted.en.practices, zh: extracted.zh.practices },
      props: { en: extracted.en.props, zh: extracted.zh.props },
      slots: { en: extracted.en.slots, zh: extracted.zh.slots },
      events: { en: extracted.en.events, zh: extracted.zh.events },
      notes: { en: extracted.en.notes, zh: extracted.zh.notes },
      examples: pairExamples(entry.slug, examples.en, examples.zh),
      anatomy: localizedAnatomy(anatomy.en[entry.slug] ?? [], anatomy.zh[entry.slug] ?? []),
      accessibility: localizedAccessibility(accessibility.en[entry.slug] ?? [], accessibility.zh[entry.slug] ?? []),
      docsUrl: {
        en: `${DOCS_ORIGIN}/en/components/${entry.slug}`,
        zh: `${DOCS_ORIGIN}/components/${entry.slug}`,
      },
    })
  }
  if (missing.length > 0)
    throw new Error(`component pages did not yield a usage summary:\n${missing.join('\n')}`)

  const undocumented = componentExportsMissingDocs([...exportKeys], components.map(component => component.importPath))
  if (undocumented.length > 0) {
    throw new Error(
      `core export is missing docs metadata. Add demos/<slug>/meta.ts and a docs page that imports it, then run pnpm --filter @astryx-vue/cli generate:\n${undocumented.join('\n')}`,
    )
  }

  return {
    generator: 'packages/cli/scripts/generate-catalog.mjs',
    description: 'Generated from apps/docs pages, demos/*/meta.ts, demo Vue sources, reference JSON, @astryx-vue/core exports, and the playground templates. Do not edit by hand.',
    packageName: '@astryx-vue/core',
    themesPackage: '@astryx-vue/themes',
    conventions: await readConventions(repoRoot),
    components,
    topics: await readTopics(repoRoot),
    templates: await buildTemplates(repoRoot, templates),
  }
}

/** What the playground manifest knows about a page: its slug, its two titles, and its category. */
export interface PlaygroundTemplateSummary {
  slug: string
  title: LocaleText
  category: LocaleText
}

/** Packages a project can install. Everything else makes a template unready. */
const INSTALLABLE_PACKAGES = new Set(['vue', '@astryx-vue/core'])

/**
 * Builds the `templates` catalog from the playground pages plus the hand-written
 * metadata. Throws when a page has no metadata or metadata names a page that no
 * longer exists, so adding or deleting a playground page without touching
 * `template-meta.ts` fails the build instead of shipping a half-described template.
 */
export async function buildTemplates(repoRoot: string, summaries: readonly PlaygroundTemplateSummary[]): Promise<TemplateRecord[]> {
  const known = new Set(summaries.map(summary => summary.slug))
  const missing = summaries.map(summary => summary.slug).filter(slug => !TEMPLATE_META[slug])
  if (missing.length > 0)
    throw new Error(`playground templates are missing metadata in packages/cli/src/generate/template-meta.ts:\n${missing.join('\n')}`)
  const stale = Object.keys(TEMPLATE_META).filter(slug => !known.has(slug))
  if (stale.length > 0)
    throw new Error(`template-meta.ts describes templates that are not in the playground manifest:\n${stale.join('\n')}`)

  const records: TemplateRecord[] = []
  for (const summary of summaries) {
    const meta = TEMPLATE_META[summary.slug]!
    const source = await readFile(join(repoRoot, 'apps/docs/components/playground/pages', `${summary.slug}.vue`), 'utf8')
    const { componentsUsed, foreignPackages } = analyzeTemplateImports(source)
    const category = summary.category.en || summary.category.zh ? summary.category : (meta.category ?? { en: 'Other', zh: '其他' })
    records.push({
      slug: summary.slug,
      title: summary.title,
      description: meta.description,
      keywords: meta.keywords,
      category,
      kind: 'page',
      componentsUsed,
      ...(foreignPackages.length > 0 || meta.upstreamNotReady
        ? { isReady: false, notReadyReason: notReadyReason(foreignPackages, meta.upstreamNotReady === true) }
        : { isReady: true }),
      source,
      docsUrl: {
        en: `${DOCS_ORIGIN}/en/playground/?template=${summary.slug}`,
        zh: `${DOCS_ORIGIN}/playground/?template=${summary.slug}`,
      },
    })
  }
  return records
}

/**
 * Reads a template's imports. Components are the names it pulls from
 * `@astryx-vue/core`; anything else outside `vue` and relative files is a package
 * the reader's project may not have.
 */
export function analyzeTemplateImports(source: string): { componentsUsed: string[], foreignPackages: string[] } {
  const componentsUsed: string[] = []
  const foreign = new Set<string>()
  for (const match of source.matchAll(/(?:^|\n)import (type )?([\s\S]*?) from (['"])([^'"]+)\3/g)) {
    const typeOnly = match[1] !== undefined
    const clause = match[2] ?? ''
    const specifier = match[4] ?? ''
    if (specifier.startsWith('.'))
      continue
    const root = packageRoot(specifier)
    if (root === '@astryx-vue/core') {
      // Types and lowercase helpers (`pixel`, `proportional`) are not components,
      // so only PascalCase names are listed as what the page uses.
      if (!typeOnly)
        componentsUsed.push(...importedNames(clause, specifier))
      continue
    }
    if (INSTALLABLE_PACKAGES.has(root))
      continue
    foreign.add(root)
  }
  for (const match of source.matchAll(/(?:^|\n)import (['"])([^'"]+)\1/g)) {
    const specifier = match[2] ?? ''
    if (specifier.startsWith('.'))
      continue
    const root = packageRoot(specifier)
    if (!INSTALLABLE_PACKAGES.has(root))
      foreign.add(root)
  }
  return { componentsUsed: [...new Set(componentsUsed)], foreignPackages: [...foreign].sort() }
}

/** `@scope/name/sub/path` becomes `@scope/name`; `name/sub` becomes `name`. */
function packageRoot(specifier: string): string {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : (parts[0] ?? specifier)
}

/** PascalCase names only: the design system names components that way, and helpers do not. */
function importedNames(clause: string, specifier: string): string[] {
  const named = /\{([\s\S]*?)\}/.exec(clause)?.[1] ?? ''
  const fromBraces = named
    .split(',')
    .map(entry => entry.trim().split(/\s+as\s+/)[0] ?? '')
    .filter(name => /^[A-Z]/.test(name))
  if (fromBraces.length > 0)
    return fromBraces
  const subpath = specifier.slice('@astryx-vue/core'.length).replace(/^\//, '')
  return subpath && /^[A-Z]/.test(subpath) ? [subpath] : []
}

function notReadyReason(packages: readonly string[], upstreamNotReady: boolean): LocaleText {
  const others = packages.filter(item => item !== '@astryx-vue/playground-charts')
  const parts = { en: [] as string[], zh: [] as string[] }
  if (upstreamNotReady) {
    parts.en.push('Upstream Astryx still marks this page as a work in progress.')
    parts.zh.push('原版 Astryx 仍把这个页面标为未完成。')
  }
  if (packages.includes('@astryx-vue/playground-charts')) {
    parts.en.push('It imports @astryx-vue/playground-charts, which exists only inside the docs playground and is not a published package.')
    parts.zh.push('它引用了 @astryx-vue/playground-charts，这个包只存在于本站演练场，没有发布到 npm。')
  }
  if (others.length > 0) {
    parts.en.push(`It imports ${others.join(', ')}, which this package does not document.`)
    parts.zh.push(`它引用了 ${others.join(', ')}，本工具没有为这些包提供文档。`)
  }
  return { en: parts.en.join(' '), zh: parts.zh.join(' ') }
}

async function readLocalePage(repoRoot: string, locale: 'en' | 'zh', slug: string): Promise<{ index: string, props: string }> {
  const dir = join(repoRoot, 'apps/docs/docs', locale, 'components', slug)
  return {
    index: await readFile(join(dir, 'index.md'), 'utf8'),
    props: await readOptional(join(dir, 'props.md')),
  }
}

async function readTopics(repoRoot: string): Promise<TopicRecord[]> {
  const topics: TopicRecord[] = []
  for (const kind of ['guide', 'theme'] as const) {
    const directory = kind === 'guide' ? 'guide' : 'themes'
    const ids = (await readdir(join(repoRoot, 'apps/docs/docs/en', directory)))
      .filter(name => name.endsWith('.md'))
      .map(name => name.slice(0, -'.md'.length))
      .sort((a, b) => {
        if (a === 'index')
          return -1
        if (b === 'index')
          return 1
        return a < b ? -1 : a > b ? 1 : 0
      })
    for (const id of ids) {
      const en = await readFile(join(repoRoot, 'apps/docs/docs/en', directory, `${id}.md`), 'utf8')
      const zh = await readFile(join(repoRoot, 'apps/docs/docs/zh', directory, `${id}.md`), 'utf8')
      const enTopic = extractTopic(en)
      const zhTopic = extractTopic(zh)
      topics.push({
        id: id === 'index' ? kind : `${kind}/${id}`,
        kind,
        title: { en: enTopic.title, zh: zhTopic.title },
        summary: { en: enTopic.summary, zh: zhTopic.summary },
        headings: { en: enTopic.headings, zh: zhTopic.headings },
        keywords: { en: enTopic.keywords, zh: zhTopic.keywords },
        body: { en: cleanMarkdown(en), zh: cleanMarkdown(zh) },
        docsUrl: docsUrl(kind, id),
      })
    }
  }
  return topics
}

async function readConventions(repoRoot: string): Promise<{ en: string[], zh: string[] }> {
  const gettingStarted = {
    en: await readFile(join(repoRoot, 'apps/docs/docs/en/guide/getting-started.md'), 'utf8'),
    zh: await readFile(join(repoRoot, 'apps/docs/docs/zh/guide/getting-started.md'), 'utf8'),
  }
  const installation = {
    en: await readFile(join(repoRoot, 'apps/docs/docs/en/guide/installation.md'), 'utf8'),
    zh: await readFile(join(repoRoot, 'apps/docs/docs/zh/guide/installation.md'), 'utf8'),
  }
  const styling = {
    en: await readFile(join(repoRoot, 'apps/docs/docs/en/guide/styling.md'), 'utf8'),
    zh: await readFile(join(repoRoot, 'apps/docs/docs/zh/guide/styling.md'), 'utf8'),
  }
  return {
    en: [
      paragraphContaining(gettingStarted.en, 'own subpath'),
      paragraphContaining(installation.en, 'peers on'),
      paragraphContaining(installation.en, 'Subpaths and the package root'),
      paragraphContaining(styling.en, 'do not require UnoCSS'),
    ],
    zh: [
      paragraphContaining(gettingStarted.zh, '子路径'),
      paragraphContaining(installation.zh, 'peer 依赖'),
      paragraphContaining(installation.zh, '子路径和包根'),
      paragraphContaining(styling.zh, '不要求 UnoCSS'),
    ],
  }
}

function localizedAnatomy(en: AnatomyPart[], zh: ReferencePart[]): { en: AnatomyPart[], zh: AnatomyPart[] } {
  if (zh.length !== en.length)
    return { en, zh: en }
  return {
    en,
    zh: en.map((part, index) => ({
      name: zh[index]?.name ?? part.name,
      description: zh[index]?.description ?? part.description,
    })),
  }
}

function localizedAccessibility(en: AccessibilitySource[], zh: ReferencePart[]): { en: AccessibilityItem[], zh: AccessibilityItem[] } {
  const english = en.map(item => ({ ...item }))
  if (zh.length !== en.length)
    return { en: english, zh: english }
  return {
    en: english,
    zh: en.map((item, index) => ({
      ...item,
      name: zh[index]?.name ?? item.name,
      description: zh[index]?.description ?? item.description,
    })),
  }
}

function docsUrl(kind: 'guide' | 'theme', id: string): LocaleText {
  const folder = kind === 'guide' ? 'guide' : 'themes'
  const suffix = id === 'index' ? '' : `/${id}`
  return {
    en: `${DOCS_ORIGIN}/en/${folder}${suffix}`,
    zh: `${DOCS_ORIGIN}/${folder}${suffix}`,
  }
}

async function readOptional(path: string): Promise<string> {
  try {
    return await readFile(path, 'utf8')
  }
  catch (error) {
    if (isMissing(error))
      return ''
    throw error
  }
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}

function demoSources(repoRoot: string, folder: string, cache: Map<string, Promise<Map<string, string>>>): Promise<Map<string, string>> {
  const cached = cache.get(folder)
  if (cached)
    return cached
  const pending = readDemoSources(repoRoot, folder)
  cache.set(folder, pending)
  return pending
}

/**
 * Folds the examples of both locale pages into one array. Each page lists the
 * same demos in the same order and points at the same `.vue` file, so the code
 * is stored once. Titles and descriptions stay separate per language.
 *
 * Throws instead of dropping a language when the two pages drift apart, because
 * the alternative is shipping an English snippet under a Chinese heading.
 */
export function pairExamples(slug: string, en: readonly ExampleRecord[], zh: readonly ExampleRecord[]): ExampleEntry[] {
  if (en.length !== zh.length) {
    throw new Error(
      `${slug}: the en page lists ${en.length} examples and the zh page lists ${zh.length}. Both pages must document the same examples, in the same order, so the code can be stored once.`,
    )
  }
  return en.map((example, index) => {
    const translated = zh[index]!
    if (example.code !== translated.code) {
      throw new Error(
        `${slug}: example ${index + 1} (en "${example.title}", zh "${translated.title}") uses different code on the en and zh pages. Point both pages at the same demo, or remove the example from one of them.`,
      )
    }
    return {
      title: { en: example.title, zh: translated.title },
      description: { en: example.description, zh: translated.description },
      code: example.code,
    }
  })
}

async function resolveExamples(repoRoot: string, slug: string, locale: 'en' | 'zh', examples: readonly PageExample[], cache: Map<string, Promise<Map<string, string>>>): Promise<ExampleRecord[]> {
  const resolved: ExampleRecord[] = []
  for (const example of examples) {
    if (!example.demo) {
      resolved.push({ title: example.title, description: example.description, code: example.code })
      continue
    }
    const folder = example.folder ?? slug
    const exportName = example.exportName ?? example.demo
    const code = (await demoSources(repoRoot, folder, cache)).get(exportName)
    if (code === undefined) {
      throw new Error(
        `${locale} docs for ${slug} reference demo "${example.demo}" (${folder}#${exportName}), but apps/docs/components/demos/${folder}/index.ts does not export that Vue demo`,
      )
    }
    resolved.push({ title: example.title, description: example.description, code })
  }
  return resolved
}

async function readDemoSources(repoRoot: string, slug: string): Promise<Map<string, string>> {
  const indexPath = join(repoRoot, 'apps/docs/components/demos', slug, 'index.ts')
  let source = ''
  try {
    source = await readFile(indexPath, 'utf8')
  }
  catch (error) {
    if (isMissing(error))
      return new Map()
    throw error
  }
  const files = new Map<string, string>()
  for (const match of source.matchAll(/import\s+(\w+)\s+from\s+['"](\.[^'"]+\.vue)['"]/g)) {
    const local = match[1]
    const relativePath = match[2]
    if (local && relativePath)
      files.set(local, relativePath)
  }
  const sources = new Map<string, string>()
  for (const match of source.matchAll(/export\s+const\s+(\w+)\s*=\s*defineDemo\(\s*(\w+)/g)) {
    const exported = match[1]
    const local = match[2]
    const relativePath = exported && local ? files.get(local) : undefined
    if (!exported || !relativePath || sources.has(exported))
      continue
    sources.set(exported, (await readFile(join(dirname(indexPath), relativePath), 'utf8')).trimEnd())
  }
  return sources
}
