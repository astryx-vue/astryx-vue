/**
 * @file reorderController.ts
 * @input A List's element, the id of its handles' hint and its row reader
 * @output `ListReorderController`: one List's reorder session. A mouse (and
 *   a fine pen) drags a handle past a 4 px slop. A finger (and a coarse pen)
 *   drags it after a still hold. A handle's click starts reorder mode, where
 *   the arrow keys move its row a place at a time and commit at once
 * @position The last layer of the List reorder controller, over
 *   reorderDrop.ts. listReorderEngine.ts creates it, and List renders its
 *   `Host`, `Handle` and `RowName`
 */
import type { ListReorderSession, ReorderKey } from './reorderTypes.js'
import { VelocityTracker } from '../../gestures/VelocityTracker.js'
import ListReorderHandle from './ListReorderHandle.vue'
import ListReorderHost from './ListReorderHost.vue'
import ListReorderRowName from './ListReorderRowName.js'
import { boundsOf, layoutTop, MOUSE_DRAG_SLOP, START_FOCUS_CLAIM_MS } from './reorderDom.js'
import { ReorderDrop } from './reorderDrop.js'
import { clearReordering, markReordering } from './reorderMarks.js'
import { gestureStateOf } from './reorderState.js'
import { attachTouchHold } from './reorderTouch.js'

export class ListReorderController extends ReorderDrop implements ListReorderSession {
  readonly Host = ListReorderHost
  readonly Handle = ListReorderHandle
  readonly RowName = ListReorderRowName

  /** Starts reorder mode on `handle`, or ends it there. */
  toggleMode(handle: HTMLElement | null): void {
    if (handle == null || this.session != null)
      return
    if (this.modeHandle === handle) {
      this.endMode()
      return
    }
    if (this.handleOf(handle) === handle) {
      this.setMode(handle)
      if (handle.ownerDocument.activeElement !== handle)
        handle.focus({ preventScroll: true })
    }
  }

  endMode(): void {
    const handle = this.modeHandle
    const list = this.getList()
    const row = this.rowOf(handle)
    const active = handle?.ownerDocument.activeElement
    if (handle != null && active != null && this.hintElement?.contains(active))
      handle.focus({ preventScroll: true })
    this.setMode(null)
    if (list == null || row == null)
      return
    const rows = this.rows.read(list)
    const index = rows.indexOf(row)
    this.announce(this.messages?.modeDone(this.nameOf(row, index), index + 1, rows.length) ?? '')
  }

  /** Reorder mode for the item with `key`, from the app's own UI. */
  startByKey(key: ReorderKey): boolean {
    if (this.session != null)
      return true
    for (const [handle, handleKey] of this.keys) {
      if (handleKey === key && handle instanceof HTMLElement && this.handleOf(handle) === handle) {
        this.setMode(handle)
        handle.focus({ preventScroll: true })
        this.rowOf(handle)?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
        // The menu item that started it may hand focus back as it closes.
        this.claimFocusUntil = performance.now() + START_FOCUS_CLAIM_MS
        return true
      }
    }
    return false
  }

  /** Whether `handle`'s click ends a drag; reading it clears it. */
  takeDrag(handle: Element | null): boolean {
    const dragged = handle != null && this.draggedHandle === handle
    this.draggedHandle = null
    return dragged
  }

