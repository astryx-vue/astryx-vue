import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { byRole, queryByRole } from '../../test-support/a11y.js'
import { stubResizeObserver } from '../../test-support/chart.js'
import { mountSankey } from '../../test-support/sankey.js'
import { useSankey } from './context.js'

afterEach(() => vi.unstubAllGlobals())

describe('sankeyChart accessibility', () => {
  it('makes a horizontally scrolling chart keyboard focusable and names both regions', () => {
    const wrapper = mountSankey({ width: 300, minColumnWidth: 400, label: 'Traffic flow' })
    expect(byRole('group', 'Traffic flow', wrapper.element).getAttribute('tabindex')).toBe('0')
    expect(byRole('img', 'Traffic flow', wrapper.element)).not.toBeNull()
    wrapper.unmount()
  })

  it('does not add a scroll region when all columns fit', () => {
    const wrapper = mountSankey({ minColumnWidth: 50 })
    expect(queryByRole('group', wrapper.element)).toBeNull()
    expect(byRole('img', 'Sankey chart', wrapper.element)).not.toBeNull()
    wrapper.unmount()
  })

  it('mirrors flows into a visually hidden table with node labels', () => {
    const wrapper = mountSankey({ label: 'Traffic flow' })
    expect(byRole('columnheader', 'From', wrapper.element)).not.toBeNull()
    expect(byRole('columnheader', 'To', wrapper.element)).not.toBeNull()
    expect(byRole('columnheader', 'Value', wrapper.element)).not.toBeNull()
    expect(byRole('rowheader', 'A', wrapper.element)).not.toBeNull()
    expect(byRole('rowheader', 'B', wrapper.element)).not.toBeNull()
    const table = byRole('table', undefined, wrapper.element)
    expect(table.parentElement?.hasAttribute('hidden')).toBe(false)
    wrapper.unmount()
  })

  it('omits the table above 100 links', () => {
    const nodes = Array.from({ length: 102 }, (_, index) => ({ id: `n${index}`, label: `N${index}`, value: 1 }))
    const links = Array.from({ length: 101 }, (_, index) => ({ source: `n${index}`, target: `n${index + 1}`, value: 1 }))
    const wrapper = mountSankey({ nodes, links, minColumnWidth: 5 })
    expect(queryByRole('table', wrapper.element)).toBeNull()
    wrapper.unmount()
  })
})

describe('sankeyChart sizing', () => {
  it('reserves height before measurement and renders after ResizeObserver reports width', async () => {
    const observer = stubResizeObserver()
    const wrapper = mountSankey({ width: 0 })
    expect(wrapper.element.querySelector('svg')).toBeNull()
    expect((wrapper.element as HTMLElement).style.height).toBe('320px')
    await observer.reportWidth(600)
    expect(byRole('img', 'Sankey chart', wrapper.element).getAttribute('width')).toBe('600')
    wrapper.unmount()
  })

  it('uses explicit dimensions for SSR and deterministic rendering', () => {
    const wrapper = mountSankey({ width: 640, height: 280 })
    const svg = byRole('img', undefined, wrapper.element)
    expect(svg.getAttribute('width')).toBe('640')
    expect(svg.getAttribute('height')).toBe('280')
    wrapper.unmount()
  })
})

describe('useSankey', () => {
  it('throws when used outside SankeyChart', () => {
    const Probe = defineComponent({
      setup() {
        useSankey()
        return () => null
      },
    })
    expect(() => mount(Probe)).toThrow('Sankey components must be used inside <SankeyChart>')
  })
})
