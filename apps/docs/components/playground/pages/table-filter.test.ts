import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import TableFilter from './table-filter.vue'

function gripLabels(): string[] {
  return [...document.querySelectorAll<HTMLElement>('[aria-label^="Reorder "]')].map(el => el.getAttribute('aria-label')!.replace('Reorder ', ''))
}

async function openColumns() {
  const wrapper = mount(TableFilter, { attachTo: document.body })
  const trigger = [...document.querySelectorAll<HTMLElement>('button')].find(b => b.getAttribute('aria-label') === 'View options' || b.textContent?.trim() === 'View options')
  trigger?.click()
  await new Promise(resolve => setTimeout(resolve, 50))
  return wrapper
}

function key(el: Element, name: string) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }))
}

describe('table-filter column reordering by keyboard', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('moves a column with the arrow keys, Home and End', async () => {
    const wrapper = await openColumns()
    const before = gripLabels()
    expect(before.slice(0, 3)).toEqual(['Job', 'Customer', 'Technician'])
    const grip = () => document.querySelector<HTMLElement>('[aria-label="Reorder Customer"]')!
    key(grip(), 'ArrowDown')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(gripLabels().slice(0, 3)).toEqual(['Job', 'Technician', 'Customer'])
    key(grip(), 'Home')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(gripLabels()[0]).toBe('Customer')
    key(grip(), 'End')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(gripLabels().at(-1)).toBe('Customer')
    wrapper.unmount()
  })

  it('picks up with a click and restores the order on Escape', async () => {
    const wrapper = await openColumns()
    const original = gripLabels()
    const grip = () => document.querySelector<HTMLElement>('[aria-label="Reorder Customer"]')!
    grip().click()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(grip().getAttribute('aria-pressed')).toBe('true')
    key(grip(), 'ArrowDown')
    await new Promise(resolve => setTimeout(resolve, 0))
    key(grip(), 'Escape')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(gripLabels()).toEqual(original)
    expect(grip().getAttribute('aria-pressed')).toBe('false')
    wrapper.unmount()
  })
})

function stubMatchMedia(compact: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: compact && query.includes('max-width: 768px'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

describe('table-filter view options layout', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('keeps the rail beside the pane on a wide screen', async () => {
    stubMatchMedia(false)
    const wrapper = await openColumns()
    expect(document.querySelector('[role="tablist"]')).toBeNull()
    expect(document.querySelector('.tf-view-rail')).not.toBeNull()
    expect(document.querySelector('[role="tabpanel"]')).toBeNull()
    wrapper.unmount()
  })

  it('turns the rail into a tab strip over one shared panel on a narrow screen', async () => {
    stubMatchMedia(true)
    const wrapper = await openColumns()
    const tabs = [...document.querySelectorAll<HTMLElement>('[role="tab"]')]
    expect(tabs.map(tab => tab.dataset.tabValue)).toEqual(['columns', 'density', 'sticky', 'grouping'])
    expect(document.querySelector('.tf-view-rail')).toBeNull()

    const panel = document.querySelector<HTMLElement>('[role="tabpanel"]')!
    expect(panel.id).toBe('tf-view-panel')
    // Each tab says it controls the panel, and the panel is named by the selected tab.
    expect(tabs.every(tab => tab.getAttribute('aria-controls') === panel.id)).toBe(true)
    expect(panel.getAttribute('aria-labelledby')).toBe(tabs[0]!.id)
    expect(panel.getAttribute('aria-label')).toBeNull()

    tabs[1]!.click()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(panel.getAttribute('aria-labelledby')).toBe(tabs[1]!.id)
    expect(document.getElementById(panel.getAttribute('aria-labelledby')!)?.textContent).toContain('Density')
    // The strip already marks the section, so the pane drops its own heading.
    expect(panel.querySelector('h3')).toBeNull()
    wrapper.unmount()
  })
})
