import type { ComputedRef, ShallowRef } from 'vue'
import type { TruncateTooltip, Truncation } from './useTruncation.js'
import type { TruncationTooltipInterest } from './useTruncationTooltipInterest.js'
import { computed, shallowRef } from 'vue'
import { truncatePlacement, useTruncation } from './useTruncation.js'
import { useTruncationTooltipInterest } from './useTruncationTooltipInterest.js'

export interface TruncationTooltipBinding {
  /** 提示方位；没有截断或关掉了提示时为 null，这时也不测量。 */
  placement: ComputedRef<'above' | 'below' | 'start' | 'end' | null>
  /** 绑到被截断的元素上。 */
  bind: (value: Element | null) => void
  element: Readonly<ShallowRef<HTMLElement | null>>
  truncation: Truncation
  interest: TruncationTooltipInterest
  /** 文字确实被截断、并且已有交互到达时才挂载提示。 */
  isMounted: ComputedRef<boolean>
}

/** Text 和 Heading 共用：测量截断，并在第一次交互时才挂载显示全文的提示。 */
export function useTruncationTooltip(
  maxLines: () => number,
  hasTruncateTooltip: () => TruncateTooltip | undefined,
): TruncationTooltipBinding {
  const placement = computed(() => maxLines() > 0 ? truncatePlacement(hasTruncateTooltip()) : null)
  // 关掉提示时不测量：没有地方用得上结果。
  const truncation = useTruncation(() => placement.value == null ? 0 : maxLines())
  const isEnabled = computed(() => placement.value != null && truncation.isTruncated.value)
  const interest = useTruncationTooltipInterest(() => isEnabled.value)
  const element = shallowRef<HTMLElement | null>(null)

  function bind(value: Element | null): void {
    element.value = value instanceof HTMLElement ? value : null
    truncation.bind(value)
  }

  return {
    placement,
    bind,
    element,
    truncation,
    interest,
    isMounted: computed(() => isEnabled.value && interest.isWanted.value),
  }
}
