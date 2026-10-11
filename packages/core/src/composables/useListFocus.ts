import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'

export type ListFocusOrientation = 'horizontal' | 'vertical' | 'both'

export interface UseListFocusOptions {
  /** 列表里可移动焦点的元素。 @default '[role="menuitem"]' */
  itemSelector?: MaybeRefOrGetter<string>
  /**
   * 用来区分嵌套列表的边界。
   * 一项属于当前列表，仅当它最近的边界祖先就是这个容器。
   * 工具栏里套了菜单时，传 `[role="toolbar"], [role="menu"]`。
   */
  boundarySelector?: string
  /** 到头之后是否绕回。 @default true */
  wrap?: boolean
  /** 按下 Escape 时调用。 */
  onEscape?: () => void
  /** 方向键怎么走。 @default 'vertical' */
  orientation?: MaybeRefOrGetter<ListFocusOrientation>
  /** Home / End 是否跳到首尾。 @default true */
  hasHomeEnd?: boolean
  /**
   * 为 true 时，只有一项 tabindex 为 0，其余为 -1。
   * 默认只移动焦点，不改 tabindex。
   * @default false
   */
  hasRovingTabIndex?: boolean
  /**
   * 为 true 时，方向键不从正在编辑的输入框里抢走，
   * 除非光标已经顶到移动方向的边界。
   * @default false
   */
  preserveEditing?: boolean
}

export interface UseListFocusReturn {
  listRef: Ref<HTMLElement | null>
  handleKeyDown: (event: KeyboardEvent) => void
  handleFocus: (event: FocusEvent) => void
  focusItem: (index: number) => void
  syncTabIndex: () => void
}

function isItemDisabled(element: HTMLElement): boolean {
  return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true'
}

function isRtl(element: HTMLElement): boolean {
  return getComputedStyle(element).direction === 'rtl'
}

function editingClaimsKey(event: KeyboardEvent): boolean {
  const target = event.target
  if (!(target instanceof HTMLElement))
    return false
  if (target.isContentEditable)
    return true
  if (target.tagName === 'SELECT')
    return true
  if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')
    return false

  const field = target as HTMLInputElement
  const start = field.selectionStart
  const end = field.selectionEnd
  if (start == null || end == null)
    return true
  if (start !== end)
    return true
  const length = field.value.length
  if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp') && start > 0)
    return true
  if ((event.key === 'ArrowRight' || event.key === 'ArrowDown') && end < length)
    return true
  return false
}

/**
 * 线性列表的键盘焦点：方向键移动，Home / End 跳到两端，可选循环 tabindex。
 * 横向列表会按容器的 direction 对调左右方向键。
 */
export function useListFocus(options: UseListFocusOptions = {}): UseListFocusReturn {
  const listRef = ref<HTMLElement | null>(null)
  const wrap = options.wrap ?? true
  const hasHomeEnd = options.hasHomeEnd ?? true
  function selector(): string {
    return toValue(options.itemSelector) ?? '[role="menuitem"]'
  }

  function items(): HTMLElement[] {
    const root = listRef.value
    if (!root)
      return []
    return [...root.querySelectorAll<HTMLElement>(selector())].filter((element) => {
      if (isItemDisabled(element))
        return false
      if (!options.boundarySelector)
        return true
      return element.closest(options.boundarySelector) === root
    })
  }

  function eventBelongs(event: Event): boolean {
    const root = listRef.value
    const target = event.target
    if (!root || !(target instanceof Node) || !root.contains(target))
      return false
    if (!options.boundarySelector || !(target instanceof Element))
      return true
    return target.closest(options.boundarySelector) === root
  }

  function currentIndex(list: HTMLElement[]): number {
    const active = document.activeElement
    const focused = list.findIndex(element => element === active || (active instanceof Node && element.contains(active)))
    if (focused >= 0)
      return focused
    return list.findIndex(element => element.tabIndex === 0)
  }

  function syncTabIndex(): void {
    if (!options.hasRovingTabIndex)
      return
    const list = items()
    if (list.length === 0)
      return
    const selected = list.findIndex(element => element.tabIndex === 0)
    const activeIndex = selected >= 0 ? selected : 0
    list.forEach((element, index) => {
      element.tabIndex = index === activeIndex ? 0 : -1
    })
  }

  function focusItem(index: number): void {
    const list = items()
    if (list.length === 0)
      return
    const next = ((index % list.length) + list.length) % list.length
    const target = list[next]
    if (!target)
      return
    if (options.hasRovingTabIndex) {
      list.forEach((element, itemIndex) => {
        element.tabIndex = itemIndex === next ? 0 : -1
      })
    }
    target.focus()
  }

  function move(delta: number): void {
    const list = items()
    if (list.length === 0)
      return
    const current = currentIndex(list)
    if (current < 0) {
      focusItem(delta > 0 ? 0 : list.length - 1)
      return
    }
    let next = current + delta
    if (wrap) {
      next = (next + list.length) % list.length
    }
    else if (next < 0 || next >= list.length) {
      return
    }
    focusItem(next)
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!eventBelongs(event))
      return
    if (options.preserveEditing && editingClaimsKey(event))
      return

    if (event.key === 'Escape' && options.onEscape) {
      event.preventDefault()
      event.stopPropagation()
      options.onEscape()
      return
    }

    const orientation = toValue(options.orientation) ?? 'vertical'
    const horizontal = orientation === 'horizontal' || orientation === 'both'
    const vertical = orientation === 'vertical' || orientation === 'both'
    const root = listRef.value
    const rtl = root ? isRtl(root) : false
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight'
    const previousKey = rtl ? 'ArrowRight' : 'ArrowLeft'

    if (hasHomeEnd && event.key === 'Home') {
      event.preventDefault()
      event.stopPropagation()
      focusItem(0)
      return
    }
    if (hasHomeEnd && event.key === 'End') {
      event.preventDefault()
      event.stopPropagation()
      const list = items()
      focusItem(list.length - 1)
      return
    }

    let delta: number | null = null
    if (vertical && event.key === 'ArrowDown')
      delta = 1
    else if (vertical && event.key === 'ArrowUp')
      delta = -1
    else if (horizontal && event.key === nextKey)
      delta = 1
    else if (horizontal && event.key === previousKey)
      delta = -1

    if (delta == null)
      return
    event.preventDefault()
    event.stopPropagation()
    move(delta)
  }

  function handleFocus(event: FocusEvent): void {
    if (!options.hasRovingTabIndex || !eventBelongs(event))
      return
    const list = items()
    const target = event.target
    const index = list.findIndex(element => element === target || (target instanceof Node && element.contains(target)))
    if (index >= 0)
      focusItem(index)
  }

  watch(listRef, (element, _previous, onCleanup) => {
    if (!element || !options.hasRovingTabIndex)
      return
    syncTabIndex()
    if (typeof MutationObserver === 'undefined')
      return
    const observer = new MutationObserver(() => syncTabIndex())
    observer.observe(element, {
      attributeFilter: ['aria-disabled', 'disabled'],
      attributes: true,
      childList: true,
      subtree: true,
    })
    onCleanup(() => observer.disconnect())
  })

  onScopeDispose(() => {
    listRef.value = null
  })

  return { listRef, handleKeyDown, handleFocus, focusItem, syncTabIndex }
}
