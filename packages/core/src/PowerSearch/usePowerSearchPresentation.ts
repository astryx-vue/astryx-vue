import type { SheetPresentationState } from '../layer/useSheetPresentation.js'
import type { PowerSearchProps } from './types.js'
import { watch } from 'vue'
import { useSheetPresentation } from '../layer/useSheetPresentation.js'

interface FocusableControl {
  focus: (options?: FocusOptions) => void
  blur: () => void
}

export interface PowerSearchPresentationState extends SheetPresentationState {
  /** 把焦点交给当前呈现的控件：行内的输入框，或底部弹层呈现的触发器。 */
  focusControl: (options?: FocusOptions) => void
  blurControl: () => void
}

/**
 * PowerSearch 的呈现：行内字段加浮层菜单，还是触屏底部弹层流程。底部弹层呈现里没有浮层菜单和
 * 浮层编辑器，换过去时把开着的都收起；`menuWidth` 和 `overflow` 只描述行内字段，在那里不生效。
 */
export function usePowerSearchPresentation(options: {
  props: Pick<PowerSearchProps, 'presentation' | 'menuWidth' | 'overflow'>
  /** 当前呈现的字段根元素。 */
  root: () => HTMLElement | null | undefined
  input: () => FocusableControl | null | undefined
  sheetTrigger: () => FocusableControl | null | undefined
  /** 换成底部弹层呈现时调用：收起浮层菜单和编辑器。 */
  onEnterSheet: () => void
}): PowerSearchPresentationState {
  const { props } = options

  const state = useSheetPresentation({
    component: 'PowerSearch',
    presentation: () => props.presentation ?? 'adaptive',
    root: options.root,
    focusControl: () => control()?.focus(),
    inertProps: () => [
      props.menuWidth != null ? 'menuWidth' : '',
      props.overflow != null && props.overflow !== 'none' ? 'overflow' : '',
    ].filter(Boolean),
  })

  function control(): FocusableControl | null | undefined {
    return state.isSheet.value ? options.sheetTrigger() : options.input()
  }

  watch(state.isSheet, (isSheet) => {
    if (isSheet)
      options.onEnterSheet()
  })

  return {
    ...state,
    focusControl: focusOptions => control()?.focus(focusOptions),
    blurControl: () => control()?.blur(),
  }
}
