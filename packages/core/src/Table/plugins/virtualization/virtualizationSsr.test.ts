// @vitest-environment node
import type { TableColumn } from '../../types.js'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { pixel } from '../../columnUtils.js'
import Table from '../../Table.vue'
import { useTableColumnsVirtualization, useTableRowsVirtualization } from '../virtualization.js'

type Row = Record<string, unknown> & { id: string }

const rows: Row[] = Array.from({ length: 200 }, (_, index) => ({ id: `r${index}`, c0: `cell ${index}` }))

async function render(plugins: Record<string, unknown>, columns: TableColumn<Row>[]): Promise<string> {
  const props: Record<string, unknown> = { data: rows, columns, idKey: 'id', plugins }
  return renderToString(createSSRApp({ render: () => h(Table, props) }))
}

describe('窗口化的服务端渲染', () => {
  it('首帧按初始视口高度只渲染前几行，其余用占位行撑开', async () => {
    const html = await render(
      { rows: useTableRowsVirtualization<Row>({ rowHeight: 40, initialViewportHeight: 400 }) },
      [{ key: 'c0', header: 'C0' }],
    )
    expect(html.match(/data-window-row/g)?.length).toBe(14)
    expect(html).toContain('data-window-gap')
    expect(html).toContain('aria-rowcount="201"')
  })

  it('首帧按初始视口宽度只渲染前几列', async () => {
    const columns: TableColumn<Row>[] = Array.from({ length: 30 }, (_, index) => ({ key: `c${index}`, header: `C${index}`, width: pixel(100) }))
    const html = await render(
      { columns: useTableColumnsVirtualization<Row>({ initialViewportWidth: 300 }) },
      columns,
    )
    expect(html).toContain('aria-colcount="30"')
    expect(html).not.toContain('>C29<')
  })
})
