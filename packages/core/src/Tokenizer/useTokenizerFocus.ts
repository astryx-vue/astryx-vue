import type { Ref } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { TokenizerMenu } from './useTokenizerMenu.js'

interface TokenizerFocusOptions<T extends SearchableItem> {
  anchor: Readonly<Ref<HTMLElement | null>>
  listbox: () => HTMLElement | null
  input: Readonly<Ref<HTMLInputElement | null>>
  focused: Ref<boolean>
  placeholderHeight: Ref<number>
  menu: TokenizerMenu<T>['menu']
  isDisabled: () => boolean
  atMax: () => boolean
  showsEntriesOnFocus: () => boolean
  /** 只有 `unfocused-layer` 需要在聚焦前量好占位的高度。 */
  isFloatingLayer: () => boolean
  disabledTooltip: { onTooltipPointerEnter: () => void, onBlur: () => void }
  /** 呈现切换交来的焦点不算「从外面进来」。 */
  isHandingOffFocus: () => boolean
  onFocus: (event: FocusEvent) => void
  onBlur: (event: FocusEvent) => void
}

/** 字段里焦点的进出：从外面进来才发 `focus`，整个字段（含结果列表）都离开才发 `blur`。 */
export function useTokenizerFocus<T extends SearchableItem>(options: TokenizerFocusOptions<T>): {
  onFocusIn: (event: FocusEvent) => void
  onFocusOut: (event: FocusEvent) => void
} {
  function isInside(node: EventTarget | null): boolean {
    if (!(node instanceof Node))
      return false
    return Boolean(options.anchor.value?.contains(node) || options.listbox()?.contains(node))
  }

  function onFocusIn(event: FocusEvent): void {
    const comingFromOutside = !isInside(event.relatedTarget)
    options.disabledTooltip.onTooltipPointerEnter()
    if (!options.focused.value && options.isFloatingLayer())
      options.placeholderHeight.value = options.anchor.value?.offsetHeight ?? 0
    options.focused.value = true
    if (event.target === options.input.value && options.showsEntriesOnFocus() && !options.isDisabled() && !options.atMax())
      options.menu.open()
    if (comingFromOutside && !options.isHandingOffFocus())
      options.onFocus(event)
  }

  function onFocusOut(event: FocusEvent): void {
    options.disabledTooltip.onBlur()
    if (isInside(event.relatedTarget))
      return
    options.focused.value = false
    options.menu.close()
    options.onBlur(event)
  }

  return { onFocusIn, onFocusOut }
}
