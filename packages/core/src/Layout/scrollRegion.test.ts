import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import StackItem from '../Stack/StackItem.vue'
import LayoutContent from './LayoutContent.vue'
import LayoutPanel from './LayoutPanel.vue'

function stubOverflow(element: HTMLElement, overflows: boolean): void {
  const box = { clientWidth: 200, clientHeight: 100, scrollWidth: 200, scrollHeight: overflows ? 400 : 100, scrollTop: 0, scrollLeft: 0 }
  for (const key of Object.keys(box) as (keyof typeof box)[])
    Object.defineProperty(element, key, { configurable: true, get: () => box[key] })
  element.style.overflowX = 'auto'
  element.style.overflowY = 'auto'
}

async function remeasure(): Promise<void> {
  window.dispatchEvent(new Event('resize'))
  await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('scrolling regions are named while they overflow', () => {
  it.each([
    ['LayoutContent', LayoutContent],
    ['LayoutPanel', LayoutPanel],
  ])('%s is a group named "Content" while its content overflows', async (_name, component) => {
    const wrapper = mount(component, { attachTo: document.body, slots: { default: () => h('div', 'Body') } })
    const element = wrapper.element as HTMLElement
    expect(element.getAttribute('role')).toBeNull()
    expect(element.getAttribute('aria-label')).toBeNull()

    stubOverflow(element, true)
    await remeasure()
    expect(element.getAttribute('role')).toBe('group')
    expect(element.getAttribute('aria-label')).toBe('Content')

    stubOverflow(element, false)
    await remeasure()
    expect(element.getAttribute('role')).toBeNull()
    expect(element.getAttribute('aria-label')).toBeNull()
  })

  it('the caller label names the group; a caller role keeps its own, with only the caller label', async () => {
    const labelled = mount(LayoutContent, { attachTo: document.body, props: { label: 'Results' }, slots: { default: () => h('div', 'Body') } })
    stubOverflow(labelled.element as HTMLElement, true)
    await remeasure()
    expect(labelled.element.getAttribute('role')).toBe('group')
    expect(labelled.element.getAttribute('aria-label')).toBe('Results')

    const landmark = mount(LayoutContent, { attachTo: document.body, props: { role: 'main' }, slots: { default: () => h('div', 'Body') } })
    stubOverflow(landmark.element as HTMLElement, true)
    await remeasure()
    expect(landmark.element.getAttribute('role')).toBe('main')
    expect(landmark.element.getAttribute('aria-label')).toBeNull()
  })

  it('a scrollable StackItem is named; a fitting or non-scrollable one is untouched', async () => {
    const scrollable = mount(StackItem, { attachTo: document.body, props: { isScrollable: true }, slots: { default: () => h('div', 'Body') } })
    stubOverflow(scrollable.element as HTMLElement, true)
    await remeasure()
    expect(scrollable.element.getAttribute('role')).toBe('group')
    expect(scrollable.element.getAttribute('aria-label')).toBe('Content')

    const fixed = mount(StackItem, { attachTo: document.body, slots: { default: () => h('div', 'Body') } })
    stubOverflow(fixed.element as HTMLElement, true)
    await remeasure()
    expect(fixed.element.getAttribute('role')).toBeNull()
  })
})
