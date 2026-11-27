import type { ComputedRef, Ref } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { TokenizerProps } from './types.js'
import { computed, nextTick, ref, watch } from 'vue'
import { preloadBottomSheet } from '../BottomSheet/lazyBottomSheet.js'
import { isDevBuild } from '../composables/internal/devBuild.js'
import { devWarn } from '../composables/useDevWarning.js'
import { useHeldPresentation } from '../layer/useHeldPresentation.js'

export interface TokenizerPresentationState {
  /** 底部弹层开着（含正在退场之前的那一刻）。 */
  sheetOpen: Ref<boolean>
  /** 现在渲染的是底部弹层呈现：打开时选定，保持到退场播完。 */
  isSheet: ComputedRef<boolean>
  /** 接到底部弹层的 `motionComplete` 上。 */
  onSheetMotionComplete: (motion: 'entering' | 'exiting') => void
  /** 换呈现时正在把焦点交给新控件：这次聚焦不是从外面进来的。 */
  isHandingOffFocus: () => boolean
}

/** 底部弹层呈现的字段对外暴露的方法。 */
export interface TokenizerSheetFieldHandle {
  element: HTMLElement | null
  focus: (options?: FocusOptions) => void
  blur: () => void
  /** 换呈现交来的焦点：之后的聚焦都算在字段里。 */
  adoptFocus: () => void
}

const warnedInertSets = new Set<string>()

/** 在底部弹层呈现里没有地方生效的属性名。 */
function inertSheetProps<T extends SearchableItem>(props: TokenizerProps<T>, hasItemSlot: boolean): string[] {
  const candidates: [string, boolean][] = [
    ['item slot', hasItemSlot],
    ['hasClear', Boolean(props.hasClear || props.clearable)],
    ['hasEntriesOnFocus', Boolean(props.hasEntriesOnFocus || props.showOnFocus)],
    ['menuWidth', props.menuWidth != null],
    ['menu', props.menu != null],
    ['overflow', props.overflow != null && props.overflow !== 'none'],
    ['hasAutoFocus', Boolean(props.hasAutoFocus)],
  ]
  return candidates.filter(([, isSet]) => isSet).map(([name]) => name)
}

/**
 * Tokenizer 的呈现：行内浮层还是触屏底部弹层（上游 isSheetPresented 闩锁）。
 *
 * 换呈现时焦点在旧控件上，就交给新控件（输入框和触发器互换），不掉回页面。
 * 底部弹层可能成为呈现时先把它的模块加载好。只描述行内菜单的属性在底部弹层里
 * 没有地方生效，开发期提示一次。
 */
export function useTokenizerPresentation<T extends SearchableItem>(options: {
  props: TokenizerProps<T>
  hasItemSlot: () => boolean
  /** 整个字段的根元素，判断焦点是否在字段里。 */
  root: () => HTMLElement | null | undefined
  /** 把焦点交给当前呈现的控件。 */
  focusControl: () => void
}): TokenizerPresentationState {
  const { props } = options
  const sheetOpen = ref(false)
  let isHandingOff = false
  const { isSheet, settle } = useHeldPresentation(() => props.presentation ?? 'adaptive', sheetOpen)

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
    const inert = computed(() => isSheet.value ? inertSheetProps(props, options.hasItemSlot()) : [])
    watch(inert, (names) => {
      const key = names.join(',')
      if (key === '' || warnedInertSets.has(key))
        return
      warnedInertSets.add(key)
      devWarn('Tokenizer', `\`${names.join('`, `')}\` ${names.length === 1 ? 'has' : 'have'} no surface in the bottom-sheet presentation and ${names.length === 1 ? 'is' : 'are'} not rendered there. Pass \`presentation="popover"\` to keep the inline field on every device.`)
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
