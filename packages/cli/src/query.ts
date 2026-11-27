import type { ComponentRecord, TemplateRecord, TopicRecord } from './catalog-types.ts'
import type { Suggestion } from './error.ts'
import type { LookupCommand } from './query-hints.ts'
import type { SearchType } from './spec.ts'
import { catalog, componentNames, examplesFor, text } from './catalog.ts'
import { CliError } from './error.ts'
import { keywordSuggestions, otherCommandHints } from './query-hints.ts'
import { componentKeywordScore } from './query-keywords.ts'
import { compareText, queryFit } from './query-order.ts'
import { compoundNameScore, nameWords, splitWords, stemWord } from './query-words.ts'
import { BINARY, DOCS_PACKAGE } from './spec.ts'

export interface SearchHit {
  /** Composables are their own domain, separate from components. */
  domain: SearchType
  name: string
  package: string
  score: number
  reason: string
  description: string
  command: string
  import?: string
  title: string
  docsUrl: string
}

/** How one kind of record answers to names on the command line. */
interface Lookup<T> {
  id: (item: T) => string
  names: (item: T) => string[]
  label: (item: T) => string
  /** Components accept a fragment of a name; topics accept ids, aliases, and exact bare names only. */
  partial: boolean
}

const COMPONENT_LOOKUP: Lookup<ComponentRecord> = {
  id: component => component.slug,
  names: component => componentNames(component),
  label: displayName,
  partial: true,
}

const TOPIC_LOOKUP: Lookup<TopicRecord> = {
  id: topic => topic.id,
  names: topicNames,
  label: topic => topic.id,
  partial: false,
}

/** Components and composables share one generated list, split by `kind`. */
export function listComponents(): ComponentRecord[] {
  return catalog.components.filter(component => component.kind === 'component')
}

export function listComposables(): ComponentRecord[] {
  return catalog.components.filter(component => component.kind === 'composable')
}

export function listTopics(): TopicRecord[] {
  return catalog.topics
}

/** Resolves any documented record, including the composables `component <Name>` still prints. */
export function resolveComponent(query: string): ComponentRecord {
  ensureNamed(query, 'component')
  return resolveRecord(query, catalog.components, COMPONENT_LOOKUP, matches => matches.length > 0
    ? ambiguous('component', query, matches, COMPONENT_LOOKUP)
    : new CliError(
        `No component named "${query}".`,
        'ERR_UNKNOWN_COMPONENT',
        1,
        missSuggestions(query, catalog.components, COMPONENT_LOOKUP, 'component'),
      ))
}

export function resolveComposable(query: string): ComponentRecord {
  ensureNamed(query, 'composable')
  const composables = listComposables()
  return resolveRecord(query, composables, COMPONENT_LOOKUP, matches => matches.length > 0
    ? ambiguous('composable', query, matches, COMPONENT_LOOKUP)
    : new CliError(
        `No composable named "${query}".`,
        'ERR_UNKNOWN_COMPOSABLE',
        1,
        missSuggestions(query, composables, COMPONENT_LOOKUP, 'composable'),
      ))
}

export function resolveTopic(query: string): TopicRecord {
  ensureNamed(query, 'topic')
  return resolveRecord(query, catalog.topics, TOPIC_LOOKUP, matches => matches.length > 0
    ? ambiguous('topic', query, matches, TOPIC_LOOKUP)
    : new CliError(
        `No topic named "${query}".`,
        'ERR_UNKNOWN_TOPIC',
        1,
        missSuggestions(query, catalog.topics, TOPIC_LOOKUP, 'docs'),
      ))
}

export function searchCatalog(query: string, locale: 'en' | 'zh', options: { limit: number, type?: SearchType }): { matchCount: number, results: SearchHit[] } {
  const needle = query.trim()
  if (!needle)
    throw new CliError('Pass a search query.', 'ERR_MISSING_ARGUMENT', 2)

  const type = options.type
  const hits: RankedHit[] = []
  if (type === undefined || type === 'component' || type === 'composable') {
    for (const record of catalog.components) {
      if (type !== undefined && record.kind !== type)
        continue
      const scored = scoreComponent(needle, record, locale)
      if (scored)
        hits.push(scored)
    }
  }
  if (type === undefined || type === 'doc') {
    for (const topic of catalog.topics) {
      const scored = scoreTopic(needle, topic, locale)
      if (scored)
        hits.push(scored)
    }
  }
  if (type === undefined || type === 'template') {
    for (const template of catalog.templates) {
      const scored = scoreTemplate(needle, template, locale)
      if (scored)
        hits.push(scored)
    }
  }
  hits.sort(compareHits)
  return { matchCount: hits.length, results: hits.slice(0, options.limit).map(({ fit: _fit, ...hit }) => hit) }
}

