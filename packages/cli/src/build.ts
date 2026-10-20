import type { TemplateRecord } from './catalog-types.ts'
import type { SearchHit } from './query.ts'
import { catalog, text } from './catalog.ts'
import { CliError } from './error.ts'
import { searchCatalog } from './query.ts'
import { BINARY } from './spec.ts'

/**
 * `build` answers one question: given a sentence, which page template should I
 * start from, and which documented pieces does it use? The ranking is local,
 * deterministic, and offline: field-weighted keyword matching, with rare words
 * counting more than common ones. Nothing here calls a model or the network.
 */

/** Where a word counts, and how much. The slug is the author's own name for the page. */
const FIELD_WEIGHTS = {
  slug: 3,
  title: 2,
  keywords: 2,
  description: 1,
  components: 1,
} as const

/** How much a template that cannot be copied keeps of its score. */
const NOT_READY_SHARE = 0.55

/** Below this a match is noise: one common word, or a coincidence. */
const SCORE_FLOOR = 3

/** How many components and composables a kit offers. */
const COMPONENT_LIMIT = 6
const COMPOSABLE_LIMIT = 4

/**
 * Words that name the shape of an answer rather than its subject. Dropped so
 * "admin dashboard with charts" is scored on two words, not four.
 */
const EN_STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'app',
  'application',
  'build',
  'component',
  'create',
  'demo',
  'example',
  'for',
  'from',
  'in',
  'into',
  'it',
  'its',
  'layout',
  'make',
  'my',
  'new',
  'of',
  'on',
  'or',
  'our',
  'page',
  'screen',
  'site',
  'some',
  'template',
  'that',
  'the',
  'this',
  'to',
  'ui',
  'view',
  'want',
  'with',
  'your',
])

/** Chinese has no spaces, so a two-character run is dropped by its own words only. */
const ZH_STOPWORDS = new Set([
  '一个',
  '做个',
  '帮我',
  '想要',
  '我的',
  '我要',
  '给我',
  '这个',
  '那个',
  '什么',
  '怎么',
  '可以',
  '页面',
])

export interface TemplateMatch {
  slug: string
  title: string
  description: string
  category: string
  /** False when the page imports a package a project cannot install. */
  isReady: boolean
  notReadyReason?: string
  /** The words this idea and this template share, most valuable first. */
  matchedTerms: string[]
  /** Reads the template without writing anything. */
  command: string
  /** The next step: copy it into the project, then edit it. */
  copyCommand: string
}

export interface KitComponent {
  name: string
  kind: 'component' | 'composable'
  description: string
  command: string
  /** `search` when the idea named it, `template` when the recommended page uses it. */
  reason: 'search' | 'template'
}

export interface BuildKit {
  idea: string
  locale: 'en' | 'zh'
  template: TemplateMatch | null
  otherTemplates: TemplateMatch[]
  components: KitComponent[]
  composables: KitComponent[]
  notes: string[]
}

interface TemplateField {
  weight: number
  /** Lowercased words, for English matching on word boundaries. */
  words: Set<string>
  /** Lowercased full text, for Chinese, which has no word boundaries. */
  text: string
}

interface TemplateDoc {
  template: TemplateRecord
  fields: TemplateField[]
}

/**
 * Splits an idea into matchable terms. English and digits split on anything that
 * is not a letter or digit; a Chinese run has no spaces, so it becomes
 * overlapping two-character terms, which is how Chinese words are found without
 * a dictionary.
 */
export function ideaTerms(idea: string): string[] {
  const runs = idea.toLowerCase().match(/[a-z0-9]+|[\u4E00-\u9FFF]+/g) ?? []
  const terms: string[] = []
  for (const run of runs) {
    if (/^[\u4E00-\u9FFF]/.test(run)) {
      if (run.length === 1) {
        terms.push(run)
        continue
      }
      for (let index = 0; index < run.length - 1; index++)
        terms.push(run.slice(index, index + 2))
      continue
    }
    if (run.length < 2 || EN_STOPWORDS.has(run))
      continue
    terms.push(run)
  }
  return [...new Set(terms)].filter(term => !ZH_STOPWORDS.has(term))
}

