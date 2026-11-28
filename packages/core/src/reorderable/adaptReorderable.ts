/**
 * @file adaptReorderable.ts
 * @input A reorderable object made by createReorderable
 * @output `reorderableOptions`: the options the object was made with.
 *   `adaptReorderable`: an object that runs the owner's engine with other
 *   options, so a Lab collection can turn the owner's moves into its own
 *   terms (shown rows into value indexes, a staged draft). The owner's
 *   `start` still finds the collection's list. Neither loads the reorder
 *   engine: it comes with the owner's object
 * @position Internal to core and Lab. The root entry exports both under
 *   `unstable_` names: undocumented, outside the compatibility promise, and
 *   versioned with core
 */
import type { ListReorderOptions, ReorderableInternals } from '../List/reorder/reorderTypes.js'
import type { Reorderable, ReorderableOptions } from './createReorderable.js'
import { REORDER_ENGINE } from '../List/reorder/reorderTypes.js'

/** The options `reorderable` was made with by `createReorderable`. */
export function reorderableOptions<TKey extends string | number, TTo>(
  reorderable: Reorderable<TKey, TTo>,
): ReorderableOptions<TKey, TTo> {
  return (reorderable as unknown as ReorderableInternals).options as unknown as ReorderableOptions<TKey, TTo>
}

/**
 * An object that reorders with `reorderable`'s engine but `options`' moves
 * and `isReorderable`. The owner's `start(key)` still finds the collection's
 * list, and the adapted object's `start` is the owner's.
 */
export function adaptReorderable<TKey extends string | number, TTo>(
  reorderable: Reorderable<TKey, TTo>,
  options: ReorderableOptions<TKey, TTo>,
): Reorderable<TKey, TTo> {
  const source = reorderable as unknown as ReorderableInternals
  const adapted: ReorderableInternals = {
    options: {
      ...(options as unknown as ListReorderOptions),
      startedBy: source.options.startedBy ?? source.options,
    },
    [REORDER_ENGINE]: source[REORDER_ENGINE],
    start: key => source.start(key),
  }
  return adapted as unknown as Reorderable<TKey, TTo>
}
