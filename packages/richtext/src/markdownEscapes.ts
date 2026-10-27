import { absentCharacters, type ProtectedMarkdown, type StandIn } from './markdownStandIns.js'
import { codeRanges } from './markdownCodeRanges.js'

/** The characters a backslash escapes (CommonMark 0.31 §2.4). */
const ESCAPABLE = new Set('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~');

/**
 * Returns `markdown` with every backslash escape outside code — a backslash
 * before ASCII punctuation — replaced by a private-use stand-in for the
 * escaped character, and every backslash in code by a stand-in for itself,
 * which Lexical would otherwise drop from a code span — except before `|`,
 * which a table reads before its code. A backslash before anything else
 * outside code stays as written. One pass over the source.
 */
export function protectBackslashEscapes(markdown: string): ProtectedMarkdown {
  const standIns = new Map<string, StandIn>();
  if (!markdown.includes('\\')) {
    return {markdown, standIns};
  }
  const available = absentCharacters(markdown);
  const byKey = new Map<string, string>();
  const standInFor = (key: string, value: StandIn): string | null => {
    const existing = byKey.get(key);
    if (existing != null) {
      return existing;
    }
    const next = available.next();
    if (next.done === true) {
      // Every private-use character is in the text: leave the rest as
      // written.
      return null;
    }
    byKey.set(key, next.value);
    standIns.set(next.value, value);
    return next.value;
  };
  const code = codeRanges(markdown);
  let output = '';
  let copied = 0;
  let codeIndex = 0;
  let index = markdown.indexOf('\\');
  while (index !== -1) {
    while (code[codeIndex] != null && code[codeIndex][1] <= index) {
      codeIndex++;
    }
    const range = code[codeIndex];
    const character = markdown[index + 1];
    const inCode = range != null && range[0] <= index;
    // A table splits its cells before it reads code, so `\|` in code is the
    // table's to read.
    if (inCode && character === '|') {
      index = markdown.indexOf('\\', index + 2);
      continue;
    }
    const isEscape = !inCode && character != null && ESCAPABLE.has(character);
    if (inCode || isEscape) {
      const standIn = inCode
        ? standInFor('code', {kind: 'backslash'})
        : standInFor(`escape:${character}`, {
            kind: 'escape',
            character: character ?? '',
          });
      if (standIn == null) {
        break;
      }
      output += markdown.slice(copied, index) + standIn;
      copied = index + (inCode ? 1 : 2);
      index = markdown.indexOf('\\', copied);
      continue;
    }
    index = markdown.indexOf('\\', index + 1);
  }
  return {markdown: output + markdown.slice(copied), standIns};
}
