import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Tokenizer from './Tokenizer.vue'

const people: SearchableItem[] = [
  { id: 'ada', label: 'Ada' },
  { id: 'grace', label: 'Grace' },
]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function mountTokenizer(props: Record<string, unknown> = {}) {
  return mount(Tokenizer, {
    attachTo: document.body,
    props: { label: 'People', searchSource: createStaticSource(people), debounceMs: 0, showOnFocus: true, ...props },
  })
}

describe('tokenizer 禁用后保留 Tab 停点', () => {
  it('没有禁用说明也是 aria-disabled 加只读，不带原生 disabled', () => {
    const wrapper = mountTokenizer({ disabled: true })
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('readonly')).toBeDefined()
    expect(wrapper.find('.astryx-visually-hidden[id$="-disabled"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('输入框在失焦才展开的浮层里（unfocused-layer）且没有说明时，仍用原生 disabled', () => {
    const wrapper = mountTokenizer({ disabled: true, overflow: 'unfocused-layer' })
    expect(wrapper.get('input[role="combobox"]').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('unfocused-layer 带说明时仍可聚焦', () => {
    const wrapper = mountTokenizer({ disabled: true, overflow: 'unfocused-layer', disabledMessage: 'Editors only' })
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('aria-disabled')).toBe('true')
    wrapper.unmount()
  })
})

describe('tokenizer 搜索框的触屏键盘提示', () => {
  it('请求 Search 键，且不自动纠正', () => {
    const wrapper = mountTokenizer()
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('enterkeyhint')).toBe('search')
    expect(input.attributes('autocorrect')).toBe('off')
    wrapper.unmount()
  })
})

describe('tokenizer 查询变化的上报', () => {
  it('选中一项后输入框清空，同时把清空后的查询报给 changeQuery', async () => {
    const wrapper = mountTokenizer({ showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('gr')
    await flush()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(wrapper.emitted('changeQuery')!.map(args => args[0])).toEqual(['gr', ''])
    wrapper.unmount()
  })
})

describe('tokenizer 空结果和聚焦清单', () => {
  it('旧查询的空结果不留给正在防抖的新输入', async () => {
    vi.useFakeTimers()
    const source: SearchSource = { search: query => query === 'zzz' ? [] : people }
    const wrapper = mountTokenizer({ searchSource: source, debounceMs: 150, showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('zzz')
    await vi.advanceTimersByTimeAsync(150)
    await flush()
    expect(document.querySelector('.astryx-typeahead-listbox')?.textContent).toContain('No results')
    await input.setValue('zzza')
    await flush()
    expect(document.querySelector('.astryx-typeahead-listbox')?.textContent).not.toContain('No results')
    wrapper.unmount()
  })

  it('聚焦清单里的选项都已选完，列表收起而不是开着一个空的', async () => {
    const wrapper = mountTokenizer({ modelValue: people })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('聚焦清单加载失败，列表收起', async () => {
    const source: SearchSource = { search: () => [], bootstrap: () => Promise.reject(new Error('offline')) }
    const wrapper = mountTokenizer({ searchSource: source })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})

describe('tokenizer 忙碌时的播报', () => {
  it('进入忙碌由输入框念一次 Loading，列表里的转圈对读屏隐藏', async () => {
    resetLiveRegionsForTest()
    const source: SearchSource = { search: () => new Promise(() => {}) }
    const wrapper = mountTokenizer({ searchSource: source, showOnFocus: false })
    await wrapper.get('input[role="combobox"]').setValue('a')
    await flush()
    await nextFrame()
    await nextFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Loading')
    expect(document.querySelector('.astryx-typeahead-listbox [role="status"]')?.closest('[aria-hidden="true"]')).not.toBeNull()
    wrapper.unmount()
  })
})

describe('tokenizer 开着的列表跟着已选的标签变化', () => {
  it('标签在外面被加上或去掉，开着的列表立刻跟着排除或放回', async () => {
    const wrapper = mountTokenizer()
    const input = wrapper.get('input[role="combobox"]')
    ;(input.element as HTMLInputElement).focus()
    await flush()
    const labels = (): string[] => [...document.querySelectorAll('.astryx-typeahead-listbox [role="option"]')].map(row => row.textContent?.trim() ?? '')
    expect(labels()).toEqual(['Ada', 'Grace'])
    await wrapper.setProps({ modelValue: [people[0]!] })
    await flush()
    expect(labels()).toEqual(['Grace'])
    await wrapper.setProps({ modelValue: [] })
    await flush()
    expect(labels()).toEqual(['Ada', 'Grace'])
    wrapper.unmount()
  })
})
