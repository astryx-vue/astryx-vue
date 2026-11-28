/**
 * @file ListReorderScope.ts
 * @input A reorderable object made by createReorderable, and the element
 *   whose children are the rows
 * @output `useListReorderScope`: a reorder session over rows that are not
 *   ListItems. `ListReorderScope` hands those rows the session the way a
 *   reorderable List hands its own, so the session's `Handle` inside a row
 *   drags that row
 * @position Internal to core. Lab's ListInput reaches it through the root
 *   entry's `unstable_` names. It runs the engine a reorderable List runs
 *   (listReorderEngine.ts), which comes with the object, so the rows drag,
 *   take keys and announce their moves alike. List.vue runs the same session
 *   for its own rows through useReorderSession.ts
 */
import type { ComputedRef, PropType } from 'vue'
import type { Reorderable } from '../../reorderable/createReorderable.js'
import type { ListContextValue } from '../context.js'
import type { ListReorderContextValue } from './reorderTypes.js'
import { computed, defineComponent, h, provide } from 'vue'
import { listContextKey } from '../context.js'
import { useReorderCommit, useReorderSession } from './useReorderSession.js'

/**
 * The reorder session over the children of the element `getList` returns,
 * run by `reorderable`'s engine, or `null` without an object. `hintId` names
 * the handles' instructions, which `ListReorderScope` renders. Call it in the
 * `setup` of the component that renders the rows: the session's commit runs
 * after each of its updates. The object may change: the session lasts as long
 * as its engine and reads the latest options.
 */
export function useListReorderScope(
  reorderable: () => Reorderable | undefined,
  getList: () => HTMLElement | null,
  hintId: string,
): ComputedRef<ListReorderContextValue | null> {
  const reorder = useReorderSession(reorderable, getList, hintId)
  useReorderCommit(reorder)
  return reorder
}

/**
 * Gives the rows in its slot the reorder session, so the session's `Handle`
 * in a row drags that row, and renders the session's instructions and reorder
 * mode hint. Without a session it renders its slot alone.
 */
export const ListReorderScope = defineComponent({
  name: 'AstryxListReorderScope',
  props: {
    reorder: { type: Object as PropType<ListReorderContextValue | null>, default: null },
  },
  setup(props, { slots }) {
    // A reorder scope's rows read only `reorder`; the rest is a List's defaults.
    const context: ListContextValue = {
      density: computed(() => 'balanced'),
      edge: computed(() => 'padded'),
      hasDividers: computed(() => false),
      listStyle: computed(() => 'none'),
      edgeCompensation: computed(() => undefined),
      reorder: computed(() => props.reorder),
    }
    provide(listContextKey, context)
    return () => {
      const reorder = props.reorder
      return [
        slots.default?.(),
        reorder == null ? null : h(reorder.session.Host, { reorder }),
      ]
    }
  },
})
