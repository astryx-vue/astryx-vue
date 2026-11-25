import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, markRaw, nextTick, ref } from 'vue'
import { defineTheme } from '../Theme/defineTheme.js'
import Icon from './Icon.vue'
import { addIcon, resetIcons } from './registry.js'

afterEach(() => {
  resetIcons()
  vi.resetModules()
})

describe('the svg an Icon exposes', () => {
  it('is the rendered svg for a name, and follows a glyph change', async () => {
    addIcon('test:one', { body: '<path d="M0 0"/>', width: 16, height: 16 })
    const icon = ref('test:one')
    const instance = ref<InstanceType<typeof Icon>>()
    mount({ setup: () => () => h(Icon, { ref: instance, name: icon.value }) })
    await nextTick()
    expect(instance.value?.svg).toBeInstanceOf(SVGSVGElement)
    expect(instance.value?.element?.contains(instance.value.svg)).toBe(true)

    icon.value = 'test:missing'
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    await nextTick()
    await nextTick()
    expect(instance.value?.svg).toBeNull()
  })

  it('is the svg an icon component renders', async () => {
    const Custom = markRaw({ render: () => h('svg', { class: 'custom' }) })
    const wrapper = mount(Icon, { props: { icon: Custom as never } })
    await nextTick()
    expect((wrapper.vm as unknown as { svg: SVGSVGElement | null }).svg?.classList.contains('custom')).toBe(true)
  })

  it('is null for a built-in glyph drawn without an svg', async () => {
    const wrapper = mount(Icon, { props: { icon: 'check' } })
    await nextTick()
    expect((wrapper.vm as unknown as { svg: SVGSVGElement | null }).svg).toBeNull()
  })
})

describe('the icon registry', () => {
  it('is shared by every copy of the package on the page', async () => {
    const first = await import('./registry.js')
    vi.resetModules()
    const copy = await import('./registry.js')
    expect(copy).not.toBe(first)
    first.addIcon('shared:mark', { body: '<path/>' })
    expect(copy.getIcon('shared:mark')?.body).toBe('<path/>')
  })
})

describe('a theme dimension on an Icon size', () => {
  it('reaches the glyph through the private size variables', () => {
    const theme = defineTheme({
      name: 'icon-dimension',
      components: { icon: { 'size:sm': { width: '1.125rem', height: '1.125rem' } } },
    })
    expect(theme.css).toContain('--_icon-width: 1.125rem')
    expect(theme.css).toContain('--_icon-height: 1.125rem')

    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/icon.css'), 'utf8')
    expect(css).toContain('font-size: min(var(--_icon-width, 1rem), var(--_icon-height, 1rem))')
  })
})
