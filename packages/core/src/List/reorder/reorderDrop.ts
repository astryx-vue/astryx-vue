/**
 * @file reorderDrop.ts
 * @input The end of a drag, and every List commit after the List's layout
 *   updates
 * @output `ReorderDrop`: the drop reports `onReorder({key, to})` once and
 *   waits for the commit that applies it. That commit glides the rows from
 *   their old places, the dropped row from where it was let go. An order the
 *   app keeps springs back. It also announces each move once it lands
 * @position The fourth layer of the List reorder controller, over
 *   reorderDrag.ts
 */
import type { DragSession, PendingAnnouncement, PendingDrop, PendingMove, RowRestore } from './reorderState.js'
import { animatorFor, isMoving, motionNow, motionOf, releaseMotion } from '../../utils/rowMotion.js'
import { hideLine, layoutTop, MIN_MOVE_PX, sameOrder, settleAtRest, shownY } from './reorderDom.js'
import { ReorderDrag } from './reorderDrag.js'
import { clearReordering, clearReorderSource, isReordering } from './reorderMarks.js'
import { touchMotion } from './reorderTouch.js'

interface RebaseRow {
  readonly element: HTMLElement
  readonly index: number
  readonly shift: number
  readonly value: number
  readonly moving: boolean
}

export abstract class ReorderDrop extends ReorderDrag {
  protected drop(velocity: number): void {
    const session = this.session
    if (session == null)
      return
    if (session.scrollStale)
      this.track(session.lastY)
    this.session = null
    this.stopAutoscroll(session)
    session.stopScrollWatch()
    const { geometry, dragged, position, rows, list } = session
    const element = rows[dragged]!
    const droppedTop = geometry.rows[dragged]!.top + shownY(session.preview, motionNow())
    this.clearOverlays(session)
    const dropped = this.messages?.dropped(position + 1, rows.length) ?? ''
    const key = this.keyOf(element)
    const options = this.options
    if (position === dragged || options == null || key == null) {
      if (position === dragged) {
        this.announce(dropped, 'polite')
        clearReordering(list)
        this.restWhenDone(element, session.restore)
      }
      else {
        this.springBack(list, rows, dragged, session.restore)
      }
      return
    }
    this.announceWhenCommitted({
      row: element,
      to: position,
      landed: () => dropped,
      kept: this.messages?.cancelled(dragged + 1, rows.length) ?? '',
      politeness: 'polite',
    })
    this.pending = { list, rows, tops: session.tops, dragged, droppedTop, velocity, restore: session.restore }
    options.onReorder({ key, to: position })
    // An app that keeps its order commits nothing new: the rows go home.
    this.fallback = setTimeout(() => {
      this.fallback = null
      this.refuse()
    }, 0)
  }

  cancel(): void {
    const session = this.session
    if (session == null)
      return
    this.session = null
    this.stopAutoscroll(session)
    session.stopScrollWatch()
    this.clearOverlays(session)
    this.springBack(session.list, session.rows, session.dragged, session.restore)
    this.announce(this.messages?.cancelled(session.dragged + 1, session.rows.length) ?? '')
  }

  private clearOverlays(session: DragSession): void {
    session.preview.remove()
    hideLine(session.list)
    const row = session.rows[session.dragged]!
    clearReorderSource(row)
    row.style.opacity = session.restore.opacity
    row.style.counterIncrement = session.restore.counterIncrement
    session.list.style.position = session.restore.listPosition
  }

  private springBack(list: HTMLElement, rows: ReadonlyArray<HTMLElement>, dragged: number, restore: RowRestore): void {
    const at = motionNow()
    const away = rows.filter(element => Math.abs(shownY(element, at)) >= MIN_MOVE_PX || isMoving(element))
    const spring = this.animates && away.length > 0 ? touchMotion.glideBase(list) : null
    for (const element of away) {
      if (spring == null) {
        animatorFor(element).set({ y: 0 })
        releaseMotion(element, 'translate')
        continue
      }
      touchMotion.home(element, spring, at, false)
    }
    clearReordering(list)
    this.restWhenDone(rows[dragged]!, restore)
  }

  private refuse(): void {
    const pending = this.pending
    if (pending == null)
      return
    const current = this.rows.read(pending.list)
    if (!sameOrder(current, pending.rows))
      return
    this.pending = null
    this.springBack(pending.list, pending.rows, pending.dragged, pending.restore)
  }

  /** Gives the row its own styles back once its glide arrives. */
  private restWhenDone(element: HTMLElement, restore: RowRestore): void {
    const settle = (): void => {
      if (this.session?.rows[this.session.dragged] === element)
        return
      const running = motionOf(element, 'y')
      if (running != null) {
        void running.handle.finished.then(settle)
        return
      }
      element.style.zIndex = restore.zIndex
      element.style.backgroundColor = restore.backgroundColor
      for (const row of restore.rows)
        releaseMotion(row, 'translate')
    }
    settle()
  }

  protected flushPending(): void {
    if (this.pending == null)
      return
    if (this.fallback != null) {
      clearTimeout(this.fallback)
      this.fallback = null
    }
    this.refuse()
    this.pending = null
  }

