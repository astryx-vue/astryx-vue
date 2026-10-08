import type { VueWrapper } from '@vue/test-utils'
import type { CSSProperties } from 'vue'
import type { KbdProps } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Kbd from './Kbd.vue'

const originalPlatform = navigator.platform

function setPlatform(platform: string): void {
  Object.defineProperty(navigator, 'platform', { value: platform, configurable: true })
}

function setClientHintsPlatform(platform: string | undefined): void {
  Object.defineProperty(navigator, 'userAgentData', {
    value: platform === undefined ? undefined : { platform },
    configurable: true,
  })
}

/**
 * The platform is read once the component is mounted, so the badge inside a
 * freshly mounted Kbd still shows the pre-platform fallback until the mount
 * effects have flushed.
 */
async function mountKbd(props: KbdProps, attrs?: Record<string, unknown>): Promise<VueWrapper> {
  const wrapper = mount(Kbd, attrs ? { props, attrs } : { props })
  await nextTick()

  return wrapper
}

function badgeTexts(wrapper: VueWrapper): string[] {
  return wrapper.findAll('kbd').map(badge => badge.text())
}

function accessibleName(wrapper: VueWrapper): string | undefined {
  return wrapper.find('.astryx-kbd').attributes('aria-label')
}

beforeEach(() => {
  setPlatform('Linux x86_64')
  setClientHintsPlatform(undefined)
})

afterEach(() => {
  setPlatform(originalPlatform)
  setClientHintsPlatform(undefined)
})

