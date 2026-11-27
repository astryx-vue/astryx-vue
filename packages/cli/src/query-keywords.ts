import { splitWords, stemWord } from './query-words.ts'

/**
 * Words a reader may type for a component that its own name and page do not
 * use: other libraries' names for it, and the glyph names any icon library
 * renders through `Icon`. Keyed by catalog slug. Each keyword is one word;
 * a query matches it when adjacent query words join into it.
 */
const COMPONENT_KEYWORDS: Readonly<Record<string, readonly string[]>> = {
  'code': ['inlinecode', 'monospace'],
  'command-palette': ['commandmenu', 'cmdk'],
  'drawer': ['sidesheet'],
  'icon': [
    'arrow',
    'chevron',
    'caret',
    'checkmark',
    'cross',
    'gear',
    'cog',
    'broom',
    'sparkle',
    'star',
    'heart',
    'bell',
    'trash',
    'pencil',
    'magnifyingglass',
    'paperclip',
    'house',
    'flame',
    'rocket',
    'lightning',
    'bolt',
    'globe',
    'sun',
    'moon',
    'bookmark',
    'thumbsup',
    'smiley',
    'emoji',
    'lock',
    'eye',
    'cloud',
    'hourglass',
    'trophy',
    'gift',
    'camera',
  ],
  'layout-header': ['pageheader', 'appheader'],
  'metadata-list': ['descriptionlist', 'keyvalue'],
  'progress-bar': ['linearprogress'],
  'scrollable-area': ['scrollarea', 'scrollview'],
  'spinner': ['circularprogress'],
  'timestamp': ['relativetime'],
  'toggle-button-group': ['togglegroup', 'buttontogglegroup'],
  'tree-list': ['treeview'],
  'use-resizable': ['splitpane', 'resizablepanel'],
}

const MAX_RUN = 6

/**
 * Score of a component's keyword that the query names: a single query word,
 * or adjacent query words joined, equal to one keyword. The last word of a run
 * may be a plural or gerund (`split panes`, `sparkles`). A longer run scores a
 * little higher, on the same scale as a compound name, so `toggle group`
 * outranks an entry that matches the one word `button`. Null when no keyword
 * matches.
 */
export function componentKeywordScore(query: string, slug: string): number | null {
  const keywords = COMPONENT_KEYWORDS[slug]
  if (keywords == null)
    return null
  const wanted = new Set(keywords.flatMap(keyword => [keyword, stemWord(keyword)]))
  const words = splitWords(query)
  let best = 0
  for (let start = 0; start < words.length; start++) {
    let joined = ''
    for (let end = start; end < words.length && end - start < MAX_RUN; end++) {
      const word = words[end]!
      if (wanted.has(joined + word) || wanted.has(joined + stemWord(word)))
        best = Math.max(best, 90 + end - start + 1)
      joined += word
    }
  }
  return best === 0 ? null : best
}

/** Slugs of the components that list the whole query, joined into one word, as a keyword. */
export function keywordOwners(query: string): string[] {
  const words = splitWords(query)
  if (words.length === 0)
    return []
  const joined = words.join('')
  const stemmed = words.slice(0, -1).join('') + stemWord(words.at(-1)!)
  return Object.entries(COMPONENT_KEYWORDS)
    .filter(([, keywords]) => keywords.some(keyword => keyword === joined || keyword === stemmed || stemWord(keyword) === stemmed))
    .map(([slug]) => slug)
}
