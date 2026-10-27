import type { ElementNode } from 'lexical'
import { $isLinkNode } from '@lexical/link'
import { $dfs } from '@lexical/utils'
import { parseInlineAst } from '@astryx-vue/core/Markdown/parser'
import { absentCharacters, type ProtectedMarkdown, type StandIn } from './markdownStandIns.js'
import { codeRanges } from './markdownCodeRanges.js'

/**
 * For each `[`, `]`, `(`, and `)` in `text` outside code and not escaped,
 * the index of the bracket or parenthesis it pairs with by nesting; -1 for
 * the rest. One pass, so a candidate never rescans the text.
 */
export function pairedDelimiters(
  text: string,
  code: ReadonlyArray<readonly [number, number]>,
): Int32Array {
  const pair = new Int32Array(text.length).fill(-1);
  const brackets: number[] = [];
  const parentheses: number[] = [];
  let codeIndex = 0;
  for (let index = 0; index < text.length; index++) {
    while (codeIndex < code.length && code[codeIndex][1] <= index) {
      codeIndex++;
    }
    if (codeIndex < code.length && code[codeIndex][0] <= index) {
      index = code[codeIndex][1] - 1;
      continue;
    }
    const character = text[index];
    const open =
      character === ']'
        ? brackets.pop()
        : character === ')'
          ? parentheses.pop()
          : undefined;
    if (character === '\\') {
      index++;
    } else if (character === '[') {
      brackets.push(index);
    } else if (character === '(') {
      parentheses.push(index);
    } else if (open !== undefined) {
      pair[index] = open;
      pair[open] = index;
    }
  }
  return pair;
}

/**
 * Where a destination that opens with `<` ends — the index of the `)` that
 * closes the link — read as core Markdown reads it (CommonMark 0.31 §6.3):
 * `'refused'` when it opens with `<` but is no angle-bracket destination,
 * and null when the content after `open` (the `(`) does not open with `<`.
 * Inside the brackets parentheses are plain characters; a line ending, even
 * escaped, or an unescaped `<` makes it no destination; after the `>` come
 * only spaces, an optional title, and the `)`.
 */
export function angleDestinationEnd(
  text: string,
  open: number,
): number | 'refused' | null {
  let index = open + 1;
  while (text[index] === ' ' || text[index] === '\t') {
    index++;
  }
  if (text[index] !== '<') {
    return null;
  }
  for (index++; index < text.length; index++) {
    const character = text[index];
    if (
      character === '\\' &&
      text[index + 1] !== '\n' &&
      text[index + 1] !== '\r'
    ) {
      index++;
    } else if (character === '\n' || character === '\r' || character === '<') {
      return 'refused';
    } else if (character === '>') {
      break;
    }
  }
  if (index >= text.length) {
    return 'refused';
  }
  index++;
  while (/\s/.test(text[index] ?? '')) {
    index++;
  }
  const quote = text[index];
  if (quote === '"' || quote === "'" || quote === '(') {
    const closer = quote === '(' ? ')' : quote;
    for (index++; index < text.length && text[index] !== closer; index++) {
      if (text[index] === '\\') {
        index++;
      } else if (quote === '(' && text[index] === '(') {
        return 'refused';
      }
    }
    index++;
    while (/\s/.test(text[index] ?? '')) {
      index++;
    }
  }
  return text[index] === ')' ? index : 'refused';
}

/**
 * Whether core Markdown refuses a link to `destination`, as written in the
 * source: its own parser decides, so both surfaces refuse the same
 * destinations by one policy.
 */
export function coreRefusesDestination(destination: string): boolean {
  const probe = `[x](${destination})`;
  const [only, ...rest] = parseInlineAst(probe);
  return rest.length === 0 && only?.type === 'text' && only.value === probe;
}

/**
 * Whether core Markdown refuses a link to `url`, a destination already
 * decoded: the probe writes it back with every special character escaped.
 * A URL that cannot be written back is refused.
 */
