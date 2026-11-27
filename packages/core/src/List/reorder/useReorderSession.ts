/**
 * @file useReorderSession.ts
 * @input A List's `reorderable` object, its element and its hint id
 * @output `useReorderSession`: the List's reorder session, one per engine,
 *   and what it hands its rows. `useReorderCommit`: runs the session's
 *   commit after every List commit; List calls it after its layout updates
 * @position List reorder internals, called by List.vue. It reads only the
 *   object's key, so the machinery comes with the object
 */
import type { ComputedRef } from 'vue'
import type { Reorderable } from '../../reorderable/createReorderable.js'
import type { ListReorderContextValue, ListReorderSession, ReorderableInternals } from './reorderTypes.js'
import { computed, onMounted, onUpdated } from 'vue'
import { REORDER_ENGINE } from './reorderTypes.js'

export function useReorderSession(
  reorderable: () => Reorderable | undefined,
  getList: () => HTMLElement | null,
  hintId: string,
): ComputedRef<ListReorderContextValue | null> {
  const internals = computed(() => reorderable() as ReorderableInternals | undefined)
  const engine = computed(() => internals.value?.[REORDER_ENGINE])
  const session = computed<ListReorderSession | null>(() => engine.value?.createSession(getList, hintId) ?? null)
  return computed(() => {
    const options = internals.value?.options
    return session.value == null || options == null ? null : { session: session.value, options }
  })
}

/** Runs the session's commit after the List mounts and after each of its updates. */
export function useReorderCommit(reorder: ComputedRef<ListReorderContextValue | null>): void {
  const commit = (): void => reorder.value?.session.commit()
  onMounted(commit)
  onUpdated(commit)
}
