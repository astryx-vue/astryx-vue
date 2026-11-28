/**
 * @file useRefreshControl.ts
 * @input onRefresh、isRefreshing、isDisabled 和 announce；触摸层（useRefreshTouch.ts）
 * @output useRefreshControl：被拉的内容和 app 指示器的模板 ref 函数、`isRefreshing`，以及不靠手势的 `refresh()`
 * @position lab 的下拉刷新：状态、`onRefresh`、播报和开关。手指驱动的一切在 useRefreshTouch.ts，
 *   只有这个文件引入它。
 */

// 手指能拉，触控板的双指滚动在内容到顶后也能拉，映射、触发和回落都一样。下拉只发生在能滚的元素里。
// 鼠标或笔的拖动留给浏览器选文字。指示器由 app 画，播报什么也由 app 说。

import type { MaybeRefOrGetter, Ref } from 'vue'
import type { RefreshEffect, RefreshEvent, RefreshState } from './refreshModel'
import { useAnnounce } from '@astryx-vue/core'
import { computed, nextTick, onScopeDispose, readonly, shallowRef, toValue, watch } from 'vue'
import { INITIAL_REFRESH_STATE, reduceRefresh } from './refreshModel'
import { useRefreshTouch } from './useRefreshTouch'

export { REFRESH_REVEAL_VAR } from './refreshIndicator'

export interface UseRefreshControlOptions {
  /** 下拉触发或 `refresh()` 时调用。返回 Promise 时（非受控）刷新持续到它落定。 */
  onRefresh?: () => unknown
  /**
   * 受控的刷新状态：`true` 进入刷新（同 `beginRefreshing()`），`false` 结束（同 `endRefreshing()`）。
   * 不给时由 `onRefresh` 返回的 Promise 决定。
   */
  isRefreshing?: MaybeRefOrGetter<boolean | undefined>
  /** 关掉下拉。进行中的刷新照常继续。 */
  isDisabled?: MaybeRefOrGetter<boolean | undefined>
  /** 刷新开始时礼貌地播报，比如「正在刷新」，用 app 自己的语言。不给就什么都不播。 */
  announce?: MaybeRefOrGetter<string | undefined>
}

export interface UseRefreshControlResult {
  /** 绑到包住滚动内容的元素上（被拉的就是它）：`:ref="pull.contentRef"`。 */
  contentRef: (element: unknown) => void
  /**
   * 绑到 app 的指示器上，比如一个 Spinner。指示器是一条和刷新高度一样高的带子，放在一个裁剪溢出、
   * 骑在内容上沿的盒子底部。这里会让带子逆着内容移动，所以它一直钉在滚动视图顶部，就是
   * UIRefreshControl 待的地方；内容的上沿盖住它。下拉露出它多少（0 到 1）写在 `REFRESH_REVEAL_VAR`，
   * 回落把内容带回去时让它淡掉。
   */
  indicatorRef: (element: unknown) => void
  /** 是否正在刷新。 */
  isRefreshing: Readonly<Ref<boolean>>
  /** 不用下拉开始一次刷新（非手势的路径）。 */
  refresh: () => void
}

/**
 * 照 UIRefreshControl 做的下拉刷新，给 app 自己的滚动容器用。把内容拉过顶部露出 app 的指示器，
 * 拉过触发点就在手指还按着时开始刷新；松手后内容落在刷新时的内边距上，刷新结束再滑上去。
 *
 * 手指能拉，触控板在顶部的双指滚动也能拉；鼠标或笔的拖动留给浏览器选文字，鼠标滚轮的一格格
 * 从不下拉。下拉没有键盘或辅助技术的等价操作，所以一定要另给一个刷新办法，比如调 `refresh()` 的按钮。
 */
export function useRefreshControl(options: UseRefreshControlOptions = {}): UseRefreshControlResult {
  const announcer = useAnnounce()
  const isRefreshingState = shallowRef(false)
  const isControlled = (): boolean => toValue(options.isRefreshing) !== undefined
  let model: RefreshState = INITIAL_REFRESH_STATE
  const modelRef = { get current(): RefreshState {
    return model
  } }
  let refreshToken = 0

  const touch = useRefreshTouch({
    isPullEnabled: () => toValue(options.isDisabled) !== true,
    model: modelRef,
    dispatch: event => dispatch(event),
  })

  function say(): void {
    const words = toValue(options.announce)
    if (words)
      announcer(words)
  }

  function callHandler(): void {
    const token = ++refreshToken
    const result = options.onRefresh?.()
    if (isControlled()) {
      // 受控时 prop 说了算：父组件不接手这次刷新（设 `isRefreshing`），下一次更新时就结束。
      void nextTick(() => {
        if (token === refreshToken && toValue(options.isRefreshing) === false)
          dispatch({ type: 'end' })
      })
      return
    }
    const settle = (): void => {
      if (token === refreshToken)
        dispatch({ type: 'end' })
    }
    void Promise.resolve(result).then(settle, settle)
  }

  function run(effect: RefreshEffect): void {
    switch (effect.type) {
      case 'trigger':
        isRefreshingState.value = true
        touch.trigger()
        say()
        callHandler()
        break
      case 'begin':
        isRefreshingState.value = true
        say()
        touch.begin()
        if (effect.callHandler)
          callHandler()
        break
      case 'settle':
        touch.settle(effect.to)
        break
      case 'end':
        isRefreshingState.value = false
        touch.end()
        break
    }
  }

  function dispatch(event: RefreshEvent): void {
    const next = reduceRefresh(model, event)
    model = next.state
    for (const effect of next.effects)
      run(effect)
  }

  // 受控的 `isRefreshing` 交给触摸层（它在合成线程上播内边距和滑动）和播报；渲染的值就是 prop 本身。
  watch(() => toValue(options.isRefreshing), (value) => {
    if (value !== undefined)
      dispatch(value ? { type: 'begin', source: 'program' } : { type: 'end' })
  }, { immediate: true })

  onScopeDispose(() => {
    refreshToken++
  })

  return {
    contentRef: touch.contentRef,
    indicatorRef: touch.indicatorRef,
    // 受控时从第一次渲染起就是 prop。
    isRefreshing: readonly(computed(() => (isControlled() ? Boolean(toValue(options.isRefreshing)) : isRefreshingState.value))),
    refresh: () => dispatch({ type: 'begin', source: 'user' }),
  }
}
