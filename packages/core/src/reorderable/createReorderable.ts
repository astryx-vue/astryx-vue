/**
 * @file createReorderable.ts
 * @input The app's `onReorder` and, optionally, which items move
 * @output `createReorderable`: an object a List takes as `reorderable`. It
 *   carries the reorder's machinery (List/reorder/listReorderEngine.ts), so
 *   a List without one loads none of it
 * @position Public factory, re-exported by composables/createReorderable.ts
 */
import type { ListReorderOptions, ReorderableInternals } from '../List/reorder/reorderTypes.js'
import { listReorderEngine } from '../List/reorder/listReorderEngine.js'
import { REORDER_ENGINE } from '../List/reorder/reorderTypes.js'

/** One committed move: the item's key and where it goes. */
export interface ReorderMove<TKey extends string | number = string | number, TTo = number> {
  /** The moved item's key (ListItem `itemKey`). */
  readonly key: TKey
  /** The item's index after the move. */
  readonly to: TTo
}

export interface ReorderableOptions<TKey extends string | number = string | number, TTo = number> {
  /**
   * Called once per committed move. Apply it by rendering the items in their
   * new order. An order the app keeps springs the rows back.
   */
  onReorder: (move: ReorderMove<TKey, TTo>) => void
  /**
   * Whether the item with `key` moves. One that does not keeps its place and
   * shows no handle. Fixed items at either end bound the drop range; every
   * item moves without it.
   */
  isReorderable?: (key: TKey) => boolean
}

declare const reorderableBrand: unique symbol

/** What `createReorderable` makes: pass it to a List's `reorderable`. */
export interface Reorderable<TKey extends string | number = string | number, TTo = number> {
  readonly [reorderableBrand]: { readonly key: TKey, readonly to: TTo }
  /**
   * Starts reorder mode for the item with `key`, from the app's own UI (a
   * menu's "Move" item, say). Its handle takes focus, and the arrow keys
   * move it. It runs in the collection the object is mounted on, or the one
   * mounted last if several.
   */
  // 方法写法让 `Reorderable<string>` 也能交给只认 `Reorderable` 的 List。
  // eslint-disable-next-line ts/method-signature-style
  start(key: TKey): void
}

/**
 * Makes a collection's items reorderable: by dragging a row's handle, and by
 * the keyboard in reorder mode. Create it once per collection (in `setup`)
 * and pass it to the List's `reorderable`.
 *
 * @example
 * ```ts
 * const reorderable = createReorderable<string>({
 *   onReorder: ({ key, to }) => {
 *     const next = items.value.filter(item => item.id !== key)
 *     next.splice(to, 0, items.value.find(item => item.id === key)!)
 *     items.value = next
 *   },
 * })
 * ```
 */
export function createReorderable<TKey extends string | number = string | number, TTo = number>(
  options: ReorderableOptions<TKey, TTo>,
): Reorderable<TKey, TTo> {
  const internals: ReorderableInternals = {
    options: options as unknown as ListReorderOptions,
    [REORDER_ENGINE]: listReorderEngine,
    start: key => listReorderEngine.start(internals.options, key),
  }
  return internals as unknown as Reorderable<TKey, TTo>
}