/**
 * Ties on score are broken by how well the entry fits the query, then by domain,
 * then by name, so an equal-scoring hit never changes place between runs:
 * components first, then composables, docs, templates.
 */
const DOMAIN_ORDER: Record<SearchType, number> = { component: 0, composable: 1, doc: 2, template: 3 }

function compareHits(a: RankedHit, b: RankedHit): number {
  return b.score - a.score
    || b.fit - a.fit
    || DOMAIN_ORDER[a.domain] - DOMAIN_ORDER[b.domain]
    || compareText(a.name, b.name)
}

/** The name people type: `Button` for a component, `useClipboard` for a composable. */
export function displayName(component: ComponentRecord): string {
  return component.kind === 'composable' ? text(component.title, 'en') : component.name
}

function resolveRecord<T>(query: string, candidates: readonly T[], lookup: Lookup<T>, failure: (matches: T[]) => CliError): T {
  const key = normalize(query)
  const exact = unique(candidates.filter(candidate => names(lookup, candidate).includes(key)), lookup)
  if (exact.length === 1)
    return exact[0]!
  if (exact.length > 1)
    throw failure(exact)

  if (lookup.partial && key.length >= 3) {
    const partial = unique(candidates.filter(candidate => names(lookup, candidate).some(name => name.includes(key))), lookup)
    if (partial.length === 1)
      return partial[0]!
    if (partial.length > 1)
      throw failure(partial)
  }

  throw failure([])
}

function names<T>(lookup: Lookup<T>, candidate: T): string[] {
  return [...new Set(lookup.names(candidate).map(normalize))]
}

function ensureNamed(query: string, what: 'component' | 'composable' | 'topic'): void {
  if (normalize(query))
    return
  const message = what === 'topic'
    ? 'Pass a topic such as guide/dark-mode, or omit it to list every topic.'
    : `Pass a ${what} name, or use --list.`
  throw new CliError(message, 'ERR_MISSING_ARGUMENT', 2)
}

function ambiguous<T>(what: 'component' | 'composable' | 'topic', query: string, matches: readonly T[], lookup: Lookup<T>): CliError {
  return new CliError(
    `More than one ${what} matches "${query}".`,
    what === 'component' ? 'ERR_AMBIGUOUS_COMPONENT' : what === 'composable' ? 'ERR_AMBIGUOUS_COMPOSABLE' : 'ERR_AMBIGUOUS_TOPIC',
    1,
    matches.slice(0, 8).map(match => ({ name: lookup.label(match), reason: 'similar name' })),
  )
}

/**
 * How many edits still count as the same name. Two characters away is a typo only once the
 * query is long enough for that to stay meaningful; `nope` is not close to any topic.
 */
function nameDistanceLimit(length: number): number {
  return length >= 6 ? 2 : 1
}

function suggestRecords<T>(query: string, candidates: readonly T[], lookup: Lookup<T>): Suggestion[] {
  return suggestByNames(query, candidates, item => names(lookup, item), lookup.label)
}

const MAX_SUGGESTIONS = 5

/**
 * What a lookup that found no entry points to, best first: components whose
 * keywords are the typed name, the command that does read the name, then the
 * names close to it.
 */
export function missSuggestions<T>(query: string, candidates: readonly T[], lookup: Lookup<T>, command: LookupCommand): Suggestion[] {
  const keyword = command === 'component' || command === 'composable' ? keywordSuggestions(query, command) : []
  const close = suggestRecords(query, candidates, lookup)
  const seen = new Set<string>()
  return [...keyword, ...otherCommandHints(query, command), ...close]
    .filter(suggestion => !seen.has(suggestion.name) && seen.add(suggestion.name))
    .slice(0, MAX_SUGGESTIONS)
}

/**
 * Names within the typo distance of the query, or that contain it. Shared by
 * components, composables, topics, and templates so a misspelling is answered
 * the same way everywhere.
 */
