import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Table from './Table.vue'
import { useTableRowExpansion } from './plugins/rowExpansion.js'
import { useTableSelection, useTableSelectionState } from './plugins/selection.js'
import { SELECT_COLUMN_KEY, SELECT_COLUMN_WIDTH } from './plugins/stickyColumns.js'

interface Person extends Record<string, unknown> {
  id: string
  name: string
}

const people: Person[] = [{ id: '1', name: 'Ada' }, { id: '2', name: 'Bo' }]
const columns = [{ key: 'name', header: 'Name' }]
const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/table.css'), 'utf8')

/** 取 `selector {` 那条规则的花括号内文本。 */
function rule(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  expect(start, `rule ${selector}`).toBeGreaterThan(-1)
  return css.slice(start, css.indexOf('}', start))
}

describe('table: 数据模式的列布局（D19）', () => {
  it('传 data 和 columns 时是 fixed 布局，手写行列时不是', () => {
    const data = mount(Table, { props: { data: people, columns } })
    expect(data.get('table').attributes('data-layout')).toBe('fixed')
    const manual = mount(Table, { slots: { default: () => h('tbody', [h('tr', [h('td', 'x')])]) } })
    expect(manual.get('table').attributes('data-layout')).toBeUndefined()
    expect(rule('.astryx-table[data-layout=\'fixed\']')).toContain('table-layout: fixed')
  })

  it('插件改选择列宽后，表头、数据格和表格最小宽度读到同一个值', async () => {
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
        })
        const widen = { widthFor: (column: { key: string }) => column.key === SELECT_COLUMN_KEY ? 48 : undefined }
        return { people, columns, plugins: { selection: useTableSelection(selectionConfig), widen } }
      },
      template: '<Table :data="people" :columns="columns" :plugins="plugins" id-key="id" />',
    }))
    await nextTick()
    expect(wrapper.get('table').attributes('style')).toContain('min-width: 108px')
    expect(wrapper.get('th.astryx-table__select').attributes('style')).toContain('width: 48px')
    expect(wrapper.get('td.astryx-table__select').attributes('style')).toContain('width: 48px')
  })

  it('不改宽度时选择列是原版的 36px', async () => {
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
        })
        return { people, columns, plugins: { selection: useTableSelection(selectionConfig) } }
      },
      template: '<Table :data="people" :columns="columns" :plugins="plugins" id-key="id" />',
    }))
    await nextTick()
    expect(wrapper.get('td.astryx-table__select').attributes('style')).toContain(`width: ${SELECT_COLUMN_WIDTH}px`)
  })
})

describe('table: 整行格不吃密度内边距（D19）', () => {
  it('密度规则用 :where 排除分组头和展开面板，不抬特异性', () => {
    const base = rule('.astryx-table :is(th, td):where(:not(.astryx-table__group, .astryx-table__panel))')
    expect(base).toContain('padding-block: var(--_cell-block')
    expect(base).toContain('padding-inline: var(--_cell-inline')
  })

  it('分组头的内边距固定：块向 8、结束侧 12、起始侧 0', () => {
    const group = rule('.astryx-table td.astryx-table__group')
    expect(group).toContain('padding-block: var(--astryx-spacing-2, 8px)')
    expect(group).toContain('padding-inline-start: 0')
    expect(group).toContain('padding-inline-end: var(--astryx-spacing-3, 12px)')
  })

  it('展开面板的块向 16、结束侧 20 固定，起始侧 = 40px 展开列 + 密度横向内边距', () => {
    const panel = rule('.astryx-table td.astryx-table__panel')
    expect(panel).toContain('padding-block: var(--astryx-spacing-4, 16px)')
    expect(panel).toContain('padding-inline-end: var(--astryx-spacing-5, 20px)')
    expect(css).toMatch(/td\.astryx-table__panel \{\s*padding-inline-start: calc\(40px \+ var\(--_cell-inline/)
  })

  it('密度只写变量：compact / balanced / spacious 各一组', () => {
    expect(rule('.astryx-table[data-density=\'compact\']')).toContain('--_cell-block: var(--astryx-spacing-1, 4px)')
    expect(rule('.astryx-table[data-density=\'balanced\']')).toContain('--_cell-inline: var(--astryx-spacing-3, 12px)')
    expect(rule('.astryx-table[data-density=\'spacious\']')).toContain('--_cell-inline: var(--astryx-spacing-4, 16px)')
  })
})

describe('table: 行展开的菜单格（D19）', () => {
  it('只有可展开行的数据格带 data-row-menu，对应原版"内边距挪给菜单触发层"', async () => {
    const expanded = ref(new Set<string>())
    const wrapper = mount(defineComponent({
      components: { Table },
      setup() {
        const expansion = useTableRowExpansion<Person>(() => ({
          expandedKeys: expanded.value,
          onToggle: () => {},
          getRowKey: person => person.id,
          renderExpanded: person => h('p', person.name),
          getIsItemExpandable: person => person.id !== '2',
        }))
        return { people, columns, plugins: { expansion } }
      },
      template: '<Table :data="people" :columns="columns" :plugins="plugins" id-key="id" density="compact" />',
    }))
    await nextTick()
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].findAll('td').every(cell => cell.attributes('data-row-menu') === '')).toBe(true)
    expect(rows[1].findAll('td').some(cell => cell.attributes('data-row-menu') != null)).toBe(false)
    expect(rule('.astryx-table td[data-row-menu]')).toContain('+ 1px')
  })
})
