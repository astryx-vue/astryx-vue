// 保留原文的导入：分块喂给 Lexical，把每块占位保护起来（插件节点、链接、行内代码、
// 反斜杠转义、链接目标里的括号、字符实体），导入完再把占位换回来，最后按块记录原文。

import type { MarkdownPluginEntry } from '@astryx-vue/core/Markdown/plugins'
import type { Transformer } from '@lexical/markdown'
import type { ElementNode, LexicalEditor, LexicalNode } from 'lexical'
import type { MarkdownChunk } from './markdownSourceChunks.js'
import type { GroupRecord } from './markdownSourceRecords.js'
import { $isCodeNode } from '@lexical/code'
import { $isListItemNode, $isListNode } from '@lexical/list'
import { $convertFromMarkdownString } from '@lexical/markdown'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getState,
  $isElementNode,
  $isLineBreakNode,
  $isTextNode,
  $setState,

} from 'lexical'
import {
  $restoreCharacterReferences,
  $restoreCodeSpans,
  $unwrapRefusedLinks,
  protectBackslashEscapes,
  protectCharacterReferences,
  protectCodeSpans,
  protectLinkDestinationParentheses,
  protectRefusedLinks,
} from './markdownCharacterReferences.js'
import {
  $restoreExtensionSources,
  shieldExtensionSources,
} from './markdownExtensions.js'
import { isMarkedHardLineBreak } from './markdownHardLineBreak.js'
import { normalizeListIndentation } from './markdownListIndentation.js'
import { $canonicalMarkdown } from './markdownSourceCanonical.js'
import {

  sameLines,
  splitMarkdownChunks,
} from './markdownSourceChunks.js'
import {
  documentState,
  ENDS_WITH_BLANK_LINE,

  groupState,
  nextImportId,
} from './markdownSourceRecords.js'
import { lineEndingOf, withoutCarriageReturns } from './markdownSourceText.js'
/**
 * Imports Markdown into the editor's root and records its authored bytes. Runs
 * two discrete updates: the first imports every chunk and stamps its nodes
 * with the chunk's group id; the second runs after node transforms have
 * settled the tree (adjacent lists merge, for example), so each group covers
 * exactly the chunks that ended up in its nodes.
 */
export function importMarkdownKeepingSource(
  editor: LexicalEditor,
  markdown: string,
  transformers: Array<Transformer>,
  plugins: ReadonlyArray<MarkdownPluginEntry> = [],
): void {
  const importId = nextImportId()
  const byteOrderMark = markdown.startsWith('\uFEFF')
  const body = byteOrderMark ? markdown.slice(1) : markdown
  const chunks = splitMarkdownChunks(body)
  // Lexical reads the same chunks with list nesting spelled its way; the
  // records keep the authored bytes. Only indentation changes, so each chunk
  // is the same lines of the rewritten text.
  const importChunks = sameLines(normalizeListIndentation(body), chunks)
  const lineEnding = lineEndingOf(body, '\n')
  editor.update(
    () => {
      const root = $getRoot()
      root.clear()
      chunks.forEach((chunk, index) => {
        // The holder is attached while Lexical imports into it: Lexical only
        // continues a paragraph, list item, or quote onto the next line
        // inside an attached tree, and would otherwise start a new paragraph
        // at every line ending.
        const holder = $createParagraphNode()
        root.append(holder)
        // Lexical imports LF lines; the record keeps the authored endings.
        // Adopted plugins' nodes, links core refuses (as their source text),
        // then code spans, then backslash escapes and parentheses in
        // link destinations, then character references go through as
        // stand-ins: plugin nodes come back as extension nodes holding their
        // source, escapes and parentheses as the literal characters,
        // references decoded.
        const shielded = shieldExtensionSources(
          withoutCarriageReturns(importChunks[index]?.content ?? chunk.content),
          plugins,
        )
        // Links core refuses go first, on the source as written, so one whose
        // text holds code (`[`x`](javascript:y)`) shows whole as core shows
        // it; code spans next, so a safe link's code still reads as code.
        const refused = protectRefusedLinks(shielded.markdown)
        const code = protectCodeSpans(refused.markdown)
        const escaped = protectBackslashEscapes(code.markdown)
        const destinations = protectLinkDestinationParentheses(
          escaped.markdown,
        )
        const referenced = protectCharacterReferences(destinations.markdown)
        $convertFromMarkdownString(referenced.markdown, transformers, holder)
        $restoreCharacterReferences(
          holder,
          new Map([
            ...refused.standIns,
            ...code.standIns,
            ...escaped.standIns,
            ...destinations.standIns,
            ...referenced.standIns,
          ]),
        )
        $restoreCodeSpans(holder, code.spans)
        $unwrapRefusedLinks(holder)
        $restoreExtensionSources(holder, shielded.standIns)
        $joinSoftLineBreaks(holder)
        for (const node of holder.getChildren()) {
          $setState(node, groupState, { group: `${importId}:${index}` })
        }
        for (const node of holder.getChildren()) {
          holder.insertBefore(node)
        }
        holder.remove()
      })
      $nestFollowingLists(root)
      if (root.getChildrenSize() === 0) {
        // Nothing to import: keep one empty paragraph, as Lexical does.
        root.append($createParagraphNode())
      }
    },
    { discrete: true },
  )
  editor.update(
    () => {
      $recordGroups(chunks, importId, transformers)
      const root = $getRoot()
      const hasGroups = root
        .getChildren()
        .some(node => $getState(node, groupState)?.content != null)
      $setState(root, documentState, {
        importId,
        byteOrderMark,
        leading: hasGroups ? (chunks[0]?.leading ?? '') : '',
        trailing: hasGroups
          ? (chunks[chunks.length - 1]?.trailing ?? '')
          : body,
        lineEnding,
      })
    },
    { discrete: true },
  )
}

