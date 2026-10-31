import type { LexicalEditor } from 'lexical'
import { $isTableCellNode, $isTableNode, $isTableRowNode } from '@lexical/table'
import { $getRoot } from 'lexical'
import { createFrameScheduler } from './nextFrame.js'

const TABLE_COLUMN_MIN_CH = 4
const TABLE_COLUMN_MAX_CH = 24
const TABLE_COLUMN_TARGET_LINES = 2
const TABLE_HEADER_ONE_LINE_MAX_CH = 20

/**
 * 每一列的最小宽度（单位 `ch`），按每个单元格的字数算，表头行在最前：
 * 最长的格子最多折成两行，表头尽量一行读完（到上限为止），每一列都落在上下限之间。
 */
export function tableColumnFloors(rows: ReadonlyArray<ReadonlyArray<number>>): number[] {
  const [header, ...body] = rows
  if (header === undefined)
    return []
  return header.map((headerLength, column) => {
    const longest = Math.max(headerLength, ...body.map(row => row[column] ?? 0))
    const bodyFloor = Math.ceil(longest / TABLE_COLUMN_TARGET_LINES)
    const headerFloor = Math.min(headerLength, TABLE_HEADER_ONE_LINE_MAX_CH)
    return Math.min(TABLE_COLUMN_MAX_CH, Math.max(TABLE_COLUMN_MIN_CH, bodyFloor, headerFloor))
  })
}

/**
 * 每次更新之后，给每张顶层表格的表头单元格设上这一列的最小宽度，让它跟着编辑走。
 *
 * 和 core 的 Markdown 表格列宽一致：浏览器的自动表格布局本来就让每列至少和最长的词一样宽，
 * 但正文列里最长的词很短，窄表格会一行只放一个词。这里让一列最长的格子折成大约两行，
 * 表头在上限内保持一行，每列有上下限；更宽的表格在自己的容器里横向滚动。
 * 用 `ch` 加在 content-box 的格子上，所以跟着读者的字号走，内边距也不占这份宽度。
 */
export function registerTableColumnFloor(editor: LexicalEditor): () => void {
  const frame = createFrameScheduler(() => {
    editor.getEditorState().read(() => {
      for (const table of $getRoot().getChildren().filter($isTableNode)) {
        const rows = table.getChildren().filter($isTableRowNode).map(row => row.getChildren().filter($isTableCellNode))
        const floors = tableColumnFloors(rows.map(cells => cells.map(cell => cell.getTextContentSize())))
        rows[0]?.forEach((cell, column) => {
          const element = editor.getElementByKey(cell.getKey())
          const floor = `${floors[column]}ch`
          if (element !== null && element.style.minWidth !== floor)
            element.style.minWidth = floor
        })
      }
    })
  })
  const stop = editor.registerUpdateListener(frame.schedule)
  frame.schedule()
  return () => {
    frame.cancel()
    stop()
  }
}