  /** The mouse's and fine pen's drag: past `MOUSE_DRAG_SLOP`. Returns the release. */
  attachMouse(): () => void {
    const list = this.getList()
    if (list == null)
      return () => {}
    const onPointerDown = (event: PointerEvent): void => {
      if (!this.dragsAtOnce(event.pointerType) || event.button !== 0)
        return
      const handle = this.handleOf(event.target)
      if (handle == null)
        return
      this.endMouse?.()
      this.draggedHandle = null
      const { pointerId, clientX: x, clientY: y } = event
      let isDragging = false
      const velocity = new VelocityTracker()
      velocity.add(x, y, event.timeStamp)
      const listening = new AbortController()
      const end = (): void => {
        listening.abort()
        if (handle.hasPointerCapture?.(pointerId))
          handle.releasePointerCapture(pointerId)
        if (this.endMouse === end)
          this.endMouse = null
      }
      const onMove = (move: PointerEvent): void => {
        if (move.pointerId !== pointerId)
          return
        velocity.add(move.clientX, move.clientY, move.timeStamp)
        if (!isDragging) {
          if (Math.hypot(move.clientX - x, move.clientY - y) < MOUSE_DRAG_SLOP)
            return
          isDragging = true
          this.draggedHandle = handle
          this.gesture(this.rowOf(handle), { state: 'began', y })
        }
        this.gesture(null, { state: 'changed', y: move.clientY })
      }
      const onUp = (up: PointerEvent): void => {
        if (up.pointerId !== pointerId)
          return
        end()
        if (isDragging) {
          velocity.add(up.clientX, up.clientY, up.timeStamp)
          this.gesture(null, { state: 'ended', y: up.clientY, velocity: velocity.velocity(up.timeStamp).y })
        }
      }
      const onCancel = (cancel: PointerEvent): void => {
        if (cancel.pointerId !== pointerId)
          return
        end()
        if (isDragging)
          this.gesture(null, { state: 'cancelled', y: cancel.clientY })
      }
      const { signal } = listening
      list.addEventListener('pointermove', onMove, { signal })
      list.addEventListener('pointerup', onUp, { signal })
      list.addEventListener('pointercancel', onCancel, { signal })
      list.addEventListener('lostpointercapture', onCancel, { signal })
      handle.setPointerCapture?.(pointerId)
      this.endMouse = end
    }
    // Capture: the handle stops its press from reaching the row's own press
    // and swipe handling.
    list.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      this.endMouse?.()
      list.removeEventListener('pointerdown', onPointerDown, true)
    }
  }

  /** The finger's drag, and a coarse pen's: after a still hold. Returns the release. */
  attachTouch(isCoarsePointer: boolean): () => void {
    const list = this.getList()
    if (list == null)
      return () => {}
    let held: HTMLElement | null = null
    const velocity = new VelocityTracker()
    return attachTouchHold(
      list,
      isCoarsePointer ? ['touch', 'pen'] : ['touch'],
      (target) => {
        const handle = this.handleOf(target)
        if (handle != null)
          held = handle
        return handle != null
      },
      (recognizer) => {
        const state = gestureStateOf(recognizer.state)
        if (state === 'began') {
          this.draggedHandle = held
          velocity.reset()
        }
        const touch = recognizer.trackedTouches[0]
        if (touch != null && state != null && state !== 'cancelled')
          velocity.add(touch.x, touch.y, touch.time)
        if (state != null) {
          this.gesture(state === 'began' ? this.rowOf(held) : null, {
            state,
            y: recognizer.location().y,
            velocity: state === 'ended' && touch != null ? velocity.velocity(touch.time).y : undefined,
          })
        }
      },
      target => this.handleOf(target) != null,
    )
  }

  /** A handle that goes away or turns disabled ends its drag and its mode. */
  release(handle: Element | null): void {
    if (handle == null)
      return
    if (this.session != null && this.draggedHandle === handle) {
      this.endMouse?.()
      this.cancel()
    }
    if (this.modeHandle === handle)
      this.setMode(null)
  }

  keyDown(handle: HTMLElement | null, event: KeyboardEvent): void {
    if (handle == null || handle !== this.modeHandle || event.altKey || event.ctrlKey || event.metaKey)
      return
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        this.endMode()
        return
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault()
        this.step(handle, event.key === 'ArrowUp' ? -1 : 1)
    }
  }

  /** Moves the mode's row a place up or down, committed at once. */
  step(handle: HTMLElement | null, delta: -1 | 1): void {
    const list = this.getList()
    const options = this.options
    const row = this.rowOf(handle)
    const key = row == null ? undefined : this.keyOf(row)
    if (list == null || options == null || row == null || key == null || handle !== this.modeHandle || this.session != null)
      return
    const rows = this.rows.read(list)
    const index = rows.indexOf(row)
    const to = index + delta
    if (to < 0 || to >= rows.length)
      return
    if (boundsOf(rows.map(element => this.handleIn(element) != null))[to]) {
      this.announce(this.messages?.refused(this.nameOf(rows[to], to)) ?? '')
      return
    }
    this.focusRow = row
    this.lastStep = delta
    this.announceWhenCommitted({
      row,
      to,
      landed: () => this.placeIn(this.rows.read(list), to),
      kept: this.placeIn(rows, index),
      politeness: undefined,
    })
    if (this.animates) {
      this.committedMove = { list, rows, tops: rows.map(element => layoutTop(element, list)) }
      markReordering(list)
      if (this.moveFallback != null)
        clearTimeout(this.moveFallback)
      this.moveFallback = setTimeout(() => {
        this.moveFallback = null
        if (this.committedMove != null) {
          this.committedMove = null
          if (this.session == null && this.pending == null)
            clearReordering(list)
        }
      }, 0)
    }
    options.onReorder({ key, to })
  }

  private placeIn(order: ReadonlyArray<HTMLElement>, at: number): string {
    const name = (index: number): string => this.nameOf(order[index], index)
    return this.messages?.place(
      name(at),
      at + 1,
      order.length,
      at > 0 ? name(at - 1) : null,
      at < order.length - 1 ? name(at + 1) : null,
    ) ?? ''
  }

  /**
   * Keeps focus on a handle `start` just put in reorder mode: a closing menu
   * hands focus back to its trigger.
   */
  blur(handle: HTMLElement | null, next: EventTarget | null): void {
    if (next instanceof Node && this.hintElement?.contains(next))
      return
    if (handle != null && handle === this.modeHandle && performance.now() < this.claimFocusUntil) {
      setTimeout(() => {
        if (this.modeHandle === handle)
          handle.focus({ preventScroll: true })
      }, 0)
    }
  }

  dispose(): void {
    this.endMouse?.()
    this.setMode(null)
    this.cancel()
    if (this.moveFallback != null) {
      clearTimeout(this.moveFallback)
      this.moveFallback = null
    }
    this.committedMove = null
    if (this.fallback != null) {
      clearTimeout(this.fallback)
      this.fallback = null
    }
    this.pending = null
    if (this.announcementFallback != null) {
      clearTimeout(this.announcementFallback)
      this.announcementFallback = null
    }
    this.announcement = null
  }
}
