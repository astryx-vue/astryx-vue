<script lang="ts">
import type { VNode } from 'vue'
import type { MetadataListContextValue, MetadataListProps } from './types.js'
import { Comment, computed, defineComponent, Fragment, h, provide, ref, useId } from 'vue'
import { useAstryxMessages } from '../locale/context.js'
import { metadataListKey } from './context.js'
import '../../styles/metadata-list.css'

function itemNodes(nodes: VNode[]): VNode[] {
  const result: VNode[] = []
  for (const node of nodes) {
    if (node.type === Comment)
      continue
    if (node.type === Fragment && Array.isArray(node.children))
      result.push(...itemNodes(node.children as VNode[]))
    else
      result.push(node)
  }
  return result
}

export default defineComponent({
  name: 'AstryxMetadataList',
  inheritAttrs: false,
  props: {
    columns: { type: [String, Number], default: 'single' },
    label: { type: Object, default: undefined },
    maxNumOfItems: { type: Number, default: undefined },
    orientation: { type: String, default: 'vertical' },
    title: { type: String, default: undefined },
  },
  setup(props: MetadataListProps, { slots, attrs }) {
    const messages = useAstryxMessages()
    const expanded = ref(false)
    const contentId = `astryx-metadata-list-${useId()}`

    const isMultiColumn = computed(() => props.columns === 'multi' || (typeof props.columns === 'number' && props.columns > 1))
    const labelPosition = computed(() => {
      if (props.orientation === 'horizontal')
        return 'top' as const
      return props.label?.position ?? (isMultiColumn.value ? 'top' : 'start')
    })

    const context: MetadataListContextValue = {
      get labelPosition() {
        return labelPosition.value
      },
      get orientation() {
        return props.orientation ?? 'vertical'
      },
    }
    provide(metadataListKey, context)

    return () => {
      const orientation = props.orientation ?? 'vertical'
      const stacked = labelPosition.value === 'top'
      const horizontal = orientation === 'horizontal'
      const layout = horizontal
        ? 'horizontal'
        : stacked
          ? (props.columns === 'single' || props.columns === 1 ? 'stacked-single' : 'stacked-multi')
          : (props.columns === 'single' || props.columns === 1 ? 'single' : 'multi')

      let gridTemplateColumns: string | undefined
      if (!horizontal && typeof props.columns === 'number' && props.columns > 1) {
        gridTemplateColumns = stacked
          ? `repeat(${props.columns}, 1fr)`
          : `repeat(${props.columns}, auto minmax(0, 1fr))`
      }
      else if (!horizontal && !stacked && props.label?.width != null) {
        const width = typeof props.label.width === 'number' ? `${props.label.width}px` : props.label.width
        gridTemplateColumns = `${width} minmax(0, 1fr)`
      }

      const nodes = itemNodes(slots.default?.() ?? [])
      const limit = horizontal ? undefined : props.maxNumOfItems
      const collapsed = limit != null && nodes.length > limit && !expanded.value
      const visible = collapsed ? nodes.slice(0, limit) : nodes

      const title = slots.title || props.title
        ? h('div', { class: 'astryx-metadata-list__title' }, slots.title ? slots.title() : props.title)
        : null

      const list = h('dl', {
        'id': contentId,
        'class': 'astryx-metadata-list__dl',
        'data-layout': layout,
        'style': gridTemplateColumns ? { gridTemplateColumns } : undefined,
      }, visible)

      const toggle = limit != null && nodes.length > limit
        ? h('button', {
            'type': 'button',
            'class': 'astryx-metadata-list__toggle',
            'aria-controls': contentId,
            'aria-expanded': expanded.value ? 'true' : 'false',
            'onClick': () => {
              expanded.value = !expanded.value
            },
          }, expanded.value ? messages.value.metadataList.showLess : messages.value.metadataList.showMore)
        : null

      return h('div', {
        ...attrs,
        'class': ['astryx-metadata-list', attrs.class],
        'data-columns': String(props.columns),
        'data-orientation': orientation,
      }, [title, list, toggle])
    }
  },
})
</script>
