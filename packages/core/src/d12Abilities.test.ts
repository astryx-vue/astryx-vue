import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Button from './Button/Button.vue'
import StatusDot from './StatusDot/StatusDot.vue'

describe('d12 alignment: newly wired component abilities', () => {
  describe('button icon prop', () => {
    it('renders a semantic icon name through Icon', () => {
      const wrapper = mount(Button, { props: { label: 'Save', icon: 'search' } })
      expect(wrapper.get('.astryx-button__icon').find('.astryx-icon').exists()).toBe(true)
    })

    it('renders a component icon', () => {
      const Glyph = defineComponent({ setup: () => () => h('span', { class: 'glyph-mark' }) })
      const wrapper = mount(Button, { props: { label: 'Save', icon: Glyph } })
      expect(wrapper.get('.astryx-button__icon').find('.glyph-mark').exists()).toBe(true)
    })

    it('still supports the legacy render-function form', () => {
      const wrapper = mount(Button, { props: { label: 'Save', icon: () => h('span', { class: 'fn-mark' }) } })
      expect(wrapper.get('.astryx-button__icon').find('.fn-mark').exists()).toBe(true)
    })

    it('keeps the icon slot ahead of the prop', () => {
      const wrapper = mount(Button, {
        props: { label: 'Save', icon: 'search' },
        slots: { icon: () => h('span', { class: 'slot-mark' }) },
      })
      expect(wrapper.get('.astryx-button__icon').find('.slot-mark').exists()).toBe(true)
      expect(wrapper.get('.astryx-button__icon').find('.astryx-icon').exists()).toBe(false)
    })
  })

  describe('statusDot accent variant', () => {
    it('marks the dot as accent', () => {
      const wrapper = mount(StatusDot, { props: { label: 'Busy', variant: 'accent' } })
      expect(wrapper.get('.astryx-status-dot').attributes('data-variant')).toBe('accent')
    })

    it('ships the accent variant styles', () => {
      const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/status-dot.css'), 'utf8')
      expect(css).toContain('.astryx-status-dot[data-variant=\'accent\']')
      expect(css).toContain('--astryx-color-accent')
    })
  })
})
