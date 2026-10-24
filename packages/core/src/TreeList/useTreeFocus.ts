import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'

const DEFAULT_ITEM_SELECTOR = '[role="treeitem"]'
const TYPEAHEAD_RESET_MS = 500
const NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '])

export interface UseTreeFocusOptions {
  /**
   * 树容器里可见树节点的选择器，按 DOM 顺序。
   * @default '[role="treeitem"]'
   */
  itemSelector?: string
  /**
   * 判断某个树节点是否停用、导航时要跳过。
   * 不传时看 `data-tree-disabled` 和 `aria-disabled`。
   */
  isItemDisabled?: (item: HTMLElement) => boolean
  /**
   * 读某个树节点的层级（从 1 开始）。
   * 不传时看 `aria-level`。
   */
  getLevel?: (item: HTMLElement) => number
  /** 展开或收起指定 id 的树节点时调用。 */
  onToggleExpand?: (id: string) => void
  /** Enter 或空格激活树节点时调用。返回 true 表示已处理，否则交给展开切换。 */
  onActivate?: (item: HTMLElement, id: string | undefined) => boolean | void
  /** 这里把焦点移到某个树节点之后调用，用来同步你自己管理的 tab 停靠点。 */
  onActiveChange?: (id: string | undefined) => void
  /**
   * 是否由这里管理唯一的 tab 停靠点：给各项打上 `tabindex="0"` / `-1`，
   * 挂载时对齐一次，导航时跟着走。挂载时已有的 `tabindex="0"` 会被保留为起点。
   * @default false
   */
  hasRovingTabIndex?: boolean
  /**
   * 是否启用 typeahead：敲字符跳到下一个以这些字符开头的节点。
   * @default true
   */
  typeahead?: boolean
  /**
   * 敲字符时只拿 `aria-labelledby` 指到的文本，不拿整行的说明和按钮名。
   * @default false
   */
  matchLabelledBy?: boolean
}

function isRtl(element: HTMLElement | null): boolean {
  return element != null && getComputedStyle(element).direction === 'rtl'
}

/**
 * 树形控件的方向键焦点：上下 Home End 在可见节点间线性走（跳过停用项），
 * 左右走树的语义（展开收起、进第一个子节点、回父节点），Enter 和空格激活，
 * 敲字符走 typeahead。方向键横过来时看容器的书写方向，RTL 里左右对调。
 */