/**
 * Joins the lines of a paragraph, list item, or block quote across soft line
 * breaks: a line ending without two trailing spaces or a backslash continues
 * the block, as one space (CommonMark, soft line breaks; spec:AST-061 FR5).
 * Lexical imports every line ending as a line break and marks the hard ones,
 * so the unmarked ones outside code are the soft breaks.
 */
export function $joinSoftLineBreaks(element: ElementNode): void {
  for (const child of element.getChildren()) {
    if ($isElementNode(child) && !$isCodeNode(child)) {
      $joinSoftLineBreaks(child)
    }
  }
  for (const child of element.getChildren()) {
    if (!$isLineBreakNode(child) || isMarkedHardLineBreak(child)) {
      continue
    }
    // The spaces around a soft break are part of it.
    const previous = child.getPreviousSibling()
    if ($isTextNode(previous) && !previous.hasFormat('code')) {
      // Counted from the end: a pattern such as /[ \t]+$/ retries from every
      // space in a long run that does not end the text, so its time grows
      // with the square of the run.
      const text = previous.getTextContent()
      let end = text.length
      while (end > 0 && (text[end - 1] === ' ' || text[end - 1] === '\t')) {
        end--
      }
      previous.setTextContent(text.slice(0, end))
    }
    const next = child.getNextSibling()
    if ($isTextNode(next) && !next.hasFormat('code')) {
      next.setTextContent(next.getTextContent().replace(/^[ \t]+/, ''))
    }
    child.replace($createTextNode(' '))
  }
}

/**
 * Moves a list that begins nested right after another list into that list's
 * last item. Lexical starts a new top-level list for an item of a different
 * type (a bullet under `1. item`) and nests it there, while CommonMark nests
 * it inside the item above; without this, writing it back would lose the
 * nesting (spec:AST-061 FR5, spec:AST-062 FR3).
 */
export function $nestFollowingLists(root: ElementNode): void {
  for (const node of root.getChildren()) {
    const previous = node.getPreviousSibling()
    if (!$isListNode(node) || !$isListNode(previous)) {
      continue
    }
    // Lexical keeps a nested list in an item of its own after its parent.
    let first = node.getFirstChild()
    while (
      $isListItemNode(first)
      && first.getChildrenSize() === 1
      && $isListNode(first.getFirstChild())
    ) {
      previous.append(first)
      first = node.getFirstChild()
    }
    if (node.getChildrenSize() === 0) {
      node.remove()
    }
  }
}

/**
 * Turns the first pass's chunk stamps into groups. Consecutive nodes stamped
 * with one chunk form a group, and the group also covers every later chunk up
 * to the next group's: those chunks merged into its nodes or imported to
 * nothing. Chunks before the first group become part of it.
 */
function $recordGroups(
  chunks: ReadonlyArray<MarkdownChunk>,
  importId: string,
  transformers: Array<Transformer>,
): void {
  const children = $getRoot().getChildren()
  const chunkOf = (node: LexicalNode): number | null => {
    const group = $getState(node, groupState)?.group
    if (group == null || !group.startsWith(`${importId}:`)) {
      return null
    }
    return Number(group.slice(importId.length + 1))
  }
  let index = 0
  let isFirstGroup = true
  while (index < children.length) {
    const firstChunk = chunkOf(children[index])
    if (firstChunk == null) {
      index++
      continue
    }
    const group: Array<LexicalNode> = []
    while (index < children.length && chunkOf(children[index]) === firstChunk) {
      group.push(children[index])
      index++
    }
    const nextChunk
      = index === children.length
        ? chunks.length
        : (chunkOf(children[index]) ?? chunks.length)
    const startChunk = isFirstGroup ? 0 : firstChunk
    isFirstGroup = false
    const covered = chunks.slice(startChunk, nextChunk)
    const content = covered
      .map(
        (chunk, position) =>
          (position === 0 ? '' : chunk.leading)
          + (position === covered.length - 1
            ? chunk.content
            : chunk.content + chunk.trailing),
      )
      .join('')
    const isLastGroup = index === children.length
    const trailing = isLastGroup
      ? ''
      : (covered[covered.length - 1]?.trailing ?? '')
    const record: GroupRecord = {
      group: `${importId}:${firstChunk}`,
      size: group.length,
      content,
      trailing,
      canonicalHash: $canonicalMarkdown(group, transformers).hash,
      lineEnding: lineEndingOf(
        content + (covered[covered.length - 1]?.trailing ?? ''),
        '\n',
      ),
      ...(!isLastGroup && !ENDS_WITH_BLANK_LINE.test(trailing)
        ? { next: `${importId}:${nextChunk}` }
        : {}),
    }
    group.forEach((node, position) => {
      $setState(
        node,
        groupState,
        position === 0 ? record : { group: record.group },
      )
    })
  }
}
