/**
 * @file reorderDrag.ts
 * @input Gesture events from the mouse path and the touch hold
 * @output `ReorderDrag`: a drag from pick-up to the move before the drop.
 *   The rows stay still while a preview copy of the dragged row follows the
 *   pointer, the insertion line marks the drop position, and the scroller
 *   autoscrolls near its edges and is followed when anything else scrolls it
 * @position The third layer of the List reorder controller, over
 *   reorderNames.ts. reorderDrop.ts ends what this begins
 */
import type { ReorderGeometry } from './reorderModel.js'
import type { DragSession, ReorderGestureEvent, RowRestore } from './reorderState.js'
import { paintedBackground } from '../../motion/inertClone.js'
import { reorder } from '../../motion/uikit/reorder.js'
import { edgeAutoscroll } from '../../utils/edgeAutoscroll.js'
import { subscribeInput } from '../../utils/inputStream.js'
import { animatorFor, motionNow } from '../../utils/rowMotion.js'
import {
  boundsOf,
  hideLine,
  isTransparent,
  layoutTop,
  lineCenter,
  lineSpanOf,
  MOVING_OPACITY,
  previewCopyOf,
  previewOf,
  previewSpanOf,
  scrollerOf,
  showLine,
  shownY,
} from './reorderDom.js'
import { markReordering, markReorderSource } from './reorderMarks.js'
import { autoscrollStep, clampTop, dropPosition } from './reorderModel.js'
import { ReorderNames } from './reorderNames.js'

export abstract class ReorderDrag extends ReorderNames {
  gesture(row: HTMLElement | null, event: ReorderGestureEvent): void {
    switch (event.state) {
      case 'began':
        if (row != null)
          this.begin(row, event.y)
        break
      case 'changed':
        this.track(event.y)
        break
      case 'ended':
        this.drop(event.velocity ?? 0)
        break
      case 'cancelled':
        this.cancel()
        break
    }
  }

  protected abstract drop(velocity: number): void
  abstract cancel(): void
  protected abstract flushPending(): void

  /**
   * Picks `row` up at pointer `y`: its preview copy goes over it, it dims in
   * place, and every row gets a translate the drop can glide.
   */
  private begin(row: HTMLElement, y: number): boolean {
    const list = this.getList()
    if (list == null || this.session != null)
      return false
    if (this.modeHandle != null)
      this.endMode()
    this.flushPending()
    const rows = this.rows.read(list)
    const dragged = rows.indexOf(row)
    const movable = rows.map(element => this.handleIn(element) != null)
    if (dragged < 0 || !movable[dragged])
      return false
    // Every read before the first write: one layout for the pick-up.
    const at = motionNow()
    const tops = rows.map(element => layoutTop(element, list))
    const heights = rows.map(element => element.offsetHeight)
    const lineSpan = lineSpanOf(row, list)
    const previewSpan = previewSpanOf(row, list)
    const isStatic = getComputedStyle(list).position === 'static'
    const bounds = boundsOf(movable)
    const geometry: ReorderGeometry = {
      rows: rows.map((_element, index) => ({ top: tops[index]!, height: heights[index]!, isFixed: bounds[index]! })),
      gap: rows.length > 1 ? Math.max(0, tops[1]! - tops[0]! - heights[0]!) : 0,
    }
    const shown = shownY(row, at)
    const origin = row.getBoundingClientRect().top - shown - tops[dragged]!
    const scroller = scrollerOf(list)
    const restore: RowRestore = {
      zIndex: row.style.zIndex,
      backgroundColor: row.style.backgroundColor,
      opacity: row.style.opacity,
      counterIncrement: row.style.counterIncrement,
      listPosition: list.style.position,
      rows,
    }
    const background = isTransparent(getComputedStyle(row).backgroundColor) ? paintedBackground(list) : null
    const copy = previewCopyOf(row)
    for (const element of rows) {
      if (element.style.translate === '')
        element.style.translate = '0px 0px'
    }
    if (isStatic)
      list.style.position = 'relative'
    const preview = previewOf(copy, tops[dragged]!, previewSpan, background)
    row.before(preview)
    // The copy holds the row's place in a numbered list; the row counts none.
    row.style.counterIncrement = 'none'
    markReorderSource(row)
    row.style.opacity = MOVING_OPACITY
    markReordering(list)
    const session: DragSession = {
      list,
      rows,
      tops,
      geometry,
      dragged,
      lineSpan,
      position: dragged,
      offsets: rows.map((element, index) => (index === dragged ? 0 : shownY(element, at))),
      origin,
      grabOffset: y - (origin + tops[dragged]! + shown),
      scroller,
      scrolled: 0,
      lastY: y,
      edge: edgeAutoscroll({
        intervalMs: reorder.autoscroll.tickMs,
        catchUp: true,
        now: motionNow,
        step: () => this.edgeStep(session),
        apply: delta => this.scrollBy(session, delta),
      }),
      step: 0,
      restore,
      preview,
      previewOffset: 0,
      scrollStale: false,
      ownScroll: false,
      wrote: true,
      foldArmed: false,
      stopScrollWatch: () => {},
    }
    this.session = session
    session.stopScrollWatch = this.watchScroll(session)
    this.moveTo(dragged)
    this.track(y)
    this.announce(this.messages?.pickedUp(dragged + 1, rows.length) ?? '', 'polite')
    return true
  }

