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