export function useTreeFocus(options: UseTreeFocusOptions): {
  treeRef: Ref<HTMLElement | null>
  handleKeyDown: (event: KeyboardEvent) => void
  handleFocus: (event?: FocusEvent) => void
  focusFirst: () => void
  focusLast: () => void
} {
  const treeRef = ref<HTMLElement | null>(null)
  const typeahead = { buffer: '', timer: undefined as ReturnType<typeof setTimeout> | undefined }
  const hasRovingTabIndex = options.hasRovingTabIndex === true

  function items(): HTMLElement[] {
    const root = treeRef.value
    if (root == null)
      return []
    return [...root.querySelectorAll<HTMLElement>(options.itemSelector ?? DEFAULT_ITEM_SELECTOR)]
  }

  function disabled(item: HTMLElement): boolean {
    if (options.isItemDisabled != null)
      return options.isItemDisabled(item)
    return item.dataset.treeDisabled === 'true' || item.getAttribute('aria-disabled') === 'true'
  }

  function levelOf(item: HTMLElement): number {
    if (options.getLevel != null)
      return options.getLevel(item)
    return Number(item.getAttribute('aria-level') ?? '1')
  }

  /** typeahead 用的名字。指明时只读标签，否则用整行文字。 */
  function matchText(item: HTMLElement): string {
    if (options.matchLabelledBy === true) {
      const ids = item.getAttribute('aria-labelledby')?.split(/\s+/).filter(Boolean) ?? []
      if (ids.length > 0) {
        const doc = item.ownerDocument
        return ids.map(id => doc.getElementById(id)?.textContent ?? '').join(' ').trim().toLowerCase()
      }
    }
    return (item.textContent ?? '').trim().toLowerCase()
  }

  /** 树节点的 id：优先 `data-tree-id`，退回元素自己的 `id`。 */
  function idOf(item: HTMLElement): string | undefined {
    const id = item.dataset.treeId ?? item.id
    return id == null || id === '' ? undefined : id
  }

  function syncTabStops(): void {
    const list = items()
    const active = document.activeElement
    const selector = options.itemSelector ?? DEFAULT_ITEM_SELECTOR
    const current = active instanceof Element ? active.closest<HTMLElement>(selector) : null
    const owned = current != null && list.includes(current) ? current : list.find(item => item.tabIndex === 0) ?? list.find(item => !disabled(item))
    for (const item of list)
      item.tabIndex = item === owned ? 0 : -1
  }

  function focusItem(item: HTMLElement): void {
    if (hasRovingTabIndex) {
      for (const candidate of items())
        candidate.tabIndex = candidate === item ? 0 : -1
    }
    item.focus()
    options.onActiveChange?.(idOf(item))
  }

  function focusEnabledFrom(list: HTMLElement[], start: number, step: 1 | -1): void {
    for (let index = start; index >= 0 && index < list.length; index += step) {
      const item = list[index]
      if (item != null && !disabled(item)) {
        focusItem(item)
        return
      }
    }
  }

  if (hasRovingTabIndex)
    onMounted(syncTabStops)

  function handleKeyDown(event: KeyboardEvent): void {
    const list = items()
    if (list.length === 0)
      return
    const active = document.activeElement
    const selector = options.itemSelector ?? DEFAULT_ITEM_SELECTOR
    const activeItem = active instanceof Element ? active.closest<HTMLElement>(selector) : null
    const currentIndex = list.findIndex(item => item === activeItem)
    const current = currentIndex >= 0 ? list[currentIndex] : undefined

    if (
      (options.typeahead ?? true)
      && event.key.length === 1
      && !event.ctrlKey
      && !event.metaKey
      && !event.altKey
      && !NAVIGATION_KEYS.has(event.key)
    ) {
      typeahead.buffer += event.key.toLowerCase()
      clearTimeout(typeahead.timer)
      typeahead.timer = setTimeout(() => {
        typeahead.buffer = ''
      }, TYPEAHEAD_RESET_MS)
      const query = typeahead.buffer
      const ordered = [...list.slice(currentIndex + 1), ...list.slice(0, currentIndex + 1)]
      const match = ordered.find(item => !disabled(item) && matchText(item).startsWith(query))
      if (match != null) {
        event.preventDefault()
        focusItem(match)
      }
      return
    }

    if (!NAVIGATION_KEYS.has(event.key))
      return

    let key = event.key
    if ((key === 'ArrowLeft' || key === 'ArrowRight') && isRtl(treeRef.value))
      key = key === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft'

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        focusEnabledFrom(list, currentIndex < 0 ? 0 : currentIndex + 1, 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusEnabledFrom(list, currentIndex < 0 ? list.length - 1 : currentIndex - 1, -1)
        break
      case 'ArrowRight': {
        if (current == null)
          break
        event.preventDefault()
        const expanded = current.getAttribute('aria-expanded')
        if (expanded === 'false') {
          const id = idOf(current)
          if (id != null)
            options.onToggleExpand?.(id)
        }
        else if (expanded === 'true') {
          const next = list[currentIndex + 1]
          if (next != null && levelOf(next) > levelOf(current))
            focusItem(next)
        }
        break
      }
      case 'ArrowLeft': {
        if (current == null)
          break
        event.preventDefault()
        if (current.getAttribute('aria-expanded') === 'true') {
          const id = idOf(current)
          if (id != null)
            options.onToggleExpand?.(id)
        }
        else {
          const currentLevel = levelOf(current)
          for (let index = currentIndex - 1; index >= 0; index -= 1) {
            const candidate = list[index]
            if (candidate != null && levelOf(candidate) < currentLevel) {
              focusItem(candidate)
              break
            }
          }
        }
        break
      }
      case 'Home':
        event.preventDefault()
        focusEnabledFrom(list, 0, 1)
        break
      case 'End':
        event.preventDefault()
        focusEnabledFrom(list, list.length - 1, -1)
        break
      case 'Enter':
      case ' ': {
        if (current == null || disabled(current))
          break
        event.preventDefault()
        const handled = options.onActivate?.(current, idOf(current)) === true
        if (!handled && current.getAttribute('aria-expanded') != null) {
          const id = idOf(current)
          if (id != null)
            options.onToggleExpand?.(id)
        }
        break
      }
      default:
        break
    }
  }

  /** roving tabindex 打开时，点击或程序聚焦之后把停靠点对齐到当前项。 */
  function handleFocus(): void {
    if (!hasRovingTabIndex)
      return
    syncTabStops()
  }

  /** 聚焦第一个可用节点。 */
  function focusFirst(): void {
    focusEnabledFrom(items(), 0, 1)
  }

  /** 聚焦最后一个可用节点。 */
  function focusLast(): void {
    const list = items()
    focusEnabledFrom(list, list.length - 1, -1)
  }

  return { treeRef: treeRef as Ref<HTMLElement | null>, focusFirst, focusLast, handleFocus, handleKeyDown }
}
