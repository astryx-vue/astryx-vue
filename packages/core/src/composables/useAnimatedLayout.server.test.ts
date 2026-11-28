// @vitest-environment node
/**
 * @file useAnimatedLayout.server.test.ts
 * @input useAnimatedLayout.ts, the layout motion module, and the components
 *   that take its handle, with no DOM
 * @output Importing them touches no DOM global, and a page that passes a
 *   handle renders on the server exactly as one without it
 * @position Unit test beside useAnimatedLayout.ts: the server side of layout
 *   motion
 */

import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

describe('layout motion on the server', () => {
  it('the composable and the module import with no window or document', async () => {
    expect(typeof document).toBe('undefined')
    expect(Object.keys(await import('./useAnimatedLayout.js'))).toEqual(['useAnimatedLayout'])
    await expect(import('../motion/layout/index.js')).resolves.toBeDefined()
  })

  it('renders adopters with a handle the same as without one', async () => {
    const { useAnimatedLayout } = await import('./useAnimatedLayout.js')
    const { default: Collapsible } = await import('../Collapsible/Collapsible.vue')
    const { default: TreeList } = await import('../TreeList/TreeList.vue')
    const { default: Table } = await import('../Table/Table.vue')
    const { useTableRowExpansion } = await import('../Table/plugins/rowExpansion.js')
    const rows = [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }]
    const items = [{ id: 'a', label: 'A', isExpanded: true, children: [{ id: 'b', label: 'B' }] }]
    const page = (withHandle: boolean) => defineComponent({
      setup() {
        const container = ref<HTMLElement | null>(null)
        const handle = useAnimatedLayout({ containerRef: container })
        const animatedLayout = withHandle ? handle : undefined
        const expansion = useTableRowExpansion<Record<string, unknown>>({
          expandedKeys: new Set(['1']),
          onToggle: () => {},
          getRowKey: row => String(row.id),
          renderExpanded: row => `Detail ${String(row.name)}`,
          animatedLayout,
        })
        return () => h('div', { ref: container }, [
          h(Collapsible, { trigger: 'Details', animatedLayout }, () => 'Body'),
          h(TreeList, { items, label: 'Files', animatedLayout }),
          h(Table, { data: rows, columns: [{ key: 'name', header: 'Name' }], idKey: 'id', plugins: { expansion } }),
        ])
      },
    })

    const withHandle = await renderToString(h(page(true)))
    const withoutHandle = await renderToString(h(page(false)))
    expect(withHandle).toContain('Body')
    expect(withHandle).toContain('Detail Alice')
    expect(withHandle).toBe(withoutHandle)
  })
})
