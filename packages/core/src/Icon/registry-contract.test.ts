import type { IconName, IconRegistry } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { h } from 'vue'
import { defineTheme } from '../Theme/defineTheme.js'
import Theme from '../Theme/Theme.vue'
import { ICON_GLYPHS } from './glyphs.js'
import Icon from './Icon.vue'
import { addIcon, resetIcons } from './registry.js'
import { defaultSemanticIcons, resolveSemanticIcon } from './semantic.js'

describe('icon registry contract', () => {
  it('requires upload in a complete registry', () => {
    expectTypeOf<'upload'>().toExtend<IconName>()
    expectTypeOf<IconRegistry>().toHaveProperty('upload')
    // @ts-expect-error A complete registry without upload does not compile.
    const incomplete: IconRegistry = { ...defaultSemanticIcons, upload: undefined }
    expect(incomplete).toBeDefined()
  })

  it('ships upload as its own drawing, distinct from arrowUp', () => {
    expect(defaultSemanticIcons.upload).toBe('lucide:upload')
    expect(defaultSemanticIcons.upload).not.toBe(defaultSemanticIcons.arrowUp)
    expect(ICON_GLYPHS).toContain('upload')
  })

  it('draws every shared name in the default registry and as a built-in glyph', () => {
    const names = Object.keys(defaultSemanticIcons).sort()
    expect([...ICON_GLYPHS].filter(name => !name.includes(':')).sort()).toEqual(names)
  })

  it('lets a theme redraw upload without touching arrowUp', () => {
    resetIcons()
    addIcon('carbon:upload', { body: '<path d="M1"/>', width: 32, height: 32 })
    addIcon('lucide:arrow-up', { body: '<path d="M2"/>', width: 24, height: 24 })
    const theme = defineTheme({ name: 'upload-only', icons: { upload: 'carbon:upload' } })
    const wrapper = mount(Theme, {
      props: { theme },
      slots: { default: () => [h(Icon, { icon: 'upload' }), h(Icon, { icon: 'arrowUp' })] },
    })
    const icons = wrapper.findAll('.astryx-icon__svg')
    expect(icons[0]!.html()).toContain('M1')
    expect(icons[1]!.html()).toContain('M2')
  })

  it('draws the built-in glyph for a component-owned key, and lets a theme replace it', () => {
    resetIcons()
    const plain = mount(Icon, { props: { icon: 'numberInput:stepperDown', size: 'xsm' } })
    expect(plain.find('.astryx-icon__glyph').classes()).toContain('astryx-icon--number-input-stepper-down')
    expect(plain.find('.astryx-icon').attributes('data-size')).toBe('xsm')

    addIcon('carbon:chevron-down', { body: '<path d="M3"/>', width: 32, height: 32 })
    const theme = defineTheme({ name: 'stepper', icons: { 'numberInput:stepperDown': 'carbon:chevron-down' } })
    const themed = mount(Theme, { props: { theme }, slots: { default: () => h(Icon, { icon: 'numberInput:stepperDown' }) } })
    expect(themed.find('.astryx-icon__svg').html()).toContain('M3')
  })

  it('resolves a namespaced component key through the theme', () => {
    const theme = defineTheme({ name: 'ns', icons: { 'numberInput:stepperDown': 'carbon:chevron-down' } })
    expect(resolveSemanticIcon('numberInput:stepperDown', theme.icons)).toBe('carbon:chevron-down')
    expect(resolveSemanticIcon('numberInput:stepperDown')).toBeUndefined()
  })
})
