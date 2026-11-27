/**
 * @file reorderTypes.ts
 * @input Nothing but Vue's types
 * @output The contract between a reorderable object
 *   (reorderable/createReorderable.ts), the collection it is passed to and
 *   its rows: the engine key `REORDER_ENGINE`, the options, the session, the
 *   row reader and the context a List hands its rows
 * @position List reorder internals. List, ListItem and createReorderable
 *   import only these types, so a List without `reorderable` loads no
 *   reorder code: the machinery comes with the object.
 */
import type { Component } from 'vue'
import type { ItemAlign } from '../types.js'
import { sharedKey } from '../../utils/sharedRealm.js'

/** A row's key, as ListItem's `itemKey`. */
export type ReorderKey = string | number

/**
 * The key a reorderable object carries its machinery under. `sharedKey`
 * registers it, so a copied List reads a package object, and the package
 * List reads an object a copy adapted.
 */
export const REORDER_ENGINE = sharedKey('list/reorder-engine', 1)

/** What a List's reorder reports and asks, as createReorderable took them. */
export interface ListReorderOptions {
  /** Called once per committed move: the item's key and its index after it. */
  readonly onReorder: (move: { key: ReorderKey, to: number }) => void
  /** Whether the item with `key` moves; every item does without it. */
  readonly isReorderable?: (key: ReorderKey) => boolean
  /**
   * An adapted object's (`adaptReorderable`): the owner's options, which the
   * owner's `start` finds this list by, while the moves go through these.
   */
  readonly startedBy?: ListReorderOptions
}

/** How a reorder session finds a collection's rows in its container. */
export interface ReorderRows {
  /** The rows that hold a place in the order, in order. */
  read: (container: HTMLElement) => HTMLElement[]
  /**
   * Whether `element` is a row of the collection. A row put back for its
   * exit is a row, but holds no place in the order.
   */
  holds: (element: Element, container: HTMLElement) => boolean
}

/** The parts of a List's reorder session that its List and rows use. */
export interface ListReorderSession {
  /**
   * Runs after every List commit, after the List's layout updates. When a
   * drop's new order is applied, each row's old place is put back. Its
   * running spring then continues to the new one.
   */
  commit: () => void
  /**
   * Whether a drag or a reorder-mode move owns the list's next commit. The
   * List's layout updates measure nothing for such a commit.
   */
  ownsCommit: () => boolean
  /**
   * Rendered by the List beside its rows (prop `reorder`). It keeps the
   * session's callbacks, strings and listeners current, renders the handles'
   * instructions and disposes of the session when it goes.
   */
  readonly Host: Component
  /** The handle each reorderable row ends with. */
  readonly Handle: Component
  /** Names a row without a handle for the announcements; renders nothing. */
  readonly RowName: Component
}

/** The machinery a reorderable object carries. */
export interface ListReorderEngine {
  /**
   * A reorder session over the rows of the element `getList` returns.
   * `rows` finds those rows; without it, they are the element's children,
   * as in a List.
   */
  createSession: (
    getList: () => HTMLElement | null,
    hintId: string,
    rows?: ReorderRows,
  ) => ListReorderSession
  /**
   * Reorder mode for the item with `key`, started from the app's own UI. It
   * runs in the collection the object with `options` is mounted on, or the
   * one mounted last if several.
   */
  start: (options: ListReorderOptions, key: ReorderKey) => void
}

/** What a reorderable object holds (reorderable/createReorderable.ts). */
export interface ReorderableInternals {
  readonly options: ListReorderOptions
  readonly [REORDER_ENGINE]: ListReorderEngine
  /** Reorder mode for the item with `key`, from the app's own UI. */
  start: (key: ReorderKey) => void
}

/** What a reorderable List hands its rows. */
export interface ListReorderContextValue {
  readonly session: ListReorderSession
  readonly options: ListReorderOptions
}

/** The handle's props (List/reorder/ListReorderHandle.vue). */
export interface ListReorderHandleProps {
  /** The row's label text: it names the handle. */
  label?: string
  /** The row's item key (ListItem `itemKey`), which its moves report. */
  itemKey: ReorderKey
  /**
   * The row's own accessible name, when its caller gave one (ListItem
   * `aria-label`): the handle is "Reorder" followed by it.
   */
  rowLabel?: string
  /**
   * The elements that name the row, when its caller gave them (ListItem
   * `aria-labelledby`): the handle is "Reorder" followed by them.
   */
  rowLabelledBy?: string
  /**
   * The row is disabled: the handle stays focusable with
   * `aria-disabled="true"`, and no gesture or key moves the row.
   */
  isDisabled?: boolean
  /**
   * The row's alignment (ListItem `align`) when the handle is the row's own
   * child, after its label: a row without end content. Absent inside the end
   * slot.
   */
  rowAlign?: ItemAlign
}
