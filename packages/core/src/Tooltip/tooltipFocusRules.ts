import type { TooltipFocusTrigger } from './types.js'
import { getInteractionModality } from '../composables/internal/interactionModality.js'
import { isFocusable } from '../layer/focus.js'
import { isTextEntryControl, matchesFocusVisible } from './tooltipTriggerRules.js'

/**
 * 这次焦点算不算触发器的焦点，焦点到达时才判断：
 * - `always`：触发器自己或里面任何元素拿到焦点都算；
 * - `auto`：触发器自己拿到焦点算；焦点落在里面时，触发器此刻能聚焦才算。
 *   漫游 tabindex 的成员挂监听时可能是 `-1`，轮到它时已经是 Tab 停靠点了；
 *   普通包裹层仍然不理会里面子元素的焦点；
 * - `never`：都不算。
 */
export function isFocusForTrigger(mode: TooltipFocusTrigger, trigger: HTMLElement, target: EventTarget | null): boolean {
  if (mode === 'never')
    return false
  if (mode === 'always')
    return true
  return target === trigger || isFocusable(trigger)
}

/**
 * 落在 `target` 上的焦点会不会打开气泡。只有 `:focus-visible` 的焦点会，轻点从来不会。
 * 上一次输入是指针时，只有文本框会打开：浏览器给指针点进文本框的焦点也算 focus-visible，
 * 而指针按下之后脚本挪过来的焦点，在别的元素上也可能被标成 focus-visible。
 */
export function opensOnFocus(target: HTMLElement, isTouch: boolean): boolean {
  if (isTouch || !matchesFocusVisible(target))
    return false
  return isTextEntryControl(target) || getInteractionModality() !== 'pointer'
}

/**
 * 记住当前这次焦点在到达时算不算触发器的焦点。失焦时据此收起，
 * 哪怕触发器此后已不在 Tab 顺序里。
 */
export interface FocusGate {
  arrive: (trigger: HTMLElement | null, target: EventTarget | null) => boolean
  /** 这次失焦要不要收起提示。 */
  leave: (trigger: HTMLElement | null, target: EventTarget | null) => boolean
}

export function createFocusGate(mode: () => TooltipFocusTrigger): FocusGate {
  let counted = false
  return {
    arrive(trigger: HTMLElement | null, target: EventTarget | null): boolean {
      counted = trigger != null && isFocusForTrigger(mode(), trigger, target)
      return counted
    },
    leave(trigger: HTMLElement | null, target: EventTarget | null): boolean {
      const wasCounted = counted || (trigger != null && isFocusForTrigger(mode(), trigger, target))
      counted = false
      return wasCounted
    },
  }
}
