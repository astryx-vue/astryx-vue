import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ScrollableArea from './ScrollableArea.vue'

describe('scrollable area', () => {
  it('names the viewport and keeps overflow clipped until content actually overflows', () => {
    const wrapper = mount(ScrollableArea, {
      props: { label: 'Workspace files', axis: 'block', role: 'region', height: 300, padding: 4 },
      slots: { default: '<p>Brief</p>' },
    })

    const viewport = wrapper.get('.astryx-scrollable-area')
    expect(viewport.attributes('role')).toBe('region')
    expect(viewport.attributes('aria-label')).toBe('Workspace files')
    expect(viewport.attributes('data-scroll-axis')).toBe('block')
    expect(viewport.attributes('tabindex')).toBeUndefined()
    const viewportElement = viewport.element as HTMLElement
    expect(viewportElement.style.overflowY).toBe('clip')
    expect(viewportElement.style.height).toBe('300px')
    const content = wrapper.get('[data-scroll-content]').element as HTMLElement
    expect(content.style.getPropertyValue('--_pad-block-start')).toContain('--astryx-spacing-4')
  })

  it('contains the gesture only on an effective axis', () => {
    const wrapper = mount(ScrollableArea, {
      props: { label: 'Archived', overscroll: 'contain', axis: 'inline', isFullBleed: true },
      slots: { default: '<span>Rail</span>' },
    })

    expect(wrapper.attributes('data-full-bleed')).toBe('true')
    expect(wrapper.attributes('data-axis')).toBe('inline')
    expect((wrapper.element as HTMLElement).style.overscrollBehaviorX).toBe('auto')
  })
})
