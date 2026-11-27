import type { ComputedRef, Ref } from 'vue'
import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { computed, ref, shallowRef, watch } from 'vue'

/** 一次画多少行；滚到接近底部、或焦点走到最后一行时再画下一批。 */
export const LIST_RENDER_BATCH_SIZE = 50
/** 离列表底部这么近就画下一批。 */
const LOAD_MORE_THRESHOLD_PX = 200

export interface TokenizerSheetSearchOptions<T extends SearchableItem> {
  /** 弹层是否开着。关着时不搜，并作废还没回来的请求。 */
  isOpen: () => boolean
  /** 弹层打开时的查询：字段替它保管，弹层卸载再挂上也还在。 */
  initialQuery: string
  searchSource: () => SearchSource<T>
  minQueryLength: () => number
  maxMenuItems: () => number
  debounceMs: () => number
  /** 打开那一刻已选中的条目：列表开头那一段，按原顺序。 */
  selectedAtOpen: () => readonly T[]
  /** 草稿里现在选中的条目：勾选状态跟着它，行的位置不动。 */
  draft: () => readonly T[]
}

export interface TokenizerSheetSearch<T extends SearchableItem> {
  query: Ref<string>
  /** 换查询：收回渲染窗口，要搜的查询先进入「加载中」。 */
  setQuery: (next: string) => void
  /** 这一次搜索的结果（被 `maxMenuItems` 截掉之前的部分）。 */
  results: ComputedRef<T[]>
  /** 从打开、从每次换查询起，直到这次搜索落定。 */
  isPending: Ref<boolean>
  /** 查询不为空、但短于 `minQueryLength`：不搜，也不显示空状态。 */
  isBelowMinQuery: ComputedRef<boolean>
  visibleItems: ComputedRef<T[]>
  renderedItems: ComputedRef<T[]>
  /** 被条数上限藏起来、又没在列表里出现的匹配数。 */
  hiddenMatchCount: ComputedRef<number>
  /** 每落定一次跑过的搜索加一，播报结果数用。 */
  settledCount: Ref<number>
  /** 再画一批。 */
  renderMore: () => void
  onScroll: (event: Event) => void
}

/**
 * Tokenizer 底部弹层的搜索状态（上游 TokenizerBottomSheet 的 sheet session）。
 *
 * 列表顺序：打开时选中的排最前（按选中顺序），然后是草稿里新选、结果里没有的，最后是
 * 搜索结果。勾选一行不会让它跳走，下次打开才重新分组。空查询立即请求 `bootstrap`，
 * 打字的查询等 `debounceMs`；同步返回的搜索源在这次渲染之前就落定，不会闪「加载中」。
 * 新请求作废旧请求，关闭和卸载时取消还没回来的请求。
 */
export function useTokenizerSheetSearch<T extends SearchableItem>(options: TokenizerSheetSearchOptions<T>): TokenizerSheetSearch<T> {
  const query = ref(options.initialQuery)
  const sourceResults = shallowRef<T[]>([])
  const sourceHidden = shallowRef<T[]>([])
  const renderedCount = ref(LIST_RENDER_BATCH_SIZE)
  const settledCount = ref(0)
  let lastLoadHeight: number | null = null
  let sequence = 0

  const willSearchFor = (trimmed: string): boolean => trimmed === '' || trimmed.length >= options.minQueryLength()
  const isPending = ref(options.isOpen() && willSearchFor(options.initialQuery.trim()))
  const isBelowMinQuery = computed(() => !willSearchFor(query.value.trim()))
  const results = computed(() => isBelowMinQuery.value ? [] : sourceResults.value)

  function resetWindow(): void {
    lastLoadHeight = null
    renderedCount.value = LIST_RENDER_BATCH_SIZE
  }

  function setQuery(next: string): void {
    resetWindow()
    isPending.value = willSearchFor(next.trim())
    query.value = next
  }

  watch(options.isOpen, (open) => {
    if (!open)
      return
    resetWindow()
    isPending.value = willSearchFor(query.value.trim())
  })

  watch(
    [options.isOpen, query, options.minQueryLength, options.maxMenuItems, options.debounceMs],
    ([open, current], _previous, onCleanup) => {
      const seq = ++sequence
      if (!open)
        return
      const trimmed = current.trim()
      if (!willSearchFor(trimmed))
        return
      let unanswered: SearchSource<T> | null = null
      const settle = (items: T[]): void => {
        unanswered = null
        if (sequence !== seq)
          return
        const max = options.maxMenuItems()
        sourceResults.value = items.slice(0, max)
        sourceHidden.value = items.slice(max)
        isPending.value = false
        settledCount.value += 1
      }
      const run = (): void => {
        const source = options.searchSource()
        let answer: T[] | PromiseLike<T[]>
        try {
          answer = trimmed === '' ? (source.bootstrap?.() ?? []) : source.search(current)
        }
        catch {
          answer = []
        }
        if (Array.isArray(answer)) {
          settle(answer)
          return
        }
        unanswered = source
        void Promise.resolve(answer).then(settle, () => settle([]))
      }
      const delay = options.debounceMs()
      const timer = trimmed !== '' && delay > 0 ? setTimeout(run, delay) : null
      if (timer == null)
        run()
      onCleanup(() => {
        if (timer != null)
          clearTimeout(timer)
        const source: SearchSource<T> | null = unanswered
        unanswered = null
        source?.cancel?.()
      })
    },
    { immediate: true },
  )

  const visibleItems = computed<T[]>(() => {
    const normalized = query.value.trim().toLowerCase()
    const matches = (item: T): boolean => normalized === '' || item.label.toLowerCase().includes(normalized)
    const atOpen = options.selectedAtOpen().filter(matches)
    const atOpenIds = new Set(atOpen.map(item => item.id))
    const resultIds = new Set(results.value.map(item => item.id))
    const missing = options.draft().filter(item => !atOpenIds.has(item.id) && !resultIds.has(item.id) && matches(item))
    return [...atOpen, ...missing, ...results.value.filter(item => !atOpenIds.has(item.id))]
  })

  const renderedItems = computed(() => visibleItems.value.slice(0, renderedCount.value))

  const hiddenMatchCount = computed(() => {
    if (isBelowMinQuery.value)
      return 0
    const listed = new Set(visibleItems.value.map(item => item.id))
    return sourceHidden.value.filter(item => !listed.has(item.id)).length
  })

  function renderMore(): void {
    renderedCount.value = Math.min(renderedCount.value + LIST_RENDER_BATCH_SIZE, visibleItems.value.length)
  }

  function onScroll(event: Event): void {
    const list = event.currentTarget as HTMLElement | null
    if (list == null)
      return
    const distance = list.scrollHeight - list.scrollTop - list.clientHeight
    if (distance > LOAD_MORE_THRESHOLD_PX || lastLoadHeight === list.scrollHeight)
      return
    lastLoadHeight = list.scrollHeight
    renderMore()
  }

  return {
    query,
    setQuery,
    results,
    isPending,
    isBelowMinQuery,
    visibleItems,
    renderedItems,
    hiddenMatchCount,
    settledCount,
    renderMore,
    onScroll,
  }
}
