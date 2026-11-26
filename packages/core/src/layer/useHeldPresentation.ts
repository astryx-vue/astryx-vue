/**
 * 浮层还是底部弹层，打开时选定，保持到关闭结束（上游 cd3787bac、6422a1db4）。
 *
 * 解析读当前主题的「紧凑触屏」定义（useAdaptivePresentation）。打开那一刻的
 * 结论由呈现保持记住：开着的时候转屏、换指针都不会把底部弹层换成浮层，退场也
 * 用同一种呈现播完。浮层没有退场，关上就放开；底部弹层等退场播完，由组件调
 * `settle()` 放开。
 */
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { AdaptivePresentation, ResolvedAdaptivePresentation } from '../composables/internal/presentation.js'
import { computed, toValue, watch } from 'vue'
import { useAdaptivePresentation } from '../composables/internal/presentation.js'
import { usePresentationHold } from './presentationHold.js'

export interface HeldPresentation {
  /** 现在要渲染的表面：保持中的选择，没有保持时是实时结论。 */
  surface: ComputedRef<ResolvedAdaptivePresentation>
  isSheet: ComputedRef<boolean>
  /** 底部弹层的退场播完了：放开保持。 */
  settle: () => void
}

export function useHeldPresentation(
  presentation: MaybeRefOrGetter<AdaptivePresentation>,
  isOpen: MaybeRefOrGetter<boolean>,
): HeldPresentation {
  const live = useAdaptivePresentation(presentation)
  const hold = usePresentationHold({ isOpen, presentation: live })
  const surface = computed(() => hold.presentation.value ?? live.value)

  watch(() => toValue(isOpen), (open) => {
    if (!open && hold.presentation.value === 'popover')
      hold.release()
  })

  function settle(): void {
    if (!toValue(isOpen))
      hold.release()
  }

  return { surface, isSheet: computed(() => surface.value === 'bottom-sheet'), settle }
}
