import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

  it.each([
    ['zero on every edge by default', {}, ['0px', '0px', '0px', '0px']],
    ['uniform padding on every edge', { padding: 4 }, [4, 4, 4, 4]],
    ['zero axis values over uniform', { padding: 4, paddingInline: 0, paddingBlock: 0 }, [0, 0, 0, 0]],
    ['start edges over axis over uniform', { padding: 4, paddingInline: 3, paddingBlock: 2, paddingInlineStart: 0, paddingBlockStart: 0 }, [0, 3, 0, 2]],
    ['end edges over axis over uniform', { padding: 4, paddingInline: 3, paddingBlock: 2, paddingInlineEnd: 0, paddingBlockEnd: 0 }, [3, 0, 2, 0]],
  ] as [string, Record<string, unknown>, (string | number)[]][])('publishes %s', (_name, props, edges) => {
    const wrapper = mount(ScrollableArea, { props: { label: 'Messages', ...props } as never, slots: { default: 'Messages' } })
    const content = wrapper.get('[data-scroll-content]').element as HTMLElement
    const names = ['--_pad-inline-start', '--_pad-inline-end', '--_pad-block-start', '--_pad-block-end']
    names.forEach((name, index) => {
      const value = content.style.getPropertyValue(name)
      const step = edges[index]
      expect(value).toContain(typeof step === 'number' ? `--astryx-spacing-${String(step).replace('.', '-')}` : step)
    })
  })

  it('leaves the platform scroll indicator on touch screens and in forced colors', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/scrollable-area.css'), 'utf8')
    expect(css).toMatch(/@media \(pointer: coarse\)\s*\{\s*\.astryx-scrollable-area\s*\{\s*scrollbar-color: auto/)
    expect(css).toMatch(/@media \(forced-colors: active\)\s*\{\s*\.astryx-scrollable-area\s*\{\s*scrollbar-color: auto/)
  })
})
