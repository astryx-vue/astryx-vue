import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'

export interface UseOptionActionGridOptions {
  /** 这次挂载里是否已经出现过带操作的选项。 */
  enabled: () => boolean
  isOpen: () => boolean
  activeIndex: Ref<number>
  rowHasAction: (index: number) => boolean
  /** 弹出层根，用来读书写方向。 */
  getListbox: () => HTMLElement | null
  optionId: (index: number) => string
  actionId: (index: number) => string
}

export interface OptionActionGrid {
  column: Ref<'option' | 'action'>
  onKeyDown: (event: KeyboardEvent) => boolean
  activeDescendant: ComputedRef<string | undefined>
}

/**
 * 选项操作的键盘列。上一项、下一项仍交给列表模型。
 * 行末方向键走到操作，行首方向键走回选项。搜索框里只有光标已经顶到边上才接管。
 */
export function useOptionActionGrid(options: UseOptionActionGridOptions): OptionActionGrid {
  const column = ref<'option' | 'action'>('option')

  watch(() => options.activeIndex.value, () => {
    column.value = 'option'
  })
  watch(options.isOpen, (open) => {
    if (!open)
      column.value = 'option'
  })

  function towardAction(event: KeyboardEvent): boolean {
    const rtl = options.getListbox() != null && getComputedStyle(options.getListbox()!).direction === 'rtl'
    return rtl ? event.key === 'ArrowLeft' : event.key === 'ArrowRight'
  }

  function towardOption(event: KeyboardEvent): boolean {
    const rtl = options.getListbox() != null && getComputedStyle(options.getListbox()!).direction === 'rtl'
    return rtl ? event.key === 'ArrowRight' : event.key === 'ArrowLeft'
  }

  function caretAllows(event: KeyboardEvent, edge: 'start' | 'end'): boolean {
    const target = event.target
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement))
      return true
    const point = edge === 'end' ? target.value.length : 0
    return target.selectionStart === point && target.selectionEnd === point
  }

  function activate(index: number): void {
    const id = options.actionId(index)
    const listed = options.getListbox()?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    const control = listed?.matches('button, a, input, [role="button"]')
      ? listed
      : listed?.querySelector<HTMLElement>('button, a, input, [role="button"]')
    control?.click()
  }

  /** 返回 true 表示这个键已经用掉，不要再交给列表模型。 */
  function onKeyDown(event: KeyboardEvent): boolean {
    if (!options.enabled() || !options.isOpen() || options.activeIndex.value < 0)
      return false
    const index = options.activeIndex.value
    if (towardAction(event) && column.value === 'option' && options.rowHasAction(index) && caretAllows(event, 'end')) {
      event.preventDefault()
      column.value = 'action'
      return true
    }
    if (towardOption(event) && column.value === 'action' && caretAllows(event, 'start')) {
      event.preventDefault()
      column.value = 'option'
      return true
    }
    if (column.value !== 'action')
      return false
    const typingSpace = event.key === ' ' && event.target instanceof HTMLInputElement
    if ((event.key === 'Enter' || event.key === ' ') && !typingSpace) {
      event.preventDefault()
      activate(index)
      return true
    }
    return false
  }

  const activeDescendant = computed(() => {
    const index = options.activeIndex.value
    if (!options.isOpen() || index < 0)
      return undefined
    if (column.value === 'action' && options.rowHasAction(index))
      return options.actionId(index)
    return options.optionId(index)
  })

  return { column, onKeyDown, activeDescendant }
}
