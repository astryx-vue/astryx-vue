import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import OverflowList from './OverflowList/OverflowList.vue'
import { useTableSelection, useTableSelectionState } from './Table/plugins/selection.js'
import Table from './Table/Table.vue'

describe('D12 alignment: measurement behavior', () => {
  it('OverflowList measures the real overflow slot content, not a built-in label', () => {
    const wrapper = mount(OverflowList, {
      props: {
        items: [
          { label: 'Alpha' },
          { label: 'Beta' },
          { label: 'Gamma' },
        ],
      },
      slots: {
        overflow: ({ items }: { items: readonly { label: string }[] }) =>
          h('button', { class: 'custom-overflow' }, `+${items.length}`),
      },
    })

    const measure = wrapper.get('.astryx-overflow-list__measure [data-overflow-indicator]')
    expect(measure.find('.custom-overflow').exists()).toBe(true)
    // 按最多项数渲染，保证留出最大宽度。
    expect(measure.get('.custom-overflow').text()).toBe('+3')
    // 可见区只在溢出时出现自定义指示器。
    expect(wrapper.find('.astryx-overflow-list__row .custom-overflow').exists()).toBe(false)
  })

  it('PowerSearch tokens never grow and the input is content-sized', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/power-search.css'), 'utf8')
    const tokens = css.indexOf('.astryx-power-search-tokens {')
    const block = css.slice(tokens, css.indexOf('}', tokens))
    expect(block).toContain('flex: 0 1 auto')
    const input = css.indexOf('.astryx-power-search-input {')
    const inputBlock = css.slice(input, css.indexOf('}', input))
    expect(inputBlock).toContain('height: auto')
  })

  it('Table counts the selection column in the table min width', async () => {
    interface Person extends Record<string, unknown> {
      id: string
      name: string
    }
    const people: Person[] = [
      { id: '1', name: 'Charlie' },
      { id: '2', name: 'Alice' },
    ]
    const tableColumns = [
      // 两列都无 width：每列 floor 60，共 120；选择列 48 也要算进去。
      { key: 'name', header: 'Name' },
      { key: 'role', header: 'Role' },
    ]
    const selected = ref(new Set<string>())
    const wrapper = mount(defineComponent({
      components: { Table },
      setup() {
        const { selectionConfig } = useTableSelectionState<Person>({
          data: people,
          idKey: 'id',
          selectedKeys: selected,
          setSelectedKeys: (keys) => {
            selected.value = keys
          },
          getRowLabel: item => item.name,
        })
        const selection = useTableSelection(selectionConfig)
        return { people, tableColumns, selection }
      },
      template: '<Table :data="people" :columns="tableColumns" :plugins="{ selection }" id-key="id" />',
    }))
    await nextTick()
    expect(wrapper.get('table').attributes('style')).toContain('min-width: 168px')
  })
})