export function suggestByNames<T>(query: string, candidates: readonly T[], namesOf: (item: T) => string[], labelOf: (item: T) => string): Suggestion[] {
  const key = normalize(query)
  if (key.length < 2)
    return []
  return candidates
    .map((candidate) => {
      const values = [...new Set(namesOf(candidate).map(normalize))].filter(Boolean)
      const distance = Math.min(...values.map(value => levenshtein(key, value)))
      const included = values.some(value => value.includes(key) || key.includes(value))
      const compound = compoundNameScore(query, namesOf(candidate)) ?? 0
      return { candidate, distance, included, compound }
    })
    .filter(entry => entry.included || entry.distance <= nameDistanceLimit(key.length))
    .sort((a, b) => b.compound - a.compound || a.distance - b.distance || compareText(labelOf(a.candidate), labelOf(b.candidate)))
    .slice(0, 5)
    .map(entry => ({ name: labelOf(entry.candidate), reason: 'similar name' }))
}

/** A hit with the fit that orders it among entries of the same score; the fit is not part of the result. */
type RankedHit = SearchHit & { fit: number }

function scoreComponent(query: string, record: ComponentRecord, locale: 'en' | 'zh'): RankedHit | null {
  const ownNames = names(COMPONENT_LOOKUP, record)
  const fromText = scoreText(query, ownNames, [
    text(record.summary, locale),
    text(record.title, locale),
    record.group,
  ], [
    ...record.props[locale].flatMap(group => group.rows.map(row => row.name)),
    ...examplesFor(record, locale).flatMap(example => [example.title, example.description]),
  ])
  // Another library's name for the component, or a glyph name for Icon. It
  // never outranks a match on the component's own name.
  const keyword = componentKeywordScore(query, record.slug)
  const scored = keyword != null && (fromText == null || (fromText.reason !== 'name' && keyword > fromText.score))
    ? { score: keyword, reason: 'keyword', fit: fromText?.fit ?? 0 }
    : fromText
  if (!scored)
    return null
  const name = displayName(record)
  return {
    domain: record.kind,
    name,
    package: record.package,
    score: scored.score,
    reason: scored.reason,
    fit: scored.fit,
    description: text(record.summary, locale),
    command: `${BINARY} ${record.kind === 'composable' ? 'composable' : 'component'} ${name}`,
    ...(record.importPath ? { import: record.importPath } : {}),
    title: text(record.title, locale),
    docsUrl: text(record.docsUrl, locale),
  }
}

function scoreTopic(query: string, topic: TopicRecord, locale: 'en' | 'zh'): RankedHit | null {
  const scored = scoreText(query, names(TOPIC_LOOKUP, topic), [
    text(topic.summary, locale),
    text(topic.title, locale),
  ], [
    ...topic.headings[locale],
    ...topic.keywords[locale],
  ])
  if (!scored)
    return null
  return {
    domain: 'doc',
    name: topic.id,
    package: DOCS_PACKAGE,
    score: scored.score,
    reason: scored.reason,
    fit: scored.fit,
    description: text(topic.summary, locale),
    command: `${BINARY} docs ${topic.id}`,
    title: text(topic.title, locale),
    docsUrl: text(topic.docsUrl, locale),
  }
}

/** A template's own words answer a query before the components it happens to import. */
const USED_COMPONENTS_SCORE = 25

function scoreTemplate(query: string, template: TemplateRecord, locale: 'en' | 'zh'): RankedHit | null {
  const scored = scoreText(query, [template.slug, template.title.en, template.title.zh], [
    text(template.description, locale),
    ...template.keywords[locale],
  ], [
    text(template.category, locale),
  ]) ?? scoreUsedComponents(query, template)
  if (!scored)
    return null
  return {
    domain: 'template',
    name: template.slug,
    package: template.package,
    score: scored.score,
    reason: scored.reason,
    fit: scored.fit,
    description: text(template.description, locale),
    command: `${BINARY} template ${template.slug}`,
    title: text(template.title, locale),
    docsUrl: text(template.docsUrl, locale),
  }
}

/**
 * Another entry's name is that entry's evidence: a page does not answer a
 * query only because it imports components the query names. It still turns up
 * for a query its own words miss, below the components themselves.
 */
function scoreUsedComponents(query: string, template: TemplateRecord): { score: number, reason: string, fit: number } | null {
  const words = splitWords(query).filter(word => word.length > 2).map(stemWord)
  const used = new Set(template.componentsUsed.flatMap(name => nameWords(name)))
  if (words.length === 0 || !words.every(word => used.has(word)))
    return null
  return { score: USED_COMPONENTS_SCORE, reason: 'text', fit: 0 }
}

