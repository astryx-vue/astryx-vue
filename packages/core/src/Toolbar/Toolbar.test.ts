import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Toolbar from './Toolbar.vue'

describe('toolbar', () => {
  it('uses a toolbar landmark and moves focus across the groups', async () => {
    const wrapper = mount(Toolbar, {
      attachTo: document.body,
      props: { label: 'Editor' },
      slots: {
        end: () => h('button', { type: 'button' }, 'Share'),
        start: () => [
          h('button', { type: 'button' }, 'Bold'),
          h('button', { type: 'button' }, 'Italic'),
        ],
      },
    })
    await nextTick()
    const toolbar = wrapper.get('[role="toolbar"]')
    expect(toolbar.attributes('aria-label')).toBe('Editor')
    const buttons = wrapper.findAll('button')
    expect(buttons[0].attributes('tabindex')).toBe('0')
    expect(buttons[2].attributes('tabindex')).toBe('-1')

    buttons[0].element.focus()
    await buttons[0].trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons[1].element)

    await buttons[1].trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(buttons[2].element)
    wrapper.unmount()
  })

  it('keeps one Tab stop for a toolbar of disabled Buttons', async () => {
    const { default: Button } = await import('../Button/Button.vue')
    const wrapper = mount(Toolbar, {
      attachTo: document.body,
      props: { label: 'Read-only editor' },
      slots: {
        start: () => [
          h(Button, { isDisabled: true, label: 'Bold' }),
          h(Button, { isDisabled: true, label: 'Italic' }),
        ],
      },
    })
    await nextTick()
    expect(wrapper.findAll('button').map(button => button.attributes('tabindex'))).toEqual(['0', '-1'])
    wrapper.unmount()
  })

  it('paints a muted bar and the requested dividers', () => {
    const wrapper = mount(Toolbar, {
      props: { dividers: ['bottom'], label: 'Bulk actions', variant: 'muted' },
      slots: { start: () => h('button', { type: 'button' }, 'Delete') },
    })
    const inner = wrapper.get('.astryx-section__inner')
    expect(inner.attributes('data-variant')).toBe('muted')
    expect(inner.attributes('data-divider-bottom')).toBeDefined()
  })

  it('wraps the toolbar in a Section that carries the block padding, as the original does', () => {
    const wrapper = mount(Toolbar, {
      props: { label: 'Actions' },
      slots: { start: () => h('button', { type: 'button' }, 'Go') },
    })
    const inner = wrapper.get('.astryx-section__inner')
    expect(inner.attributes('style')).toContain('--_section-block-start: var(--astryx-spacing-2')
    expect(inner.attributes('style')).toContain('--_section-block-end: var(--astryx-spacing-2')
    expect(inner.find('[role="toolbar"]').exists()).toBe(true)
  })

  it('pulls a slot back by the edge inset when its edge child is a flat button', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/toolbar.css'), 'utf8')
    expect(css).toContain('.astryx-toolbar__slot:has(> [data-astryx-edge-comp]:first-child)')
    expect(css).toContain('.astryx-toolbar__slot:has(> [data-astryx-edge-comp]:last-child:not([data-astryx-has-layer]))')
    expect(css).toContain('--_edge-comp-inset: calc(var(--container-padding-inline-start, var(--astryx-spacing-4, 16px)) - var(--astryx-spacing-2, 8px))')
  })

  it('does not clip the center slot', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/toolbar.css'), 'utf8')
    const rule = css.slice(css.indexOf('.astryx-toolbar__slot--center'), css.indexOf('.astryx-toolbar__slot--end'))
    expect(rule).not.toMatch(/overflow\s*:/)
    expect(rule).toContain('min-width: 0')
  })

  it('keeps arrow keys inside the toolbar that owns them', async () => {
    const wrapper = mount(Toolbar, {
      attachTo: document.body,
      props: { label: 'Outer' },
      slots: {
        start: () => [
          h('button', { type: 'button' }, 'Outer'),
          h(Toolbar, { label: 'Inner' }, {
            start: () => h('button', { type: 'button' }, 'Inner'),
          }),
        ],
      },
    })
    await nextTick()
    const outer = wrapper.get('[aria-label="Outer"]')
    const buttons = wrapper.findAll('button')
    buttons[0].element.focus()
    await outer.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons[0].element)
    expect(document.activeElement?.textContent).toBe('Outer')
    wrapper.unmount()
  })

  it.each([
    ['start and end lanes', { start: true, end: true }, {}, true],
    ['a start lane only', { start: true }, {}, false],
    ['a center lane', { start: true, center: true, end: true }, {}, false],
    ['a vertical toolbar', { start: true, end: true }, { orientation: 'vertical' as const }, false],
  ])('lets %s wrap the end lane onto the next line: %#', (_name, lanes, props, wraps) => {
    const slots = Object.fromEntries(
      Object.keys(lanes).map(lane => [lane, () => h('button', { type: 'button' }, lane)]),
    )
    const wrapper = mount(Toolbar, { props: { label: 'Board', ...props }, slots })

    expect(wrapper.get('.astryx-toolbar').classes('astryx-toolbar--two-lane')).toBe(wraps)
  })

  it('wraps two lanes as a row and keeps each lane on one line while it fits', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/toolbar.css'), 'utf8')
    const rule = (selector: string): string => {
      const at = css.lastIndexOf(`${selector} {`)
      expect(at, selector).toBeGreaterThan(-1)
      return css.slice(at, css.indexOf('}', at))
    }

    expect(rule('.astryx-toolbar--two-lane')).toContain('flex-wrap: wrap')
    expect(rule('.astryx-toolbar--two-lane > .astryx-toolbar__slot--end')).toContain('flex-grow: 1')
    expect(css).toMatch(/\.astryx-toolbar--two-lane > \.astryx-toolbar__slot--start,\s*\.astryx-toolbar--two-lane > \.astryx-toolbar__slot--end \{[^}]*min-width: fit-content/)
  })
})
