import type { ThemeRecord } from '../catalog-types.ts'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cleanMarkdown, extractTopic, paragraphContaining } from './markdown.ts'
import { DOCS_ORIGIN } from './site.ts'

/**
 * The theme catalog is read from two places that must agree: a theme ships as a
 * stylesheet in `packages/themes/`, and it has a docs page at
 * `apps/docs/docs/<locale>/themes/<slug>.md` that says how to load it. A theme
 * with a stylesheet but no page fails the build, because `theme <name>` would
 * have nothing to print.
 */

/** Stylesheets that are not a theme of their own: the data primitives and the font faces. */
const NOT_A_THEME = new Set(['data.css', 'fonts.css'])

export interface ThemeSource {
  slug: string
}

/** Every shipped theme, in the order the docs sidebar lists them (alphabetical). */
export async function discoverThemes(repoRoot: string): Promise<ThemeSource[]> {
  const entries = await readdir(join(repoRoot, 'packages/themes'))
  return entries
    .filter(name => name.endsWith('.css') && !NOT_A_THEME.has(name))
    .map(name => ({ slug: name.slice(0, -'.css'.length) }))
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

export async function buildThemes(repoRoot: string): Promise<ThemeRecord[]> {
  const sources = await discoverThemes(repoRoot)
  const records: ThemeRecord[] = []
  for (const source of sources) {
    const en = await readFile(join(repoRoot, 'apps/docs/docs/en/themes', `${source.slug}.md`), 'utf8')
    const zh = await readFile(join(repoRoot, 'apps/docs/docs/zh/themes', `${source.slug}.md`), 'utf8')
    const topic = { en: extractTopic(en), zh: extractTopic(zh) }
    records.push({
      slug: source.slug,
      title: { en: topic.en.title, zh: topic.zh.title },
      summary: { en: topic.en.summary, zh: topic.zh.summary },
      cssImport: readCssImport(en, source.slug),
      attributeValue: readAttributeValue(en, source.slug),
      body: { en: cleanMarkdown(en), zh: cleanMarkdown(zh) },
      docsUrl: {
        en: `${DOCS_ORIGIN}/en/themes/${source.slug}`,
        zh: `${DOCS_ORIGIN}/themes/${source.slug}`,
      },
    })
  }
  return records
}

/**
 * How a theme is loaded and scoped, read from the themes index page rather than
 * written again in the CLI: the page that explains that `data-astryx-theme` on a
 * subtree themes only that subtree is the page the command points at.
 */
export async function readThemeScope(repoRoot: string): Promise<{ en: string[], zh: string[] }> {
  const en = await readFile(join(repoRoot, 'apps/docs/docs/en/themes/index.md'), 'utf8')
  const zh = await readFile(join(repoRoot, 'apps/docs/docs/zh/themes/index.md'), 'utf8')
  return {
    en: [paragraphContaining(en, 'data-astryx-theme'), paragraphContaining(en, 'load with every theme')],
    zh: [paragraphContaining(zh, 'data-astryx-theme'), paragraphContaining(zh, '只有默认的 Neutral')],
  }
}

function readCssImport(page: string, slug: string): string {
  const match = /import\s+['"](@astryx-vue\/themes\/[^'"]+\.css)['"]/.exec(page)
  if (!match)
    throw new Error(`themes/${slug}.md does not show how to import the theme; expected an import from @astryx-vue/themes/${slug}.css`)
  return match[1]!
}

/**
 * The value `data-astryx-theme` takes. Theme pages show it in a snippet; the
 * default theme only names it in prose, and a theme's value is its slug, which
 * is what its stylesheet selects on.
 */
function readAttributeValue(page: string, slug: string): string {
  const match = /data-astryx-theme=["']([^"']+)["']/.exec(page)
  return match?.[1] ?? slug
}

/** The one-line labels the `theme` command prints above each theme. */
export function themeBrief(record: ThemeRecord, locale: 'en' | 'zh'): { slug: string, title: string, summary: string, cssImport: string, attributeValue: string, docsUrl: string } {
  return {
    slug: record.slug,
    title: record.title[locale],
    summary: record.summary[locale],
    cssImport: record.cssImport,
    attributeValue: record.attributeValue,
    docsUrl: record.docsUrl[locale],
  }
}
