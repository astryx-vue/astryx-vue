<script lang="ts">
import { computed, defineComponent, h, useSlots } from 'vue'
import { useMetadataListContext } from './context.js'
import '../../styles/metadata-list.css'

export default defineComponent({
  name: 'AstryxMetadataListItem',
  props: {
    label: { type: String, required: true },
  },
  setup(props) {
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
        return h('div', { class: 'astryx-metadata-list__item' }, [
          h('dt', { class: 'astryx-metadata-list__item-label' }, [icon, props.label]),
          h('dd', { class: 'astryx-metadata-list__item-value' }, slots.default?.()),
        ])
      }
      return [
        h('dt', { class: 'astryx-metadata-list__label' }, [icon, props.label]),
        h('dd', { class: 'astryx-metadata-list__value' }, slots.default?.()),
      ]
    }
  },
})
</script>
