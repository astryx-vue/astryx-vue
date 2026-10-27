import type { ComputedRef, Ref } from 'vue'
import type { SearchableItem, SearchSource } from './types.js'
import { computed, onScopeDispose, ref, watch } from 'vue'

/** 一次画多少行；滚到接近底部再接着画下一批。 */
export const LIST_RENDER_BATCH_SIZE = 50
/** 离底部这么近就算滚到底了，可以接着画下一批。 */
export const LOAD_MORE_THRESHOLD_PX = 200

export interface SheetSearchOptions<T extends SearchableItem> {
  /** 面板是不是开着。关着的时候不搜。 */
  isOpen: () => boolean
  query: Ref<string>
  searchSource: () => SearchSource<T>
  minQueryLength: () => number
  maxMenuItems: () => number
  debounceMs: () => number
  /** 打开那一刻已经选中的条目，决定列表开头那一段的顺序。 */
  selectedAtOpen: () => readonly T[]
  /** 当前选中的条目。选中状态跟着它变，行的位置不动。 */
  selectedNow: () => readonly T[]
}

/**
 * 底部面板的搜索状态：防抖搜索、结果截断、可视条目拼接、分批渲染。
 *
 * 列表顺序的规则：打开时选中的排前面，之后新选中但结果里没有的接在后面，
 * 最后是搜索结果。这样勾选一行不会让它跳走，下次打开才重新分组。
 */
export interface SheetSearch<T extends SearchableItem> {
  results: Ref<T[]>
  isSearching: Ref<boolean>
  visibleItems: ComputedRef<T[]>
  renderedItems: ComputedRef<T[]>
  renderedCount: Ref<number>
  /** 把渲染窗口收回第一批。 */
  resetWindow: () => void
  handleScroll: (event: Event) => void
}

export function useSheetSearch<T extends SearchableItem>(options: SheetSearchOptions<T>): SheetSearch<T> {
  const results = ref<T[]>([]) as Ref<T[]>
  const isSearching = ref(false)
  const renderedCount = ref(LIST_RENDER_BATCH_SIZE)
  let sequence = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let lastLoadScrollHeight: number | null = null

  function resetWindow(): void {
    lastLoadScrollHeight = null
    renderedCount.value = LIST_RENDER_BATCH_SIZE
  }

  const visibleItems = computed<T[]>(() => {
    const normalized = options.query.value.trim().toLowerCase()
    const matches = (item: T): boolean =>
      normalized === '' || item.label.toLowerCase().includes(normalized)

    const selectedAtOpenMatches = options.selectedAtOpen().filter(matches)
    const selectedAtOpenIds = new Set(selectedAtOpenMatches.map(item => item.id))
    const resultIds = new Set(results.value.map(item => item.id))
    const selectedMissingFromResults = options.selectedNow().filter(
      item => !selectedAtOpenIds.has(item.id) && !resultIds.has(item.id) && matches(item),
    )

    return [
      ...selectedAtOpenMatches,
      ...selectedMissingFromResults,
      ...results.value.filter(item => !selectedAtOpenIds.has(item.id)),
    ]
  })

  const renderedItems = computed<T[]>(() => visibleItems.value.slice(0, renderedCount.value))

  function search(): void {
    if (!options.isOpen())
      return
    const current = ++sequence
    const run = async (): Promise<void> => {
      isSearching.value = true
      try {
        const source = options.searchSource()
        const trimmed = options.query.value.trim()
        let items: T[]
        if (trimmed === '') {
          items = source.bootstrap
            ? await source.bootstrap()
            : await source.search('')
        }
        else if (trimmed.length < options.minQueryLength()) {
          items = []
        }
        else {
          items = await source.search(options.query.value)
        }
        if (sequence === current)
          results.value = items.slice(0, options.maxMenuItems())
      }
      finally {
        if (sequence === current)
          isSearching.value = false
      }
    }

    if (timer != null)
      clearTimeout(timer)
    const delay = options.debounceMs()
    if (delay > 0)
      timer = setTimeout(() => void run(), delay)
    else
      void run()
  }

  watch(
    [options.isOpen, options.query, options.searchSource, options.minQueryLength, options.maxMenuItems, options.debounceMs],
    () => {
      // 换一次查询就把渲染窗口收回第一批，否则搜出短列表时还留着上次滚出来的长度。
      resetWindow()
      search()
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    if (timer != null)
      clearTimeout(timer)
  })

  /** 滚到离底部 200px 以内就多画一批；同一个 scrollHeight 只触发一次。 */
  function handleScroll(event: Event): void {
    const list = event.currentTarget as HTMLElement | null
    if (list == null)
      return
    const distanceFromBottom = list.scrollHeight - list.scrollTop - list.clientHeight
    if (distanceFromBottom > LOAD_MORE_THRESHOLD_PX || lastLoadScrollHeight === list.scrollHeight)
      return
    lastLoadScrollHeight = list.scrollHeight
    renderedCount.value = Math.min(renderedCount.value + LIST_RENDER_BATCH_SIZE, visibleItems.value.length)
  }

  return { results, isSearching, visibleItems, renderedItems, renderedCount, resetWindow, handleScroll }
}
