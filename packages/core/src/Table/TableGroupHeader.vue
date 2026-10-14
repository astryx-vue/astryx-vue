<script setup lang="ts">
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/context.js'

defineOptions({ name: 'AstryxTableGroupHeader' })

defineProps<{
  groupKey: string
  count: number
  collapsed: boolean
  custom?: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()
const messages = useAstryxMessages()
</script>

<template>
  <span class="astryx-table__group-inner" :data-pinned="custom ? undefined : ''">
    <button
      type="button"
      class="astryx-table__group-chevron"
      :data-pinned="custom ? '' : undefined"
      :aria-expanded="collapsed ? 'false' : 'true'"
      :aria-label="collapsed ? messages.table.expandGroup(groupKey) : messages.table.collapseGroup(groupKey)"
      @click.stop="emit('toggle')"
    >
      <span class="astryx-table__chevron-icon" :class="{ 'is-expanded': !collapsed }">
        <Icon icon="chevronRight" size="sm" />
      </span>
    </button>
    <slot>
      <span class="astryx-table__group-label">
        {{ groupKey }}
        <span class="astryx-table__group-count">({{ count }})</span>
      </span>
    </slot>
  </span>
</template>
