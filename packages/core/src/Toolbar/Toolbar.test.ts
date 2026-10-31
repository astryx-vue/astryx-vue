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
    expect(css).toContain('.astryx-toolbar__slot:has(> [data-astryx-edge-comp]:last-child)')
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
})
