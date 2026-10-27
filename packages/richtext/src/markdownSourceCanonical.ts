// 规范 Markdown 的生成：把一组节点导出成 Lexical 的规范写法，并算出指纹；
// 组里有改动时，再给会被读成结构的字面文字加上反斜杠转义。

import type { Transformer } from '@lexical/markdown'
import type { ElementNode, LexicalNode, NodeKey } from 'lexical'
import { $isCodeNode } from '@lexical/code'
import { $isElementNode, $isLineBreakNode, $isTextNode } from 'lexical'
import { absentCharacters } from './markdownCharacterReferences.js'
import { $isRichTextExtensionNode } from './markdownExtensionNode.js'
import { extensionTextView, withExtensionExport } from './markdownExtensions.js'
import { hashOf } from './markdownSourceText.js'
import { $convertToMarkdownKeepingTimeLinear } from './markdownSpaceRuns.js'
/**
 * An element that lists `nodes` as its children without adopting them, so
 * Lexical's exporter can read a run of top-level nodes on its own. The
 * exporter only ever asks the root it is given for its children.
 */
function childrenOf(nodes: ReadonlyArray<LexicalNode>): ElementNode {
  return { getChildren: () => [...nodes] } as unknown as ElementNode
}

/** Every node in the runs' subtrees, in document order. */
function descendantsOf(nodes: ReadonlyArray<LexicalNode>): Array<LexicalNode> {
  const out: Array<LexicalNode> = []
  const visit = (node: LexicalNode): void => {
    out.push(node)
    if ($isElementNode(node)) {
      node.getChildren().forEach(visit)
    }
  }
  nodes.forEach(visit)
  return out
}

/**
 * Canonical Markdown per run of nodes, keyed by the run's first node. Lexical
 * keeps a node's object across editor states until that node itself changes,
 * so a run whose every descendant is the same object as last time is
 * unchanged and costs a walk instead of an export.
 */
const canonicalCache = new WeakMap<
  LexicalNode,
  {
    readonly descendants: ReadonlyArray<LexicalNode>
    readonly transformers: ReadonlyArray<Transformer>
    readonly markdown: string
    readonly hash: string
  }
>()

export function $canonicalMarkdown(
  nodes: ReadonlyArray<LexicalNode>,
  transformers: Array<Transformer>,
): { readonly markdown: string, readonly hash: string } {
  const descendants = descendantsOf(nodes)
  const cached = canonicalCache.get(nodes[0])
  if (
    cached != null
    && cached.transformers === transformers
    && cached.descendants.length === descendants.length
    && cached.descendants.every((node, index) => node === descendants[index])
  ) {
    return cached
  }
  // Inline plugin nodes read as text inside the marks around them, so a mark
  // put on or taken off a node alone changes the canonical form too.
  const { placeholders, sources } = extensionPlaceholders(
    descendants,
    descendants.map(node => node.getTextContent()).join(''),
  )
  let markdown = $convertToMarkdownKeepingTimeLinear(
    withExtensionExport(transformers),
    childrenOf(
      placeholders.size === 0
        ? nodes
        : nodes.map(node => markedView(node, null, placeholders)),
    ),
  )
  for (const [placeholder, source] of sources) {
    markdown = markdown.split(placeholder).join(source)
  }
  const entry = { descendants, transformers, markdown, hash: hashOf(markdown) }
  canonicalCache.set(nodes[0], entry)
  return entry
}

/**
 * Line starts that would turn literal text into a block structure. Each match
 * is the spaces before the marker, where the escape goes: block markers may
 * follow up to three spaces (CommonMark 0.31), and a list item's continuation
 * line adds its own indentation, so any spaces count.
 */
const LINE_START_SYNTAX: ReadonlyArray<RegExp> = [
  // Block quote or ATX heading marker.
  /^ *(?=>|#{1,6}(?:[ \t]|$))/,
  // Bullet list item.
  /^ *(?=[-+](?:[ \t]|$))/,
  // Setext underline or thematic break made of `=` or `-`.
  /^ *(?=[=-][=\- \t]*$)/,
  // Table delimiter row.
  /^ *(?=[|:][\t :|]*-[-\t :|]*$)/,
]
// An ordered list item escapes its delimiter, not its first character.
const ORDERED_LIST_START = /^( *\d{1,9})(?=[.)](?:[ \t]|$))/

// Inline syntax Lexical's export leaves unescaped: link and image brackets and
// character references.
const INLINE_SYNTAX
  = /[[\]]|&(?=#\d{1,7};|#x[0-9a-f]{1,6};|[A-Z][A-Z0-9]*;)/gi

const PRIVATE_USE_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0xE000, 0xF8FF],
  [0xF0000, 0xFFFFD],
  [0x100000, 0x10FFFD],
]

/**
 * A token that appears nowhere in `text`. There are 137,468 private-use code
 * points, so a text shorter than that always misses one of them; a longer
 * text cannot contain every one of the 137,468² ordered pairs.
 */
