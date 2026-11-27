/**
 * @file reorderBase.ts
 * @input The list element getter, the hint id and the row reader a session
 *   is created with
 * @output `ReorderBase`: the state every layer of a reorder session shares.
 *   It holds the registered handles and names, the finds from a handle to
 *   its row and back, reorder mode's handle and its insertion line
 * @position The first layer of the List reorder controller:
 *   reorderNames.ts → reorderDrag.ts → reorderDrop.ts → reorderController.ts
 */
import type { AnnounceFn } from '../../composables/internal/announce.js'
import type { DevWarnings } from '../../composables/internal/devWarnings.js'
import type { DragSession, PendingAnnouncement, PendingDrop, PendingMove, ReorderMessages } from './reorderState.js'
import type { ListReorderOptions, ReorderKey, ReorderRows } from './reorderTypes.js'
import { createDevWarnings } from '../../composables/internal/devWarnings.js'
import { CHILD_ROWS, hideLine, layoutTop, lineSpanOf, showLine } from './reorderDom.js'
import { closestReorderHandle, reorderHandlesIn } from './reorderMarks.js'

/** What the List's host hands the session on each render. */
export interface ReorderConfiguration {
  options: ListReorderOptions
  announce: AnnounceFn
  messages: ReorderMessages
  presentation: 'uikit' | 'theme'
}

export abstract class ReorderBase {
  options: ListReorderOptions | null = null
  announce: AnnounceFn = () => {}
  messages: ReorderMessages | null = null
  /** `uikit` glides the rows (touch presentation); `theme` puts them at once. */
  presentation: 'uikit' | 'theme' = 'theme'

  protected readonly keys = new Map<Element, ReorderKey>()
  protected readonly names = new Map<Element, string>()
  protected modeHandle: HTMLElement | null = null
  protected readonly modeListeners = new Set<() => void>()
  protected hintElement: HTMLElement | null = null
  protected draggedHandle: Element | null = null
  protected committedMove: PendingMove | null = null
  protected moveFallback: ReturnType<typeof setTimeout> | null = null
  protected modeLine: { list: HTMLElement, listPosition: string } | null = null
  /** The way the mode's last move went: the line marks the edge it came in by. */
  protected lastStep: -1 | 1 | null = null
  protected claimFocusUntil = 0
  protected session: DragSession | null = null
  protected pending: PendingDrop | null = null
  protected fallback: ReturnType<typeof setTimeout> | null = null
  protected focusRow: HTMLElement | null = null
  protected announcement: PendingAnnouncement | null = null
  protected announcementFallback: ReturnType<typeof setTimeout> | null = null
  protected endMouse: (() => void) | null = null
  protected readonly warn: DevWarnings = createDevWarnings()

  constructor(
    protected readonly getList: () => HTMLElement | null,
    readonly hintId: string,
    protected readonly rows: ReorderRows = CHILD_ROWS,
  ) {}

  configure(configuration: ReorderConfiguration): void {
    this.options = configuration.options
    this.announce = configuration.announce
    this.messages = configuration.messages
    this.presentation = configuration.presentation
  }

  protected get animates(): boolean {
    return this.presentation === 'uikit'
  }

  /**
   * Whether a press of this pointer drags at once (past the slop) rather
   * than after a hold: a mouse, and a pen outside touch presentation.
   */
  protected dragsAtOnce(pointerType: string): boolean {
    return pointerType === 'mouse' || (pointerType === 'pen' && this.presentation !== 'uikit')
  }

  registerHandle(handle: Element | null, key: ReorderKey): () => void {
    if (handle == null)
      return () => {}
    this.keys.set(handle, key)
    return () => {
      if (this.keys.get(handle) === key) {
        this.keys.delete(handle)
        if (this.modeHandle === handle)
          this.setMode(null)
      }
    }
  }

  /** Names a row (or its handle) for the announcements. */
  registerName(row: Element | null, name: string): () => void {
    if (row == null)
      return () => {}
    this.names.set(row, name)
    return () => {
      if (this.names.get(row) === name)
        this.names.delete(row)
    }
  }

