import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Button from '../Button/Button.vue'
import BottomSheet from './BottomSheet.vue'
import BottomSheetSwitcher from './BottomSheetSwitcher.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

/** 列表里一行带提示的按钮；行没了就换成一段空状态，和列表在同一个父元素里。 */
function listOrEmpty(rows: { value: string[] }): () => unknown {
  return () => h('div', { class: 'host' }, [
    rows.value.length > 0
      ? h('ul', rows.value.map(row => h('li', { key: row }, [h(Button, { label: `Remove ${row}`, isIconOnly: true, icon: 'close', tooltip: `Remove ${row}` })])))
      : h('p', { class: 'empty' }, 'No filters'),
  ])
}

const tooltips = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>('[role="tooltip"]')]

describe('bottom sheet layer host', () => {
  it('mounts a button tooltip in the sheet\'s own layer host, outside the dragged panel', async () => {
    const rows = ref(['ada'])
    mount(defineComponent(() => () => h(BottomSheet, { isOpen: true, label: 'Filters' }, { default: listOrEmpty(rows) })), { attachTo: document.body })
    await flushPromises()
    expect(tooltips()).toHaveLength(1)
    expect(tooltips()[0]!.parentElement?.classList.contains('astryx-bottom-sheet__layer-host')).toBe(true)
    expect(tooltips()[0]!.closest('.astryx-bottom-sheet')).toBeNull()
  })

  it('swaps a list of tooltip buttons for its empty state without losing the insertion point', async () => {
    const rows = ref([{ id: 'ada', editable: true }])
    const errors: unknown[] = []
    const Content = defineComponent({
      components: { Button },
      setup: () => ({ rows }),
      template: `
        <div class="host">
          <p v-if="rows.length === 0" class="empty">No filters</p>
          <ul v-else>
            <li v-for="row in rows" :key="row.id">
              {{ row.id }}
              <Button v-if="row.editable" label="Remove" is-icon-only icon="close" tooltip="Remove" />
            </li>
          </ul>
        </div>
      `,
    })
    mount(defineComponent(() => () => h(BottomSheet, { isOpen: true, label: 'Filters' }, { default: () => h(Content) })), {
      attachTo: document.body,
      global: { config: { errorHandler: error => errors.push(error) } },
    })
    await flushPromises()
    rows.value = []
    await flushPromises()
    expect(errors).toEqual([])
    expect(document.querySelector('.host .empty')?.textContent).toBe('No filters')
    expect(tooltips()).toHaveLength(0)
  })

  it('gives sheets in a switcher the switcher\'s layer host', async () => {
    const rows = ref(['ada'])
    mount(defineComponent(() => () => h(BottomSheetSwitcher, { activeSheet: 'filters', label: 'Search' }, {
      default: () => h(BottomSheet, { sheetId: 'filters', label: 'Filters' }, { default: listOrEmpty(rows) }),
    })), { attachTo: document.body })
    await flushPromises()
    expect(tooltips()[0]?.parentElement?.closest('dialog')?.classList.contains('astryx-bottom-sheet-switcher')).toBe(true)
    expect(tooltips()[0]!.parentElement?.classList.contains('astryx-bottom-sheet__layer-host')).toBe(true)
  })
})