describe('kbd', () => {
  it('paints one key badge per segment of the shortcut', async () => {
    const wrapper = await mountKbd({ keys: 'mod+k' })

    const root = wrapper.find('.astryx-kbd')
    expect(root.element.tagName).toBe('SPAN')
    expect(root.attributes('role')).toBe('img')
    expect(badgeTexts(wrapper)).toEqual(['Ctrl', 'K'])
    wrapper.findAll('kbd').forEach((badge) => {
      expect(badge.classes()).toContain('astryx-kbd__key')
    })
  })

  it('renders a single key on its own', async () => {
    const wrapper = await mountKbd({ keys: 'k' })

    expect(badgeTexts(wrapper)).toEqual(['K'])
    expect(accessibleName(wrapper)).toBe('K')
  })

  it('names the shortcut out loud and hides the painted glyphs', async () => {
    const wrapper = await mountKbd({ keys: 'mod+shift+k' })

    expect(accessibleName(wrapper)).toBe('Control + Shift + K')
    expect(wrapper.find('.astryx-kbd').attributes('aria-hidden')).toBeUndefined()
    wrapper.findAll('kbd').forEach((badge) => {
      expect(badge.attributes('aria-hidden')).toBe('true')
    })
  })

  it('resolves mod for the platform the component runs on', async () => {
    const linux = await mountKbd({ keys: 'mod+k' })
    expect(badgeTexts(linux)).toEqual(['Ctrl', 'K'])
    expect(accessibleName(linux)).toBe('Control + K')

    setPlatform('MacIntel')
    const mac = await mountKbd({ keys: 'mod+k' })
    expect(badgeTexts(mac)).toEqual(['\u2318', 'K'])
    expect(accessibleName(mac)).toBe('Command + K')
  })

  it('prefers a named client-hints platform over navigator.platform', async () => {
    setPlatform('MacIntel')
    setClientHintsPlatform('Linux')
    expect(badgeTexts(await mountKbd({ keys: 'mod' }))).toEqual(['Ctrl'])

    setPlatform('Linux x86_64')
    setClientHintsPlatform('macOS')
    expect(badgeTexts(await mountKbd({ keys: 'mod' }))).toEqual(['\u2318'])
  })

  it('falls back to navigator.platform when client hints name no platform', async () => {
    setPlatform('MacIntel')
    setClientHintsPlatform('Unknown')
    expect(badgeTexts(await mountKbd({ keys: 'mod' }))).toEqual(['\u2318'])

    setClientHintsPlatform('')
    expect(badgeTexts(await mountKbd({ keys: 'mod' }))).toEqual(['\u2318'])
  })

  it('maps modifier and special keys to their glyphs', async () => {
    const wrapper = await mountKbd({
      keys: 'ctrl+alt+shift+enter+backspace+tab+up+down+left+right',
    })

    expect(badgeTexts(wrapper)).toEqual(['\u2303', '\u2325', '\u21E7', '\u21B5', '\u232B', '\u21E5', '\u2191', '\u2193', '\u2190', '\u2192'])
    expect(accessibleName(wrapper)).toBe('Control + Alt + Shift + Enter + Backspace + Tab + Up arrow + Down arrow + Left arrow + Right arrow')
  })

  it('renders escape as a word, because the glyph is not legible', async () => {
    const wrapper = await mountKbd({ keys: 'escape' })

    expect(badgeTexts(wrapper)).toEqual(['Esc'])
    expect(accessibleName(wrapper)).toBe('Escape')
  })

  it.each([
    { alias: 'esc', canonical: 'escape' },
    { alias: 'return', canonical: 'enter' },
  ])('renders the $alias alias exactly like $canonical', async ({ alias, canonical }) => {
    const aliased = await mountKbd({ keys: alias })
    const named = await mountKbd({ keys: canonical })

    expect(badgeTexts(aliased)).toEqual(badgeTexts(named))
    expect(accessibleName(aliased)).toBe(accessibleName(named))
  })

  it('keeps every occurrence of a repeated key', async () => {
    const wrapper = await mountKbd({ keys: 'escape+esc+ESC+enter+return+return' })

    expect(badgeTexts(wrapper)).toEqual(['Esc', 'Esc', 'Esc', '\u21B5', '\u21B5', '\u21B5'])
  })

  it('treats an unknown key as text rather than as an object member', async () => {
    const wrapper = await mountKbd({ keys: 'constructor+__proto__+f1' })

    expect(badgeTexts(wrapper)).toEqual(['CONSTRUCTOR', '__PROTO__', 'F1'])
    expect(accessibleName(wrapper)).toBe('CONSTRUCTOR + __PROTO__ + F1')
  })

  it('ignores whitespace and case around keys', async () => {
    const wrapper = await mountKbd({ keys: 'mod + K + F1' })

    expect(badgeTexts(wrapper)).toEqual(['Ctrl', 'K', 'F1'])
  })

  it('renders plus as a literal key', async () => {
    const wrapper = await mountKbd({ keys: 'shift+plus' })

    expect(badgeTexts(wrapper)).toEqual(['\u21E7', '+'])
    expect(accessibleName(wrapper)).toBe('Shift + Plus')
  })

  it('lets unrelated attributes reach the root', async () => {
    const wrapper = await mountKbd({ keys: 'mod+k' }, {
      'id': 'shortcut',
      'data-testid': 'kbd',
      'class': 'shortcut-hint',
    })

    const root = wrapper.find('.astryx-kbd')
    expect(root.attributes('id')).toBe('shortcut')
    expect(root.attributes('data-testid')).toBe('kbd')
    expect(root.classes()).toContain('shortcut-hint')
  })

  it('keeps the computed role and accessible name over consumer overrides', async () => {
    const wrapper = await mountKbd({ keys: 'mod+k' }, {
      'role': 'presentation',
      'aria-label': 'custom',
    })

    const root = wrapper.find('.astryx-kbd')
    expect(root.attributes('role')).toBe('img')
    expect(root.attributes('aria-label')).toBe('Control + K')
  })

  it('forwards a consumer style to the root', async () => {
    const wrapper = await mountKbd({ keys: 'k' }, {
      style: { marginInlineStart: '8px' } as CSSProperties,
    })

    expect(wrapper.find('.astryx-kbd').attributes('style')).toContain('margin-inline-start: 8px')
  })

  it('follows the shortcut instead of the value present at setup', async () => {
    const keys = ref('k')
    const Owner = defineComponent({
      setup() {
        return () => h(Kbd, { keys: keys.value })
      },
    })

    const wrapper = mount(Owner)
    await nextTick()
    expect(badgeTexts(wrapper)).toEqual(['K'])

    keys.value = 'mod+shift+p'
    await nextTick()

    expect(badgeTexts(wrapper)).toEqual(['Ctrl', '\u21E7', 'P'])
    expect(accessibleName(wrapper)).toBe('Control + Shift + P')
  })

  it('repaints when the keys prop changes', async () => {
    const wrapper = await mountKbd({ keys: 'escape' })
    expect(badgeTexts(wrapper)).toEqual(['Esc'])

    await wrapper.setProps({ keys: 'enter' })
    expect(badgeTexts(wrapper)).toEqual(['\u21B5'])
    expect(accessibleName(wrapper)).toBe('Enter')
  })
})
