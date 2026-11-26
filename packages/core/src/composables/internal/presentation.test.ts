import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, nextTick, provide, ref } from 'vue'
import { compactDefinition, DEFAULT_COMPACT_DEFINITION } from '../../Theme/compactDefinition.js'
import { themeContextKey } from '../../Theme/context.js'
import { defineTheme } from '../../Theme/defineTheme.js'
import { COMPACT_TOUCH, installMatchMedia } from '../testing/fakeMatchMedia.js'
import { mountComposable } from '../testing/mountComposable.js'
import { readPresentation, resolvePresentation, useAdaptivePresentation, usePresentation } from './presentation.js'

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

const phone = { isTouch: true, isCompact: true }
const tablet = { isTouch: true, isCompact: false }
const desktop = { isTouch: false, isCompact: false }

describe('compact definition', () => {
  it('is narrower than md or shorter than 500px, with a coarse pointer for the sheet', () => {
    expect(DEFAULT_COMPACT_DEFINITION.query).toBe('(width < 768px), (height < 500px)')
    expect(DEFAULT_COMPACT_DEFINITION.coarsePointerQuery).toBe(COMPACT_TOUCH)
    expect(compactDefinition({ md: 900 }).coarsePointerQuery)
      .toBe('(width < 900px) and (pointer: coarse), (height < 500px) and (pointer: coarse)')
  })
})

describe('resolvePresentation', () => {
  it('lets the caller win over the touch default', () => {
    expect(resolvePresentation('popover', phone, 'touch')).toEqual({ surface: 'popover', touchModes: false })
    expect(resolvePresentation('bottom-sheet', desktop)).toEqual({ surface: 'bottom-sheet', touchModes: false })
    expect(resolvePresentation('bottom-sheet', tablet)).toEqual({ surface: 'bottom-sheet', touchModes: true })
    expect(resolvePresentation('adaptive', phone)).toEqual({ surface: 'bottom-sheet', touchModes: true })
    expect(resolvePresentation('adaptive', tablet)).toEqual({ surface: 'popover', touchModes: true })
    expect(resolvePresentation('adaptive', desktop)).toEqual({ surface: 'popover', touchModes: false })
  })

  it('reads an omitted presentation by the component default', () => {
    expect(resolvePresentation(undefined, phone)).toEqual({ surface: 'popover', touchModes: false })
    expect(resolvePresentation(undefined, phone, 'touch')).toEqual({ surface: 'popover', touchModes: true })
  })
})

describe('readPresentation', () => {
  it('answers the popover where the window has no matchMedia, as in a test DOM', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(readPresentation('adaptive', { compact: DEFAULT_COMPACT_DEFINITION })).toEqual({ surface: 'popover', touchModes: false })
  })

  it('reads a landscape phone (short, coarse) as compact touch', () => {
    installMatchMedia(query => query === '(pointer: coarse)' || query === DEFAULT_COMPACT_DEFINITION.query)
    expect(readPresentation('adaptive', { compact: DEFAULT_COMPACT_DEFINITION })).toEqual({ surface: 'bottom-sheet', touchModes: true })
  })
})

describe('usePresentation', () => {
  it('subscribes to no query for a pinned popover', () => {
    const media = installMatchMedia(() => true)
    const { result } = mountComposable(() => usePresentation('popover'))
    expect(result.value).toEqual({ surface: 'popover', touchModes: false })
    expect(media.queries).toEqual([])
  })

  it('follows the pointer and the size while it is adaptive', async () => {
    const media = installMatchMedia(() => false)
    const { result } = mountComposable(() => usePresentation('adaptive'))
    expect(result.value.surface).toBe('popover')
    media.set(query => query === '(pointer: coarse)' || query === DEFAULT_COMPACT_DEFINITION.query)
    await nextTick()
    expect(result.value).toEqual({ surface: 'bottom-sheet', touchModes: true })
  })

  it('resolves without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined)
    const { result } = mountComposable(() => usePresentation('adaptive', { whenOmitted: 'touch' }))
    expect(result.value).toEqual({ surface: 'popover', touchModes: false })
  })
})

describe('useAdaptivePresentation', () => {
  it('reads the active theme compact definition', () => {
    const wide = compactDefinition({ md: 900 }).coarsePointerQuery
    installMatchMedia(query => query === wide)
    const theme = defineTheme({ name: 'wide-md', adaptations: { widthBreakpoints: { md: 900 } } })
    const presentation = ref<'adaptive' | 'popover'>('adaptive')
    let resolved!: ReturnType<typeof useAdaptivePresentation>
    const Child = defineComponent({
      setup() {
        resolved = useAdaptivePresentation(presentation)
        return () => h('div')
      },
    })
    mount(defineComponent({
      setup() {
        provide(themeContextKey, computed(() => ({ theme, mode: 'light' as const })))
        return () => h(Child)
      },
    }))
    expect(resolved.value).toBe('bottom-sheet')
    presentation.value = 'popover'
    expect(resolved.value).toBe('popover')
  })

  it('stays a popover on a coarse screen exactly md wide', () => {
    installMatchMedia(query => query === '(max-width: 768px) and (pointer: coarse)')
    const { result } = mountComposable(() => useAdaptivePresentation('adaptive'))
    expect(result.value).toBe('popover')
  })
})
