import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import DateRangeInput from './DateRangeInput.vue'

const YEAR = new Date().getFullYear()
const THIS_YEAR = { start: `${YEAR}-03-02`, end: `${YEAR}-03-09` }

afterEach(() => {
  document.body.innerHTML = ''
})

describe('dateRangeInput 今年的年份', () => {
  it('客户端直接挂载时，起止都在今年就省掉年份', () => {
    const wrapper = mount(DateRangeInput, { props: { label: 'Period', modelValue: THIS_YEAR } })
    expect(wrapper.get('.astryx-date-range-value').text()).not.toContain(String(YEAR))
  })

  it('服务端渲染不读时钟，一律写出年份', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(DateRangeInput, { label: 'Period', modelValue: THIS_YEAR }) }))
    expect(/<span class="astryx-date-range-value"[^>]*>([^<]*)<\/span>/.exec(html)?.[1]).toContain(String(YEAR))
  })

  it('水合那一趟和服务端一致，挂载之后再省掉今年的年份', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(DateRangeInput, { label: 'Period', modelValue: THIS_YEAR }) }))
    const host = document.createElement('div')
    document.body.appendChild(host)
    host.innerHTML = html
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const app = createSSRApp({ render: () => h(DateRangeInput, { label: 'Period', modelValue: THIS_YEAR }) })
    app.mount(host)
    expect(host.querySelector('.astryx-date-range-value')?.textContent).toContain(String(YEAR))
    await nextTick()
    expect(host.querySelector('.astryx-date-range-value')?.textContent).not.toContain(String(YEAR))
    // 文字不一致的水合警告会点出两边的文字；弹层自己的水合警告与此无关。
    expect(warn.mock.calls.some(call => call.map(String).join(' ').includes(String(YEAR)))).toBe(false)
    warn.mockRestore()
    app.unmount()
  })
})

describe('dateRangeInput 的值', () => {
  it('值里放了 Date 对象时，开发期报错并点明属性和改法', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const value = { start: new Date(2026, 0, 1), end: new Date(2026, 0, 31) } as unknown as { start: string, end: string }
    expect(() => mount(DateRangeInput, { props: { label: 'Period', modelValue: value } })).toThrowError(
      /DateRangeInput: `modelValue` must be null or \{ start, end \} with ISO date strings.*Pass strings, not Date objects\./,
    )
    vi.restoreAllMocks()
  })
})
