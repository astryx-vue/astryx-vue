// 保留原文的导入导出（spec:AST-062）：没被改动的顶层块原样导出，只有改动的块才按
// 规范写法重新生成。导入看 markdownSourceImport.ts，规范 Markdown 的生成看
// markdownSourceCanonical.ts，分块看 markdownSourceChunks.ts。

import type { Transformer } from '@lexical/markdown'
import type { LexicalNode } from 'lexical'
import { $getRoot, $getState } from 'lexical'
import { $canonicalMarkdown, $regeneratedMarkdown } from './markdownSourceCanonical.js'
import { SETEXT_DASHES, THEMATIC_BREAK_LINE } from './markdownSourceChunks.js'
import { documentState, ENDS_WITH_BLANK_LINE, groupState } from './markdownSourceRecords.js'
import { withLineEnding } from './markdownSourceText.js'

interface ExportPiece {
  readonly text: string
  /** Recorded bytes after the piece, when they belong to this document. */
  readonly trailing: string | null
  /** Whether the piece is the group's recorded source, unchanged. */
  readonly isAsWritten: boolean
  /** The piece's group, and the group that followed it in the source. */
  readonly group: string | null
  readonly next: string | null
}

/** Whether `text` is one thematic break line, as written. */
function isRuleLine(text: string): boolean {
  return !text.includes('\n') && THEMATIC_BREAK_LINE.test(text)
}

/**
 * Whether the bytes recorded after `piece` still separate it from `next`.
 * Bytes ending in a blank line separate any two blocks. A single line break
 * only follows or precedes a thematic break (a rule is a chunk of its own),
 * and it belongs to the block it follows:
 *
 * - after a rule as written, it stays whatever comes next, because no line
 *   after a rule can join it;
 * - between the same two blocks, both as written, it stays;
 * - after a changed block, it stays only above the same rule as written when
 *   that rule cannot underline the block as a heading (`***`, `___`, or
 *   spaced dashes, not `---`).
 *
 * Everywhere else — next to a moved, inserted, deleted, or changed block — a
 * blank line separates the two, so no block can join its neighbor.
 */
function keepsRecordedTrailing(piece: ExportPiece, next: ExportPiece): boolean {
  // The last block's recorded trailing is empty: it separates nothing.
  if (piece.trailing == null || !piece.trailing.includes('\n')) {
    return false
  }
  if (ENDS_WITH_BLANK_LINE.test(piece.trailing)) {
    return true
  }
  if (piece.isAsWritten && isRuleLine(piece.text)) {
    return true
  }
  if (piece.next == null || piece.next !== next.group || !next.isAsWritten) {
    return false
  }
  return (
    piece.isAsWritten
    || (isRuleLine(next.text) && !SETEXT_DASHES.test(next.text))
  )
}

/**
 * Exports the root per spec:AST-062: unchanged groups as authored, changed and
 * new blocks in canonical form, all in the document's envelope. Reads the tree
 * without changing it, so it runs in a read of the live editor state.
 */
export function $exportMarkdownKeepingSource(
  transformers: ReadonlyArray<Transformer>,
): string {
  const transformerList = transformers as Array<Transformer>
  const root = $getRoot()
  const document = $getState(root, documentState)
  const lineEnding = document?.lineEnding ?? '\n'
  const children = root.getChildren()
  const pieces: Array<ExportPiece> = []
  let index = 0
  while (index < children.length) {
    const first = children[index]
    const record = $getState(first, groupState)
    const group: Array<LexicalNode> = [first]
    index++
    if (record?.content != null) {
      while (
        index < children.length
        && $getState(children[index], groupState)?.group === record.group
        && $getState(children[index], groupState)?.content == null
      ) {
        group.push(children[index])
        index++
      }
    }
    const canonical = $canonicalMarkdown(group, transformerList)
    // A group imported into another document keeps its content but takes this
    // document's line ending and separators.
    const isOwn
      = document != null
        && record?.group.startsWith(`${document.importId}:`) === true
    if (
      record?.content != null
      && group.length === record.size
      && canonical.hash === record.canonicalHash
    ) {
      pieces.push({
        text: isOwn
          ? record.content
          : withLineEnding(record.content, lineEnding),
        trailing: isOwn ? (record.trailing ?? null) : null,
        isAsWritten: isOwn,
        group: record.group,
        next: record.next ?? null,
      })
      continue
    }
    const regenerated = $regeneratedMarkdown(
      group,
      canonical.markdown,
      transformerList,
    )
    pieces.push({
      text: withLineEnding(
        regenerated,
        isOwn && record?.lineEnding != null ? record.lineEnding : lineEnding,
      ),
      trailing: isOwn ? (record?.trailing ?? null) : null,
      isAsWritten: false,
      group: record?.group ?? null,
      next: isOwn ? (record?.next ?? null) : null,
    })
  }
  const separator = lineEnding + lineEnding
  let output
    = (document?.byteOrderMark === true ? '\uFEFF' : '')
      + (document?.leading ?? '')
  pieces.forEach((piece, position) => {
    output += piece.text
    if (position < pieces.length - 1) {
      output += keepsRecordedTrailing(piece, pieces[position + 1])
        ? (piece.trailing ?? '')
        : separator
    }
  })
  return output + (document?.trailing ?? '')
}

export { absentToken } from './markdownSourceCanonical.js'
export type { MarkdownChunk } from './markdownSourceChunks.js'
export { splitMarkdownChunks } from './markdownSourceChunks.js'
export {
  $joinSoftLineBreaks,
  $nestFollowingLists,
  importMarkdownKeepingSource,
} from './markdownSourceImport.js'
