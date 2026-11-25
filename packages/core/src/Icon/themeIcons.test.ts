import type { ThemeDefinition } from '../Theme/types.js'
import type { IconSize } from './types.js'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { defineTheme } from '../Theme/defineTheme.js'
import Theme from '../Theme/Theme.vue'
import Icon from './Icon.vue'
import { addIcon, resetIcons } from './registry.js'
import { useSemanticIcon } from './useSemanticIcon.js'

declare module './themeIcons.js' {
  interface IconVariantMap {
    filled: true
    outline: true
  }
}

function renderIn(theme: ThemeDefinition, props: Record<string, unknown>) {
  return mount(Theme, {
    props: { theme },
    slots: { default: () => h(Icon, props) },
  })
}

function drawnId(wrapper: ReturnType<typeof mount>): string | undefined {
  return wrapper.find('.astryx-icon__svg svg path').attributes('data-mark')
}

beforeEach(() => {
  resetIcons()
  for (const id of ['small', 'large', 'medium', 'filled', 'outline', 'base'])
    addIcon(`test:${id}`, { body: `<path data-mark="${id}" d="M0 0"/>`, width: 16, height: 16 })
})

describe('a theme icon entry that is a function of the request', () => {
  const sized = defineTheme({
    name: 'icon-sized',
    icons: {
      info: ({ size }) => (size === 'sm' ? 'test:small' : size === 'lg' ? 'test:large' : 'test:medium'),
    },
  })

  it('receives the size the icon renders at', () => {
    expect(drawnId(renderIn(sized, { icon: 'info', size: 'sm' }))).toBe('small')
    expect(drawnId(renderIn(sized, { icon: 'info', size: 'lg' }))).toBe('large')
    expect(drawnId(renderIn(sized, { icon: 'info' }))).toBe('medium')
  })

  it('receives md when the icon takes the default size', () => {
    const seen: IconSize[] = []
    const theme = defineTheme({
      name: 'icon-seen',
      icons: {
        info: ({ size }) => {
          seen.push(size)
          return 'test:medium'
        },
      },
    })
    seen.length = 0
    renderIn(theme, { icon: 'info' })
    expect(seen).toContain('md')
  })

  it('draws nothing when the function answers null, instead of falling back', () => {
    const none = defineTheme({ name: 'icon-none', icons: { close: () => null } })
    const wrapper = renderIn(none, { icon: 'close' })
    expect(wrapper.find('.astryx-icon').exists()).toBe(false)
  })

  it('keeps the id view at md for theme.icons and useSemanticIcon', () => {
    expect(sized.icons).toEqual({ info: 'test:medium' })
    let read: string | undefined
    mount(Theme, {
      props: { theme: sized },
      slots: {
        default: () => h({
          setup() {
            const id = useSemanticIcon('info')
            read = id.value
            return () => null
          },
        }),
      },
    })
    expect(read).toBe('test:medium')
  })

  it('is inherited with its function by a child theme', () => {
    const child = defineTheme({ name: 'icon-sized-child', extends: sized, icons: { close: 'test:base' } })
    expect(drawnId(renderIn(child, { icon: 'info', size: 'sm' }))).toBe('small')
  })
})

describe('icon variants', () => {
  const pick = vi.fn(({ variant }: { variant?: string }) => (variant === 'filled' ? 'test:filled' : 'test:outline'))
  const listed = defineTheme({
    name: 'icon-variants',
    iconVariants: ['outline', 'filled'],
    icons: { info: pick },
  })

  it('reads the list back, and a child inherits or replaces it', () => {
    expect(listed.iconVariants).toEqual(['outline', 'filled'])
    expect(defineTheme({ name: 'icon-variants-inherit', extends: listed }).iconVariants).toEqual(['outline', 'filled'])
    expect(defineTheme({ name: 'icon-variants-replace', extends: listed, iconVariants: ['filled'] }).iconVariants).toEqual(['filled'])
  })

  it('passes a listed variant to the entry', () => {
    expect(drawnId(renderIn(listed, { icon: 'info', variant: 'filled' }))).toBe('filled')
    expect(drawnId(renderIn(listed, { icon: 'info' }))).toBe('outline')
  })

  it('withholds a variant the theme does not list', () => {
    const unlisted = defineTheme({ name: 'icon-variants-none', icons: { info: pick } })
    expect(drawnId(renderIn(unlisted, { icon: 'info', variant: 'filled' }))).toBe('outline')
  })

  it('withholds from an inherited entry a variant its defining theme did not list', () => {
    const base = defineTheme({ name: 'icon-variants-base', iconVariants: ['outline'], icons: { info: pick } })
    const wider = defineTheme({ name: 'icon-variants-wider', extends: base, iconVariants: ['outline', 'filled'] })
    expect(drawnId(renderIn(wider, { icon: 'info', variant: 'filled' }))).toBe('outline')
  })

  it('is never written to the DOM', () => {
    const wrapper = renderIn(listed, { icon: 'info', variant: 'filled' })
    expect(wrapper.find('.astryx-icon').attributes('data-variant')).toBeUndefined()
    expect(wrapper.find('.astryx-icon').attributes('variant')).toBeUndefined()
  })
})
