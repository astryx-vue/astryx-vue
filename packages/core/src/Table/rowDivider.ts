/**
 * @file rowDivider.ts
 * @position Table 内部：在表格自己画的位置之外画分隔线时（例如行滑动时跟着行走的替身线），
 *   先在这里按合并边框的规则算出表格本来会在格子下面画哪条边，主题和应用设的边框就能照搬。
 */

/** 合并边框里各种线型的优先级，从弱到强（CSS 2.1）。 */
const STYLE_RANK = [
  'inset',
  'groove',
  'outset',
  'ridge',
  'dotted',
  'dashed',
  'solid',
  'double',
]

export interface BottomEdge {
  width: number
  style: string
  color: string
}

function edgeOf(element: Element | null, side: 'bottom' | 'top'): BottomEdge {
  if (element == null)
    return { width: 0, style: 'none', color: '' }
  const style = getComputedStyle(element)
  return {
    width: Number.parseFloat(style.getPropertyValue(`border-${side}-width`)) || 0,
    style: style.getPropertyValue(`border-${side}-style`),
    color: style.getPropertyValue(`border-${side}-color`),
  }
}

/** `row` 下面的一行，跨过分组边界（thead 到 tbody）也算。 */
function rowBelow(row: Element | null): Element | null {
  if (row == null)
    return null
  return row.nextElementSibling ?? row.parentElement?.nextElementSibling?.firstElementChild ?? null
}

/**
 * 表格在一个格子下面画的那条边，按合并边框的规则（CSS 2.1 17.6.2.1）：在格子自己的下边、
 * 下面格子的上边、所在行的下边、下一行的上边，以及分组边界上两个行组的边里，`hidden` 最优先，
 * 然后宽的胜，再然后线型强的胜；打平时格子胜过行、行胜过行组，上面的胜过下面的。
 * `isOwn` 表示格子自己的边胜出；`isRow` 表示行或行组的边胜出，表格会沿整行画它。
 */
export function collapsedBottom(cell: HTMLTableCellElement): BottomEdge & { isOwn: boolean, isRow: boolean } {
  const row = cell.parentElement
  const nextRow = rowBelow(row)
  const nextCell = nextRow?.children[cell.cellIndex] ?? null
  const isSectionEdge = row != null && row.nextElementSibling == null
  // 按打平时的先后顺序排。
  const candidates = [
    edgeOf(cell, 'bottom'),
    edgeOf(nextCell, 'top'),
    edgeOf(row, 'bottom'),
    edgeOf(nextRow, 'top'),
    edgeOf(isSectionEdge ? (row?.parentElement ?? null) : null, 'bottom'),
    edgeOf(isSectionEdge ? (nextRow?.parentElement ?? null) : null, 'top'),
  ]
  const own = candidates[0]!
  if (candidates.some(edge => edge.style === 'hidden'))
    return { width: 0, style: 'none', color: own.color, isOwn: own.style === 'hidden', isRow: false }
  const strength = (edge: BottomEdge): [number, number] =>
    edge.style === 'none' || edge.width === 0 ? [-1, -1] : [edge.width, STYLE_RANK.indexOf(edge.style)]
  let winner = own
  for (const edge of candidates.slice(1)) {
    const [width, rank] = strength(edge)
    const [bestWidth, bestRank] = strength(winner)
    if (width > bestWidth || (width === bestWidth && rank > bestRank))
      winner = edge
  }
  return { ...winner, isOwn: winner === own, isRow: candidates.indexOf(winner) >= 2 }
}
