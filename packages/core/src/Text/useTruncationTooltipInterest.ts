import type { Ref } from 'vue'
import type { TooltipPresentInterestState } from '../Tooltip/tooltipPresentInterest.js'
import { shallowRef } from 'vue'
import { getInteractionModality, trackInteractionModality } from '../composables/internal/interactionModality.js'
import { matchesFocusVisible } from '../Tooltip/tooltipTriggerRules.js'

export interface TruncationTooltipInterest {
  /** 是否已有悬停、轻点或聚焦到达元素。变成 true 后不再变回去。 */
  isWanted: Readonly<Ref<boolean>>
  /** 让提示挂载的那次交互，提示读过后就不再更新。 */
  state: TooltipPresentInterestState
  onPointerenter: (event: PointerEvent) => void
  onPointerleave: () => void
  onPointerdown: (event: PointerEvent) => void
  onFocusin: (event: FocusEvent) => void
  onFocusout: () => void
}

/**
 * 截断文字的提示不随文字一起挂载，等第一次悬停、轻点或键盘聚焦才挂。
 * 一长串表格单元格因此不会在加载时各挂一个关着的提示层。
 * 这次交互记在 `state` 里，提示挂上后按自己的规则回应：悬停照常等延迟，轻点立刻打开。
 */
export function useTruncationTooltipInterest(isEnabled: () => boolean): TruncationTooltipInterest {
  const isWanted = shallowRef(false)
  const state: TooltipPresentInterestState = { interest: null, tapEvent: null, isRead: false }
  // 最近一次按下是手指或笔。手指点到里面的链接时，浏览器会在按下后给它焦点，
  // 那次焦点属于这次轻点，不能顶掉已经记下的轻点。
  let isTouchPress = false
  trackInteractionModality()

  function want(interest: 'hover' | 'tap' | 'focus', tapEvent: Event | null = null): void {
    if (!isEnabled() || state.isRead)
      return
    state.interest = interest
    state.tapEvent = tapEvent
    isWanted.value = true
  }

  function forget(interest: 'hover' | 'focus'): void {
    if (!state.isRead && state.interest === interest)
      state.interest = null
  }

  return {
    isWanted,
    state,
    onPointerenter(event) {
      if (event.pointerType !== 'touch')
        want('hover')
    },
    onPointerleave: () => forget('hover'),
    onPointerdown(event) {
      isTouchPress = event.pointerType === 'touch' || event.pointerType === 'pen'
      if (event.pointerType === 'touch') {
        want('tap', event)
        return
      }
      // 鼠标或笔按下会取消还没显示的悬停提示，和已挂载的提示一样。
      forget('hover')
    },
    onFocusin(event) {
      const target = event.target
      if (!(target instanceof Element) || !matchesFocusVisible(target))
        return
      if (isTouchPress && getInteractionModality() === 'pointer')
        return
      want('focus')
    },
    onFocusout: () => forget('focus'),
  }
}