interface ProseToken {
  raw: string
  /** The words of a name written as one word, such as `TableHeaderCell`. */
  parts: string[]
}

/**
 * The words a query is searched by in prose. A name written as one word is
 * found whether the text spells it that way or as its words, so a page that
 * only says "table header cell" still matches `TableHeaderCell`.
 */
function proseTokens(query: string): ProseToken[] {
  return query
    .split(/[^a-z0-9\u4E00-\u9FFF]+/i)
    .filter(token => token.length > 1 || /[\u4E00-\u9FFF]/.test(token))
    .map(token => ({ raw: token.toLowerCase(), parts: splitWords(token) }))
}

function scoreText(query: string, lookupNames: string[], primary: string[], rest: string[]): { score: number, reason: string, fit: number } | null {
  const key = normalize(query)
  const normalizedNames = lookupNames.map(normalize)
  const tokens = proseTokens(query)
  const head = primary.join('\n').toLowerCase()
  const haystack = `${head}\n${rest.join('\n').toLowerCase()}`
  const has = (token: ProseToken): boolean =>
    haystack.includes(token.raw) || (token.parts.length > 1 && token.parts.every(part => haystack.includes(part)))
  const fit = (): number => queryFit(query, lookupNames, head, haystack)
  if (normalizedNames.includes(key))
    return { score: 100, reason: 'name', fit: fit() }
  const compound = compoundNameScore(query, lookupNames)
  if (compound !== null)
    return { score: compound, reason: 'name', fit: fit() }
  if (normalizedNames.some(name => name.startsWith(key) || (key.startsWith(name) && name.length >= 4)))
    return { score: 80, reason: 'prefix', fit: fit() }
  if (isFamilyWord(query, lookupNames))
    return { score: 80, reason: 'prefix', fit: fit() }
  // A query that sits inside a name, such as `clipboard` in `useClipboard`, still names the entry.
  // This outranks prose matches, which are only on the page text.
  if (key.length >= 3 && normalizedNames.some(name => name.includes(key)))
    return { score: 75, reason: 'name', fit: fit() }
  const distance = Math.min(...normalizedNames.map(name => levenshtein(key, name)))
  if (key.length >= 4 && distance <= nameDistanceLimit(key.length))
    return { score: 70, reason: 'similar name', fit: fit() }
  if (tokens.length > 0 && tokens.every(has))
    return { score: 50 + tokens.length, reason: 'text', fit: fit() }
  const matched = tokens.filter(has).length
  const joinedIdentifier = /^[a-z0-9]+(?:_[a-z0-9]+)+$/i.test(query.trim())
  // A single underscored identifier is one name, not a bag of unrelated prose words.
  // Other multi-word queries need a majority, not merely half of their words.
  if (!joinedIdentifier && tokens.length > 0 && matched / tokens.length > 0.5)
    return { score: 20 + matched, reason: 'text', fit: fit() }
  return null
}

/** One word that is the first word of a longer name, in any plural form: `tabs` for TabList. */
function isFamilyWord(query: string, lookupNames: readonly string[]): boolean {
  const words = nameWords(query)
  if (words.length !== 1 || words[0]!.length < 3)
    return false
  return lookupNames.some((name) => {
    const own = nameWords(name)
    return own.length > 1 && own[0] === words[0]
  })
}

function topicNames(topic: TopicRecord): string[] {
  const bare = topic.id.includes('/') ? topic.id.slice(topic.id.indexOf('/') + 1) : topic.id
  const keys = [topic.id, bare, topic.title.en, topic.title.zh]
  if (topic.kind === 'theme')
    keys.push(topic.id.replace(/^theme/, 'themes'))
  return keys.filter(Boolean)
}

function unique<T>(items: readonly T[], lookup: Lookup<T>): T[] {
  return [...new Map(items.map(item => [lookup.id(item), item])).values()]
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_]+/g, '-')
}

function levenshtein(a: string, b: string): number {
  if (a === b)
    return 0
  if (Math.abs(a.length - b.length) > 4)
    return 99
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    let diagonal = previous[0]!
    previous[0] = i
    for (let j = 1; j <= b.length; j++) {
      const saved = previous[j]!
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      previous[j] = Math.min(previous[j]! + 1, previous[j - 1]! + 1, diagonal + cost)
      diagonal = saved
    }
  }
  return previous[b.length]!
}
