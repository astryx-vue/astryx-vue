import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import type { OptionActionNode } from '../selectors/optionAction.js'
import { onScopeDispose, ref, shallowRef, toValue, watch } from 'vue'
import { devWarn } from './useDevWarning.js'

/**
 * 一条可搜索的候选项。`auxiliaryData` 用来挂业务数据，组件本身只读 `id` 和 `label`。
 */
export interface SearchableItem<TAux = unknown> {
  id: string
  label: string
  disabled?: boolean
  description?: string
  /** 这一项旁边的操作。点它不会改选择。有一项带了操作，菜单就变成两列网格。 */
  action?: OptionActionNode | null
  auxiliaryData?: TAux
}

/**
 * 一次搜索的上下文，作为 `search` 的第三个参数。
 */
export interface SearchContext<T extends SearchableItem = SearchableItem> {
  /**
   * 在 `search()` 落定之前先显示一份列表，比如页面上已经有的匹配项，服务端的答案随后追加。
   *
   * 每份列表都是数据源当时的完整答案。同一个查询的第一份列表可以换掉已有的行；
   * 之后的每一份（包括 `search()` 的返回值）把已经显示的行留在最前面、顺序不变，
   * 新行只加在它们后面，所以高亮的行不会被挤走。空列表不动已显示的行。
   * 查询已经不是当前查询、或 `search()` 已经落定之后的调用会被忽略。
   */
  update: (items: T[]) => void
}

/**
 * 搜索数据源。同步数组和 Promise 都可以。
 * 新一次搜索开始时会调用 `cancel`，并传入 AbortSignal，用来丢掉过期请求。
 * 搜索菜单还会传入 `context`，数据源可以用它先显示已有的匹配项。
 */
export interface SearchSource<T extends SearchableItem = SearchableItem> {
  search: (query: string, signal?: AbortSignal, context?: SearchContext<T>) => Promise<T[]> | T[]
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
  /** 当前的 items 和 status 是为哪个查询发出的请求得到的；请求还在防抖时它落后于 `query`。 */
  searchedQuery: Ref<string | null>
  /** 忽略防抖，立刻再搜一次。 */
  reload: () => void
  cancel: () => void
}

function isPromise<T>(value: Promise<T> | T): value is Promise<T> {
  return typeof (value as Promise<T>)?.then === 'function'
}

/**
 * 同一个查询的后一份列表接在前一份已显示的行后面：已显示的行留在最前面、顺序不变，
 * 新行只加在后面。后一份列表移动或去掉了已显示的行时按它给的显示，并在开发期警告。
 */
function appendAfterShown<T extends SearchableItem>(shown: readonly T[], next: readonly T[]): T[] {
  const nextById = new Map(next.map(item => [item.id, item]))
  const kept = shown.filter(item => nextById.has(item.id))
  const keepsShown = kept.length === shown.length
    && next.filter(item => shown.some(row => row.id === item.id)).every((item, index) => item.id === shown[index]?.id)
  if (!keepsShown) {
    devWarn('SearchSource', 'a later list for the same query moved or removed rows that were already shown, so it is shown as given. Keep the shown rows first and in order, and add new rows after them.')
    return [...next]
  }
  const shownIds = new Set(shown.map(item => item.id))
  return [...shown.map(item => nextById.get(item.id) as T), ...next.filter(item => !shownIds.has(item.id))]
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
  const searchedQuery = ref<string | null>(null)
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
    searchedQuery.value = query
    const isBootstrap = query.trim() === '' && source.bootstrap != null
    // 同一个查询已经显示过的列表；新一份列表接在它的行后面。
    let shown: T[] | null = null
    let isSettled = false
    const context: SearchContext<T> = {
      update: (list) => {
        if (isSettled || captured !== requestId || ac.signal.aborted)
          return
        if (list.length === 0 && shown != null)
          return
        shown = shown == null ? [...list] : appendAfterShown(shown, list)
        items.value = shown
        error.value = null
      },
    }
    const pending = isBootstrap
      ? source.bootstrap!(ac.signal)
      : source.search(query, ac.signal, context)

    try {
      let resolved: T[]
      if (isPromise(pending)) {
        status.value = 'loading'
        resolved = await pending
      }
      else {
        resolved = pending
      }
      isSettled = true
      if (captured !== requestId || ac.signal.aborted)
        return
      if (!isBootstrap && shown != null && resolved.length > 0)
        resolved = appendAfterShown(shown, resolved)
      else if (!isBootstrap && shown != null)
        resolved = shown
      items.value = resolved
      error.value = null
      status.value = resolved.length === 0 ? 'empty' : 'ready'
    }
    catch (caught) {
      isSettled = true
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
    searchedQuery,
    reload: () => schedule(true),
    cancel,
  }
}
