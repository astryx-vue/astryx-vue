/**
 * @file reorderState.ts
 * @input The List locale messages and the long-press recognizer's state
 * @output The records a reorder session keeps while a row moves (the drag,
 *   the restore, the pending drop, move and announcement), its messages and
 *   the gesture event the mouse and touch paths both feed it
 * @position List reorder internals, read by reorderDom.ts and the
 *   controller layers
 */
import type { AnnouncePoliteness } from '../../composables/internal/announce.js'
import type { GestureState } from '../../gestures/types.js'
import type { ListMessages } from '../../locale/messages/list.js'
import type { EdgeAutoscroll } from '../../utils/edgeAutoscroll.js'
import type { ReorderGeometry } from './reorderModel.js'

/** An inline extent in a list's coordinates: start and size, px. */
export interface LineSpan {
  readonly start: number
  readonly size: number
}

/** The element autoscroll writes to and its visible band in the viewport. */
export interface Scroller {
  readonly element: Element
  top: number
  bottom: number
  readonly max: number
  position: number
}

/** What the row and list styles were before a drag wrote them. */
export interface RowRestore {
  readonly zIndex: string
  readonly backgroundColor: string
  readonly opacity: string
  readonly counterIncrement: string
  readonly listPosition: string
  readonly rows: ReadonlyArray<HTMLElement>
}

/** A drag under way. */
export interface DragSession {
  readonly list: HTMLElement
  readonly rows: ReadonlyArray<HTMLElement>
  readonly tops: ReadonlyArray<number>
  readonly geometry: ReorderGeometry
  readonly dragged: number
  readonly lineSpan: LineSpan
  position: number
  readonly offsets: number[]
  readonly origin: number
  readonly grabOffset: number
  readonly scroller: Scroller
  scrolled: number
  lastY: number
  readonly edge: EdgeAutoscroll
  step: number
  readonly restore: RowRestore
  readonly preview: HTMLElement
  previewOffset: number
  scrollStale: boolean
  ownScroll: boolean
  wrote: boolean
  foldArmed: boolean
  stopScrollWatch: () => void
}

/** A drop waiting for the commit that applies its order. */
export interface PendingDrop {
  readonly list: HTMLElement
  readonly rows: ReadonlyArray<HTMLElement>
  readonly tops: ReadonlyArray<number>
  readonly dragged: number
  readonly droppedTop: number
  readonly velocity: number
  readonly restore: RowRestore
}

/** A reorder-mode move waiting for the commit that applies it. */
export interface PendingMove {
  readonly list: HTMLElement
  readonly rows: ReadonlyArray<HTMLElement>
  readonly tops: ReadonlyArray<number>
}

/** What to announce once a move's commit lands, or `kept` if it never does. */
export interface PendingAnnouncement {
  readonly row: HTMLElement
  readonly to: number
  readonly landed: () => string
  readonly kept: string
  readonly politeness: AnnouncePoliteness | undefined
}

/** The announcements of a reorder, from the List locale messages. */
export interface ReorderMessages {
  place: (label: string, position: number, total: number, previous: string | null, next: string | null) => string
  refused: (label: string) => string
  itemAt: (position: number) => string
  modeDone: (label: string, position: number, total: number) => string
  pickedUp: (position: number, total: number) => string
  dropped: (position: number, total: number) => string
  cancelled: (position: number, total: number) => string
}

export function messagesFrom(list: ListMessages): ReorderMessages {
  return {
    place: (label, position, total, previous, next) =>
      previous == null
        ? list.reorderPlaceTop(label, position, total, next ?? '')
        : next == null
          ? list.reorderPlaceEnd(label, position, total, previous)
          : list.reorderPlace(label, position, total, previous, next),
    refused: list.reorderRefused,
    itemAt: list.reorderItemAt,
    modeDone: list.reorderModeDone,
    pickedUp: list.reorderPickedUp,
    dropped: list.reorderDropped,
    cancelled: list.reorderCancelled,
  }
}

/** A step of a drag, from the mouse path or the touch hold. */
export interface ReorderGestureEvent {
  readonly state: 'began' | 'changed' | 'ended' | 'cancelled'
  readonly y: number
  readonly velocity?: number
}

/**
 * How a handle is named: by its row's place (`position`, when its row has no
 * name of its own), and whether its row's label element shows no name.
 */
export interface ListReorderHandleName {
  readonly position: number | null
  readonly labelShowsNoName: boolean
}

/** A handle the session has not read yet: named by its row's label. */
export const UNREAD_HANDLE_NAME: ListReorderHandleName = {
  position: null,
  labelShowsNoName: false,
}

export function gestureStateOf(state: GestureState): ReorderGestureEvent['state'] | null {
  switch (state) {
    case 'began':
    case 'changed':
    case 'ended':
    case 'cancelled':
      return state
    case 'failed':
      return 'cancelled'
    case 'possible':
      return null
  }
}
