import type { LocaleText, TemplateRecord } from '../catalog-types.ts'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { PACKAGE_NAME } from '../spec.ts'
import { DOCS_ORIGIN } from './site.ts'
import { TEMPLATE_META } from './template-meta.ts'

/** The CLI ships the playground pages, so it owns every template record. */
const TEMPLATE_PACKAGE = PACKAGE_NAME

/** What the playground manifest knows about a page: its slug, its two titles, and its category. */
export interface PlaygroundTemplateSummary {
  slug: string
  title: LocaleText
  category: LocaleText
}

/**
 * Builds the `templates` catalog from the playground pages plus the hand-written
 * metadata. Throws when a page has no metadata or metadata names a page that no
 * longer exists, so adding or deleting a playground page without touching
 * `template-meta.ts` fails the build instead of shipping a half-described template.
 */
export async function buildTemplates(repoRoot: string, summaries: readonly PlaygroundTemplateSummary[], installable: ReadonlySet<string>): Promise<TemplateRecord[]> {
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
    const { componentsUsed, foreignPackages } = analyzeTemplateImports(source, installable)
    const category = summary.category.en || summary.category.zh ? summary.category : (meta.category ?? { en: 'Other', zh: '其他' })
    records.push({
      slug: summary.slug,
      package: TEMPLATE_PACKAGE,
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
 * Reads a template's imports. Components are the names it pulls from any package
 * a project can install; anything else outside `vue` and relative files is a
 * package the reader's project may not have.
 */
export function analyzeTemplateImports(source: string, installable: ReadonlySet<string>): { componentsUsed: string[], foreignPackages: string[] } {
  const componentsUsed: string[] = []
  const foreign = new Set<string>()
  for (const match of source.matchAll(/(?:^|\n)import (type )?([\s\S]*?) from (['"])([^'"]+)\3/g)) {
    const typeOnly = match[1] !== undefined
    const clause = match[2] ?? ''
    const specifier = match[4] ?? ''
    if (specifier.startsWith('.'))
      continue
    const root = packageRoot(specifier)
    if (!installable.has(root)) {
      foreign.add(root)
      continue
    }
    // Types and lowercase helpers (`pixel`, `proportional`) are not components,
    // so only PascalCase names are listed as what the page uses.
    if (!typeOnly && root !== 'vue')
      componentsUsed.push(...importedNames(clause, specifier))
  }
  for (const match of source.matchAll(/(?:^|\n)import (['"])([^'"]+)\1/g)) {
    const specifier = match[2] ?? ''
    if (specifier.startsWith('.'))
      continue
    const root = packageRoot(specifier)
    if (!installable.has(root))
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
  const subpath = specifier.slice(specifier.lastIndexOf('/') + 1)
  return /^[A-Z]/.test(subpath) ? [subpath] : []
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
    parts.en.push(`It imports ${others.join(', ')}, which is not one of the astryx-vue packages, so the docs do not cover it.`)
    parts.zh.push(`它引用了 ${others.join(', ')}，这不是 astryx-vue 发布的包，文档没有覆盖。`)
  }
  return { en: parts.en.join(' '), zh: parts.zh.join(' ') }
}
