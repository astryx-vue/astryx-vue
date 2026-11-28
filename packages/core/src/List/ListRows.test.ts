import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Item from './Item.vue'
import List from './List.vue'
import ListItem from './ListItem.vue'

const listCss = readFileSync(resolve(process.cwd(), 'packages/core/styles/list.css'), 'utf8')

function cssRule(selector: string): string {
  const start = listCss.indexOf(selector)
  expect(start, `css rule ${selector}`).toBeGreaterThan(-1)
  return listCss.slice(start, listCss.indexOf('}', start))
}

describe('row touch target', () => {
  it('gives an actionable, enabled row the touch band and raises it inside a list', () => {
    const wrapper = mount(List, {
      slots: {
        default: () => [
          h(ListItem, { label: 'Action', onClick: () => {} }),
          h(ListItem, { label: 'Link', href: '/a' }),
          h(ListItem, { label: 'Static' }),
          h(ListItem, { label: 'Off', onClick: () => {}, isDisabled: true }),
        ],
      },
    })
    const classes = wrapper.findAll('.astryx-list-item').map(row => row.classes().includes('astryx-touch-hit-area-band'))
    expect(classes).toEqual([true, true, false, false])
    expect(cssRule('.astryx-list > .astryx-list-item.astryx-touch-hit-area-band::after')).toContain('z-index: 1')
  })

  it('forwards a click on the link row\'s own box to its link only for a coarse pointer or the band', () => {
    const wrapper = mount(List, {
      attachTo: document.body,
      slots: { default: () => h(ListItem, { label: 'Link', href: '/a' }) },
    })
    const row = wrapper.get<HTMLElement>('.astryx-list-item').element
    const anchor = wrapper.get<HTMLAnchorElement>('a.astryx-item__content').element
    const onAnchor = vi.fn((event: Event) => event.preventDefault())
    anchor.addEventListener('click', onAnchor)
    row.getBoundingClientRect = () => ({ left: 10, top: 10, right: 110, bottom: 30, width: 100, height: 20, x: 10, y: 10, toJSON: () => ({}) })

    row.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, clientX: 50, clientY: 20 }))
    expect(onAnchor).not.toHaveBeenCalled()

    row.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, clientX: 5, clientY: 20, ctrlKey: true }))
    expect(onAnchor).toHaveBeenCalledTimes(1)
    expect((onAnchor.mock.calls[0]![0] as MouseEvent).ctrlKey).toBe(true)

    row.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0, clientX: 5, clientY: 20 }))
    expect(onAnchor).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})

describe('selected row interaction paint', () => {
  it('layers hover and press over a selected row\'s fill instead of replacing it', () => {
    expect(listCss).toContain('.astryx-item[data-interactive=\'true\'][data-selected=\'true\']:not([data-disabled=\'true\']):hover')
    expect(listCss).toContain('.astryx-item[data-interactive=\'true\'][data-selected=\'true\']:not([data-disabled=\'true\']):active')
    expect(cssRule('.astryx-item[data-astryx-press]:not([data-disabled=\'true\'])')).toContain('background-image: var(--_press-paint-image)')
  })
})

describe('numbered list columns', () => {
  it('puts a numbered row\'s content in one cell beside the marker so rows share a marker column', () => {
    const numbered = mount(List, {
      props: { listStyle: 'decimal' },
      slots: { default: () => [h(ListItem, { label: 'One' }), h(ListItem, { label: 'Two', swipeActions: { trailing: [{ label: 'Del', onActivate: () => {} }] } })] },
    })
    const rows = numbered.findAll('.astryx-list-item')
    expect(rows[0]!.find(':scope > .astryx-item__marker-content').exists()).toBe(true)
    expect(rows[0]!.find('.astryx-item__marker-content .astryx-item__content').exists()).toBe(true)
    expect(rows[1]!.find(':scope > .astryx-item__marker-content').exists()).toBe(true)

    const bullets = mount(List, { props: { listStyle: 'disc' }, slots: { default: () => h(ListItem, { label: 'One' }) } })
    expect(bullets.find('.astryx-item__marker-content').exists()).toBe(false)
    const plain = mount(List, { slots: { default: () => h(ListItem, { label: 'One' }) } })
    expect(plain.find('.astryx-item__marker-content').exists()).toBe(false)
    expect(listCss).toContain('grid-template-columns: subgrid')
    expect(cssRule('.astryx-list-marker__number {')).toContain('font-variant-numeric: tabular-nums')
  })
})

describe('bleed list corners', () => {
  it('takes the rounded container corner on the first and last row, less the block padding', () => {
    expect(listCss).toMatch(/\.astryx-card, \.astryx-dialog__inner\) > \.astryx-list\[data-edge='bleed'\]:first-child > \.astryx-list-item:first-child \{\s*border-start-start-radius: max\(0px, var\(--_container-corner-block-start, 0px\) - var\(--container-padding-block-start, 0px\)\)/)
    expect(listCss).toMatch(/border-end-end-radius: max\(0px, var\(--_container-corner-block-end, 0px\) - var\(--container-padding-block-end, 0px\)\)/)
  })
})

describe('selected row aria-current', () => {
  it('puts the marker on the element that takes focus in an interactive row', () => {
    const button = mount(Item, { props: { label: 'Row', isSelected: true, onClick: () => {} } })
    expect(button.attributes('aria-current')).toBeUndefined()
    expect(button.get('button.astryx-item__content').attributes('aria-current')).toBe('true')

    const link = mount(Item, { props: { label: 'Row', isSelected: true, href: '/a' } })
    expect(link.attributes('aria-current')).toBeUndefined()
    expect(link.get('a.astryx-item__content').attributes('aria-current')).toBe('true')

    const stat = mount(Item, { props: { label: 'Row', isSelected: true } })
    expect(stat.attributes('aria-current')).toBe('true')

    const custom = mount(Item, { props: { label: 'Row', onClick: () => {} }, attrs: { 'aria-current': 'page' } })
    expect(custom.get('button.astryx-item__content').attributes('aria-current')).toBe('page')
  })

  it('marks the delegated control while selected and removes only what the row wrote', async () => {
    const input = document.createElement('input')
    const wrapper = mount(Item, { props: { label: 'Row', isSelected: true, interactiveRef: () => input } })
    await wrapper.vm.$nextTick()
    expect(input.getAttribute('aria-current')).toBe('true')
    await wrapper.setProps({ isSelected: false })
    expect(input.hasAttribute('aria-current')).toBe(false)

    const own = document.createElement('input')
    own.setAttribute('aria-current', 'page')
    mount(Item, { props: { label: 'Row', isSelected: true, interactiveRef: () => own } })
    expect(own.getAttribute('aria-current')).toBe('page')
  })
})
