import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { onScopeDispose, ref, shallowRef, toValue, watch } from 'vue'

/**
 * 一条可搜索的候选项。`auxiliaryData` 用来挂业务数据，组件本身只读 `id` 和 `label`。
 */
export interface SearchableItem<TAux = unknown> {
  id: string
  label: string
  disabled?: boolean
  description?: string
  auxiliaryData?: TAux
}

/**
 * 搜索数据源。同步数组和 Promise 都可以。
 * 新一次搜索开始时会调用 `cancel`，并传入 AbortSignal，用来丢掉过期请求。
 */
export interface SearchSource<T extends SearchableItem = SearchableItem> {
  search: (query: string, signal?: AbortSignal) => Promise<T[]> | T[]
  bootstrap?: (signal?: AbortSignal) => Promise<T[]> | T[]
  cancel?: () => void
}

export interface CreateStaticSourceOptions<T extends SearchableItem = SearchableItem> {
  /** 除 label 之外还要参与子串匹配的词。 */
  keywords?: (item: T) => readonly string[]
}

/**
 * 用本地数组做一个搜索源，按 label 和可选关键词做子串匹配。
 * 空查询走 bootstrap，返回全部条目。
 */
export function createStaticSource<T extends SearchableItem>(
  items: readonly T[],
  options?: CreateStaticSourceOptions<T>,
): SearchSource<T> {
  const keywords = options?.keywords

  function matches(item: T, query: string): boolean {
    if (item.label.toLowerCase().includes(query))
      return true
    if (!keywords)
      return false
    return keywords(item).some(word => word.toLowerCase().includes(query))
  }

  return {
    search(query: string): T[] {
      const normalized = query.toLowerCase().trim()
      if (normalized === '')
        return [...items]
      return items.filter(item => matches(item, normalized))
    },
    bootstrap(): T[] {
      return [...items]
    },
  }
}

export type AsyncSourceStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error'

export interface UseAsyncSourceOptions<T extends SearchableItem = SearchableItem> {
  source: MaybeRefOrGetter<SearchSource<T>>
  query: Ref<string>
  /** 为 false 时取消进行中的请求，不再发起新请求。 */
  enabled: Ref<boolean>
  /** 输入停止后再搜索。0 表示立刻搜索。默认 150。 */
  debounceMs?: MaybeRefOrGetter<number>
}

export interface AsyncSource<T extends SearchableItem = SearchableItem> {
  items: ShallowRef<T[]>
  status: Ref<AsyncSourceStatus>
  error: ShallowRef<unknown>
  /** 忽略防抖，立刻再搜一次。 */
  reload: () => void
  cancel: () => void
}

function isPromise<T>(value: Promise<T> | T): value is Promise<T> {
  return typeof (value as Promise<T>)?.then === 'function'
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * 把 SearchSource 接到一个查询字符串上：防抖、取消过期请求、暴露加载 / 空 / 错误状态。
 * 空查询优先调用 bootstrap，没有 bootstrap 时调用 search('')。
 */
export function useAsyncSource<T extends SearchableItem = SearchableItem>(
  options: UseAsyncSourceOptions<T>,
): AsyncSource<T> {
  const items = shallowRef<T[]>([]) as ShallowRef<T[]>
  const status = ref<AsyncSourceStatus>('idle')
  const error = shallowRef<unknown>(null)
  let requestId = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | undefined

  function cancel(): void {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
    controller?.abort()
    controller = undefined
    toValue(options.source).cancel?.()
  }

  async function run(captured: number): Promise<void> {
    if (captured !== requestId)
      return

    const source = toValue(options.source)
    const ac = new AbortController()
    controller = ac
    const query = options.query.value
    const pending = query.trim() === '' && source.bootstrap
      ? source.bootstrap(ac.signal)
      : source.search(query, ac.signal)

    try {
      let resolved: T[]
      if (isPromise(pending)) {
        status.value = 'loading'
        resolved = await pending
      }
      else {
        resolved = pending
      }
      if (captured !== requestId || ac.signal.aborted)
        return
      items.value = resolved
      error.value = null
      status.value = resolved.length === 0 ? 'empty' : 'ready'
    }
    catch (caught) {
      if (captured !== requestId || ac.signal.aborted || isAbortError(caught))
        return
      items.value = []
      error.value = caught
      status.value = 'error'
    }
  }

  function schedule(immediate = false): void {
    cancel()
    const captured = ++requestId
    if (!options.enabled.value) {
      status.value = 'idle'
      return
    }
    const delay = immediate ? 0 : Math.max(0, toValue(options.debounceMs) ?? 150)
    if (delay === 0) {
      void run(captured)
      return
    }
    timer = setTimeout(() => {
      timer = undefined
      void run(captured)
    }, delay)
  }

  watch(
    [options.query, options.enabled, () => toValue(options.source)],
    () => {
      schedule(false)
    },
    { immediate: true },
  )

  onScopeDispose(cancel)

  return {
    items,
    status,
    error,
    reload: () => schedule(true),
    cancel,
  }
}
