import type { ComponentRecord, TemplateRecord, TopicRecord } from './catalog-types.ts'
import type { Suggestion } from './error.ts'
import type { SearchType } from './spec.ts'
import { catalog, componentNames, examplesFor, text } from './catalog.ts'
import { CliError } from './error.ts'
import { BINARY } from './spec.ts'

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

const COMPONENT_PACKAGE = catalog.packageName

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
        suggestRecords(query, catalog.components, COMPONENT_LOOKUP),
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
        suggestRecords(query, composables, COMPONENT_LOOKUP),
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
        suggestRecords(query, catalog.topics, TOPIC_LOOKUP),
      ))
}

export function searchCatalog(query: string, locale: 'en' | 'zh', options: { limit: number, type?: SearchType }): { matchCount: number, results: SearchHit[] } {
  const needle = query.trim()
  if (!needle)
    throw new CliError('Pass a search query.', 'ERR_MISSING_ARGUMENT', 2)

  const type = options.type
  const hits: SearchHit[] = []
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
  hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
  return { matchCount: hits.length, results: hits.slice(0, options.limit) }
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
      return { candidate, distance, included }
    })
    .filter(entry => entry.included || entry.distance <= nameDistanceLimit(key.length))
    .sort((a, b) => a.distance - b.distance || labelOf(a.candidate).localeCompare(labelOf(b.candidate)))
    .slice(0, 5)
    .map(entry => ({ name: labelOf(entry.candidate), reason: 'similar name' }))
}

function scoreComponent(query: string, record: ComponentRecord, locale: 'en' | 'zh'): SearchHit | null {
  const scored = scoreText(query, names(COMPONENT_LOOKUP, record), [
    text(record.summary, locale),
    text(record.title, locale),
    record.group,
    ...record.props[locale].flatMap(group => group.rows.map(row => row.name)),
    ...examplesFor(record, locale).flatMap(example => [example.title, example.description]),
  ])
  if (!scored)
    return null
  const name = displayName(record)
  return {
    domain: record.kind,
    name,
    package: COMPONENT_PACKAGE,
    score: scored.score,
    reason: scored.reason,
    description: text(record.summary, locale),
    command: `${BINARY} ${record.kind === 'composable' ? 'composable' : 'component'} ${name}`,
    ...(record.importPath ? { import: record.importPath } : {}),
    title: text(record.title, locale),
    docsUrl: text(record.docsUrl, locale),
  }
}

function scoreTopic(query: string, topic: TopicRecord, locale: 'en' | 'zh'): SearchHit | null {
  const scored = scoreText(query, names(TOPIC_LOOKUP, topic), [
    text(topic.summary, locale),
    ...topic.headings[locale],
    ...topic.keywords[locale],
    text(topic.title, locale),
  ])
  if (!scored)
    return null
  return {
    domain: 'doc',
    name: topic.id,
    package: '@astryx-vue/docs',
    score: scored.score,
    reason: scored.reason,
    description: text(topic.summary, locale),
    command: `${BINARY} docs ${topic.id}`,
    title: text(topic.title, locale),
    docsUrl: text(topic.docsUrl, locale),
  }
}

function scoreTemplate(query: string, template: TemplateRecord, locale: 'en' | 'zh'): SearchHit | null {
  const scored = scoreText(query, [template.slug, template.title.en, template.title.zh], [
    text(template.description, locale),
    text(template.category, locale),
    ...template.keywords[locale],
    ...template.componentsUsed,
  ])
  if (!scored)
    return null
  return {
    domain: 'template',
    name: template.slug,
    package: '@astryx-vue/cli',
    score: scored.score,
    reason: scored.reason,
    description: text(template.description, locale),
    command: `${BINARY} template ${template.slug}`,
    title: text(template.title, locale),
    docsUrl: text(template.docsUrl, locale),
  }
}

function scoreText(query: string, lookupNames: string[], prose: string[]): { score: number, reason: string } | null {
  const key = normalize(query)
  const tokens = key.split(/[^a-z0-9\u4E00-\u9FFF]+/i).filter(token => token.length > 1 || /[\u4E00-\u9FFF]/.test(token))
  const haystack = prose.join('\n').toLowerCase()
  if (lookupNames.includes(key))
    return { score: 100, reason: 'name' }
  if (lookupNames.some(name => name.startsWith(key) || (key.startsWith(name) && name.length >= 4)))
    return { score: 80, reason: 'prefix' }
  // A query that sits inside a name, such as `clipboard` in `useClipboard`, still names the entry.
  // This outranks prose matches, which are only on the page text.
  if (key.length >= 3 && lookupNames.some(name => name.includes(key)))
    return { score: 75, reason: 'name' }
  const distance = Math.min(...lookupNames.map(name => levenshtein(key, name)))
  if (key.length >= 4 && distance <= nameDistanceLimit(key.length))
    return { score: 70, reason: 'similar name' }
  if (tokens.length > 0 && tokens.every(token => haystack.includes(token)))
    return { score: 50 + tokens.length, reason: 'text' }
  const matched = tokens.filter(token => haystack.includes(token)).length
  if (tokens.length > 0 && matched / tokens.length >= 0.5)
    return { score: 20 + matched, reason: 'text' }
  return null
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
