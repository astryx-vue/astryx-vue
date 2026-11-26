/**
 * Popover 的底部弹层呈现（上游 Popover `presentation`，DEC-6、DEC-8）。
 *
 * `presentation` 决定内容放在哪：锚定浮层、底部弹层，或 `'adaptive'`（紧凑触屏上
 * 用底部弹层，其余用浮层，和 iOS 在手机上呈现 popover 的方式一样）。
 *
 * - 呈现在打开那一刻选定，保持到关闭：开着的底部弹层不会因为转屏变成浮层；
 *   开着的浮层再按触发器，按浮层关闭。受控时在 `isOpen` 变成 true 的那一刻选定。
 * - 底部弹层挂着的时候（能被选中、开着、或者关了还在播退场）内容只放在它里面，
 *   一次只有一份内容；关着也挂着，内容里的状态（勾选、输入的字）重开还在。
 *   退场播完、并且不再是会被选中的呈现时才把内容还给浮层。
 * - 触发器的展开状态和 `aria-controls` 跟着开着的那一个呈现走。
 */
import type { ComputedRef, Ref } from 'vue'
import type { BottomSheetMotion } from '../BottomSheet/types.js'
import type { AdaptivePresentation } from '../composables/internal/presentation.js'
import { computed, shallowRef, watch } from 'vue'
import { preloadBottomSheet } from '../BottomSheet/lazyBottomSheet.js'
import { useAdaptivePresentation } from '../composables/internal/presentation.js'

type Surface = 'popover' | 'bottom-sheet'

export interface PopoverSheetOptions {
  presentation: () => AdaptivePresentation
  /** 受控的打开状态；不受控时是 undefined。 */
  controlledOpen: () => boolean | undefined
  /** 锚定浮层此刻是否打开。可以晚于本函数就绪。 */
  isPopoverOpen: () => boolean
  /** 底部弹层请求打开或关闭时通知调用方。 */
  onOpenChange: (open: boolean) => void
}

export interface PopoverSheet {
  /** 底部弹层是开着的那个呈现。 */
  isOpen: ComputedRef<boolean>
  /** 底部弹层挂着：内容在它里面。 */
  isMounted: ComputedRef<boolean>
  /** 底部弹层没打开时，没写名字的弹层用触发器的文字命名。 */
  triggerText: Ref<string>
  /** 交给锚定浮层的受控 `isOpen`：受控并且选中了浮层时才为 true。 */
  popoverControlledOpen: () => boolean | undefined
  /** 底部弹层请求开关（遮罩、下滑、Escape、后备关闭按钮）。 */
  setOpen: (open: boolean) => void
  /** 触发器被按下：底部弹层接管时返回 true。 */
  onTriggerPress: (trigger: HTMLElement | null) => boolean
  /** 接到 BottomSheet 的 `motionComplete` 上。 */
  onMotionComplete: (motion: BottomSheetMotion) => void
}

/** 触发器自己的名字：`aria-label`，没有就用它的文字。 */
export function readTriggerText(trigger: HTMLElement): string {
  return trigger.getAttribute('aria-label')?.trim() || trigger.textContent?.trim() || ''
}

export function usePopoverSheet(options: PopoverSheetOptions): PopoverSheet {
  const live = useAdaptivePresentation(options.presentation)
  const openState = shallowRef(false)
  const controlledSurface = shallowRef<Surface | null>(null)
  const hasBeenOpen = shallowRef(false)
  const triggerText = shallowRef('')
  const isControlled = (): boolean => options.controlledOpen() !== undefined

  // 受控时在 `isOpen` 变化的同一刻选定呈现：锚定浮层的受控监听读到的已是这次的选择。
  watch(options.controlledOpen, (open) => {
    if (open !== true)
      controlledSurface.value = null
    else controlledSurface.value ??= options.isPopoverOpen() ? 'popover' : live.value
  }, { immediate: true, flush: 'sync' })

  const isOpen = computed(() => isControlled()
    ? options.controlledOpen() === true && controlledSurface.value === 'bottom-sheet'
    : openState.value)

  watch(isOpen, (open) => {
    if (open)
      hasBeenOpen.value = true
  }, { immediate: true, flush: 'sync' })

  const isMounted = computed(() => isOpen.value
    || hasBeenOpen.value
    || (live.value === 'bottom-sheet' && !options.isPopoverOpen()))

  // 底部弹层可能成为呈现方式时先把它加载好，打开时立刻就有。
  watch(live, (surface) => {
    if (surface === 'bottom-sheet')
      preloadBottomSheet()
  }, { immediate: true })

  function setOpen(open: boolean): void {
    if (!isControlled())
      openState.value = open
    options.onOpenChange(open)
  }

  return {
    isOpen,
    isMounted,
    triggerText,
    popoverControlledOpen: () => {
      const open = options.controlledOpen()
      return open === undefined ? undefined : open && controlledSurface.value === 'popover'
    },
    setOpen,
    onTriggerPress(trigger) {
      // 打开时选定呈现；开着的浮层按浮层关闭。
      if (!isOpen.value && (options.isPopoverOpen() || live.value !== 'bottom-sheet'))
        return false
      if (trigger != null)
        triggerText.value = readTriggerText(trigger)
      setOpen(!isOpen.value)
      return true
    },
    onMotionComplete(motion) {
      if (motion === 'exiting' && !isOpen.value)
        hasBeenOpen.value = false
    },
  }
}
