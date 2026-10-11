import type { SearchableItem, SearchSource } from './useAsyncSource'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { createStaticSource, useAsyncSource } from './useAsyncSource'

const fruits: SearchableItem[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'apricot', label: 'Apricot' },
  { id: 'banana', label: 'Banana', auxiliaryData: { aka: ['plantain'] } },
]

function mountSource(source: SearchSource, debounceMs = 0) {
  const query = ref('')
  const enabled = ref(false)
  let api: ReturnType<typeof useAsyncSource> | undefined
  const Probe = defineComponent({
    setup() {
      api = useAsyncSource({ source, query, enabled, debounceMs })
      return () => h('span')
    },
  })
  const wrapper = mount(Probe)
  return {
    wrapper,
    query,
    enabled,
    get api() {
      return api!
    },
  }
}

describe('createStaticSource', () => {
  it('returns every item for an empty query and filters by label', () => {
    const source = createStaticSource(fruits)
    const bootstrapped = source.bootstrap?.()
    expect(Array.isArray(bootstrapped) ? bootstrapped : []).toHaveLength(3)
    const apricot = source.search('apr')
    const apple = source.search('  APP  ')
    expect((Array.isArray(apricot) ? apricot : []).map(item => item.id)).toEqual(['apricot'])
    expect((Array.isArray(apple) ? apple : []).map(item => item.id)).toEqual(['apple'])
  })

  it('also matches caller-supplied keywords', () => {
    const source = createStaticSource(fruits, {
      keywords: item => (item.auxiliaryData as { aka?: string[] } | undefined)?.aka ?? [],
    })
    const planted = source.search('plant')
    expect((Array.isArray(planted) ? planted : []).map(item => item.id)).toEqual(['banana'])
  })
})

describe('useAsyncSource', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays idle until enabled, then bootstraps an empty query', async () => {
    const source = createStaticSource(fruits)
    const view = mountSource(source)
    await nextTick()
    expect(view.api.status.value).toBe('idle')

    view.enabled.value = true
    await nextTick()
    await Promise.resolve()
    expect(view.api.status.value).toBe('ready')
    expect(view.api.items.value).toHaveLength(3)
    view.wrapper.unmount()
  })

  it('debounces search and reports an empty result', async () => {
    vi.useFakeTimers()
    const search = vi.fn((query: string) => fruits.filter(item => item.label.toLowerCase().includes(query)))
    const view = mountSource({ search }, 150)
    view.enabled.value = true
    view.query.value = 'zzz'
    await nextTick()
    expect(search).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(150)
    expect(search).toHaveBeenCalledWith('zzz', expect.any(AbortSignal))
    expect(view.api.status.value).toBe('empty')
    expect(view.api.items.value).toEqual([])
    view.wrapper.unmount()
  })

  it('drops a stale response after a newer query resolves', async () => {
    let resolveSlow: ((items: SearchableItem[]) => void) | undefined
    const source: SearchSource = {
      search(query) {
        if (query === 'slow') {
          return new Promise((resolve) => {
            resolveSlow = resolve
          })
        }
        return [{ id: 'fast', label: 'Fast' }]
      },
    }
    const view = mountSource(source)
    view.enabled.value = true
    view.query.value = 'slow'
    await nextTick()
    await Promise.resolve()
    expect(view.api.status.value).toBe('loading')

    view.query.value = 'fast'
    await nextTick()
    await Promise.resolve()
    expect(view.api.items.value.map(item => item.id)).toEqual(['fast'])

    resolveSlow?.([{ id: 'slow', label: 'Slow' }])
    await Promise.resolve()
    await nextTick()
    expect(view.api.items.value.map(item => item.id)).toEqual(['fast'])
    view.wrapper.unmount()
  })

  it('cancels the previous source and ignores abort errors', async () => {
    const cancel = vi.fn()
    const source: SearchSource = {
      cancel,
      search(_query, signal) {
        return new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () => {
            reject(new DOMException('aborted', 'AbortError'))
          })
        })
      },
    }
    const view = mountSource(source)
    view.enabled.value = true
    view.query.value = 'a'
    await nextTick()
    await Promise.resolve()
    expect(view.api.status.value).toBe('loading')

    view.query.value = 'b'
    await nextTick()
    expect(cancel).toHaveBeenCalled()
    await Promise.resolve()
    expect(view.api.status.value).not.toBe('error')
    view.wrapper.unmount()
  })

  it('records a failed search as an error and clears items', async () => {
    const source: SearchSource = {
      search() {
        return Promise.reject(new Error('offline'))
      },
    }
    const view = mountSource(source)
    view.enabled.value = true
    view.query.value = 'a'
    await nextTick()
    await Promise.resolve()
    await Promise.resolve()
    expect(view.api.status.value).toBe('error')
    expect(view.api.error.value).toBeInstanceOf(Error)
    expect(view.api.items.value).toEqual([])
    view.wrapper.unmount()
  })
})
