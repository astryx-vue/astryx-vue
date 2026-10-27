import type { ElementNode } from 'lexical'
import { $findMatchingParent } from '@lexical/utils'
import { $isTableCellNode } from '@lexical/table'
import { parseInlineAst } from '@astryx-vue/core/Markdown/parser'
import { absentCharacters, type StandIn } from './markdownStandIns.js'
import { codeRangesByKind } from './markdownCodeRanges.js'
import { angleDestinationEnd, pairedDelimiters } from './markdownRefusedLinks.js'

/** The code spans a stand-in pass replaced: each stand-in's code. */
export interface ProtectedCodeSpans {
  readonly markdown: string;
  readonly spans: ReadonlyMap<string, string>;
  /** Stand-ins for backticks in link destinations and titles. */
  readonly standIns: ReadonlyMap<string, StandIn>;
}

/** Whether `text` holds a `|` with no backslash before it. */
function hasUnescapedPipe(text: string): boolean {
  for (let index = text.indexOf('|'); index !== -1;) {
    let backslashes = 0;
    while (text[index - 1 - backslashes] === '\\') {
      backslashes++;
    }
    if (backslashes % 2 === 0) {
      return true;
    }
    index = text.indexOf('|', index + 1);
  }
  return false;
}

/** A GFM table's delimiter row: cells of hyphens with optional colons. */
const TABLE_DELIMITER_ROW = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

/**
 * The ranges of `markdown` a code span must not start in: inline link
 * destinations and titles, from the `(` after a `]` to its paired `)`. The
 * link reads its destination before any code span there, as core and
 * CommonMark read it.
 */
function linkTargetRanges(
  markdown: string,
  code: ReadonlyArray<readonly [number, number]>,
): Array<readonly [number, number]> {
  const ranges: Array<readonly [number, number]> = [];
  if (!markdown.includes('](')) {
    return ranges;
  }
  const pair = pairedDelimiters(markdown, code);
  for (
    let index = markdown.indexOf('](');
    index !== -1;
    index = markdown.indexOf('](', index + 1)
  ) {
    // An angle-bracket destination ends where core ends it: a parenthesis
    // inside the brackets pairs with nothing.
    const angleClose = angleDestinationEnd(markdown, index + 1);
    const close = typeof angleClose === 'number' ? angleClose : pair[index + 1];
    if (pair[index] !== -1 && close !== -1) {
      ranges.push([index + 1, close + 1]);
    }
  }
  return ranges;
}

/** The ranges of `markdown` that are GFM table rows, header row included. */
function tableRowRanges(markdown: string): Array<readonly [number, number]> {
  const ranges: Array<readonly [number, number]> = [];
  const lines = markdown.split('\n');
  const starts: number[] = [];
  let offset = 0;
  for (const line of lines) {
    starts.push(offset);
    offset += line.length + 1;
  }
  for (let index = 1; index < lines.length; index++) {
    const line = lines[index];
    if (
      line.includes('|') &&
      TABLE_DELIMITER_ROW.test(line) &&
      lines[index - 1].includes('|')
    ) {
      let end = index + 1;
      while (end < lines.length && lines[end].trim() !== '') {
        end++;
      }
      ranges.push([starts[index - 1], starts[end - 1] + lines[end - 1].length]);
      index = end;
    }
  }
  return ranges;
}

/**
 * Returns `markdown` with each code span outside fenced code replaced by a
 * private-use stand-in, and the code each stands for, as core Markdown reads
 * it. Code spans bind tighter than emphasis and links (CommonMark 0.31
 * §6.1), but Lexical's import applies a code span before an earlier mark on
 * the same line, which breaks every mark around code that follows another
 * (`~~a~~ ~~`c`~~`); with the code out of the way, the marks pair first and
 * the code comes back inside them. Backticks in a link's destination or
 * title are the link's, never a code span: they become stand-ins too, put
 * back into the link's address and title after import, so Lexical cannot
 * pair them into code either. In a table row, a span holding an unescaped
 * `|` is left alone, so the row still splits its cells there, as GFM does.
 */
export function protectCodeSpans(markdown: string): ProtectedCodeSpans {
  const spans = new Map<string, string>();
  const standIns = new Map<string, StandIn>();
  if (!markdown.includes('`')) {
    return {markdown, spans, standIns};
  }
  const code = codeRangesByKind(markdown);
  const targets = linkTargetRanges(markdown, [...code.fenced, ...code.spans]);
  const rows = tableRowRanges(markdown);
  // Whether a position lies in one of ranges sorted by start, for positions
  // asked in order: one pass over the ranges in all.
  const cursor = (ranges: ReadonlyArray<readonly [number, number]>) => {
    let next = 0;
    let coveredTo = -1;
    return (position: number): boolean => {
      while (next < ranges.length && ranges[next][0] <= position) {
        coveredTo = Math.max(coveredTo, ranges[next][1]);
        next++;
      }
      return position < coveredTo;
    };
  };
  const inTarget = cursor(targets);
  const inRow = cursor(rows);
  // Replacements in source order: code spans, and backticks in targets.
  const replacements: Array<{
    readonly start: number;
    readonly end: number;
    readonly code: string | null;
  }> = [];
  for (const [start, end] of code.spans) {
    const source = markdown.slice(start, end);
    const isInRow = inRow(start);
    if (inTarget(start) || (isInRow && hasUnescapedPipe(source))) {
      continue;
    }
    const [only, ...rest] = parseInlineAst(source);
    if (rest.length > 0 || only?.type !== 'inlineCode') {
      continue;
    }
    replacements.push({start, end, code: only.value});
  }
  for (const [from, to] of targets) {
    for (
      let index = markdown.indexOf('`', from);
      index !== -1 && index < to;
      index = markdown.indexOf('`', index + 1)
    ) {
      replacements.push({start: index, end: index + 1, code: null});
    }
  }
  replacements.sort((a, b) => a.start - b.start);
  const available = absentCharacters(markdown);
  let output = '';
  let copied = 0;
  for (const {start, end, code: content} of replacements) {
    if (start < copied) {
      continue;
    }
    const next = available.next();
    if (next.done === true) {
      break;
    }
    if (content == null) {
      standIns.set(next.value, {kind: 'literal', text: '`'});
    } else {
      spans.set(next.value, content);
    }
    output += markdown.slice(copied, start) + next.value;
    copied = end;
  }
  return {markdown: output + markdown.slice(copied), spans, standIns};
}

/**
 * Puts each code span back where its stand-in sits under `node`: the code as
 * text with the code format, inside whatever marks the stand-in took. In a
 * table cell an escaped `\|` in code is a `|`, as GFM reads cells.
 */
export function $restoreCodeSpans(
  node: ElementNode,
  spans: ReadonlyMap<string, string>,
): void {
  if (spans.size === 0) {
    return;
  }
  for (const text of node.getAllTextNodes()) {
    const content = text.getTextContent();
    const offsets: number[] = [];
    let offset = 0;
    for (const character of content) {
      if (spans.has(character)) {
        offsets.push(offset, offset + character.length);
      }
      offset += character.length;
    }
    if (offsets.length === 0) {
      continue;
    }
    const pieces = text.splitText(
      ...offsets.filter(point => point > 0 && point < content.length),
    );
    for (const piece of pieces) {
      const code = spans.get(piece.getTextContent());
      if (code == null) {
        continue;
      }
      const inCell = $findMatchingParent(piece, $isTableCellNode) != null;
      piece.setTextContent(inCell ? code.replace(/\\\|/g, '|') : code);
      if (!piece.hasFormat('code')) {
        piece.toggleFormat('code');
      }
    }
  }
}
