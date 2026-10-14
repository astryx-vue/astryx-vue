<script setup lang="ts">
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/context.js'

defineOptions({ name: 'AstryxTableExpansionChevron' })

defineProps<{ expanded: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
const messages = useAstryxMessages()
</script>

<template>
  <button
    type="button"
    class="astryx-table__expander astryx-table__expander--column"
    :aria-expanded="expanded ? 'true' : 'false'"
    :aria-label="expanded ? messages.table.collapseRow : messages.table.expandRow"
    @click.stop="emit('toggle')"
  >
    <span class="astryx-table__chevron-icon" :class="{ 'is-expanded': expanded }">
      <Icon icon="chevronRight" size="xsm" />
    </span>
  </button>
</template>
