import type { Component, VNode, VNodeChild } from 'vue'
import type { MdNode } from './ast.js'
import type { BlockDirectionScope } from './blockDirection.js'
import { h } from 'vue'
import { blockDirection, readsAgainst } from './blockDirection.js'
import { measureNode } from './renderTree.js'

const TABLE_COLUMN_MIN_CH = 4
const TABLE_COLUMN_MAX_CH = 24
const TABLE_HEADER_ONE_LINE_MAX_CH = 20

function columnMinCh(node: MdNode): number[] {
  const rows = node.children ?? []
  const header = rows[0]
  if (header == null)
    return []
  return (header.children ?? []).map((cell, index) => {
    const headerLen = measureNode(cell)
    let maxLen = headerLen
    for (const row of rows.slice(1)) {
      const body = row.children?.[index]
      if (body != null)
        maxLen = Math.max(maxLen, measureNode(body))
    }
    const bodyFloor = Math.ceil(maxLen / 2)
    const headerFloor = Math.min(headerLen, TABLE_HEADER_ONE_LINE_MAX_CH)
    return Math.min(TABLE_COLUMN_MAX_CH, Math.max(TABLE_COLUMN_MIN_CH, bodyFloor, headerFloor))
  })
}

/**
 * 单元格写出的对齐。读向和表格相反的单元格里，表格的起点是它自己的终点，
 * 所以显式的左右对齐要换到另一侧（样式见 markdown.css 的 `data-against-table`）。
 */
function cellAlign(alignment: string | null | undefined, against: boolean): string | undefined {
  if (alignment === 'center' || alignment === 'right')
    return alignment
  return alignment === 'left' && against ? alignment : undefined
}

export interface MarkdownTableOptions {
  direction?: BlockDirectionScope
  /** 渲染单元格里的行内内容。 */
  renderCell: (cell: MdNode, key: string) => VNodeChild[]
  override?: Component
  attrs: Record<string, unknown>
  fields: Record<string, unknown>
}

/** Markdown 表格。表格沿用外面的方向排列各列；每个单元格按自己的文字定方向。 */
export function renderMarkdownTable(node: MdNode, key: string, options: MarkdownTableOptions): VNode {
  const rows = node.children ?? []
  const header = rows[0]
  const body = rows.slice(1)
  const align = node.align ?? []
  const floors = columnMinCh(node)
  const renderRow = (row: MdNode, rowKey: string, cellTag: 'th' | 'td'): VNode => h('tr', { key: rowKey }, (row.children ?? []).map((cell, index) => {
    const dir = blockDirection(cell, options.direction)
    const against = readsAgainst(dir, options.direction)
    const floor = floors[index]
    return h(cellTag, {
      'key': `${rowKey}-${index}`,
      'class': 'astryx-markdown__cell',
      'scope': cellTag === 'th' ? 'col' : undefined,
      'data-align': cellAlign(align[index], against),
      'data-against-table': against || undefined,
      dir,
      'style': floor == null ? undefined : { minWidth: `${floor}ch` },
    }, options.renderCell(cell, `${rowKey}-${index}`))
  }))
  const content = [
    header == null ? null : h('thead', { key: `${key}-head` }, [renderRow(header, `${key}-head-row`, 'th')]),
    body.length === 0 ? null : h('tbody', { key: `${key}-body` }, body.map((row, index) => renderRow(row, `${key}-body-${index}`, 'td'))),
  ].filter(child => child != null)
  if (options.override != null)
    return h(options.override, { key, ...options.fields }, () => content)
  return h('div', { key, class: 'astryx-markdown__table-wrap', ...options.attrs }, [
    h('table', { class: 'astryx-markdown__table' }, content),
  ])
}
