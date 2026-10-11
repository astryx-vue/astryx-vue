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
    const toolbar = wrapper.get('[role="toolbar"]')
    expect(toolbar.classes()).toContain('astryx-toolbar--muted')
    expect(toolbar.classes()).toContain('astryx-toolbar--divider-bottom')
  })
})
