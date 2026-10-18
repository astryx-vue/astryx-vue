import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/context.js'
import { astryxMessages } from '../locale/messages.js'
import { getLocaleDirection, useLocaleDirection } from './index.js'
import InternationalizationProvider from './InternationalizationProvider.vue'

const Probe = defineComponent({
  name: 'Probe',
  setup() {
    const locale = useAstryxLocale()
    const messages = useAstryxMessages()
    const direction = useLocaleDirection()
    return () => h('div', {
      'data-locale': locale.value,
      'data-placeholder': messages.value.selector.placeholder,
      'data-direction': direction.value,
    })
  },
})

function probeText(wrapper: ReturnType<typeof mount>, attribute: string): string | null {
  return wrapper.get('div').attributes(attribute) ?? null
}

describe('getLocaleDirection', () => {
  it('returns ltr for left-to-right languages', () => {
    expect(getLocaleDirection('en')).toBe('ltr')
    expect(getLocaleDirection('fr-FR')).toBe('ltr')
    expect(getLocaleDirection('zh-Hans')).toBe('ltr')
  })

  it('returns rtl for right-to-left languages', () => {
    expect(getLocaleDirection('ar')).toBe('rtl')
    expect(getLocaleDirection('ar-SA')).toBe('rtl')
    expect(getLocaleDirection('he')).toBe('rtl')
  })

  it('falls back to ltr for an unparseable tag', () => {
    expect(getLocaleDirection('')).toBe('ltr')
    expect(getLocaleDirection('not a tag')).toBe('ltr')
  })
})

describe('internationalizationProvider', () => {
  it('keeps the shipped English defaults without a provider', () => {
    const wrapper = mount(Probe)

    expect(probeText(wrapper, 'data-locale')).toBe('en')
    expect(probeText(wrapper, 'data-placeholder')).toBe(astryxMessages.en.selector.placeholder)
    expect(probeText(wrapper, 'data-direction')).toBe('ltr')
  })

  it('switches the built-in strings by locale', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'zh-CN' },
      slots: { default: () => h(Probe) },
    })

    expect(probeText(wrapper, 'data-placeholder')).toBe(astryxMessages['zh-CN'].selector.placeholder)
  })

  it('applies a locale catalog from messages', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: {
        locale: 'fr-FR',
        messages: { 'fr-FR': { '@astryx.selector.placeholder': 'Choisir…' } },
      },
      slots: { default: () => h(Probe) },
    })

    expect(probeText(wrapper, 'data-placeholder')).toBe('Choisir…')
  })

  it('falls back to the base language before English', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: {
        locale: 'fr-CA',
        messages: { fr: { '@astryx.selector.placeholder': 'Choisir…' } },
      },
      slots: { default: () => h(Probe) },
    })

    expect(probeText(wrapper, 'data-placeholder')).toBe('Choisir…')
  })

  it('layers overrides on top of the built-in strings', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: {
        locale: 'zh-CN',
        overrides: { 'zh-CN': { '@astryx.selector.placeholder': '挑一个…' } },
      },
      slots: { default: () => h(Probe) },
    })

    expect(probeText(wrapper, 'data-placeholder')).toBe('挑一个…')
  })

  it('keeps the other fields when only one key is overridden', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: {
        locale: 'zh-CN',
        overrides: { 'zh-CN': { '@astryx.selector.placeholder': '挑一个…' } },
      },
      slots: { default: () => h(Probe) },
    })

    expect(astryxMessages['zh-CN'].selector.placeholder).not.toBe('挑一个…')
    expect(probeText(wrapper, 'data-placeholder')).toBe('挑一个…')
  })

  it('ignores overrides for another locale', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: {
        locale: 'en',
        overrides: { 'fr-FR': { '@astryx.selector.placeholder': 'Choisir…' } },
      },
      slots: { default: () => h(Probe) },
    })

    expect(probeText(wrapper, 'data-placeholder')).toBe(astryxMessages.en.selector.placeholder)
  })

  it('ignores keys that have no matching field', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: {
        locale: 'en',
        overrides: { en: { '@astryx.unknown.key': 'Anyway' } },
      },
      slots: { default: () => h(Probe) },
    })

    expect(probeText(wrapper, 'data-placeholder')).toBe(astryxMessages.en.selector.placeholder)
  })

  it('derives the direction from the locale', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'ar-SA' },
      slots: { default: () => h(Probe) },
    })

    expect(probeText(wrapper, 'data-direction')).toBe('rtl')
  })

  it('takes an explicit direction over the locale', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'en', dir: 'rtl' },
      slots: { default: () => h(Probe) },
    })

    expect(probeText(wrapper, 'data-direction')).toBe('rtl')
  })

  it('lets an inner provider override an outer one', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: {
        locale: 'en',
        overrides: { en: { '@astryx.selector.placeholder': 'Outer' } },
      },
      slots: {
        default: () => h(InternationalizationProvider, {
          locale: 'zh-CN',
          overrides: { 'zh-CN': { '@astryx.selector.placeholder': 'Inner' } },
        }, { default: () => h(Probe) }),
      },
    })

    expect(probeText(wrapper, 'data-locale')).toBe('zh-CN')
    expect(probeText(wrapper, 'data-placeholder')).toBe('Inner')
  })

  it('leaves the DOM dir attribute alone', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'ar-SA' },
      slots: { default: () => h('span', 'text') },
      attachTo: document.body,
    })

    expect(wrapper.get('span').attributes('dir')).toBeUndefined()
    expect(document.documentElement.getAttribute('dir')).toBeNull()
    wrapper.unmount()
  })
})
