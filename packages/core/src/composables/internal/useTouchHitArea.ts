import type { MaybeRefOrGetter } from 'vue'
import type { HitInsets } from './hitArea.js'
import type { WatchHitAreaOptions } from './hitAreaWatch.js'
import { toValue, watch } from 'vue'
import { measureActions } from './actionGroupTracker.js'
import { clearHitInsets, groupGrowth, writeHitInsets } from './hitArea.js'
import { watchHitArea } from './hitAreaWatch.js'
import '../../../styles/touch-hit-area.css'

/**
 * @file useTouchHitArea.ts
 * @input 一个元素、它此刻是否接受点按，以及（可选）它怎么长
 * @output `useTouchHitArea`：粗指针下把元素的热区写成 `--astryx-hit-inset-*`，
 *   给 touch-hit-area.css 的热区伪元素读；`GROUP_HIT_AREA`：组的长法
 * @position 内部组合式函数。Button 的热区画在内容包裹层的 `::after` 上，
 *   ButtonGroup 和 ToggleButtonGroup 的热区画在组根的 `::before` 上（压在成员下面）。
 */

/**
 * 组的热区：每一边和贴着那条边的成员长得一样远。组在按下时自己读成员位置，把落在热区上的触摸
 * 交给最近的成员，所以不用按下时的复查。
 */
export const GROUP_HIT_AREA: WatchHitAreaOptions = {
  // 隐藏的成员没有盒子，不撑大组的热区。
  growth: (box, group): HitInsets => groupGrowth(
    box,
    measureActions(group, 'touch').filter(rect => rect.right > rect.left && rect.bottom > rect.top),
  ),
  checkAtPress: false,
}

/**
 * 在 `enabled` 为真（元素接受点按）期间看着 `element` 的热区。元素换了、关掉或卸载时停下并清掉写过的值。
 * 细指针下共用的测量什么都不观察，热区保持 0。
 */
export function useTouchHitArea(
  element: MaybeRefOrGetter<HTMLElement | null | undefined>,
  enabled: MaybeRefOrGetter<boolean>,
  options?: WatchHitAreaOptions,
): void {
  watch(
    () => (toValue(enabled) ? toValue(element) ?? null : null),
    (target, _previous, onCleanup) => {
      if (target == null)
        return
      let hasWritten = false
      const stop = watchHitArea(target, (insets) => {
        hasWritten = true
        writeHitInsets(target, insets)
      }, options)
      onCleanup(() => {
        stop()
        if (hasWritten)
          clearHitInsets(target)
      })
    },
    { immediate: true, flush: 'post' },
  )
}
