import type { MaybeRefOrGetter } from 'vue'
import type { TableLoadingState, TablePlugin } from '../types.js'
import { h, onScopeDispose, reactive, toValue, watch } from 'vue'
import { devWarn } from '../../composables/useDevWarning.js'
import TableLoadMore from '../TableLoadMore.vue'

export interface UseTableInfiniteScrollConfig {
  /** 数据源还能再给一批吗。为 false 时去掉加载控件和观察。 */
  hasMore: boolean
  /** 调用方自己管理的加载状态。为 true 时不发新请求。 */
  isLoading: boolean
  /** 取下一批并追加到行里，返回这一批完成时 settle 的 Promise。 */
  onLoadMore: () => Promise<void>
}

/**
 * 一次加载请求的生命周期，自动加载和手动「加载更多」共用这一把锁：
 * 发出请求就上锁；Promise settle 之后，等到下一次 `isLoading` 为 false 才解锁。
 * 失败（抛错、拒绝、没返回 Promise）会暂停自动加载，手动按钮仍然能重试，成功一次就恢复。
 */
export interface InfiniteScrollRuntime {
  readonly state: { isPending: boolean, isSettled: boolean, isAutoPaused: boolean }
  /** 现在能不能发请求。 */
  canRequest: (isAutomatic: boolean) => boolean
  request: (isAutomatic: boolean) => void
  config: () => UseTableInfiniteScrollConfig
}

function createRuntime(config: () => UseTableInfiniteScrollConfig): InfiniteScrollRuntime {
  const state = reactive({ isPending: false, isSettled: false, isAutoPaused: false })
  let generation = 0
  let lastSuccess = false

  watch(() => [state.isSettled, config().isLoading] as const, ([isSettled, isLoading]) => {
    if (!isSettled || isLoading)
      return
    state.isPending = false
    state.isSettled = false
    if (lastSuccess)
      state.isAutoPaused = false
  }, { flush: 'post' })

  function canRequest(isAutomatic: boolean): boolean {
    const current = config()
    return current.hasMore && !current.isLoading && !state.isPending && !(isAutomatic && state.isAutoPaused)
  }

  function settle(id: number, isSuccessful: boolean): void {
    if (id !== generation || !state.isPending)
      return
    lastSuccess = isSuccessful
    if (!isSuccessful)
      state.isAutoPaused = true
    state.isSettled = true
  }

  function request(isAutomatic: boolean): void {
    if (!canRequest(isAutomatic))
      return
    generation += 1
    const id = generation
    state.isPending = true
    state.isSettled = false
    try {
      const result = config().onLoadMore() as unknown
      if (result == null || typeof (result as Promise<void>).then !== 'function') {
        state.isPending = false
        state.isAutoPaused = true
        devWarn('useTableInfiniteScroll', 'onLoadMore must return a Promise<void>; automatic loading is paused.')
        return
      }
      void Promise.resolve(result).then(() => settle(id, true), () => settle(id, false))
    }
    catch {
      settle(id, false)
    }
  }

  onScopeDispose(() => {
    generation += 1
  })

  return { state, canRequest, request, config }
}

/**
 * 按批加载扁平数据。行、游标、错误提示都留在调用方。
 * 只要 `hasMore` 为 true，表格下方就一直有一个「加载更多」按钮；IntersectionObserver 看见表格末尾时自动加载。
 * 第一批还在加载时，表格不显示默认的空状态。
 */
export function useTableInfiniteScroll<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableInfiniteScrollConfig>,
): TablePlugin<T> {
  const runtime = createRuntime(() => toValue(config))
  return {
    loadingState(): TableLoadingState {
      const current = toValue(config)
      return { hasMore: current.hasMore, isLoading: current.hasMore && (current.isLoading || runtime.state.isPending) }
    },
    below: () => h(TableLoadMore, { runtime }),
  }
}
