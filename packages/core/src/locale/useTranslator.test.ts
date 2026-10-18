import type { ProviderOverrides } from '../InternationalizationProvider/index.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import { useTranslator } from './useTranslator.js'

const Probe = defineComponent({
  name: 'TranslatorProbe',
  props: {
    messageKey: { type: String, required: true },
    values: { type: Object, default: undefined },
  },
  setup(props) {
    const { t } = useTranslator()
    return () => h('div', { 'data-text': t(props.messageKey, props.values as never) })
  },
})

function renderText(wrapper: ReturnType<typeof mount>): string | null {
  return wrapper.get('div').attributes('data-text') ?? null
}

describe('useTranslator', () => {
  it('没有 provider 时用包内自带的英文文案', () => {
    const wrapper = mount(Probe, { props: { messageKey: '@astryx.pagination.next' } })
    expect(renderText(wrapper)).toBe('Next')
  })

  it('跟着 provider 的语言走', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'zh-CN' },
      slots: { default: () => h(Probe, { messageKey: '@astryx.pagination.next' }) },
    })
    expect(renderText(wrapper)).toBe('下一页')
  })

  it('按参数顺序填占位符', () => {
    const wrapper = mount(Probe, {
      props: { messageKey: '@astryx.pagination.pageAnnounce', values: { current: 3 } },
    })
    expect(renderText(wrapper)).toBe('Page 3')
  })

  it('多个占位符按参数顺序填', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'zh-CN' },
      slots: {
        default: () => h(Probe, {
          messageKey: '@astryx.pagination.count',
          values: { total: 20, from: 1, to: 10 },
        }),
      },
    })
    expect(renderText(wrapper)).toBe('共 20 条，显示 1-10')
  })

  it('目录里的 ICU 复数按当前语言算', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: {
        locale: 'en',
        messages: {
          en: { '@astryx.pagination.count': '{total, plural, one {# result} other {# results}}' },
        },
      },
      slots: {
        default: () => h(Probe, {
          messageKey: '@astryx.pagination.count',
          values: { total: 1, from: 1, to: 1 },
        }),
      },
    })
    expect(renderText(wrapper)).toBe('1 result')
  })

  it('provider 的 overrides 盖过底层文案', () => {
    const overrides: ProviderOverrides = {
      en: { '@astryx.pagination.next': 'Advance' },
    }
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'en', overrides },
      slots: { default: () => h(Probe, { messageKey: '@astryx.pagination.next' }) },
    })
    expect(renderText(wrapper)).toBe('Advance')
  })

  it('认不出来的键原样返回', () => {
    const wrapper = mount(Probe, { props: { messageKey: '@astryx.notARealKey' } })
    expect(renderText(wrapper)).toBe('@astryx.notARealKey')
  })

  it('语言切换后同一个 t 读到新的文案', async () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'en' },
      slots: { default: () => h(Probe, { messageKey: '@astryx.pagination.next' }) },
    })
    expect(renderText(wrapper)).toBe('Next')

    await wrapper.setProps({ locale: 'zh-CN' })
    expect(renderText(wrapper)).toBe('下一页')
  })
})
