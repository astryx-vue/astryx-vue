<script setup lang="ts">
import { computed } from 'vue'
import ComponentIcon from '../Icon/ComponentIcon.vue'
import { useComponentMessages } from '../locale/context.js'
import { tableMessages } from '../locale/messages/table.js'

defineOptions({ name: 'AstryxTableExpansionChevron' })

const props = defineProps<{ expanded: boolean, rowLabel?: string }>()
const emit = defineEmits<{ toggle: [] }>()
const messages = useComponentMessages({ table: tableMessages })
const label = computed(() => {
  const table = messages.value.table
  if (props.rowLabel)
    return props.expanded ? table.collapseRowNamed(props.rowLabel) : table.expandRowNamed(props.rowLabel)
  return props.expanded ? table.collapseRow : table.expandRow
})
</script>

<template>
  <button
    type="button"
    class="astryx-table__expander astryx-table__expander--column"
    :aria-expanded="expanded ? 'true' : 'false'"
    :aria-label="label"
    @click.stop="emit('toggle')"
  >
    <span class="astryx-table__chevron-icon astryx-table__chevron-icon--slot" :class="{ 'is-expanded': expanded }">
      <ComponentIcon
        icon-slot="table-row-expand"
        :state="{ expanded }"
        :fallback="{ icon: 'chevronRight', size: 'xsm' }"
      />
    </span>
  </button>
</template>
