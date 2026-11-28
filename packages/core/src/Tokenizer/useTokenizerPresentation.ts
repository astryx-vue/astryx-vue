import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { SheetPresentationState } from '../layer/useSheetPresentation.js'
import type { TokenizerProps } from './types.js'
import { useSheetPresentation } from '../layer/useSheetPresentation.js'

export type TokenizerPresentationState = SheetPresentationState

/** 底部弹层呈现的字段对外暴露的方法。 */
export interface TokenizerSheetFieldHandle {
  element: HTMLElement | null
  focus: (options?: FocusOptions) => void
  blur: () => void
  /** 换呈现交来的焦点：之后的聚焦都算在字段里。 */
  adoptFocus: () => void
}

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

/** Tokenizer 的呈现：行内浮层还是触屏底部弹层，见 useSheetPresentation。 */
export function useTokenizerPresentation<T extends SearchableItem>(options: {
  props: TokenizerProps<T>
  hasItemSlot: () => boolean
  /** 整个字段的根元素，判断焦点是否在字段里。 */
  root: () => HTMLElement | null | undefined
  /** 把焦点交给当前呈现的控件。 */
  focusControl: () => void
}): TokenizerPresentationState {
  return useSheetPresentation({
    component: 'Tokenizer',
    presentation: () => options.props.presentation ?? 'adaptive',
    root: options.root,
    focusControl: options.focusControl,
    inertProps: () => inertSheetProps(options.props, options.hasItemSlot()),
  })
}
