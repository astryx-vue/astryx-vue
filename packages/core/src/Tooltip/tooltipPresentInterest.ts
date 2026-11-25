import type { InjectionKey } from 'vue'

/**
 * 让提示挂载的那次交互：鼠标或笔还停在锚点上的悬停、一次轻点，或锚点里的焦点。
 * 没有时为 `null`。
 */
export type TooltipPresentInterest = 'hover' | 'tap' | 'focus' | null

/**
 * 截断文字等到第一次悬停、轻点或聚焦才挂载提示。这次交互先存在这里，
 * 提示的触发器接上后读一次、标成已读，所以之后再挂载一次也不会自己打开。
 */
export interface TooltipPresentInterestState {
  interest: TooltipPresentInterest
  /** 轻点时的那次按下事件，交给提示按触摸规则判断。 */
  tapEvent: Event | null
  isRead: boolean
}

/** 仅库内部使用，不从 Tooltip 入口导出。 */
export const tooltipPresentInterestKey: InjectionKey<TooltipPresentInterestState> = Symbol('astryx-tooltip-present-interest')

export interface PresentInterestAnswers {
  hover: () => void
  tap: (tapEvent: Event | null) => void
  /** 焦点还在触发器里时才调用，参数是持有焦点的元素。 */
  focus: (focused: HTMLElement) => void
}

/** 提示的触发器刚接上：按提示自己的规则回应让它挂载的那次交互，只回应一次。 */
export function answerPresentInterest(
  state: TooltipPresentInterestState | null,
  trigger: HTMLElement,
  answers: PresentInterestAnswers,
): void {
  if (state == null || state.isRead)
    return
  state.isRead = true
  const { interest, tapEvent } = state
  state.tapEvent = null
  if (interest === 'hover') {
    answers.hover()
  }
  else if (interest === 'tap') {
    answers.tap(tapEvent)
  }
  else if (interest === 'focus') {
    const focused = trigger.ownerDocument.activeElement
    if (focused instanceof HTMLElement && trigger.contains(focused))
      answers.focus(focused)
  }
}
