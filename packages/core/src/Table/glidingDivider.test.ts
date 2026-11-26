import { describe, expect, it } from 'vitest'
import { GLIDING_ATTRIBUTE, markGlidingRows, rowEdge } from './glidingDivider.js'

describe('markGlidingRows', () => {
  it('marks the moving rows and carries their divider while they move, and clears both after', async () => {
    const body = document.createElement('tbody')
    // 每行：一个固定列的格子，后面两个跟着滚动的格子。
    const rows = [0, 1, 2, 3, 4].map(() => {
      const row = document.createElement('tr')
      const pinned = document.createElement('td')
      pinned.classList.add('astryx-table__sticky')
      row.append(pinned, document.createElement('td'), document.createElement('td'))
      body.append(row)
      return row
    })
    // 移动的行里嵌套的表格保留自己的分隔线。
    const nested = document.createElement('table')
    nested.innerHTML = '<tbody><tr><td></td></tr></tbody>'
    rows[2]!.children[1]!.append(nested)
    const cellMarks = (row: HTMLTableRowElement) =>
      [...row.children].map(cell => cell.getAttribute('data-astryx-cell-gliding'))
    const table = document.createElement('table')
    table.append(body)
    document.body.append(table)
    let finish = (): void => {}
    const glide = {
      finished: new Promise<void>((resolve) => {
        finish = resolve
      }),
    } as unknown as Animation
    // 变化的是第 1 行；第 2、3 行在滑，第 4 行不动。
    const moving = new Set<Element>([rows[2]!, rows[3]!])
    const glideOf = (element: Element) => moving.has(element) ? glide : null

    const edges = new Map(rows.map(row => [row, rowEdge(row)!] as const))
    const done = markGlidingRows(rows[1]!, edges, null, glideOf)
    expect(rows.map(row => row.hasAttribute(GLIDING_ATTRIBUTE))).toEqual([false, false, true, true, false])
    expect(rows[2]!.style.getPropertyValue('--_table-row-glide-width')).toBe('0px')
    // 第一个跟着滚动的格子画线；固定列的格子不画；嵌套表格的格子不做标记。
    expect(cellMarks(rows[2]!)).toEqual(['', 'line', ''])
    expect(cellMarks(rows[4]!)).toEqual([null, null, null])
    expect(nested.querySelector('td')?.hasAttribute('data-astryx-cell-gliding')).toBe(false)

    finish()
    await done
    expect(rows.some(row => row.hasAttribute(GLIDING_ATTRIBUTE))).toBe(false)
    expect(rows[2]!.style.getPropertyValue('--_table-row-glide-width')).toBe('')
    expect(cellMarks(rows[2]!)).toEqual([null, null, null])
    table.remove()
  })

  it('reads no edge from a row that is already carrying its line', () => {
    const row = document.createElement('tr')
    row.append(document.createElement('td'))
    expect(rowEdge(row)).not.toBeNull()
    row.setAttribute(GLIDING_ATTRIBUTE, '')
    expect(rowEdge(row)).toBeNull()
  })
})
