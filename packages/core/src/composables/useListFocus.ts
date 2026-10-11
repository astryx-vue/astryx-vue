import type { Ref } from 'vue'
import { ref, watch } from 'vue'

/**
 * 一维列表的方向。
 * - `horizontal`：左右方向键
 * - `vertical`：上下方向键
 * - `both`：四个方向键都按 DOM 顺序走
 */
export type ListFocusOrientation = 'horizontal' | 'vertical' | 'both'

export interface UseListFocusOptions {
  /**
   * 列表里可聚焦项的选择器。
   * @default '[role="menuitem"]'
   */
  itemSelector?: string
  /**
   * 列表边界。子菜单画在父菜单里面时，用它把两边的项和按键分开。
   * 菜单一般传 `[role="menu"]`。平铺列表不用传。
   */
  boundarySelector?: string
  /**
   * 到头之后是否绕回另一头。
   * @default true
   */
  wrap?: boolean
  /** 按下 Escape 时调用。传了才会吃掉这个键。 */
  onEscape?: () => void
  /**
   * 导航方向。
   * @default 'vertical'
   */
  orientation?: ListFocusOrientation
  /**
   * Home / End 是否跳到第一项 / 最后一项。
   * @default true
   */
  hasHomeEnd?: boolean
  /**
   * PageDown / PageUp 是否按视口翻页。不滚动的列表里它们等于 End / Home。
   * @default false
   */
  hasPaging?: boolean
  /**
   * 是否由这里管理 roving tabindex：只有一项是 `tabindex="0"`，其余是 `-1`。
   * @default false
   */
  hasRovingTabIndex?: boolean
  /**
   * 方向键是否让给嵌在列表里的文本框。光标不在移动方向的边界上时不抢。
   * @default false
   */
  hasCaretGuard?: boolean
}

export interface ListFocus {
  /** 绑到列表容器上。 */
  listRef: Ref<HTMLElement | null>
  handleKeyDown: (event: KeyboardEvent) => void
  /** roving tabindex 打开时，点击或程序聚焦后把 tab 停靠点对齐到当前项。 */
  handleFocus: (event: FocusEvent) => void
  focusItem: (index: number) => void
  /** 聚焦第一个可用项。没有可用项时返回 false。 */
  focusFirst: () => boolean
  /** 聚焦最后一个可用项。没有可用项时返回 false。 */
  focusLast: () => boolean
  /** 这个按键是不是属于当前这一层。没配 boundarySelector 时恒为 true。 */
  ownsEvent: (event: KeyboardEvent) => boolean
  /** 当前这一层、DOM 顺序上的项，含禁用项，不含藏起来的项。 */
  getItems: () => HTMLElement[]
}

const TEXT_INPUT_TYPES = new Set([
  'text',
  'search',
  'url',
  'tel',
  'email',
  'password',
  'number',
])

function isHiddenWithin(el: HTMLElement, listEl: HTMLElement): boolean {
  const hidden = el.parentElement?.closest('[hidden],[inert]')
  return hidden != null && hidden !== listEl && listEl.contains(hidden)
}

function isRtlElement(el: HTMLElement | null): boolean {
  if (el == null || typeof window === 'undefined')
    return false
  return window.getComputedStyle(el).direction === 'rtl'
}

function getContentEditableRoot(el: HTMLElement): HTMLElement | null {
  if (el.isContentEditable)
    return el
  const candidate = el.closest('[contenteditable]')
  if (candidate instanceof HTMLElement && candidate.getAttribute('contenteditable') !== 'false')
    return candidate
  return null
}

function shouldDeferToCaret(target: EventTarget | null, key: string): boolean {
  if (!(target instanceof HTMLElement))
    return false

  const editableRoot = getContentEditableRoot(target)
  if (editableRoot != null) {
    const selection = typeof window === 'undefined' ? null : window.getSelection()
    if (selection != null && selection.rangeCount > 0 && !selection.isCollapsed)
      return true
    return (editableRoot.textContent ?? '').length > 0
  }

  const isTextarea = target.tagName === 'TEXTAREA'
  const isTextInput = target.tagName === 'INPUT' && TEXT_INPUT_TYPES.has((target as HTMLInputElement).type)
  if (!isTextarea && !isTextInput)
    return false

  const input = target as HTMLInputElement | HTMLTextAreaElement
  const { selectionStart, selectionEnd, value } = input
  if (selectionStart !== selectionEnd)
    return true
  if (selectionStart == null)
    return true
  if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'Home')
    return selectionStart > 0
  if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'End')
    return selectionStart < value.length
  return false
}

