import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import { useLocale } from './useLocale.js'

const Probe = defineComponent({
  name: 'LocaleProbe',
  setup() {
    const { locale } = useLocale()
    return () => h('div', { 'data-locale': locale.value })
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
})
