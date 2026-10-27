<script lang="ts">
import { computed, defineComponent, h, useSlots } from 'vue'
import { useMetadataListContext } from './context.js'
import '../../styles/metadata-list.css'

export default defineComponent({
  name: 'AstryxMetadataListItem',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
  },
  setup(props, { attrs }) {
    const context = useMetadataListContext()
    const slots = useSlots()
    const stacked = computed(() => {
      const position = context?.labelPosition ?? 'start'
      return position === 'top' || context?.orientation === 'horizontal'
    })

    return () => {
      const icon = slots.icon
        ? h('span', { class: 'astryx-metadata-list__icon' }, slots.icon())
        : null
      if (stacked.value) {
        return h('div', { ...attrs, class: ['astryx-metadata-list__item', attrs.class] }, [
          h('dt', { class: 'astryx-metadata-list__item-label' }, [icon, props.label]),
          h('dd', { class: 'astryx-metadata-list__item-value' }, slots.default?.()),
        ])
      }
      return [
        h('dt', { ...attrs, class: ['astryx-metadata-list__label', attrs.class] }, [icon, props.label]),
        h('dd', { class: 'astryx-metadata-list__value' }, slots.default?.()),
      ]
    }
  },
})
</script>