function field(weight: number, value: string): TemplateField {
  const text = value.toLowerCase()
  return { weight, words: new Set(text.split(/[^a-z0-9\u4E00-\u9FFF]+/).filter(Boolean)), text }
}

function documentFor(template: TemplateRecord): TemplateDoc {
  return {
    template,
    fields: [
      field(FIELD_WEIGHTS.slug, template.slug.replace(/-/g, ' ')),
      field(FIELD_WEIGHTS.title, `${template.title.en} ${template.title.zh}`),
      field(FIELD_WEIGHTS.keywords, [...template.keywords.en, ...template.keywords.zh].join(' ')),
      field(FIELD_WEIGHTS.description, `${template.description.en} ${template.description.zh} ${template.category.en} ${template.category.zh}`),
      field(FIELD_WEIGHTS.components, template.componentsUsed.join(' ')),
    ],
  }
}

/** A term also counts without a trailing plural `s`, so "charts" finds "chart". */
function termForms(term: string): string[] {
  return term.length > 3 && term.endsWith('s') ? [term, term.slice(0, -1)] : [term]
}

/**
 * English matches whole words, so "board" does not match "dashboard" and "art"
 * does not match "chart". Chinese matches substrings, because a two-character
 * term is a fragment of a longer word by construction.
 */
function fieldMatches(target: TemplateField, term: string): number {
  if (/^[\u4E00-\u9FFF]/.test(term))
    return target.text.includes(term) ? target.weight : 0
  return termForms(term).some(form => target.words.has(form)) ? target.weight : 0
}

/**
 * Weighted keyword rank over the templates. A term scores at the weight of the
 * best field it appears in, multiplied by how rare it is among templates, so
 * "funnel" outranks "dashboard" and a page that shares more of the idea wins.
 */
export function rankTemplates(idea: string): TemplateMatch[] {
  const docs = catalog.templates.map(documentFor)
  const terms = ideaTerms(idea)
  if (terms.length === 0)
    return []

  const documentFrequency = new Map<string, number>()
  for (const term of terms) {
    let count = 0
    for (const doc of docs) {
      if (doc.fields.some(target => fieldMatches(target, term) > 0))
        count += 1
    }
    documentFrequency.set(term, count)
  }
  // A term no template contains can only ever lower the coverage, so it is not a
  // term this catalog can answer.
  const usable = terms.filter(term => (documentFrequency.get(term) ?? 0) > 0)
  if (usable.length === 0)
    return []

  const matches: { doc: TemplateDoc, score: number, matched: string[] }[] = []
  for (const doc of docs) {
    let score = 0
    const matched: { term: string, value: number }[] = []
    for (const term of usable) {
      let best = 0
      for (const target of doc.fields)
        best = Math.max(best, fieldMatches(target, term))
      if (best === 0)
        continue
      const idf = Math.log(docs.length / (documentFrequency.get(term) ?? 1))
      score += idf * best
      matched.push({ term, value: idf * best })
    }
    if (score < SCORE_FLOOR)
      continue
    if (!doc.template.isReady)
      score *= NOT_READY_SHARE
    matched.sort((a, b) => b.value - a.value || a.term.localeCompare(b.term))
    matches.push({ doc, score, matched: matched.map(entry => entry.term) })
  }

  return matches
    .sort((a, b) =>
      b.score - a.score
      // A page nobody can copy only leads when it answers the idea clearly better.
      || Number(b.doc.template.isReady) - Number(a.doc.template.isReady)
      // The family's own name is its default page; a variant needs its own edge.
      || hyphenCount(a.doc.template.slug) - hyphenCount(b.doc.template.slug)
      || a.doc.template.slug.localeCompare(b.doc.template.slug))
    .map(entry => toMatch(entry.doc.template, entry.matched))
}