export function absentToken(text: string): string {
  const present = new Set(text)
  for (const [first, last] of PRIVATE_USE_RANGES) {
    for (let codePoint = first; codePoint <= last; codePoint++) {
      const candidate = String.fromCodePoint(codePoint)
      if (!present.has(candidate)) {
        return candidate
      }
    }
  }
  for (const [first, last] of PRIVATE_USE_RANGES) {
    for (let a = first; a <= last; a++) {
      for (let b = first; b <= last; b++) {
        const candidate = String.fromCodePoint(a, b)
        if (!text.includes(candidate)) {
          return candidate
        }
      }
    }
  }
  throw new Error('No escape token is absent from the text')
}

/**
 * A view of `node` whose text marks every character that needs a backslash
 * with `token` (none when `token` is null), and whose inline plugin nodes read
 * as text holding their placeholders. Views delegate everything else to the
 * node they wrap, so Lexical's exporter reads them like the real tree without
 * changing it.
 */
function markedView(
  node: LexicalNode,
  token: string | null,
  placeholders: ReadonlyMap<NodeKey, string>,
): LexicalNode {
  const placeholder = placeholders.get(node.getKey())
  if (placeholder != null && $isRichTextExtensionNode(node)) {
    return extensionTextView(node, placeholder)
  }
  if ($isTextNode(node)) {
    if (node.hasFormat('code') || $isCodeNode(node.getParent())) {
      return node
    }
    if (token == null) {
      return Object.create(node) as typeof node
    }
    let text = node
      .getTextContent()
      .replace(INLINE_SYNTAX, match => token + match)
    const previous = node.getPreviousSibling()
    if (previous == null || $isLineBreakNode(previous)) {
      const ordered = ORDERED_LIST_START.exec(text)
      const start = LINE_START_SYNTAX.map(pattern => pattern.exec(text)).find(
        match => match != null,
      )
      const before = ordered?.[1] ?? start?.[0]
      if (before != null) {
        text = before + token + text.slice(before.length)
      }
    }
    const view = Object.create(node) as typeof node
    view.getTextContent = () => text
    return view
  }
  if ($isElementNode(node) && !$isCodeNode(node)) {
    // Read once: each read walks every child, so reading per child would
    // cost the square of their number — a run of tabs is one node per tab.
    const original = node.getChildren()
    const children = original.map(child =>
      markedView(child, token, placeholders),
    )
    // Each view's siblings are the views beside it, so a text view sees a
    // plugin node's text view as text with formats, not as a gap.
    children.forEach((child, index) => {
      if (child !== original[index]) {
        child.getPreviousSibling = <T extends LexicalNode>() =>
          (children[index - 1] ?? null) as T | null
        child.getNextSibling = <T extends LexicalNode>() =>
          (children[index + 1] ?? null) as T | null
      }
    })
    const view = Object.create(node) as typeof node
    view.getChildren = <T extends LexicalNode>() => children as Array<T>
    return view
  }
  return node
}

/**
 * A placeholder for each inline plugin node among `nodes`, absent from
 * `text`, and the source each placeholder stands for.
 */
function extensionPlaceholders(
  nodes: ReadonlyArray<LexicalNode>,
  text: string,
): {
  readonly placeholders: ReadonlyMap<NodeKey, string>
  readonly sources: ReadonlyMap<string, string>
} {
  const placeholders = new Map<NodeKey, string>()
  const sources = new Map<string, string>()
  const free = absentCharacters(text)
  for (const node of nodes) {
    if ($isRichTextExtensionNode(node) && node.isInline()) {
      const placeholder = free.next().value
      if (placeholder == null) {
        break
      }
      placeholders.set(node.getKey(), placeholder)
      sources.set(placeholder, node.getSource())
    }
  }
  return { placeholders, sources }
}

/**
 * The canonical Markdown of a changed group, with literal text escaped so it
 * imports again as the structure the editor showed (spec:AST-062 FR3).
 */
export function $regeneratedMarkdown(
  nodes: ReadonlyArray<LexicalNode>,
  canonical: string,
  transformers: Array<Transformer>,
): string {
  // The token is absent from the plain export and from every text the views
  // mark, so each token in the marked export is one of the marks.
  const text = canonical + nodes.map(node => node.getTextContent()).join('')
  const token = absentToken(text)
  // Inline plugin nodes export as placeholders inside the text around them,
  // so the marks around a node wrap it; each placeholder becomes the node's
  // exact source afterwards.
  const { placeholders, sources } = extensionPlaceholders(
    descendantsOf(nodes),
    text + token,
  )
  let marked = $convertToMarkdownKeepingTimeLinear(
    withExtensionExport(transformers),
    childrenOf(nodes.map(node => markedView(node, token, placeholders))),
  )
    .split(token)
    .join('\\')
  for (const [placeholder, source] of sources) {
    marked = marked.split(placeholder).join(source)
  }
  return marked
}
