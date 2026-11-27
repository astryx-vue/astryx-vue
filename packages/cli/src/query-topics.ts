import type { TopicRecord } from './catalog-types.ts'
import type { Suggestion } from './error.ts'
import { splitWords, stemWord } from './query-words.ts'

/** Words of a typed name or a page name; spaces, dashes, slashes, dots, and underscores all separate them. */
function topicWords(value: string): string[] {
  return value.toLowerCase().split(/[\s\-_/.]+/).filter(Boolean)
}

function wordKey(value: string): string {
  return [...new Set(topicWords(value))].sort().join(' ')
}

function pageNames(topic: TopicRecord): string[] {
  return [topic.id, topic.title.en, topic.title.zh].filter(Boolean)
}

/**
 * The one topic whose id or title is made of the typed words, whatever the
 * separators and word order: `dark.mode` and `mode dark` both read as
 * `dark-mode`. Null when none or several match.
 */
export function topicByWords(query: string, topics: readonly TopicRecord[]): TopicRecord | null {
  const key = wordKey(query)
  if (!key)
    return null
  const hits = topics.filter(topic => pageNames(topic).some(name => wordKey(name) === key))
  return hits.length === 1 ? hits[0]! : null
}

/**
 * Pages that carry the typed words in their id, title, or keywords, closest
 * first. One-letter words say nothing about which page was meant and are
 * ignored. When the best page carries every typed word only such pages stay;
 * otherwise every page that carries some word stays. Nothing is returned when
 * no page shares a word.
 */
export function topicsByWords(query: string, topics: readonly TopicRecord[]): Suggestion[] {
  const typed = [...new Set(splitWords(query).map(stemWord).filter(word => word.length > 1))]
  if (typed.length === 0)
    return []
  const scored = topics.map((topic, index) => {
    const id = new Set(topicWords(topic.id).map(stemWord))
    const title = new Set([topic.title.en, topic.title.zh].flatMap(topicWords).map(stemWord))
    const keywords = new Set([...topic.keywords.en, ...topic.keywords.zh].flatMap(topicWords).map(stemWord))
    const shared = typed.filter(word => id.has(word) || title.has(word) || keywords.has(word))
    const inName = typed.filter(word => id.has(word) || title.has(word)).length
    return { topic, index, shared: shared.length, inName }
  }).filter(entry => entry.shared > 0)
  const best = Math.max(0, ...scored.map(entry => entry.shared))
  const need = best === typed.length ? typed.length : 1
  return scored
    .filter(entry => entry.shared >= need)
    .sort((a, b) => b.shared - a.shared || b.inName - a.inName || a.index - b.index)
    .map(entry => ({ name: entry.topic.id, reason: 'similar name' }))
}
