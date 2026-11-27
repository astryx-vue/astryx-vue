import type { ComputedRef, Ref } from 'vue'
import type { AdaptivePresentation } from '../composables/internal/presentation.js'
import { computed, nextTick, ref, watch } from 'vue'
import { preloadBottomSheet } from '../BottomSheet/lazyBottomSheet.js'
import { isDevBuild } from '../composables/internal/devBuild.js'
import { devWarn } from '../composables/useDevWarning.js'
import { useHeldPresentation } from './useHeldPresentation.js'

export interface SheetPresentationState {
  /** 底部弹层开着（含正在退场之前的那一刻）。 */
  sheetOpen: Ref<boolean>
  /** 现在渲染的是底部弹层呈现：打开时选定，保持到退场播完。 */
  isSheet: ComputedRef<boolean>
  /** 接到底部弹层的 `motionComplete` 上。 */
  onSheetMotionComplete: (motion: 'entering' | 'exiting') => void
  /** 换呈现时正在把焦点交给新控件：这次聚焦不是从外面进来的。 */
  isHandingOffFocus: () => boolean
}

const warnedInertSets = new Set<string>()

/**
 * 字段的呈现：行内控件还是触屏底部弹层（上游 isSheetPresented 闩锁），Tokenizer 和 PowerSearch 共用。
 *
 * 换呈现时焦点在旧控件上，就交给新控件（输入框和触发器互换），不掉回页面。
 * 底部弹层可能成为呈现时先把它的模块加载好。只描述行内控件的属性在底部弹层里
 * 没有地方生效，开发期按组件提示一次。
 */
export function useSheetPresentation(options: {
  /** 开发期提示里的组件名。 */
  component: string
  presentation: () => AdaptivePresentation
  /** 整个字段的根元素，判断焦点是否在字段里。 */
  root: () => HTMLElement | null | undefined
  /** 把焦点交给当前呈现的控件。 */
  focusControl: () => void
  /** 设了但在底部弹层里不生效的属性名。 */
  inertProps: () => string[]
}): SheetPresentationState {
  const sheetOpen = ref(false)
  let isHandingOff = false
  const { isSheet, settle } = useHeldPresentation(options.presentation, sheetOpen)

  watch(isSheet, (sheet) => {
    if (sheet)
      preloadBottomSheet()
    const root = options.root()
    const active = root?.ownerDocument.activeElement
    if (root == null || active == null || !root.contains(active))
      return
    void nextTick(() => {
      isHandingOff = true
      try {
        options.focusControl()
      }
      finally {
        isHandingOff = false
      }
    })
  }, { flush: 'pre' })

  if (isDevBuild()) {
    const inert = computed(() => isSheet.value ? options.inertProps() : [])
    watch(inert, (names) => {
      const key = `${options.component}:${names.join(',')}`
      if (names.length === 0 || warnedInertSets.has(key))
        return
      warnedInertSets.add(key)
      devWarn(options.component, `\`${names.join('`, `')}\` ${names.length === 1 ? 'has' : 'have'} no surface in the bottom-sheet presentation and ${names.length === 1 ? 'is' : 'are'} not rendered there. Pass \`presentation="popover"\` to keep the inline field on every device.`)
    }, { immediate: true })
  }

  return {
    sheetOpen,
    isSheet,
    onSheetMotionComplete: (motion) => {
      if (motion === 'exiting')
        settle()
    },
    isHandingOffFocus: () => isHandingOff,
  }
}
