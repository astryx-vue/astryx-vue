import { splitWords, stemWord } from './query-words.ts'

/**
 * Orders names by code point, so the same names sort the same way on every
 * machine whatever its locale or ICU data.
 */
export function compareText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** The words of a query that carry meaning: stemmed, deduplicated, one letter words dropped. */
export function queryWords(query: string): string[] {
  const words = splitWords(query)
    .filter(word => word.length > 1 || /[\u4E00-\u9FFF]/.test(word))
    .map(stemWord)
  return [...new Set(words)]
}

/** The lowercase words a name is made of, stemmed the way query words are. */
export function nameWordSet(names: readonly string[]): Set<string> {
  return new Set(names.flatMap(name => splitWords(name).map(stemWord)))
}

/**
 * How well an entry fits a query beyond its score: each query word counts for
 * most when it is a word of the entry's own name, less when it is on the title
 * or summary, least when only the deeper text holds it. Entries that tie on
 * score are ordered by this, so the one that answers more of the query leads
 * instead of the first by name. It never changes which entries match.
 */
export function queryFit(query: string, names: readonly string[], primary: string, rest: string): number {
  const words = queryWords(query)
  if (words.length === 0)
    return 0
  const own = nameWordSet(names)
  const compact = names.map(name => splitWords(name).join('')).filter(Boolean)
  const head = primary.toLowerCase()
  const body = rest.toLowerCase()
  let fit = 0
  for (const word of words) {
    if (own.has(word) || compact.some(name => name.includes(word)))
      fit += 4
    else if (head.includes(word))
      fit += 2
    else if (body.includes(word))
      fit += 1
  }
  return fit
}
