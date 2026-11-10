/**
 * Scores names by the words they share with a query. Exact spelling is handled
 * by the caller; this also reads PascalCase, spaces, dashes, and common word forms.
 * A longer name match outranks a shorter one, while an exact name remains highest.
 */
export function compoundNameScore(query: string, names: readonly string[]): number | null {
  const queryWords = nameWords(query)
  if (queryWords.length === 0)
    return null
  const queryCompact = queryWords.join('')
  let best: number | null = null

  for (const name of names) {
    const words = nameWords(name)
    if (words.length === 0)
      continue
    if (sameWords(queryWords, words))
      return 100

    const variants = words[0] === 'use' && words.length > 1 ? [words, words.slice(1)] : [words]
    for (const variant of variants) {
      const compact = variant.join('')
      if (variant.length > 1 && compact.length >= 4 && queryCompact.includes(compact))
        best = Math.max(best ?? 0, 90 + Math.min(variant.length, 6))
      else if (containsWords(queryWords, variant))
        best = Math.max(best ?? 0, 90 + Math.min(variant.length, 6))

      const prefix = commonPrefixLength(queryWords, variant)
      if (prefix >= 3 && prefix < variant.length)
        best = Math.max(best ?? 0, 90 + Math.min(prefix, 6))
    }
  }
  return best
}

function nameWords(value: string): string[] {
  return value
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9\u4E00-\u9FFF]+/)
    .filter(Boolean)
    .map(stemWord)
}

function sameWords(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && commonPrefixLength(a, b) === a.length
}

function containsWords(haystack: readonly string[], needle: readonly string[]): boolean {
  if (needle.length > haystack.length)
    return false
  for (let start = 0; start <= haystack.length - needle.length; start++) {
    if (sameWords(haystack.slice(start, start + needle.length), needle))
      return true
  }
  return false
}

function commonPrefixLength(a: readonly string[], b: readonly string[]): number {
  let length = 0
  while (length < a.length && length < b.length && a[length] === b[length])
    length++
  return length
}

/** One conservative canonical form for the plurals and verbs used in catalog names. */
function stemWord(word: string): string {
  if (!/^[a-z0-9]+$/.test(word))
    return word
  let stem = word
  if (word.length > 4 && word.endsWith('ies')) {
    stem = `${word.slice(0, -3)}y`
  }
  else if (word.length > 3 && word.endsWith('s') && !/[siu]s$/.test(word)) {
    stem = /(?:[sxz]|ch|sh)es$/.test(word) ? word.slice(0, -2) : word.slice(0, -1)
  }
  if (stem.length > 5 && stem.endsWith('ing')) {
    stem = stem.slice(0, -3)
    if (/([b-df-hj-np-tv-z])\1$/.test(stem))
      stem = stem.slice(0, -1)
  }
  else if (stem.length > 4 && stem.endsWith('ed')) {
    stem = stem.slice(0, -2)
  }
  // "space"/"spacing" and "resize"/"resizing" need the same stem.
  if (stem.length > 4 && stem.endsWith('e'))
    stem = stem.slice(0, -1)
  return stem
}
