/**
 * @file ListReorderRowName.ts
 * @input A row without a reorder handle and its label text
 * @output A component that renders nothing and names the row for the
 *   announcements: a move past it says its name
 * @position List reorder internals, rendered by ListItem through the
 *   session's `RowName`
 */
import type { PropType } from 'vue'
import type { ListReorderController } from './reorderController.js'
import { computed, defineComponent, onMounted, watch } from 'vue'
import { useListContext } from '../context.js'

export default defineComponent({
  name: 'AstryxListReorderRowName',
  props: {
    row: { type: Function as PropType<() => HTMLElement | null>, required: true },
    label: { type: String, default: '' },
  },
  setup(props) {
    const list = useListContext()
    const controller = computed(() => list?.reorder.value?.session as ListReorderController | undefined)
    const text = computed(() => props.label.replace(/\s+/g, ' ').trim())
    onMounted(() => {
      watch(() => [controller.value, text.value] as const, ([session, name], _previous, onCleanup) => {
        if (session != null)
          onCleanup(session.registerName(props.row(), name))
      }, { immediate: true, flush: 'post' })
    })
    return () => null
  },
})
