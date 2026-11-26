import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Typeahead from './Typeahead.vue'

const fruits: SearchableItem[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

function politeRegion(): string {
  return document.querySelector('[data-astryx-live-region="polite"]')?.textContent ?? ''
}

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function mountTypeahead(props: Record<string, unknown> = {}) {
  return mount(Typeahead, {
    attachTo: document.body,
    props: { label: 'Fruit', searchSource: createStaticSource(fruits), debounceMs: 0, showOnFocus: true, ...props },
  })
}

describe('typeahead 禁用后保留 Tab 停点', () => {
  it('没有禁用原因也是 aria-disabled 加只读，不带原生 disabled', () => {
    const wrapper = mountTypeahead({ disabled: true })
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('readonly')).toBeDefined()
    wrapper.unmount()
  })

  it('列表开着时字段被禁用，点选项不改值，回车也不选', async () => {
    const wrapper = mountTypeahead()
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    await wrapper.setProps({ disabled: true })
    await input.trigger('keydown', { key: 'Enter' })
    document.querySelectorAll<HTMLElement>('[role="option"]')[1]!.click()
    await flush()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.unmount()
  })

  it('禁用时回车不选，Escape 还能把还开着的列表关掉', async () => {
    const wrapper = mountTypeahead()
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    await wrapper.setProps({ disabled: true })
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    input.element.dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})

describe('typeahead 触屏键盘提示', () => {
  it('输入框请求 Search 键，且不自动纠正', () => {
    const wrapper = mountTypeahead()
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('enterkeyhint')).toBe('search')
    expect(input.attributes('autocorrect')).toBe('off')
    wrapper.unmount()
  })
})

describe('typeahead 查询变化的上报', () => {
  it('选中一项后输入框清空，同时把清空后的查询报给 changeQuery', async () => {
    const wrapper = mountTypeahead({ showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('ban')
    await flush()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    const reported = wrapper.emitted('changeQuery')!.map(args => args[0])
    expect(reported).toEqual(['ban', ''])
    wrapper.unmount()
  })

  it('从聚焦清单里选一项时查询本来就是空的，不重复上报', async () => {
    const wrapper = mountTypeahead()
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(wrapper.emitted('changeQuery')).toBeUndefined()
    wrapper.unmount()
  })

  it('编辑已选的值时点清除，输入框和查询都清空', async () => {
    const wrapper = mountTypeahead({ modelValue: fruits[1] })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect((input.element as HTMLInputElement).value).toBe('Banana')
    await wrapper.get('.astryx-typeahead-clear').trigger('click')
    await flush()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(wrapper.emitted('changeQuery')?.map(args => args[0])).toContain('')
    wrapper.unmount()
  })
})

describe('typeahead 空结果跟着已落定的查询', () => {
  it('旧查询的空结果不留给正在防抖的新输入', async () => {
    vi.useFakeTimers()
    const source: SearchSource = {
      search: query => query === 'zzz' ? [] : fruits.filter(item => item.label.toLowerCase().includes(query)),
    }
    const wrapper = mountTypeahead({ searchSource: source, debounceMs: 150, showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('zzz')
    await vi.advanceTimersByTimeAsync(150)
    await flush()
    expect(document.querySelector('.astryx-typeahead-listbox')?.textContent).toContain('No results')

    await input.setValue('zzza')
    await flush()
    // 新输入还没发请求：不再显示上一个查询的「没有结果」。
    expect(document.querySelector('.astryx-typeahead-listbox')?.textContent).not.toContain('No results')
    wrapper.unmount()
  })
})

describe('typeahead 聚焦清单为空或失败时收起', () => {
  it('聚焦清单没有结果，列表收起而不是开着一个空的', async () => {
    const wrapper = mountTypeahead({ searchSource: createStaticSource([]) })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('聚焦清单加载失败，列表收起', async () => {
    const source: SearchSource = { search: () => [], bootstrap: () => Promise.reject(new Error('offline')) }
    const wrapper = mountTypeahead({ searchSource: source })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('输入了文字的搜索没有结果，仍然显示「没有结果」', async () => {
    const wrapper = mountTypeahead({ showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('zzz')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(document.body.textContent).toContain('No results')
    wrapper.unmount()
  })
})

describe('typeahead 编辑已选值时按 Escape', () => {
  it('先收起列表，编辑状态保留；再按一次还原标签并把焦点交给标签按钮', async () => {
    const wrapper = mountTypeahead({ modelValue: fruits[1] })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')

    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    expect((input.element as HTMLInputElement).value).toBe('Banana')
    expect(wrapper.find('.astryx-token').exists()).toBe(false)

    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(wrapper.find('.astryx-token').exists()).toBe(true)
    await nextFrame()
    expect(document.activeElement).toBe(wrapper.get('.astryx-token button').element)
    wrapper.unmount()
  })
})

describe('typeahead 忙碌时的播报', () => {
  it('忙碌图标对读屏隐藏，进入忙碌只念一次 Loading', async () => {
    resetLiveRegionsForTest()
    let settle: (items: SearchableItem[]) => void = () => {}
    const source: SearchSource = {
      search: () => new Promise((resolve) => {
        settle = resolve
      }),
    }
    const wrapper = mountTypeahead({ searchSource: source, showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('a')
    await flush()
    await nextFrame()
    await nextFrame()
    const spinner = wrapper.get('.astryx-typeahead-spinner')
    expect(spinner.attributes('aria-hidden')).toBe('true')
    expect(politeRegion()).toBe('Loading')
    settle(fruits)
    await flush()
    wrapper.unmount()
  })

  it('搜索的结果要播报时，没念出去的忙碌开始随即收回，不跟在结果后面', async () => {
    resetLiveRegionsForTest()
    const source: SearchSource = { search: () => Promise.resolve(fruits.slice(0, 2)) }
    const wrapper = mountTypeahead({ searchSource: source, showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('a')
    await flush()
    await nextFrame()
    await nextFrame()
    expect(politeRegion()).toBe('2 results')
    wrapper.unmount()
  })
})

describe('typeahead 点在字段自己的输入框里', () => {
  it('列表开着时点输入框或按钮，列表保持打开；点在外面才关', async () => {
    const wrapper = mountTypeahead({ modelValue: fruits[1] })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    const press = (target: Element): void => {
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, composed: true }))
    }
    press(input.element)
    press(wrapper.get('.astryx-typeahead-clear').element)
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    press(document.body)
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})

describe('typeahead 搜索源被替换后', () => {
  it('收起的字段按 ArrowDown，加载的是新源的结果，不是旧列表', async () => {
    const first: SearchSource = { search: () => [{ id: 'old', label: 'Old' }], bootstrap: () => [{ id: 'old', label: 'Old' }] }
    const second: SearchSource = { search: () => [{ id: 'new', label: 'New' }], bootstrap: () => [{ id: 'new', label: 'New' }] }
    const wrapper = mountTypeahead({ searchSource: first })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(document.querySelector('.astryx-typeahead-listbox')?.textContent).toContain('Old')
    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    await wrapper.setProps({ searchSource: second })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    const text = document.querySelector('.astryx-typeahead-listbox')?.textContent ?? ''
    expect(text).toContain('New')
    expect(text).not.toContain('Old')
    wrapper.unmount()
  })
})

describe('typeahead 起始图标', () => {
  it('startIcon 可以直接写语义图标名', () => {
    const wrapper = mountTypeahead({ startIcon: 'search' })
    expect(wrapper.find('.astryx-typeahead-icon .astryx-icon').exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('typeahead 值标签上的退格和删除', () => {
  it.each(['Backspace', 'Delete'])('%s 和清除按钮一样清掉值、念出来、把焦点交给空的输入框', async (key) => {
    resetLiveRegionsForTest()
    const wrapper = mountTypeahead({ modelValue: fruits[0], showOnFocus: false })
    const button = wrapper.get('.astryx-token button')
    ;(button.element as HTMLElement).focus()
    await button.trigger('keydown', { key })
    await flush()
    await nextFrame()
    await nextFrame()
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    const input = wrapper.get('input[role="combobox"]')
    expect(document.activeElement).toBe(input.element)
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toContain('Cleared Apple')
    wrapper.unmount()
  })

  it('没有清除按钮时，退格进入编辑', async () => {
    const wrapper = mountTypeahead({ modelValue: fruits[0], clearable: false, hasClear: false, showOnFocus: false })
    const button = wrapper.get('.astryx-token button')
    ;(button.element as HTMLElement).focus()
    await button.trigger('keydown', { key: 'Backspace' })
    await flush()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const input = wrapper.get('input[role="combobox"]')
    expect((input.element as HTMLInputElement).value).toBe('Apple')
    wrapper.unmount()
  })

  it('其他键和禁用的字段不动值', async () => {
    const wrapper = mountTypeahead({ modelValue: fruits[0], showOnFocus: false })
    await wrapper.get('.astryx-token button').trigger('keydown', { key: 'a' })
    await wrapper.setProps({ disabled: true })
    await wrapper.get('.astryx-token button').trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})