/**
 * 对应原版 Astryx 的 `hooks/useListFocus`。
 *
 * 一维方向键焦点：菜单、工具栏、侧栏、树列表这类「一行一项」的集合。
 * 默认只移动 DOM 焦点，不改 tabindex。`hasRovingTabIndex` 打开后，
 * 由这里维持唯一的 tab 停靠点。横向时会看容器的书写方向，RTL 里左右对调。
 */
export function useListFocus(options: UseListFocusOptions = {}): ListFocus {
  const {
    itemSelector = '[role="menuitem"]',
    boundarySelector,
    wrap = true,
    onEscape,
    orientation = 'vertical',
    hasHomeEnd = true,
    hasPaging = false,
    hasRovingTabIndex = false,
    hasCaretGuard = false,
  } = options

  const listRef = ref<HTMLElement | null>(null)

  function isItemDisabled(el: HTMLElement): boolean {
    return el.getAttribute('aria-disabled') === 'true'
      || (el as HTMLButtonElement).disabled === true
      || el.hasAttribute('disabled')
  }

  function getItems(): HTMLElement[] {
    const listEl = listRef.value
    if (listEl == null)
      return []
    const matched = Array.from(listEl.querySelectorAll<HTMLElement>(itemSelector))
      .filter(el => !isHiddenWithin(el, listEl))
    if (boundarySelector == null)
      return matched
    return matched.filter(el => el.closest(boundarySelector) === listEl)
  }

  function ownsEvent(event: KeyboardEvent): boolean {
    const listEl = listRef.value
    if (listEl == null || boundarySelector == null)
      return true
    const target = event.target
    if (!(target instanceof Element))
      return true
    return target.closest(boundarySelector) === listEl
  }

  function findEnabledIndex(items: HTMLElement[], start: number, step: 1 | -1, shouldWrap: boolean): number {
    const count = items.length
    if (count === 0)
      return -1
    let index = start
    for (let i = 0; i < count; i++) {
      if (index < 0 || index >= count) {
        if (!shouldWrap)
          return -1
        index = (index + count) % count
      }
      const item = items[index]
      if (item != null && !isItemDisabled(item))
        return index
      index += step
    }
    return -1
  }

  function getCurrentIndex(): number {
    const items = getItems()
    const active = document.activeElement
    return items.findIndex(item => item === active || item.contains(active))
  }

  function setTabIndex(el: HTMLElement, value: 0 | -1): void {
    if (el.getAttribute('tabindex') !== String(value))
      el.setAttribute('tabindex', String(value))
  }

  function syncTabStops(): void {
    const items = getItems()
    const enabled = items.filter(el => !isItemDisabled(el))
    if (enabled.length === 0)
      return
    const current = enabled.find(el => el.getAttribute('tabindex') === '0')
    const tabbable = current ?? enabled[0]
    for (const el of items)
      setTabIndex(el, el === tabbable ? 0 : -1)
  }

  function focusIndex(items: HTMLElement[], index: number): void {
    const target = items[index]
    if (target == null)
      return
    if (hasRovingTabIndex) {
      for (const el of items)
        setTabIndex(el, el === target ? 0 : -1)
    }
    target.focus()
  }

  function focusItem(index: number): void {
    const items = getItems()
    if (items.length === 0)
      return
    focusIndex(items, Math.max(0, Math.min(index, items.length - 1)))
  }

  function focusFirst(): boolean {
    const items = getItems()
    const index = findEnabledIndex(items, 0, 1, false)
    if (index === -1)
      return false
    focusIndex(items, index)
    return true
  }

  function focusLast(): boolean {
    const items = getItems()
    const index = findEnabledIndex(items, items.length - 1, -1, false)
    if (index === -1)
      return false
    focusIndex(items, index)
    return true
  }

  function focusPage(direction: 1 | -1): void {
    const container = listRef.value
    const items = getItems()
    if (container == null || items.length === 0)
      return
    const currentIndex = getCurrentIndex()
    const enabledIndices = items
      .map((item, index) => (isItemDisabled(item) ? -1 : index))
      .filter(index => index !== -1)
    if (enabledIndices.length === 0)
      return

    function edgeVisible(): number {
      const bounds = container!.getBoundingClientRect()
      const visible = enabledIndices.filter((index) => {
        const rect = items[index]!.getBoundingClientRect()
        return rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1
      })
      if (visible.length === 0)
        return -1
      return direction === 1 ? visible[visible.length - 1]! : visible[0]!
    }

    function isAhead(index: number): boolean {
      return currentIndex === -1 || (direction === 1 ? index > currentIndex : index < currentIndex)
    }

    if (currentIndex === -1 && direction === -1) {
      focusFirst()
      return
    }

    let target = edgeVisible()
    if (target === -1 || !isAhead(target)) {
      container.scrollTop += direction * container.clientHeight
      target = edgeVisible()
      if (target === -1 || !isAhead(target)) {
        const pageSize = Math.max(1, enabledIndices.filter((index) => {
          const bounds = container.getBoundingClientRect()
          const rect = items[index]!.getBoundingClientRect()
          return rect.height > 0 && rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1
        }).length)
        const position = enabledIndices.indexOf(currentIndex)
        const from = position === -1 ? (direction === 1 ? -1 : enabledIndices.length) : position
        const next = Math.max(0, Math.min(enabledIndices.length - 1, from + direction * pageSize))
        target = enabledIndices[next] ?? -1
      }
    }

    if (target !== -1 && target !== currentIndex)
      focusIndex(items, target)
  }

  function handleFocus(event: FocusEvent): void {
    if (!hasRovingTabIndex)
      return
    const items = getItems()
    const target = event.target
    if (!(target instanceof Node)) {
      syncTabStops()
      return
    }
    const match = items.find(item => item === target || item.contains(target))
    if (match != null && !isItemDisabled(match)) {
      for (const item of items)
        setTabIndex(item, item === match ? 0 : -1)
      return
    }
    syncTabStops()
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey)
      return
    if (!ownsEvent(event))
      return

    if (event.key === 'Escape') {
      if (onEscape != null) {
        event.preventDefault()
        onEscape()
      }
      return
    }

    const horizontal = orientation === 'horizontal' || orientation === 'both'
    const vertical = orientation === 'vertical' || orientation === 'both'
    const nextKeys: string[] = []
    const prevKeys: string[] = []
    if (horizontal) {
      const rtl = event.key === 'ArrowLeft' || event.key === 'ArrowRight'
        ? isRtlElement(listRef.value)
        : false
      nextKeys.push(rtl ? 'ArrowLeft' : 'ArrowRight')
      prevKeys.push(rtl ? 'ArrowRight' : 'ArrowLeft')
    }
    if (vertical) {
      nextKeys.push('ArrowDown')
      prevKeys.push('ArrowUp')
    }

    const isNext = nextKeys.includes(event.key)
    const isPrev = prevKeys.includes(event.key)
    const isHome = hasHomeEnd && event.key === 'Home'
    const isEnd = hasHomeEnd && event.key === 'End'
    const isPageDown = hasPaging && event.key === 'PageDown'
    const isPageUp = hasPaging && event.key === 'PageUp'

    if (!isNext && !isPrev && !isHome && !isEnd && !isPageDown && !isPageUp)
      return

    if (hasCaretGuard && (shouldDeferToCaret(event.target, event.key) || shouldDeferToCaret(document.activeElement, event.key)))
      return

    const items = getItems()
    const currentIndex = getCurrentIndex()

    if (isNext) {
      const from = currentIndex === -1 ? 0 : currentIndex + 1
      const next = findEnabledIndex(items, from, 1, wrap)
      if (next !== -1)
        focusIndex(items, next)
    }
    else if (isPrev) {
      const from = currentIndex === -1 ? items.length - 1 : currentIndex - 1
      const prev = findEnabledIndex(items, from, -1, wrap)
      if (prev !== -1)
        focusIndex(items, prev)
    }
    else if (isHome) {
      focusFirst()
    }
    else if (isEnd) {
      focusLast()
    }
    else if (isPageDown) {
      focusPage(1)
    }
    else if (isPageUp) {
      focusPage(-1)
    }

    event.preventDefault()
  }

  if (hasRovingTabIndex) {
    watch(listRef, (el, _previous, onCleanup) => {
      if (el == null || typeof MutationObserver === 'undefined') {
        if (el != null)
          syncTabStops()
        return
      }
      syncTabStops()
      const observer = new MutationObserver(() => syncTabStops())
      observer.observe(el, {
        attributeFilter: ['disabled', 'aria-disabled', 'hidden', 'inert'],
        attributes: true,
        childList: true,
        subtree: true,
      })
      onCleanup(() => observer.disconnect())
    }, { immediate: true })
  }

  return {
    focusFirst,
    focusItem,
    focusLast,
    getItems,
    handleFocus,
    handleKeyDown,
    listRef,
    ownsEvent,
  }
}
