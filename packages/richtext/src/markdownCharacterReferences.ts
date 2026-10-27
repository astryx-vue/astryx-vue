import { $isElementNode, $isTextNode, type ElementNode, type LexicalNode } from 'lexical'
import { $isCodeNode } from '@lexical/code'
import { $isLinkNode } from '@lexical/link'
import { decodeMarkdownCharacterReferences } from '@astryx-vue/core/Markdown/parser'
import { absentCharacters, type ProtectedMarkdown, type StandIn } from './markdownStandIns.js'
import { codeRanges } from './markdownCodeRanges.js'

// 字符实体的处理：把每个字符实体换成占位，导入完成后按 core Markdown 的解码器换成文字。
// 解码器由 core 提供，两边对同一个实体得到同一个结果。

const REFERENCE_LIKE = /&(?:#[xX][0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);/y;

/**
 * Returns `markdown` with every character reference outside code replaced by
 * a private-use stand-in that occurs nowhere else in it, and the escaped `&`
 * of an escaped reference replaced by one too. One pass over the source.
 */
export function protectCharacterReferences(
  markdown: string,
): ProtectedMarkdown {
  const standIns = new Map<string, StandIn>();
  if (!markdown.includes('&')) {
    return {markdown, standIns};
  }
  const available = absentCharacters(markdown);
  const byReference = new Map<string, string>();
  let ampersand: string | null = null;
  const standInFor = (reference: string | null): string | null => {
    const existing = reference == null ? ampersand : byReference.get(reference);
    if (existing != null) {
      return existing;
    }
    const next = available.next();
    if (next.done === true) {
      // Every private-use character is in the text or already used: leave
      // the rest as written.
      return null;
    }
    if (reference == null) {
      ampersand = next.value;
      standIns.set(next.value, {kind: 'ampersand'});
    } else {
      byReference.set(reference, next.value);
      standIns.set(next.value, {kind: 'reference', source: reference});
    }
    return next.value;
  };
  const code = codeRanges(markdown);
  let output = '';
  let copied = 0;
  let codeIndex = 0;
  let index = markdown.indexOf('&');
  while (index !== -1) {
    while (code[codeIndex] != null && code[codeIndex][1] <= index) {
      codeIndex++;
    }
    const range = code[codeIndex];
    if (range != null && range[0] <= index) {
      index = markdown.indexOf('&', range[1]);
      continue;
    }
    REFERENCE_LIKE.lastIndex = index;
    const match = REFERENCE_LIKE.exec(markdown);
    if (match == null) {
      index = markdown.indexOf('&', index + 1);
      continue;
    }
    let backslashes = 0;
    while (markdown[index - 1 - backslashes] === '\\') {
      backslashes++;
    }
    const reference = match[0];
    const end = index + reference.length;
    if (backslashes % 2 === 1) {
      // An escaped `&`: the reference stays literal, without its backslash.
      const standIn = standInFor(null);
      if (standIn != null) {
        output += markdown.slice(copied, index - 1) + standIn;
        copied = index + 1;
      }
    } else if (decodeMarkdownCharacterReferences(reference) !== reference) {
      const standIn = standInFor(reference);
      if (standIn != null) {
        output += markdown.slice(copied, index) + standIn;
        copied = end;
      }
    } else if (reference.startsWith('&#')) {
      // Not a reference (too many digits): literal, but kept from Lexical's
      // own numeric decoding.
      const standIn = standInFor(null);
      if (standIn != null) {
        output += markdown.slice(copied, index) + standIn;
        copied = index + 1;
      }
    }
    index = markdown.indexOf('&', end);
  }
  return {markdown: output + markdown.slice(copied), standIns};
}

/** `text` with each stand-in replaced as `replace` says. */
function restored(
  text: string,
  standIns: ReadonlyMap<string, StandIn>,
  replace: (standIn: StandIn) => string,
): string {
  let output = '';
  let changed = false;
  for (const character of text) {
    const standIn = standIns.get(character);
    if (standIn == null) {
      output += character;
    } else {
      output += replace(standIn);
      changed = true;
    }
  }
  return changed ? output : text;
}

const decoded = (standIn: StandIn): string => {
  switch (standIn.kind) {
    case 'literal':
      return standIn.text;
    case 'ampersand':
      return '&';
    case 'backslash':
      return '\\';
    case 'escape':
      return standIn.character;
    case 'reference':
      return decodeMarkdownCharacterReferences(standIn.source);
  }
};
const asWritten = (standIn: StandIn): string => {
  switch (standIn.kind) {
    case 'literal':
      return standIn.text;
    case 'ampersand':
      return '&';
    case 'backslash':
      return '\\';
    case 'escape':
      return `\\${standIn.character}`;
    case 'reference':
      return standIn.source;
  }
};

/**
 * Replaces the stand-ins under `node` with the characters their references
 * name or their escapes stand for — or, in code Lexical read as code, with
 * the references and escapes as written — in text, link destinations, and
 * link titles. One pass over the text.
 */
export function $restoreCharacterReferences(
  node: ElementNode,
  standIns: ReadonlyMap<string, StandIn>,
): void {
  if (standIns.size === 0) {
    return;
  }
  const visit = (current: LexicalNode, inCode: boolean) => {
    if ($isTextNode(current)) {
      const text = current.getTextContent();
      const next = restored(
        text,
        standIns,
        inCode || current.hasFormat('code') ? asWritten : decoded,
      );
      if (next !== text) {
        current.setTextContent(next);
      }
      return;
    }
    if ($isLinkNode(current)) {
      const url = restored(current.getURL(), standIns, decoded);
      if (url !== current.getURL()) {
        current.setURL(url);
      }
      const title = current.getTitle();
      if (title != null) {
        const nextTitle = restored(title, standIns, decoded);
        if (nextTitle !== title) {
          current.setTitle(nextTitle);
        }
      }
    }
    if ($isElementNode(current)) {
      const isCode = inCode || $isCodeNode(current);
      for (const child of current.getChildren()) {
        visit(child, isCode);
      }
    }
  };
  visit(node, false);
}

export { absentCharacters } from './markdownStandIns.js'
export type { ProtectedMarkdown } from './markdownStandIns.js'
export { protectBackslashEscapes } from './markdownEscapes.js'
export {
  $unwrapRefusedLinks,
  coreRefusesUrl,
  protectLinkDestinationParentheses,
  protectRefusedLinks,
} from './markdownRefusedLinks.js'
export { $restoreCodeSpans, protectCodeSpans } from './markdownCodeSpans.js'
export type { ProtectedCodeSpans } from './markdownCodeSpans.js'
