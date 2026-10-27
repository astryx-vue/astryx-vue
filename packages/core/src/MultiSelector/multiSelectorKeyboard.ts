export interface MultiSelectorKeyOption {
  value: string | number
  disabled?: boolean
}

export interface MultiSelectorKeyContext {
  canActivate: boolean
  searchable: boolean
  isOpen: boolean
  activeIndex: number
  createQuery: string | null
  selectedCount: number
  optionAt: (index: number) => MultiSelectorKeyOption | undefined
  open: () => void
  close: () => void
  highlightNext: () => void
  highlightPrevious: () => void
  highlightFirst: () => void
  highlightLast: () => void
  jumpToMatch: (char: string) => void
  toggleValue: (value: string | number) => void
  commitCreate: (query: string) => void
  clearSelection: () => void
  focusTrigger: () => void
}

/** 多选面板的按键。输入法组合期间不处理。调用方要先放行选项操作那一列。 */
export function applyMultiSelectorKey(event: KeyboardEvent, ctx: MultiSelectorKeyContext): void {
  if (!ctx.canActivate)
    return
  const searchInput = ctx.searchable && event.target instanceof HTMLInputElement
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (!ctx.isOpen)
        ctx.open()
      else
        ctx.highlightNext()
      break
    case 'ArrowUp':
      event.preventDefault()
      if (!ctx.isOpen) {
        ctx.open()
        ctx.highlightLast()
      }
      else {
        ctx.highlightPrevious()
      }
      break
    case 'Home':
      if (!searchInput && ctx.isOpen) {
        event.preventDefault()
        ctx.highlightFirst()
      }
      break
    case 'End':
      if (!searchInput && ctx.isOpen) {
        event.preventDefault()
        ctx.highlightLast()
      }
      break
    case 'PageUp':
      if (ctx.isOpen) {
        event.preventDefault()
        ctx.highlightFirst()
      }
      break
    case 'PageDown':
      if (ctx.isOpen) {
        event.preventDefault()
        ctx.highlightLast()
      }
      break
    case 'Enter':
    case ' ':
      if (event.key === ' ' && searchInput)
        break
      event.preventDefault()
      if (ctx.isOpen && ctx.activeIndex >= 0) {
        const option = ctx.optionAt(ctx.activeIndex)
        if (option && !option.disabled)
          ctx.toggleValue(option.value)
      }
      else if (ctx.isOpen && ctx.createQuery != null) {
        ctx.commitCreate(ctx.createQuery)
      }
      else if (!ctx.isOpen) {
        ctx.open()
      }
      break
    case 'Escape':
      if (ctx.isOpen) {
        event.preventDefault()
        ctx.close()
        ctx.focusTrigger()
      }
      break
    case 'Tab':
      if (ctx.isOpen)
        ctx.close()
      break
    case 'Backspace':
    case 'Delete':
      if (!searchInput && !ctx.isOpen && ctx.selectedCount > 0) {
        event.preventDefault()
        ctx.clearSelection()
      }
      break
    default:
      if (!searchInput && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        if (!ctx.isOpen)
          ctx.open()
        ctx.jumpToMatch(event.key)
      }
      break
  }
}
