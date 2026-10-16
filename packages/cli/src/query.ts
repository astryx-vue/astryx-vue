import type { ComponentRecord, TopicRecord } from './catalog-types.ts'
import type { Suggestion } from './error.ts'
import { catalog, componentNames, text } from './catalog.ts'
import { CliError } from './error.ts'
import { BINARY } from './spec.ts'

export interface ResolvedComponent {
  component: ComponentRecord
}

export interface SearchHit {
  domain: 'component' | 'doc'
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

const COMPONENT_PACKAGE = catalog.packageName

export function listComponents(): ComponentRecord[] {
  return catalog.components
}

export function resolveComponent(query: string): ComponentRecord {
  const key = normalize(query)
  if (!key)
    throw new CliError('Pass a component name, or use --list.', 'ERR_MISSING_ARGUMENT', 2)

  const exact = unique(catalog.components.filter(component => keys(component).includes(key)))
  if (exact.length === 1)
    return exact[0]!
  if (exact.length > 1)
    throw ambiguous(query, exact)

  if (key.length >= 3) {
    const partial = catalog.components.filter(component => keys(component).some(value => value.includes(key)))
    if (partial.length === 1)
      return partial[0]!
    if (partial.length > 1)
      throw ambiguous(query, partial)
  }

  throw new CliError(
    `No component named "${query}".`,
    'ERR_UNKNOWN_COMPONENT',
    1,
    suggestComponents(query),
  )
}

export function searchCatalog(query: string, locale: 'en' | 'zh', options: { limit: number, type?: 'component' | 'doc' }): { matchCount: number, results: SearchHit[] } {
  const needle = query.trim()
  if (!needle)
    throw new CliError('Pass a search query.', 'ERR_MISSING_ARGUMENT', 2)

  const hits: SearchHit[] = []
  if (options.type !== 'doc') {
    for (const component of catalog.components) {
      const scored = scoreComponent(needle, component, locale)
      if (scored)
        hits.push(scored)
    }
  }
  if (options.type !== 'component') {
    for (const topic of catalog.topics) {
      const scored = scoreTopic(needle, topic, locale)
      if (scored)
        hits.push(scored)
    }
  }
  hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
  return { matchCount: hits.length, results: hits.slice(0, options.limit) }
}

export function suggestComponents(query: string): Suggestion[] {
  const key = normalize(query)
  return catalog.components
    .map((component) => {
      const distance = Math.min(...keys(component).map(value => levenshtein(key, value)))
      const included = keys(component).some(value => value.includes(key) || key.includes(value))
      return { component, distance, included }
    })
    .filter(item => item.included || item.distance <= 3)
    .sort((a, b) => a.distance - b.distance || a.component.name.localeCompare(b.component.name))
    .slice(0, 5)
    .map(item => ({ name: item.component.name, reason: 'similar name' }))
}

function scoreComponent(query: string, component: ComponentRecord, locale: 'en' | 'zh'): SearchHit | null {
  const scored = scoreText(query, keys(component), [
    text(component.summary, locale),
    text(component.title, locale),
    component.group,
    ...component.props[locale].flatMap(group => group.rows.map(row => row.name)),
  ])
  if (!scored)
    return null
  return {
    domain: 'component',
    name: component.name,
    package: COMPONENT_PACKAGE,
    score: scored.score,
    reason: scored.reason,
    description: text(component.summary, locale),
    command: `${BINARY} component ${component.name}`,
    ...(component.importPath ? { import: component.importPath } : {}),
    title: text(component.title, locale),
    docsUrl: text(component.docsUrl, locale),
  }
}

function scoreTopic(query: string, topic: TopicRecord, locale: 'en' | 'zh'): SearchHit | null {
  const scored = scoreText(query, [normalize(topic.id), normalize(text(topic.title, locale))], [
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
    command: text(topic.docsUrl, locale),
    title: text(topic.title, locale),
    docsUrl: text(topic.docsUrl, locale),
  }
}

function scoreText(query: string, names: string[], prose: string[]): { score: number, reason: string } | null {
  const key = normalize(query)
  const tokens = key.split(/[^a-z0-9\u4E00-\u9FFF]+/i).filter(token => token.length > 1 || /[\u4E00-\u9FFF]/.test(token))
  const haystack = prose.join('\n').toLowerCase()
  if (names.includes(key))
    return { score: 100, reason: 'name' }
  if (names.some(name => name.startsWith(key) || (key.startsWith(name) && name.length >= 4)))
    return { score: 80, reason: 'prefix' }
  const distance = Math.min(...names.map(name => levenshtein(key, name)))
  if (key.length >= 4 && distance <= (key.length >= 6 ? 2 : 1))
    return { score: 70, reason: 'similar name' }
  if (tokens.length > 0 && tokens.every(token => haystack.includes(token)))
    return { score: 50 + tokens.length, reason: 'text' }
  const matched = tokens.filter(token => haystack.includes(token)).length
  if (tokens.length > 0 && matched / tokens.length >= 0.5)
    return { score: 20 + matched, reason: 'text' }
  return null
}

function keys(component: ComponentRecord): string[] {
  return [...new Set(componentNames(component).map(normalize))]
}

function unique(components: ComponentRecord[]): ComponentRecord[] {
  return [...new Map(components.map(component => [component.slug, component])).values()]
}

function ambiguous(query: string, components: ComponentRecord[]): CliError {
  return new CliError(
    `More than one component matches "${query}".`,
    'ERR_AMBIGUOUS_COMPONENT',
    1,
    components.slice(0, 8).map(component => ({ name: component.name, reason: 'similar name' })),
  )
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
