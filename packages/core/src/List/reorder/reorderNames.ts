/**
 * @file reorderNames.ts
 * @input The handles' label elements and the list's rows
 * @output `ReorderNames`: how each handle is named. A handle whose row shows
 *   a name is named after it. One whose row shows none is named after its
 *   place ("Reorder item N"), kept current as rows move and labels change
 * @position The second layer of the List reorder controller, over
 *   reorderBase.ts
 */
import type { ListReorderHandleName } from './reorderState.js'
import { ReorderBase } from './reorderBase.js'
import { LABEL_WATCH, namesRow, observeMutations } from './reorderDom.js'
import { UNREAD_HANDLE_NAME } from './reorderState.js'

export abstract class ReorderNames extends ReorderBase {
  private readonly handleLabels = new Map<Element, { labelId: string | null, isNamed: boolean }>()
  private readonly handleNames = new Map<Element, ListReorderHandleName>()
  private readonly nameListeners = new Set<() => void>()
  private namesWatch: { list: HTMLElement, unwatchRows: () => void, labels: Map<Element, () => void> } | null = null
  private namesQueued = false
  private readonly warnedNameless = new WeakSet<Element>()
  private namelessCount = 0

  /**
   * Records what names `handle`: the id of its row's label element, or
   * whether the row's caller named it (`aria-label`, `aria-labelledby`).
   */
  registerHandleLabel(handle: Element | null, labelId: string | null, isNamed: boolean): () => void {
    if (handle == null)
      return () => {}
    const label = { labelId, isNamed }
    this.handleLabels.set(handle, label)
    this.queueNames()
    return () => {
      if (this.handleLabels.get(handle) === label) {
        this.handleLabels.delete(handle)
        this.queueNames()
      }
    }
  }

  handleNameOf(handle: Element | null): ListReorderHandleName {
    return (handle == null ? null : this.handleNames.get(handle)) ?? UNREAD_HANDLE_NAME
  }

  subscribeHandleNames = (listener: () => void): (() => void) => {
    this.nameListeners.add(listener)
    return () => {
      this.nameListeners.delete(listener)
    }
  }

  /** Watches the list's rows and the handles' labels; returns the release. */
  attachNames(): () => void {
    const list = this.getList()
    if (list == null)
      return () => {}
    const watch = {
      list,
      unwatchRows: observeMutations(list, { childList: true }, this.onNamesMutation),
      labels: new Map<Element, () => void>(),
    }
    this.namesWatch = watch
    this.refreshNames()
    return () => {
      watch.unwatchRows()
      for (const unwatch of watch.labels.values())
        unwatch()
      watch.labels.clear()
      if (this.namesWatch === watch)
        this.namesWatch = null
    }
  }

  private readonly onNamesMutation = (): void => {
    this.refreshNames()
  }

  private queueNames(): void {
    if (this.namesQueued)
      return
    this.namesQueued = true
    queueMicrotask(() => {
      this.namesQueued = false
      this.refreshNames()
    })
  }

  private refreshNames(): void {
    const list = this.getList()
    if (list == null)
      return
    const places = new Map(this.rows.read(list).map((row, index) => [row, index + 1]))
    const watch = this.namesWatch
    if (watch != null && watch.list !== list) {
      watch.unwatchRows()
      watch.list = list
      watch.unwatchRows = observeMutations(list, { childList: true }, this.onNamesMutation)
    }
    const watched = new Set<Element>()
    let changed = false
    for (const handle of this.keys.keys()) {
      const label = this.handleLabels.get(handle)
      const element = label?.labelId == null ? null : list.ownerDocument.getElementById(label.labelId)
      if (element != null && watch != null) {
        watched.add(element)
        if (!watch.labels.has(element))
          watch.labels.set(element, observeMutations(element, LABEL_WATCH, this.onNamesMutation))
      }
      const labelShowsNoName = label?.labelId != null && !namesRow(element)
      const byPlace = label != null && (label.labelId != null ? labelShowsNoName : !label.isNamed)
      const row = byPlace ? this.rowOf(handle) : null
      const position = row == null ? null : (places.get(row) ?? null)
      const previous = this.handleNameOf(handle)
      if (previous.position !== position || previous.labelShowsNoName !== labelShowsNoName) {
        this.handleNames.set(handle, { position, labelShowsNoName })
        changed = true
      }
      if (byPlace && position != null && !this.warnedNameless.has(handle)) {
        this.warnedNameless.add(handle)
        this.namelessCount += 1
        this.warn(
          'ListItem',
          'A reorderable row has no accessible name, so its reorder handle is '
          + 'named after its place ("Reorder item N"). Give the row a text '
          + 'label or an aria-label.',
          `nameless-row-${this.namelessCount}`,
        )
      }
    }
    for (const handle of this.handleNames.keys()) {
      if (!this.keys.has(handle)) {
        this.handleNames.delete(handle)
        changed = true
      }
    }
    for (const [element, unwatch] of watch?.labels ?? []) {
      if (!watched.has(element)) {
        unwatch()
        watch?.labels.delete(element)
      }
    }
    if (changed) {
      for (const listener of [...this.nameListeners])
        listener()
    }
  }
}
