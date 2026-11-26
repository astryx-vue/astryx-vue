import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import { useLocale } from './useLocale.js'

const Probe = defineComponent({
  name: 'LocaleProbe',
  setup() {
    const { locale, calendar } = useLocale()
    return () => h('div', { 'data-locale': locale.value, 'data-calendar': calendar.value })
  },
})

function probeLocale(wrapper: ReturnType<typeof mount>): string | null {
  return wrapper.get('div').attributes('data-locale') ?? null
}

describe('useLocale', () => {
  it('没有 provider 时回到 en', () => {
    const wrapper = mount(Probe)
    expect(probeLocale(wrapper)).toBe('en')
  })

  it('读到 provider 的语言，并跟着它变', async () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'zh' },
      slots: { default: () => h(Probe) },
    })

    expect(probeLocale(wrapper)).toBe('zh-CN')

    await wrapper.setProps({ locale: 'en-GB' })
    await nextTick()
    expect(probeLocale(wrapper)).toBe('en-GB')
  })

  it('没有 provider 时用公历，provider 指定历法时读到它', async () => {
    expect(mount(Probe).get('div').attributes('data-calendar')).toBe('gregory')

    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'fa-IR', calendar: 'persian' },
      slots: { default: () => h(Probe) },
    })
    expect(wrapper.get('div').attributes('data-calendar')).toBe('persian')

    await wrapper.setProps({ calendar: 'hebrew' })
    expect(wrapper.get('div').attributes('data-calendar')).toBe('hebrew')
  })

  it('语言标签里的 -u-ca- 不改历法，不认识的历法退回公历并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const tagged = mount(InternationalizationProvider, {
      props: { locale: 'en-u-ca-persian' },
      slots: { default: () => h(Probe) },
    })
    expect(tagged.get('div').attributes('data-calendar')).toBe('gregory')

    const unknown = mount(InternationalizationProvider, {
      props: { locale: 'en', calendar: 'islamic' as never },
      slots: { default: () => h(Probe) },
    })
    expect(unknown.get('div').attributes('data-calendar')).toBe('gregory')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
