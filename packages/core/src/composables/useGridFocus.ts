import type { MaybeRefOrGetter, Ref } from 'vue'
import { onMounted, onScopeDispose, ref, toValue, watch } from 'vue'

/** 网格里一格可以接受的元素：按钮，或者显式可聚焦的元素。 */
const DEFAULT_CELL_SELECTOR = 'button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface UseGridFocusOptions {
  /**
   * 网格的列数。上下方向键按这个数跨格。
   */
  columns: MaybeRefOrGetter<number>
  /**
   * 选格子的选择器。要按 DOM 顺序选中**所有**位置，包括禁用和空的格子，
   * 这样行列几何才对得上。
   * @default 'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
   */
  cellSelector?: string
  /**
   * 判断某个格子能不能接焦点。不传就当每个格子都能接。
   */
  isCellFocusable?: (cell: HTMLElement) => boolean
  /**
   * 从一个格子算出真正要聚焦的元素，例如 `role="gridcell"` 里包着的按钮。
   * 不传就聚焦格子本身。
   */
  getFocusTarget?: (cell: HTMLElement) => HTMLElement | null
  /**
   * 焦点已经走到第一个格子之前时调用。拿到列序号和步长（横向是 1，纵向是列数）。
   */
  onNavigateBefore?: (column: number, offset: number) => void
  /**
   * 焦点已经走到最后一个格子之后时调用。参数同 `onNavigateBefore`。
   */
  onNavigateAfter?: (column: number, offset: number) => void
  /** 按 Page Up 时调用，例如日历翻到上个月。 */
  onPageUp?: () => void
  /** 按 Page Down 时调用，例如日历翻到下个月。 */
  onPageDown?: () => void
  /**
   * 让整张网格只保留一个 Tab 落脚点：当前格子的目标元素 `tabindex="0"`，
   * 其余都是 `-1`。打开后要把返回的 `handleFocus` 挂到容器的 `focus` 事件上。
   * @default false
   */
  hasRovingTabIndex?: MaybeRefOrGetter<boolean>
}

export interface UseGridFocusReturn {
  /** 挂到网格容器上。 */
  gridRef: Ref<HTMLElement | null>
  /** 挂到网格容器的 `keydown` 上。 */
  handleKeyDown: (event: KeyboardEvent) => void
  /** 挂到网格容器的 `focus` 上。没开 `hasRovingTabIndex` 时什么都不做，挂上也无害。 */
  handleFocus: (event: FocusEvent) => void
  /** 按序号聚焦某个格子，序号会被夹到合法范围里。 */
  focusCell: (index: number) => void
  /** 聚焦第一个能接焦点的格子。 */
  focusFirst: () => void
  /** 聚焦最后一个能接焦点的格子。 */
  focusLast: () => void
}

/**
 * 对应原版 Astryx 的 `hooks/useGridFocus`。
 *
 * 按 WAI-ARIA 的 grid 模式管二维网格的键盘导航：方向键一格一格走，
 * Home/End 走到行首行尾，Ctrl+Home/Ctrl+End 走到整张网格的开头和结尾，
 * Page Up/Down 交给调用方（日历里就是翻月）。走到边界时可以把事件交出去，
 * 让别的网格接住焦点，例如翻到上个月继续用方向键。
 *
 * 它靠读 DOM 里格子的顺序算行列，所以格子要不要能聚焦、要不要聚焦格子里的某个按钮，
 * 都是通过 `isCellFocusable` 和 `getFocusTarget` 两个回调交给调用方决定。
 */