export function coreRefusesUrl(url: string): boolean {
  if (/[\n\r]/.test(url)) {
    return true;
  }
  // Angle brackets never decide a scheme, so the probe percent-encodes them:
  // the URL then fits one angle-bracket destination even with spaces in it.
  const escaped = url
    .replace(/[<>]/g, character => (character === '<' ? '%3C' : '%3E'))
    .replace(/[\\()&[\]"']/g, character => `\\${character}`);
  return coreRefusesDestination(/\s/.test(url) ? `<${escaped}>` : escaped);
}

/**
 * Returns `markdown` with each inline link whose destination core Markdown
 * refuses — `javascript:` and the like — kept from becoming a link
 * (spec:AST-061 FR7). Where core shows the link as its source text, exactly
 * as written, the whole source becomes one stand-in that comes back as that
 * text. Where core reads no link there at all (its link text holds brackets
 * of its own), only the `(` that opens the destination becomes a stand-in,
 * so the text around it reads as core reads it, marks included. Brackets and
 * parentheses pair by nesting, so link text holding brackets is found whole.
 * Linear in the source: pairs come from one pass, and a destination inside a
 * found link is not probed again. Run first, on the source as written;
 * `$unwrapRefusedLinks` catches any link the editor still makes.
 */
export function protectRefusedLinks(markdown: string): ProtectedMarkdown {
  const standIns = new Map<string, StandIn>();
  if (!markdown.includes('](')) {
    return {markdown, standIns};
  }
  const pair = pairedDelimiters(markdown, codeRanges(markdown));
  // Ranges to replace, in order: a whole link, or the `(` that opens its
  // destination.
  const refused: Array<{start: number; end: number; whole: boolean}> = [];
  // Where the last probed destination ends: a link cannot sit inside one.
  let probedTo = -1;
  for (
    let index = markdown.indexOf('](');
    index !== -1;
    index = markdown.indexOf('](', index + 1)
  ) {
    const open = pair[index];
    // A destination in angle brackets ends where core ends it — parentheses
    // inside the brackets are plain characters — so `[a](<b)c>)` is probed
    // whole, not as `<b`.
    const angleClose = angleDestinationEnd(markdown, index + 1);
    const close = typeof angleClose === 'number' ? angleClose : pair[index + 1];
    if (index < probedTo || open === -1 || close === -1) {
      continue;
    }
    probedTo = close;
    if (!coreRefusesDestination(markdown.slice(index + 2, close))) {
      continue;
    }
    const source = markdown.slice(open, close + 1);
    const [only, ...rest] = parseInlineAst(source);
    if (rest.length === 0 && only?.type === 'text' && only.value === source) {
      // A whole link stands for the refused links found inside it.
      while (refused.length > 0 && refused[refused.length - 1].start >= open) {
        refused.pop();
      }
      refused.push({start: open, end: close + 1, whole: true});
    } else {
      refused.push({start: index + 1, end: index + 2, whole: false});
    }
  }
  if (refused.length === 0) {
    return {markdown, standIns};
  }
  const available = absentCharacters(markdown);
  let output = '';
  let copied = 0;
  for (const {start, end, whole} of refused) {
    const next = available.next();
    if (next.done === true || start < copied) {
      break;
    }
    standIns.set(
      next.value,
      whole
        ? {kind: 'literal', text: markdown.slice(start, end)}
        : {kind: 'escape', character: '('},
    );
    output += markdown.slice(copied, start) + next.value;
    copied = end;
  }
  return {markdown: output + markdown.slice(copied), standIns};
}

/**
 * Takes every link under `node` whose URL core Markdown refuses out of its
 * link, leaving its text in place, so no form of link text or destination
 * the source pass did not find can store or draw an unsafe URL.
 */
export function $unwrapRefusedLinks(node: ElementNode): void {
  for (const {node: descendant} of $dfs(node)) {
    if ($isLinkNode(descendant) && coreRefusesUrl(descendant.getURL())) {
      for (const child of descendant.getChildren()) {
        descendant.insertBefore(child);
      }
      descendant.remove();
    }
  }
}

/**
 * Returns `markdown` with every parenthesis inside an inline link
 * destination — between the destination's own parentheses, balanced, as core
 * Markdown and CommonMark read them — replaced by a private-use stand-in for
 * itself, outside code. Run after protectBackslashEscapes, so an escaped
 * parenthesis is already a stand-in and never counts toward the balance.
 */
export function protectLinkDestinationParentheses(
  markdown: string,
): ProtectedMarkdown {
  const standIns = new Map<string, StandIn>();
  if (!markdown.includes('](')) {
    return {markdown, standIns};
  }
  const available = absentCharacters(markdown);
  const byCharacter = new Map<string, string>();
  const standInFor = (character: '(' | ')'): string | null => {
    const existing = byCharacter.get(character);
    if (existing != null) {
      return existing;
    }
    const next = available.next();
    if (next.done === true) {
      return null;
    }
    byCharacter.set(character, next.value);
    standIns.set(next.value, {kind: 'escape', character});
    return next.value;
  };
  const code = codeRanges(markdown);
  const inner: Array<number> = [];
  let codeIndex = 0;
  let index = markdown.indexOf('](');
  while (index !== -1) {
    while (code[codeIndex] != null && code[codeIndex][1] <= index) {
      codeIndex++;
    }
    const range = code[codeIndex];
    if (range != null && range[0] <= index) {
      index = markdown.indexOf('](', range[1]);
      continue;
    }
    // The destination's own parentheses are depth one; any inside it are
    // deeper. A space at depth one ends the destination (a title follows);
    // a space deeper, or no closing parenthesis, means no link.
    const parentheses: Array<number> = [];
    let depth = 1;
    let position = index + 2;
    let isLink = markdown[position] !== '<';
    for (; isLink && position < markdown.length; position++) {
      const character = markdown[position];
      if (/\s/.test(character)) {
        isLink = depth === 1;
        break;
      }
      if (character === '(') {
        depth++;
        parentheses.push(position);
      } else if (character === ')') {
        depth--;
        if (depth === 0) {
          break;
        }
        parentheses.push(position);
      }
    }
    if (isLink && depth <= 1) {
      inner.push(...parentheses);
    }
    index = markdown.indexOf('](', position + 1);
  }
  if (inner.length === 0) {
    return {markdown, standIns};
  }
  let output = '';
  let copied = 0;
  for (const position of inner) {
    const standIn = standInFor(markdown[position] as '(' | ')');
    if (standIn == null) {
      break;
    }
    output += markdown.slice(copied, position) + standIn;
    copied = position + 1;
  }
  return {markdown: output + markdown.slice(copied), standIns};
}
