import type { ComputedRef, Ref } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { LatchedOptionGrid } from '../selectors/useLatchedOptionGrid.js'
import type { TypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import { isImeKeyEvent } from '../utils/ime.js'

export interface TokenizerKeysOptions<T extends SearchableItem> {
  values: ComputedRef<readonly T[]>
  disabled: () => boolean | undefined
  menu: TypeaheadMenu<T>
  optionGrid: LatchedOptionGrid
  inputRef: Readonly<Ref<HTMLInputElement | null>>
  remove: (item: T) => void
  focusToken: (index: number) => void
}

/** 输入框和标签上的按键：退格删最后一个、方向键在标签和输入框之间移动焦点。 */
export function useTokenizerKeys<T extends SearchableItem>(options: TokenizerKeysOptions<T>): {
  onInputKeyDown: (event: KeyboardEvent) => void
  onTokenKeyDown: (event: KeyboardEvent, item: T, index: number) => void
} {
  const { values, menu, optionGrid, inputRef, remove, focusToken } = options

  function onInputKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented || isImeKeyEvent(event))
      return
    if (optionGrid.actionGrid.onKeyDown(event))
      return
    const input = inputRef.value
    if (event.key === 'Backspace' && menu.query.value === '' && values.value.length > 0) {
      event.preventDefault()
      const last = values.value[values.value.length - 1]
      if (last)
        remove(last)
      return
    }
    if (event.key === 'ArrowLeft' && input && input.selectionStart === 0 && input.selectionEnd === 0 && values.value.length > 0) {
      event.preventDefault()
      focusToken(values.value.length - 1)
      return
    }
    menu.onKeyDown(event)
  }

  function onTokenKeyDown(event: KeyboardEvent, item: T, index: number): void {
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusToken(index - 1)
    }
    else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (index < values.value.length - 1)
        focusToken(index + 1)
      else
        inputRef.value?.focus()
    }
    else if (event.key === 'Escape') {
      inputRef.value?.focus()
    }
    else if (!options.disabled() && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault()
      remove(item)
      if (index > 0)
        focusToken(index - 1)
    }
  }

  return { onInputKeyDown, onTokenKeyDown }
}