  protected handleIn(row: HTMLElement): Element | null {
    for (const handle of reorderHandlesIn(row)) {
      if (this.keys.has(handle))
        return handle
    }
    return null
  }

  protected keyOf(row: HTMLElement): ReorderKey | undefined {
    const handle = this.handleIn(row)
    return handle == null ? undefined : this.keys.get(handle)
  }

  /** The enabled handle of this list that holds `target`. */
  protected handleOf(target: unknown): HTMLElement | null {
    const list = this.getList()
    if (list == null || !(target instanceof Element))
      return null
    const handle = closestReorderHandle(target)
    return handle != null
      && this.keys.has(handle)
      && list.contains(handle)
      && handle.getAttribute('aria-disabled') !== 'true'
      ? handle
      : null
  }

  /** The row of this list that holds `element`. */
  rowOf(element: Element | null): HTMLElement | null {
    const list = this.getList()
    if (list == null)
      return null
    let node = element
    while (node != null && !this.rows.holds(node, list))
      node = node.parentElement
    return node instanceof HTMLElement ? node : null
  }

  protected nameOf(row: HTMLElement | undefined, index: number): string {
    const handle = row == null ? null : this.handleIn(row)
    const name = (handle == null ? null : this.names.get(handle)) ?? (row == null ? null : this.names.get(row)) ?? ''
    return name !== '' ? name : (this.messages?.itemAt(index + 1) ?? '')
  }

  isInMode(handle: Element | null): boolean {
    return handle != null && this.modeHandle === handle
  }

  subscribeMode = (listener: () => void): (() => void) => {
    this.modeListeners.add(listener)
    return () => {
      this.modeListeners.delete(listener)
    }
  }

  /** The handle reorder mode runs on, the hint's anchor. */
  get modeTarget(): HTMLElement | null {
    return this.modeHandle
  }

  setHintElement(element: HTMLElement | null): void {
    this.hintElement = element
  }

  protected setMode(handle: HTMLElement | null): void {
    if (this.modeHandle === handle)
      return
    this.modeHandle = handle
    this.lastStep = null
    this.clearModeLine()
    const list = this.getList()
    if (handle != null && list != null)
      this.placeModeLine(list)
    for (const listener of [...this.modeListeners])
      listener()
  }

  abstract endMode(): void

  protected placeModeLine(list: HTMLElement): void {
    this.measureModeLine(list)()
  }

  /**
   * Reads where reorder mode's line goes and returns its write. It marks the
   * edge its row came in by: above it until the first move down.
   */
  protected measureModeLine(list: HTMLElement): () => void {
    const row = this.rowOf(this.modeHandle)
    if (row == null)
      return () => this.clearModeLine()
    const step = this.lastStep ?? -1
    const rows = this.rows.read(list)
    const index = rows.indexOf(row)
    const top = layoutTop(row, list)
    const bottom = top + row.offsetHeight
    const neighbour = rows[index + step]
    const gap = neighbour == null
      ? 0
      : step < 0
        ? Math.max(0, top - (layoutTop(neighbour, list) + neighbour.offsetHeight))
        : Math.max(0, layoutTop(neighbour, list) - bottom)
    const center = step < 0 ? top - gap / 2 : bottom + gap / 2
    const span = lineSpanOf(row, list)
    const isNewList = this.modeLine?.list !== list
    const isStatic = isNewList && getComputedStyle(list).position === 'static'
    return () => {
      if (isNewList) {
        this.clearModeLine()
        const listPosition = list.style.position
        if (isStatic)
          list.style.position = 'relative'
        this.modeLine = { list, listPosition }
      }
      showLine(list, span, center)
    }
  }

  protected clearModeLine(): void {
    const modeLine = this.modeLine
    if (modeLine == null)
      return
    this.modeLine = null
    hideLine(modeLine.list)
    modeLine.list.style.position = modeLine.listPosition
  }
}
