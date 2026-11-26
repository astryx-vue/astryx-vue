import type { SearchableItem, SearchContext, SearchSource } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import Tokenizer from '../Tokenizer/Tokenizer.vue'
import Typeahead from './Typeahead.vue'

const local: SearchableItem[] = [{ id: 'ada', label: 'Ada (local)' }, { id: 'bo', label: 'Bo (local)' }]
const server: SearchableItem[] = [{ id: 'cy', label: 'Cy (server)' }, { id: 'ada', label: 'Ada (server)' }, { id: 'bo', label: 'Bo (server)' }]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

function labels(): string[] {
  return [...document.querySelectorAll('.astryx-typeahead-listbox [role="option"]')].map(row => row.textContent?.trim() ?? '')
}

afterEach(() => {
  document.body.innerHTML = ''
  resetLiveRegionsForTest()
})

function mountTypeahead(source: SearchSource, props: Record<string, unknown> = {}) {
  return mount(Typeahead, {
    attachTo: document.body,
    props: { label: 'People', searchSource: source, debounceMs: 0, ...props },
  })
}

/** 先用 update 交出本地匹配，服务端的答案之后由调用方放行。 */
function incrementalSource() {
  let finish: (items: SearchableItem[]) => void = () => {}
  let context: SearchContext | undefined
  const source: SearchSource = {
    search: (_query, _signal, ctx) => {
      context = ctx
      ctx?.update(local)
      return new Promise<SearchableItem[]>((resolve) => {
        finish = resolve
      })
    },
  }
  return { source, finish: (items: SearchableItem[]) => finish(items), update: (items: SearchableItem[]) => context?.update(items) }
}

describe('typeahead 先显示本地匹配、再追加服务端结果', () => {
  it('update 的列表立刻显示，字段在搜索落定前一直忙碌', async () => {
    const { source } = incrementalSource()
    const wrapper = mountTypeahead(source)
    await wrapper.get('input[role="combobox"]').setValue('a')
    await flush()
    expect(labels()).toEqual(['Ada (local)', 'Bo (local)'])
    expect(wrapper.find('.astryx-typeahead-spinner').exists()).toBe(true)
    wrapper.unmount()
  })

  it('服务端的答案把已显示的行留在最前面、顺序不变，新行追加在后面', async () => {
    const { source, finish } = incrementalSource()
    const wrapper = mountTypeahead(source)
    await wrapper.get('input[role="combobox"]').setValue('a')
    await flush()
    finish(server)
    await flush()
    expect(labels()).toEqual(['Ada (server)', 'Bo (server)', 'Cy (server)'])
    expect(wrapper.find('.astryx-typeahead-spinner').exists()).toBe(false)
    wrapper.unmount()
  })

  it('高亮的行不会因为追加而移动', async () => {
    const { source, finish } = incrementalSource()
    const wrapper = mountTypeahead(source)
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('a')
    await flush()
    await input.trigger('keydown', { key: 'ArrowDown' })
    const before = document.querySelector('.astryx-typeahead-option.is-active')?.textContent?.trim()
    finish(server)
    await flush()
    expect(document.querySelector('.astryx-typeahead-option.is-active')?.textContent?.trim()).toContain(before!.split(' ')[0]!)
    wrapper.unmount()
  })

  it('空的 update 不动已显示的行；返回空数组也留着已显示的行', async () => {
    const { source, update, finish } = incrementalSource()
    const wrapper = mountTypeahead(source)
    await wrapper.get('input[role="combobox"]').setValue('a')
    await flush()
    update([])
    await flush()
    expect(labels()).toEqual(['Ada (local)', 'Bo (local)'])
    finish([])
    await flush()
    expect(labels()).toEqual(['Ada (local)', 'Bo (local)'])
    wrapper.unmount()
  })

  it('后一份列表挪动或去掉已显示的行时，按它给的显示，并在开发期警告', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { source, update } = incrementalSource()
    const wrapper = mountTypeahead(source)
    await wrapper.get('input[role="combobox"]').setValue('a')
    await flush()
    update([local[1]!, local[0]!])
    await flush()
    expect(labels()).toEqual(['Bo (local)', 'Ada (local)'])
    expect(warn.mock.calls.flat().join(' ')).toContain('moved or removed rows')
    warn.mockRestore()
    wrapper.unmount()
  })

  it('已经换了新查询、或搜索已经落定之后的 update 被忽略', async () => {
    const { source, finish, update } = incrementalSource()
    const wrapper = mountTypeahead(source)
    await wrapper.get('input[role="combobox"]').setValue('a')
    await flush()
    finish(local)
    await flush()
    update([{ id: 'late', label: 'Late' }])
    await flush()
    expect(labels()).toEqual(['Ada (local)', 'Bo (local)'])
    wrapper.unmount()
  })

  it('结果数只在搜索落定时念一次', async () => {
    const { source, finish } = incrementalSource()
    const wrapper = mountTypeahead(source)
    await wrapper.get('input[role="combobox"]').setValue('a')
    await flush()
    await nextFrame()
    await nextFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).not.toContain('result')
    finish(server)
    await flush()
    await nextFrame()
    await nextFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('3 results')
    wrapper.unmount()
  })

  it('不调用 update 的数据源一次查询只显示一份列表', async () => {
    const wrapper = mountTypeahead({ search: () => server })
    await wrapper.get('input[role="combobox"]').setValue('a')
    await flush()
    expect(labels()).toEqual(['Cy (server)', 'Ada (server)', 'Bo (server)'])
    wrapper.unmount()
  })

  it('tokenizer 同样先显示本地匹配，并把已选的人排除在每一份列表之外', async () => {
    const { source, finish } = incrementalSource()
    const wrapper = mount(Tokenizer, {
      attachTo: document.body,
      props: { label: 'People', searchSource: source, debounceMs: 0, modelValue: [local[0]!] },
    })
    await wrapper.get('input[role="combobox"]').setValue('b')
    await flush()
    expect(labels()).toEqual(['Bo (local)'])
    finish(server)
    await flush()
    expect(labels()).toEqual(['Bo (server)', 'Cy (server)'])
    wrapper.unmount()
  })
})
