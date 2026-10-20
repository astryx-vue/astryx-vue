import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Card from '../Card/Card.vue'
import CodeBlock from '../Code/CodeBlock.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import Table from '../Table/Table.vue'

const mocks = vi.hoisted(() => ({
  instances: new Map<HTMLElement, unknown>(),
  viewports: [] as HTMLElement[],
}))

vi.mock('overlayscrollbars', () => ({
  OverlayScrollbars: vi.fn((target: HTMLElement | { target: HTMLElement }) => {
    if (target instanceof HTMLElement)
      return mocks.instances.get(target)
    const element = target.target
    const instance = {
      options: vi.fn(),
      destroy: vi.fn(() => mocks.instances.delete(element)),
    }
    mocks.instances.set(element, instance)
    mocks.viewports.push(element)
    return instance
  }),
}))

const { default: ScrollbarsProvider } = await import('./ScrollbarsProvider.vue')

enableAutoUnmount(afterEach)

beforeEach(() => {
  mocks.instances.clear()
  mocks.viewports.length = 0
})

afterEach(() => {
  document.body.innerHTML = ''
})

function inProvider(child: () => ReturnType<typeof h>) {
  return defineComponent({
    setup: () => () => h(ScrollbarsProvider, null, { default: child }),
  })
}

function viewportsWithClass(className: string): HTMLElement[] {
  return mocks.viewports.filter(element => element.classList.contains(className))
}

const columns = [{ key: 'name', header: 'Name' }]
const rows = [{ id: '1', name: 'Ada' }]

describe('scrollbars integration inside a provider', () => {
  it('takes over the dropdown menu surface', async () => {
    mount(inProvider(() => h(DropdownMenu, { items: [{ label: 'Edit' }] })), { attachTo: document.body })
    await nextTick()

    const surface = document.querySelector<HTMLElement>('.astryx-dropdown-menu')!
    expect(viewportsWithClass('astryx-dropdown-menu')).toEqual([surface])
  })

  it('takes over the table scroll area', async () => {
    mount(inProvider(() => h(Table, { data: rows, columns, idKey: 'id' })), { attachTo: document.body })
    await nextTick()

    const scroll = document.querySelector<HTMLElement>('.astryx-table-scroll')!
    expect(viewportsWithClass('astryx-table-scroll')).toEqual([scroll])
  })

  it('takes over the code block scroller', async () => {
    mount(inProvider(() => h(CodeBlock, { code: 'const a = 1', language: 'javascript' })), { attachTo: document.body })
    await nextTick()

    const scroll = document.querySelector<HTMLElement>('.astryx-code-block__scroll')!
    expect(viewportsWithClass('astryx-code-block__scroll')).toEqual([scroll])
  })

  it('takes over a card only when it has a fixed height', async () => {
    mount(inProvider(() => h('div', [
      h(Card, { class: 'fixed', height: 200 }),
      h(Card, { class: 'auto' }),
    ])), { attachTo: document.body })
    await nextTick()

    const fixed = document.querySelector<HTMLElement>('.astryx-card.fixed')!
    expect(viewportsWithClass('astryx-card')).toEqual([fixed])
  })
})

describe('scrollbars integration without a provider', () => {
  it('never calls OverlayScrollbars', async () => {
    const { OverlayScrollbars } = await import('overlayscrollbars')
    vi.mocked(OverlayScrollbars).mockClear()

    mount(defineComponent({
      setup: () => () => h('div', [
        h(DropdownMenu, { items: [{ label: 'Edit' }] }),
        h(Table, { data: rows, columns, idKey: 'id' }),
        h(CodeBlock, { code: 'const a = 1', language: 'javascript' }),
        h(Card, { height: 200 }),
      ]),
    }), { attachTo: document.body })
    await nextTick()

    expect(OverlayScrollbars).not.toHaveBeenCalled()
    expect(mocks.viewports).toHaveLength(0)
  })
})
