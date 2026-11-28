import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { TypeaheadListboxMenuSlotProps } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Tokenizer from '../Tokenizer/Tokenizer.vue'
import BaseTypeahead from './BaseTypeahead.vue'
import Typeahead from './Typeahead.vue'

const fruits: SearchableItem[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'apricot', label: 'Apricot' },
  { id: 'banana', label: 'Banana' },
]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function press(target: Element): void {
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
  target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, composed: true }))
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }))
}

describe('typeahead 菜单：listbox 角色', () => {
  it('菜单插槽在结果列表周围放信息，列表仍是唯一的 listbox', async () => {
    const wrapper = mount(Typeahead, {
      attachTo: document.body,
      props: { label: 'Fruit', searchSource: createStaticSource(fruits), debounceMs: 0, menu: { role: 'listbox' } },
      slots: {
        menu: ({ listbox, query }: TypeaheadListboxMenuSlotProps) => [h('div', { id: 'header' }, `Results for ${query}`), h(listbox), h('div', { id: 'footer' }, 'Arrow keys move')],
      },
    })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('ap')
    await flush()
    const listboxes = document.querySelectorAll('[role="listbox"]')
    expect(listboxes).toHaveLength(1)
    const listbox = listboxes[0]!
    const header = document.getElementById('header')!
    expect(header.textContent).toBe('Results for ap')
    expect(listbox.contains(header)).toBe(false)
    expect(input.attributes('aria-controls')).toBe(listbox.id)

    await input.trigger('keydown', { key: 'ArrowDown' })
    const active = document.getElementById(input.attributes('aria-activedescendant') ?? '')
    expect(active?.textContent).toContain('Apricot')
    expect(listbox.contains(active)).toBe(true)
    wrapper.unmount()
  })

  it('开发期：列表外面放了可操作的控件时警告', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Typeahead, {
      attachTo: document.body,
      props: { label: 'Fruit', searchSource: createStaticSource(fruits), debounceMs: 0, menu: { role: 'listbox' } },
      slots: { menu: ({ listbox }: TypeaheadListboxMenuSlotProps) => [h(listbox), h('button', { type: 'button' }, 'Create')] },
    })
    await wrapper.get('input[role="combobox"]').setValue('ap')
    await flush()
    expect(warn.mock.calls.flat().join(' ')).toContain('outside the result list')
    wrapper.unmount()
  })
})

const Editor = defineComponent({
  props: { removeOpener: Boolean },
  setup(props) {
    const typeahead = ref<{ open: () => void, close: () => void } | null>(null)
    const openerShown = ref(true)
    const opens = ref<boolean[]>([])
    return () => [
      openerShown.value
        ? h('button', {
            type: 'button',
            id: 'opener',
            onClick: () => {
              if (props.removeOpener)
                openerShown.value = false
              typeahead.value?.open()
            },
          }, 'Status: is Open')
        : null,
      h(Typeahead, {
        ref: typeahead,
        label: 'Filters',
        searchSource: createStaticSource(fruits),
        debounceMs: 0,
        showOnFocus: true,
        menu: { role: 'dialog', label: 'Status' },
        onOpenChange: (isOpen: boolean) => opens.value.push(isOpen),
      }, {
        menu: ({ close }: { close: () => void }) => [h('input', { 'aria-label': 'Value', 'value': 'Open' }), h('button', { type: 'button', id: 'cancel', onClick: close }, 'Cancel')],
      }),
      h('p', { id: 'elsewhere' }, 'Elsewhere'),
      h('output', { id: 'opens' }, JSON.stringify(opens.value)),
    ]
  },
})

function dialog(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[role="dialog"]')
}

function isShown(element: HTMLElement | null): boolean {
  return element != null && element.style.display !== 'none'
}