function toMatch(template: TemplateRecord, matchedTerms: string[]): TemplateMatch {
  return {
    slug: template.slug,
    title: text(template.title, 'en'),
    description: text(template.description, 'en'),
    category: text(template.category, 'en'),
    isReady: template.isReady,
    ...(template.notReadyReason ? { notReadyReason: template.notReadyReason.en } : {}),
    matchedTerms,
    command: `${BINARY} template ${template.slug}`,
    copyCommand: copyCommand(template.slug),
  }
}

/** Where the workflow says to put a page copy. */
export function copyCommand(slug: string): string {
  return `${BINARY} template ${slug} ./src/pages`
}

function hyphenCount(slug: string): number {
  return slug.split('-').length - 1
}

/**
 * The kit: the closest page, the next two, and the documented pieces around
 * them. Components come from the same search `search` uses, so the ranking has
 * one implementation; the recommended page's own imports fill the list when the
 * idea names too few.
 */
export function buildKit(idea: string, locale: 'en' | 'zh'): BuildKit {
  const trimmed = idea.trim()
  if (!trimmed)
    throw new CliError('Pass an idea, such as `build "login page"`.', 'ERR_INVALID_ARGUMENT', 2)

  const ranked = rankTemplates(trimmed).map(match => localizeMatch(match, locale))
  const template = ranked[0] ?? null
  const otherTemplates = ranked.slice(1, 3)
  const found = searchCatalog(trimmed, locale, { limit: 20 }).results
  const components = found
    .filter(hit => hit.domain === 'component')
    .slice(0, COMPONENT_LIMIT)
    .map(hit => toKitComponent(hit, 'search'))
  const composables = found
    .filter(hit => hit.domain === 'composable')
    .slice(0, COMPOSABLE_LIMIT)
    .map(hit => toKitComponent(hit, 'search'))

  if (template) {
    for (const name of templateRecord(template.slug)?.componentsUsed ?? []) {
      if (components.length >= COMPONENT_LIMIT)
        break
      if (components.some(item => item.name === name))
        continue
      const record = catalog.components.find(component => component.name === name)
      if (!record)
        continue
      components.push({
        name,
        kind: 'component',
        description: text(record.summary, locale),
        command: `${BINARY} component ${name}`,
        reason: 'template',
      })
    }
  }

  const notes: string[] = []
  if (!template) {
    notes.push(locale === 'zh'
      ? `这个想法没有匹配到模板。换几个词，或用 \`${BINARY} template --list\` 看全部模板。`
      : `No template matched this idea. Try other words, or list every template with \`${BINARY} template --list\`.`)
  }
  if (template && !template.isReady) {
    notes.push(locale === 'zh'
      ? `推荐的模板还不能直接落地：${template.notReadyReason ?? ''} 可以读它的结构，但不要复制。`
      : `The closest template is not copyable: ${template.notReadyReason ?? ''} Read it for structure, do not copy it.`)
  }

  return { idea: trimmed, locale, template, otherTemplates, components, composables, notes }
}

function templateRecord(slug: string): TemplateRecord | undefined {
  return catalog.templates.find(template => template.slug === slug)
}

/** Reuses the hit's own name, kind, summary, and follow-up command: search already built them. */
function toKitComponent(hit: SearchHit, reason: 'search'): KitComponent {
  const kind = hit.domain === 'composable' ? 'composable' : 'component'
  return { name: hit.name, kind, description: hit.description, command: hit.command, reason }
}

function localizeMatch(match: TemplateMatch, locale: 'en' | 'zh'): TemplateMatch {
  const record = templateRecord(match.slug)
  if (!record)
    return match
  return {
    ...match,
    title: text(record.title, locale),
    description: text(record.description, locale),
    category: text(record.category, locale),
    ...(record.notReadyReason ? { notReadyReason: text(record.notReadyReason, locale) } : {}),
  }
}
