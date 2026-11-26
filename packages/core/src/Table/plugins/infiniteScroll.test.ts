import type { TableColumn } from '../types.js'
import type { UseTableInfiniteScrollConfig } from './infiniteScroll.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive } from 'vue'
import Table from '../Table.vue'
import { useTableInfiniteScroll } from './infiniteScroll.js'

interface Row extends Record<string, unknown> {
  id: string
  name: string
}

class FakeObserver {
  static instances: FakeObserver[] = []
  readonly targets = new Set<Element>()
  isDisconnected = false
  constructor(readonly callback: IntersectionObserverCallback, readonly options?: IntersectionObserverInit) {
    FakeObserver.instances.push(this)
  }

  observe(target: Element): void {
    this.targets.add(target)
  }

  disconnect(): void {
    this.isDisconnected = true
  }

  /** 让观察的末尾进入视口。 */
  reveal(): void {
    const entries = [...this.targets].map(target => ({ target, isIntersecting: true }) as IntersectionObserverEntry)
    this.callback(entries, this as unknown as IntersectionObserver)
  }
}

function liveObserver(): FakeObserver | undefined {
  return [...FakeObserver.instances].reverse().find(observer => !observer.isDisconnected)
}

function deferred() {
  let resolve!: () => void
  let reject!: (error: unknown) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const columns: TableColumn[] = [{ key: 'name', header: 'Name' }]

function mountTable(state: UseTableInfiniteScrollConfig & { rows: Row[] }) {
  return mount(defineComponent({
    setup() {
      const plugin = useTableInfiniteScroll(() => ({ hasMore: state.hasMore, isLoading: state.isLoading, onLoadMore: state.onLoadMore }))
      return () => h(Table, { data: state.rows, columns, idKey: 'id', plugins: { more: plugin } })
    },
  }), { attachTo: document.body })
}

beforeEach(() => {
  FakeObserver.instances = []
  vi.stubGlobal('IntersectionObserver', FakeObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('useTableInfiniteScroll', () => {
  it('keeps a Load more command below the table while more rows exist', async () => {
    const state = reactive({ rows: [{ id: '1', name: 'Ada' }], hasMore: true, isLoading: false, onLoadMore: async () => {} })
    const wrapper = mountTable(state)
    const command = wrapper.get('.astryx-table-scroll .astryx-table__load-more button')
    expect(command.text()).toBe('Load more')

    state.hasMore = false
    await nextTick()
    expect(wrapper.find('.astryx-table__load-more').exists()).toBe(false)
    wrapper.unmount()
  })

  it('sends one request at a time and unlocks once the batch settled and loading turned off', async () => {
    const batch = deferred()
    const onLoadMore = vi.fn(() => batch.promise)
    const state = reactive({ rows: [{ id: '1', name: 'Ada' }], hasMore: true, isLoading: false, onLoadMore })
    const wrapper = mountTable(state)
    const command = wrapper.get('.astryx-table__load-more button')

    await command.trigger('click')
    await command.trigger('click')
    expect(onLoadMore).toHaveBeenCalledTimes(1)
    expect(command.attributes('aria-busy')).toBe('true')

    state.isLoading = true
    batch.resolve()
    await flushPromises()
    await command.trigger('click')
    expect(onLoadMore).toHaveBeenCalledTimes(1)

    state.isLoading = false
    await flushPromises()
    onLoadMore.mockImplementation(async () => {})
    await command.trigger('click')
    expect(onLoadMore).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('loads automatically when the end of the table is visible, observing against the viewport', async () => {
    const onLoadMore = vi.fn(async () => {})
    const state = reactive({ rows: [{ id: '1', name: 'Ada' }], hasMore: true, isLoading: false, onLoadMore })
    const wrapper = mountTable(state)
    await nextTick()
    const observer = liveObserver()!
    expect(observer.options).toMatchObject({ root: null, rootMargin: '0px', threshold: 0 })

    observer.reveal()
    expect(onLoadMore).toHaveBeenCalledTimes(1)
    await flushPromises()
    await nextTick()
    // 一批太短、末尾还在视口里：重新观察后再加载一批。
    liveObserver()!.reveal()
    expect(onLoadMore).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('pauses automatic loading after a failure until a manual retry succeeds', async () => {
    const onLoadMore = vi.fn<() => Promise<void>>(() => Promise.reject(new Error('offline')))
    const state = reactive({ rows: [{ id: '1', name: 'Ada' }], hasMore: true, isLoading: false, onLoadMore })
    const wrapper = mountTable(state)
    await nextTick()
    liveObserver()!.reveal()
    await flushPromises()
    await nextTick()
    expect(liveObserver()).toBeUndefined()

    onLoadMore.mockImplementation(() => Promise.resolve())
    await wrapper.get('.astryx-table__load-more button').trigger('click')
    expect(onLoadMore).toHaveBeenCalledTimes(2)
    await flushPromises()
    await nextTick()
    liveObserver()!.reveal()
    expect(onLoadMore).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })

  it('warns and pauses automatic loading when onLoadMore does not return a Promise', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onLoadMore = vi.fn(() => undefined as unknown as Promise<void>)
    const state = reactive({ rows: [{ id: '1', name: 'Ada' }], hasMore: true, isLoading: false, onLoadMore })
    const wrapper = mountTable(state)
    await nextTick()
    liveObserver()!.reveal()
    await nextTick()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('onLoadMore must return a Promise<void>'))
    expect(liveObserver()).toBeUndefined()
    warn.mockRestore()
    wrapper.unmount()
  })

  it('hides the default empty state while the first batch is loading', async () => {
    const state = reactive({ rows: [] as Row[], hasMore: true, isLoading: true, onLoadMore: async () => {} })
    const wrapper = mountTable(state)
    expect(wrapper.find('.astryx-table__empty').exists()).toBe(false)

    state.isLoading = false
    state.hasMore = false
    await nextTick()
    expect(wrapper.get('.astryx-table__empty').text()).toBe('No data')
    wrapper.unmount()
  })

  it('hands focus to the scroll region when the last batch removes the command', async () => {
    const state = reactive({ rows: [{ id: '1', name: 'Ada' }], hasMore: true, isLoading: false, onLoadMore: async () => {} })
    const wrapper = mountTable(state)
    const command = wrapper.get<HTMLButtonElement>('.astryx-table__load-more button')
    command.element.focus()
    const scroll = wrapper.get<HTMLElement>('.astryx-table-scroll').element
    const hadTabStop = scroll.hasAttribute('tabindex')

    state.hasMore = false
    await nextTick()
    expect(document.activeElement).toBe(scroll)
    if (!hadTabStop) {
      expect(scroll.getAttribute('tabindex')).toBe('-1')
      scroll.blur()
      expect(scroll.hasAttribute('tabindex')).toBe(false)
    }
    wrapper.unmount()
  })
})