  /** The dragged row's top on screen for pointer `y`, kept inside the list and the scroller. */
  private draggedTop(session: DragSession, y: number): number {
    const { geometry, dragged, scroller } = session
    const row = geometry.rows[dragged]!
    const first = geometry.rows[0]!
    const last = geometry.rows[geometry.rows.length - 1]!
    const origin = session.origin - session.scrolled
    return clampTop(y - session.grabOffset, row.height, {
      scrollTop: scroller.top,
      scrollBottom: scroller.bottom,
      listTop: origin + first.top,
      listBottom: origin + last.top + last.height,
    })
  }

  protected track(y: number): void {
    const session = this.session
    if (session == null)
      return
    if (session.scrollStale)
      this.syncScroll(session)
    session.lastY = y
    session.wrote = true
    const { geometry, dragged } = session
    const row = geometry.rows[dragged]!
    const origin = session.origin - session.scrolled
    const top = this.draggedTop(session, y)
    const offset = top - (origin + row.top)
    if (offset !== session.previewOffset) {
      session.previewOffset = offset
      animatorFor(session.preview).set({ y: offset })
    }
    const position = dropPosition(geometry, dragged, top + row.height / 2 - origin)
    if (position !== session.position)
      this.moveTo(position)
    this.autoscroll(top, row.height)
  }

  private moveTo(position: number): void {
    const session = this.session
    if (session == null)
      return
    session.position = position
    const center = lineCenter(session.geometry, session.dragged, position)
    if (center == null)
      hideLine(session.list)
    else
      showLine(session.list, session.lineSpan, center)
  }

  /** The autoscroll step for the dragged row at `top`: down past the bottom edge, up past the top. */
  private stepFor(session: DragSession, top: number, height: number): number {
    const { scroller } = session
    let step = 0
    if (scroller.position < scroller.max)
      step = autoscrollStep(top + height - scroller.bottom)
    if (step === 0 && scroller.position > 0)
      step = -autoscrollStep(scroller.top - top)
    return step
  }

  private autoscroll(top: number, height: number): void {
    const session = this.session
    if (session == null)
      return
    session.step = Math.abs(this.stepFor(session, top, height))
    session.edge.update()
  }

  private edgeStep(session: DragSession): number {
    if (this.session !== session)
      return 0
    if (session.scrollStale)
      this.syncScroll(session)
    const { geometry, dragged } = session
    const top = this.draggedTop(session, session.lastY)
    return this.stepFor(session, top, geometry.rows[dragged]!.height)
  }

  private scrollBy(session: DragSession, delta: number): number {
    if (this.session !== session)
      return 0
    const { scroller } = session
    const next = Math.min(scroller.max, Math.max(0, scroller.position + delta))
    const moved = next - scroller.position
    if (moved === 0)
      return 0
    scroller.element.scrollTop = next
    session.scrolled += moved
    scroller.position = next
    session.ownScroll = true
    requestAnimationFrame(() => {
      session.ownScroll = false
    })
    this.track(session.lastY)
    return moved
  }

  /**
   * Follows a scroll the drag did not write: of its scroller, or of a box
   * around it (the page, an outer scroller) that moves the scroller.
   */
  private watchScroll(session: DragSession): () => void {
    const doc = session.list.ownerDocument
    const view = doc.defaultView
    if (view == null)
      return () => {}
    const { element } = session.scroller
    const page = doc.scrollingElement ?? doc.documentElement
    const own = element === page ? doc : element
    const isAround = (target: EventTarget): boolean =>
      own !== doc
      && (target === doc || (target instanceof Element && target !== element && target.contains(element)))
    return subscribeInput(view, 'scroll', (event) => {
      const { target } = event
      if (target == null || this.session !== session || (target !== own && !isAround(target)))
        return
      if (target === own && session.ownScroll) {
        session.ownScroll = false
        return
      }
      session.scrollStale = true
      this.armFold(session)
    })
  }

  /**
   * Folds a scroll into the drag in a frame where the pointer wrote nothing:
   * a still pointer over a scrolling list keeps its row under it.
   */
  private armFold(session: DragSession): void {
    if (session.foldArmed)
      return
    session.foldArmed = true
    requestAnimationFrame(() => {
      session.wrote = false
      requestAnimationFrame(() => this.foldInFrame(session))
    })
  }

  private foldInFrame(session: DragSession): void {
    session.foldArmed = false
    if (this.session !== session || !session.scrollStale)
      return
    if (session.wrote) {
      session.wrote = false
      session.foldArmed = true
      requestAnimationFrame(() => this.foldInFrame(session))
      return
    }
    this.track(session.lastY)
  }

  private syncScroll(session: DragSession): void {
    session.scrollStale = false
    const { scroller } = session
    const { element } = scroller
    const position = element.scrollTop
    session.scrolled += position - scroller.position
    scroller.position = position
    const doc = element.ownerDocument
    if (element === (doc.scrollingElement ?? doc.documentElement))
      return
    const top = element.getBoundingClientRect().top + element.clientTop
    const moved = scroller.top - top
    session.scrolled += moved
    scroller.top = top
    scroller.bottom -= moved
  }

  protected stopAutoscroll(session: DragSession): void {
    session.edge.stop()
    session.step = 0
  }
}
