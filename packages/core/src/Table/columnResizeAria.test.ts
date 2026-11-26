import type { TableColumn } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { pixel, proportional } from './columnUtils.js'
import { useTableColumnResize } from './plugins/columnResize.js'
import Table from './Table.vue'

const rows = [{ id: '1', name: 'Ada', amount: 3 }]

function mountTable(columns: TableColumn[], config: { maxWidth?: number, widths?: Record<string, number> } = {}) {
  return mount({
    components: { Table },
    setup() {
      const plugin = useTableColumnResize(() => ({
        columnWidths: config.widths ?? {},
        maxWidth: config.maxWidth,
        onColumnResizeEnd: () => {},
      }))
      return { rows, columns, plugin }
    },
    template: '<Table :data="rows" :columns="columns" id-key="id" :plugins="{ resize: plugin }" />',
  }, { attachTo: document.body })
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('column resize handle names', () => {
  it('is named by a node header\'s visible text, not by the column key', () => {
    const wrapper = mountTable([
      { key: 'amount', header: () => h('span', ['Amount ', h('em', '(EUR)')]), width: proportional(1) },
      { key: 'name', header: 'Name', width: proportional(1) },
    ])
    expect(wrapper.get('.astryx-table__resize').attributes('aria-label')).toBe('Resize column Amount (EUR)')
  })

  it('falls back to the key only for a header with no text', () => {
    const wrapper = mountTable([
      { key: 'amount', header: () => h('span'), width: proportional(1) },
      { key: 'name', header: 'Name', width: proportional(1) },
    ])
    expect(wrapper.get('.astryx-table__resize').attributes('aria-label')).toBe('Resize column amount')
  })

  it('keeps the handle out of its header\'s name', () => {
    const wrapper = mountTable([
      { key: 'name', header: 'Name', width: proportional(1) },
      { key: 'amount', header: 'Amount', width: proportional(1) },
    ])
    const header = wrapper.get('thead th')
    const labelledBy = header.attributes('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const target = document.getElementById(labelledBy!)
    expect(target?.textContent?.trim()).toBe('Name')
    expect(target?.contains(header.get('.astryx-table__resize').element)).toBe(false)
  })

  it('leaves a header without a handle named by its content', () => {
    const wrapper = mountTable([
      { key: 'name', header: 'Name', width: proportional(1) },
      { key: 'amount', header: 'Amount', width: proportional(1) },
    ])
    expect(wrapper.findAll('thead th')[1]?.attributes('aria-labelledby')).toBeUndefined()
  })
})

describe('column resize handle range', () => {
  it('announces the window width as an unbounded column\'s maximum, and its width in words', async () => {
    const wrapper = mountTable([
      { key: 'name', header: 'Name', width: proportional(1) },
      { key: 'amount', header: 'Amount', width: proportional(1) },
    ])
    await nextTick()
    const handle = wrapper.get('.astryx-table__resize')
    expect(handle.attributes('aria-valuemax')).toBe(String(window.innerWidth))
    expect(handle.attributes('aria-valuetext')).toBe(`${handle.attributes('aria-valuenow')} pixels`)
  })

  it('announces a bounded column\'s maximum and no value text', async () => {
    const wrapper = mountTable([
      { key: 'name', header: 'Name', width: proportional(1) },
      { key: 'amount', header: 'Amount', width: proportional(1) },
    ], { maxWidth: 400 })
    await nextTick()
    const handle = wrapper.get('.astryx-table__resize')
    expect(handle.attributes('aria-valuemax')).toBe('400')
    expect(handle.attributes('aria-valuetext')).toBeUndefined()
  })

  it('announces the width the column renders at, and widens the range to hold it', async () => {
    const original = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      const width = this.tagName === 'TH' ? 180.4 : 0
      return { x: 0, y: 0, top: 0, left: 0, right: width, bottom: 0, width, height: 0, toJSON: () => ({}) } as DOMRect
    }
    try {
      const wrapper = mountTable([
        { key: 'name', header: 'Name', width: pixel(120) },
        { key: 'amount', header: 'Amount', width: proportional(1) },
      ], { maxWidth: 150 })
      await nextTick()
      const handle = wrapper.get('.astryx-table__resize')
      expect(handle.attributes('aria-valuenow')).toBe('180')
      expect(handle.attributes('aria-valuemax')).toBe('180')
      expect(handle.attributes('aria-valuemin')).toBe('120')
    }
    finally {
      HTMLElement.prototype.getBoundingClientRect = original
    }
  })

  it('says one pixel in the singular', async () => {
    const { tableMessages } = await import('../locale/messages/table.js')
    expect(tableMessages.en.columnWidthValue(1)).toBe('1 pixel')
    expect(tableMessages.en.columnWidthValue(1203)).toBe('1,203 pixels')
  })
})