  ownsCommit(): boolean {
    const list = this.getList()
    return list != null && isReordering(list)
  }

  commit(): void {
    const list = this.getList()
    if (list == null)
      return
    if (this.keys.size === 0 && this.options != null && this.options.isReorderable == null && list.children.length > 0) {
      this.warn('List', '`reorderable` is set, but no ListItem has an `itemKey`: give each row the key its moves report.')
    }
    const session = this.session
    if (session != null && !sameOrder(this.rows.read(list), session.rows))
      this.cancel()
    const pending = this.pending
    if (pending != null && !sameOrder(this.rows.read(list), pending.rows)) {
      this.pending = null
      if (this.fallback != null) {
        clearTimeout(this.fallback)
        this.fallback = null
      }
      this.rebase(pending)
    }
    const announcement = this.announcement
    if (announcement != null && this.rows.read(list).indexOf(announcement.row) === announcement.to) {
      this.announcement = null
      if (this.announcementFallback != null) {
        clearTimeout(this.announcementFallback)
        this.announcementFallback = null
      }
      this.announce(announcement.landed(), announcement.politeness)
    }
    const move = this.committedMove
    let slide: (() => void) | null = null
    if (move != null && !sameOrder(this.rows.read(list), move.rows)) {
      this.committedMove = null
      if (this.moveFallback != null) {
        clearTimeout(this.moveFallback)
        this.moveFallback = null
      }
      slide = this.slideCommitted(move)
    }
    if (this.announcement == null) {
      const placeLine = this.measureModeLine(list)
      this.restoreFocus()
      slide?.()
      placeLine()
    }
    else {
      slide?.()
    }
  }

  /** Reads a committed reorder-mode move and returns its glides. */
  private slideCommitted(move: PendingMove): () => void {
    const { list } = move
    const at = motionNow()
    const shifts = move.rows.map((element, index) =>
      this.rows.holds(element, list) ? move.tops[index]! - layoutTop(element, list) : 0,
    )
    const spring = shifts.some(shift => Math.abs(shift) >= MIN_MOVE_PX) ? touchMotion.glideBase(list) : null
    return () => {
      for (const [index, element] of move.rows.entries()) {
        const shift = shifts[index]!
        if (spring == null || Math.abs(shift) < MIN_MOVE_PX)
          continue
        touchMotion.follow(element, shift, spring, at)
      }
      clearReordering(list)
    }
  }

  /**
   * The drop's commit: each row starts from its old place (the dropped row
   * from where it was let go) and glides to its new one.
   */
  private rebase(pending: PendingDrop): void {
    const { list } = pending
    const at = motionNow()
    const rows: Array<RebaseRow | null> = pending.rows.map((element, index) => {
      if (!this.rows.holds(element, list))
        return null
      const from = index === pending.dragged ? pending.droppedTop : pending.tops[index]!
      return { element, index, shift: from - layoutTop(element, list), value: shownY(element, at), moving: isMoving(element) }
    })
    const settles = (row: RebaseRow): boolean => Math.abs(row.value + row.shift) < MIN_MOVE_PX && !row.moving
    const glides = (row: RebaseRow): boolean => !settles(row) && Math.abs(row.shift) >= MIN_MOVE_PX
    const spring = this.animates && rows.some(row => row != null && glides(row)) ? touchMotion.glideBase(list) : null
    for (const row of rows) {
      if (row == null)
        continue
      const { element, index, shift, value, moving } = row
      if (settles(row)) {
        settleAtRest(element, value, moving)
        continue
      }
      if (!glides(row))
        continue
      if (spring != null && index === pending.dragged)
        touchMotion.glide(element, shift, spring, at, pending.velocity)
      else if (spring != null)
        touchMotion.follow(element, shift, spring, at)
      else
        settleAtRest(element, value, moving)
    }
    clearReordering(list)
    this.restWhenDone(pending.rows[pending.dragged]!, pending.restore)
  }

  /**
   * Announces once the move lands: at the commit that puts the row at `to`,
   * or what was kept if no such commit comes.
   */
  protected announceWhenCommitted(announcement: PendingAnnouncement): void {
    this.announcement = announcement
    if (this.announcementFallback != null)
      clearTimeout(this.announcementFallback)
    this.announcementFallback = setTimeout(() => {
      this.announcementFallback = null
      const pending = this.announcement
      if (pending != null) {
        this.announcement = null
        this.announce(pending.kept, pending.politeness)
      }
      this.restoreFocus()
    }, 0)
  }

  /** Keeps focus on the mode's handle once its row has moved. */
  protected restoreFocus(): void {
    const row = this.focusRow
    if (row == null)
      return
    this.focusRow = null
    const handle = this.handleIn(row)
    const active = row.ownerDocument.activeElement
    if (handle === this.modeHandle)
      row.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
    if (
      handle instanceof HTMLElement
      && handle === this.modeHandle
      && (active == null || active === row.ownerDocument.body || this.hintElement?.contains(active) === true)
    ) {
      handle.focus({ preventScroll: true })
    }
  }
}