describe('typeahead 菜单：dialog 角色', () => {
  it('由 open() 打开，带名字的 dialog 拿走焦点，输入框指向它', async () => {
    const wrapper = mount(Editor, { attachTo: document.body })
    document.getElementById('opener')!.click()
    await flush()
    const popup = dialog()!
    expect(popup.getAttribute('aria-label')).toBe('Status')
    expect(isShown(popup)).toBe(true)
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('aria-haspopup')).toBe('dialog')
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(input.attributes('aria-controls')).toBe(popup.id)
    expect(input.attributes('aria-activedescendant')).toBeUndefined()
    expect(popup.contains(document.activeElement)).toBe(true)
    expect(document.getElementById('opens')!.textContent).toBe('[true]')
    wrapper.unmount()
  })

  it('escape 把焦点还给打开它时的元素', async () => {
    const wrapper = mount(Editor, { attachTo: document.body })
    const opener = document.getElementById('opener')!
    opener.focus()
    opener.click()
    await flush()
    expect(dialog()!.contains(document.activeElement)).toBe(true)
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flush()
    expect(isShown(dialog())).toBe(false)
    expect(document.activeElement).toBe(opener)
    wrapper.unmount()
  })

  it('打开它的元素没了，焦点回到输入框', async () => {
    const wrapper = mount(Editor, { attachTo: document.body, props: { removeOpener: true } })
    document.getElementById('opener')!.focus()
    document.getElementById('opener')!.click()
    await flush()
    document.getElementById('cancel')!.click()
    await flush()
    expect(document.activeElement).toBe(wrapper.get('input[role="combobox"]').element)
    wrapper.unmount()
  })

  it('点在字段和菜单之外关闭，点在里面保持打开', async () => {
    const wrapper = mount(Editor, { attachTo: document.body })
    document.getElementById('opener')!.click()
    await flush()
    press(dialog()!.querySelector('input')!)
    await flush()
    expect(isShown(dialog())).toBe(true)
    press(document.getElementById('elsewhere')!)
    await flush()
    expect(isShown(dialog())).toBe(false)
    wrapper.unmount()
  })

  it('只能从 open() 打开：输入、聚焦、方向键都不开', async () => {
    const wrapper = mount(Editor, { attachTo: document.body })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await input.setValue('ap')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(isShown(dialog())).toBe(false)
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('输入框清空或失去焦点，菜单仍然开着', async () => {
    const wrapper = mount(Editor, { attachTo: document.body })
    document.getElementById('opener')!.click()
    await flush()
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('ap')
    await input.setValue('')
    await input.trigger('blur')
    await flush()
    expect(isShown(dialog())).toBe(true)
    wrapper.unmount()
  })

  it('在 change 里 open()：这次选择之后菜单换成 dialog 并保持打开', async () => {
    const menu = ref<{ role: 'listbox' } | { role: 'dialog', label: string }>({ role: 'listbox' })
    const typeahead = ref<{ open: () => void } | null>(null)
    const host = defineComponent({
      setup: () => () => h(Typeahead, {
        ref: typeahead,
        label: 'Fruit',
        searchSource: createStaticSource(fruits),
        debounceMs: 0,
        showOnFocus: true,
        menu: menu.value,
        onChange: () => {
          menu.value = { role: 'dialog', label: 'Details' }
          typeahead.value?.open()
        },
      }, { menu: ({ listbox }: { listbox?: never }) => listbox ? h(listbox) : h('button', { type: 'button', id: 'inside' }, 'Details') }),
    })
    const wrapper = mount(host, { attachTo: document.body })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    document.querySelectorAll<HTMLElement>('[role="option"]')[1]!.click()
    await flush()
    const popup = dialog()!
    expect(popup.getAttribute('aria-label')).toBe('Details')
    expect(isShown(popup)).toBe(true)
    expect(popup.contains(document.activeElement)).toBe(true)
    wrapper.unmount()
  })

  it('在 change 里 open() 而角色仍是 listbox：没有聚焦清单时列表收起，焦点在输入框', async () => {
    const typeahead = ref<{ open: () => void } | null>(null)
    const host = defineComponent({
      setup: () => () => h(Typeahead, {
        ref: typeahead,
        label: 'Fruit',
        searchSource: createStaticSource(fruits),
        debounceMs: 0,
        showOnFocus: false,
        onChange: () => typeahead.value?.open(),
      }),
    })
    const wrapper = mount(host, { attachTo: document.body })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('ap')
    await flush()
    document.querySelectorAll<HTMLElement>('[role="option"]')[0]!.click()
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(input.element)
    wrapper.unmount()
  })
})

describe('menu 的转发', () => {
  it('baseTypeahead 单独使用也有 menu 和 open()', async () => {
    const wrapper = mount(BaseTypeahead, {
      attachTo: document.body,
      props: { label: 'Command', searchSource: createStaticSource(fruits), debounceMs: 0, menu: { role: 'dialog', label: 'Panel' } },
      slots: { menu: () => h('button', { type: 'button' }, 'Inside') },
    })
    ;(wrapper.vm as unknown as { open: () => void }).open()
    await flush()
    expect(dialog()?.getAttribute('aria-label')).toBe('Panel')
    wrapper.unmount()
  })

  it('tokenizer 转发 menu、openChange 和 open()', async () => {
    const wrapper = mount(Tokenizer, {
      attachTo: document.body,
      props: { label: 'People', searchSource: createStaticSource(fruits), debounceMs: 0, menu: { role: 'dialog', label: 'Filters' } },
      slots: { menu: ({ close }: { close: () => void }) => h('button', { type: 'button', id: 'close', onClick: close }, 'Close') },
    })
    ;(wrapper.vm as unknown as { open: () => void }).open()
    await flush()
    const popup = dialog()!
    expect(popup.getAttribute('aria-label')).toBe('Filters')
    expect(wrapper.get('input[role="combobox"]').attributes('aria-haspopup')).toBe('dialog')
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([true])
    document.getElementById('close')!.click()
    await flush()
    expect(isShown(dialog())).toBe(false)
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('tokenizer 的 dialog 菜单不会被输入或聚焦打开', async () => {
    const wrapper = mount(Tokenizer, {
      attachTo: document.body,
      props: { label: 'People', searchSource: createStaticSource(fruits), debounceMs: 0, showOnFocus: true, menu: { role: 'dialog', label: 'Filters' } },
      slots: { menu: () => h('span', 'x') },
    })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await input.setValue('ap')
    await flush()
    expect(isShown(dialog())).toBe(false)
    wrapper.unmount()
  })
})
