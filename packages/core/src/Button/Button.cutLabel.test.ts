import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { resetInteractionModalityForTest } from '../composables/internal/interactionModality.js'
import Table from '../Table/Table.vue'
import TableHeader from '../Table/TableHeader.vue'
import TableHeaderCell from '../Table/TableHeaderCell.vue'
import TableRow from '../Table/TableRow.vue'
import ToggleButton from '../ToggleButton/ToggleButton.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import Button from './Button.vue'

enableAutoUnmount(afterEach)

let restoreWidths: () => void = () => {}

/** 让 `selector` 命中的元素量成内容比盒子宽。 */
function makeOverflow(selector: string): () => void {
  const prototype = window.HTMLElement.prototype
  const scrollWidth = Object.getOwnPropertyDescriptor(prototype, 'scrollWidth')
  const clientWidth = Object.getOwnPropertyDescriptor(prototype, 'clientWidth')
  Object.defineProperty(prototype, 'scrollWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.matches(selector) ? 500 : 100
    },
  })
  Object.defineProperty(prototype, 'clientWidth', { configurable: true, get: () => 100 })
  return () => {
    for (const [name, descriptor] of [['scrollWidth', scrollWidth], ['clientWidth', clientWidth]] as const) {
      if (descriptor)
        Object.defineProperty(prototype, name, descriptor)
      else
        delete (prototype as unknown as Record<string, unknown>)[name]
    }
  }
}

function tooltips(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[role="tooltip"]')]
}

function pressKey(key: string): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

beforeEach(() => {
  resetInteractionModalityForTest()
})

afterEach(() => {
  restoreWidths()
  restoreWidths = () => {}
  document.body.innerHTML = ''
})

describe('a Button whose label is cut short', () => {
  it('shows the full label in a tooltip on keyboard focus, adding no description', async () => {
    restoreWidths = makeOverflow('.astryx-button__label')
    const wrapper = mount(Button, { attachTo: document.body, props: { label: 'Export the quarterly report' } })
    const button = wrapper.get('button').element as HTMLElement
    expect(tooltips()).toHaveLength(0)

    pressKey('Tab')
    button.focus()
    await nextTick()

    expect(tooltips().map(tooltip => tooltip.textContent?.trim())).toEqual(['Export the quarterly report'])
    expect(button.hasAttribute('aria-describedby')).toBe(false)

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(tooltips()).toHaveLength(0)
  })

  it('closes when focus leaves', async () => {
    restoreWidths = makeOverflow('.astryx-button__label')
    const wrapper = mount(Button, { attachTo: document.body, props: { label: 'Export the quarterly report' } })
    const button = wrapper.get('button').element as HTMLElement
    pressKey('Tab')
    button.focus()
    await nextTick()
    expect(tooltips()).toHaveLength(1)

    button.blur()
    await nextTick()
    expect(tooltips()).toHaveLength(0)
  })

  it('shows nothing for a pointer focus or a label that fits', async () => {
    restoreWidths = makeOverflow('.astryx-button__label')
    const cut = mount(Button, { attachTo: document.body, props: { label: 'Export the quarterly report' } })
    const button = cut.get('button').element as HTMLElement
    button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }))
    button.focus()
    await nextTick()
    expect(tooltips()).toHaveLength(0)
    button.blur()

    restoreWidths()
    restoreWidths = makeOverflow('.nothing-overflows')
    const fits = mount(Button, { attachTo: document.body, props: { label: 'Save' } })
    pressKey('Tab')
    ;(fits.get('button').element as HTMLElement).focus()
    await nextTick()
    expect(tooltips()).toHaveLength(0)
  })

  it('leaves the tooltip to a caller Tooltip around the Button', async () => {
    restoreWidths = makeOverflow('.astryx-button__label')
    const wrapper = mount(() => h(Tooltip, { content: 'Downloads a PDF' }, () => h(Button, { label: 'Export the quarterly report' })), { attachTo: document.body })
    await nextTick()
    pressKey('Tab')
    ;(wrapper.get('button').element as HTMLElement).focus()
    await nextTick()

    expect(tooltips().map(tooltip => tooltip.textContent?.trim())).not.toContain('Export the quarterly report')
  })

  it('works for a ToggleButton, measuring the visible label only', async () => {
    restoreWidths = makeOverflow('.astryx-toggle-button__label-text')
    const wrapper = mount(ToggleButton, { attachTo: document.body, props: { label: 'Show archived projects' } })
    pressKey('Tab')
    ;(wrapper.get('button').element as HTMLElement).focus()
    await nextTick()

    expect(tooltips().map(tooltip => tooltip.textContent?.trim())).toEqual(['Show archived projects'])
  })
})

describe('a table header cell whose heading is cut short', () => {
  it('shows the full heading when keyboard focus reaches a control inside the cell', async () => {
    restoreWidths = makeOverflow('th')
    const wrapper = mount(() => h(Table, { textOverflow: 'truncate' }, () => h(TableHeader, null, () => h(TableRow, null, () => h(TableHeaderCell, null, () => [
      'Quarterly revenue by region',
      h('button', { 'type': 'button', 'aria-label': 'Sort' }),
    ])))), { attachTo: document.body })
    expect(tooltips()).toHaveLength(0)

    pressKey('Tab')
    ;(wrapper.get('th button').element as HTMLElement).focus()
    await nextTick()
    expect(tooltips().map(tooltip => tooltip.textContent?.trim())).toEqual(['Quarterly revenue by region'])
  })

  it('shows nothing where headings wrap, the default', async () => {
    restoreWidths = makeOverflow('th')
    const wrapper = mount(() => h(Table, null, () => h(TableHeader, null, () => h(TableRow, null, () => h(TableHeaderCell, null, () => [
      'Quarterly revenue by region',
      h('button', { 'type': 'button', 'aria-label': 'Sort' }),
    ])))), { attachTo: document.body })

    pressKey('Tab')
    ;(wrapper.get('th button').element as HTMLElement).focus()
    await nextTick()
    expect(tooltips()).toHaveLength(0)
  })
})