export function useGridFocus(options: UseGridFocusOptions): UseGridFocusReturn {
  const gridRef = ref<HTMLElement | null>(null)
  const cellSelector = options.cellSelector ?? DEFAULT_CELL_SELECTOR

  function isRoving(): boolean {
    return toValue(options.hasRovingTabIndex ?? false)
  }

  function getCells(): HTMLElement[] {
    const grid = gridRef.value
    if (grid == null)
      return []
    return [...grid.querySelectorAll<HTMLElement>(cellSelector)]
  }

  /** 能接焦点的格子，按 DOM 顺序。 */
  function getFocusableCells(): HTMLElement[] {
    return getCells().filter(cell => options.isCellFocusable?.(cell) ?? true)
  }

  function resolveTarget(cell: HTMLElement): HTMLElement | null {
    return options.getFocusTarget?.(cell) ?? cell
  }

  function indexOfTarget(target: Element | null): number {
    if (target == null)
      return -1
    return getCells().findIndex(cell => cell === target || cell.contains(target))
  }

  function activeIndex(): number {
    const grid = gridRef.value
    if (grid == null)
      return -1
    const focused = grid.ownerDocument.activeElement
    if (focused == null || !grid.contains(focused))
      return -1
    return indexOfTarget(focused)
  }

  /** 让当前格子成为唯一的 Tab 落脚点，其余格子退出 Tab 顺序。 */
  function syncRovingTabIndex(index: number): void {
    if (!isRoving())
      return
    const cells = getCells()
    cells.forEach((cell, cellIndex) => {
      const target = resolveTarget(cell)
      if (target != null)
        target.tabIndex = cellIndex === index ? 0 : -1
    })
  }

  function focusTargetOf(cell: HTMLElement | undefined): boolean {
    if (cell == null)
      return false
    if (!(options.isCellFocusable?.(cell) ?? true))
      return false
    const target = resolveTarget(cell)
    if (target == null)
      return false
    target.focus({ preventScroll: true })
    syncRovingTabIndex(getCells().indexOf(cell))
    return true
  }

  function columns(): number {
    return Math.max(1, toValue(options.columns))
  }

  function columnOf(index: number): number {
    return index < 0 ? 0 : index % columns()
  }

  /** 走到边界外面时，把当前列和步长交给调用方，让另一张网格接住焦点。 */
  function navigateOut(current: number, offset: number, isAfter: boolean): void {
    if (current < 0)
      return
    const column = columnOf(current)
    if (isAfter)
      options.onNavigateAfter?.(column, offset)
    else
      options.onNavigateBefore?.(column, offset)
  }

  function moveTo(index: number, offset: number): void {
    const cells = getCells()
    const target = cells[index]
    if (target == null) {
      navigateOut(activeIndex(), offset, index >= cells.length)
      return
    }
    if (!(options.isCellFocusable?.(target) ?? true))
      return
    focusTargetOf(target)
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented)
      return
    const grid = gridRef.value
    if (grid == null)
      return

    const index = activeIndex()
    if (index < 0)
      return

    const cols = columns()
    const last = getCells().length - 1
    const rowStart = index - columnOf(index)

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        moveTo(index + 1, 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        moveTo(index - 1, 1)
        break
      case 'ArrowDown':
        event.preventDefault()
        moveTo(index + cols, cols)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveTo(index - cols, cols)
        break
      case 'Home':
        event.preventDefault()
        moveTo(event.ctrlKey || event.metaKey ? 0 : rowStart, 1)
        break
      case 'End':
        event.preventDefault()
        moveTo(event.ctrlKey || event.metaKey ? last : rowStart + cols - 1, 1)
        break
      case 'PageUp':
        if (options.onPageUp == null)
          break
        event.preventDefault()
        options.onPageUp()
        break
      case 'PageDown':
        if (options.onPageDown == null)
          break
        event.preventDefault()
        options.onPageDown()
        break
      default:
        break
    }
  }

  function handleFocus(event: FocusEvent): void {
    if (!isRoving())
      return
    const target = event.target
    if (!(target instanceof Element))
      return
    const index = indexOfTarget(target)
    if (index < 0)
      return
    syncRovingTabIndex(index)
  }

  function focusCell(index: number): void {
    const cells = getCells()
    if (cells.length === 0)
      return
    const clamped = Math.min(Math.max(index, 0), cells.length - 1)
    focusTargetOf(cells[clamped])
  }

  function focusFirst(): void {
    const cells = getFocusableCells()
    focusTargetOf(cells[0])
  }

  function focusLast(): void {
    const cells = getFocusableCells()
    focusTargetOf(cells[cells.length - 1])
  }

  /** 首次渲染后补上 Tab 落脚点；已经有一个 `tabindex="0"` 的格子就尊重它。 */
  function seedRovingTabIndex(): void {
    if (!isRoving())
      return
    const cells = getCells()
    const seeded = cells.findIndex((cell) => {
      const target = resolveTarget(cell)
      return target != null && target.tabIndex === 0 && (options.isCellFocusable?.(cell) ?? true)
    })
    if (seeded >= 0) {
      syncRovingTabIndex(seeded)
      return
    }
    const first = cells.findIndex(cell => options.isCellFocusable?.(cell) ?? true)
    if (first >= 0)
      syncRovingTabIndex(first)
  }

  onMounted(seedRovingTabIndex)
  watch(gridRef, seedRovingTabIndex)
  watch([() => toValue(options.columns), () => toValue(options.hasRovingTabIndex ?? false)], seedRovingTabIndex)
  onScopeDispose(() => {
    gridRef.value = null
  })

  return { gridRef, handleKeyDown, handleFocus, focusCell, focusFirst, focusLast }
}
