<script setup lang="ts">
import { useAstryxMessages } from '../locale/context.js'
import '../../styles/table.css'

defineOptions({ name: 'AstryxTableSelectionToolbar' })

defineProps<{ count: number }>()
const emit = defineEmits<{ clear: [] }>()
const messages = useAstryxMessages()
</script>

<template>
  <div class="astryx-table-selection-toolbar" role="region" :aria-label="messages.table.bulkActionsLabel">
    <span>{{ messages.table.selectedCount(count) }}</span>
    <slot />
    <button type="button" class="astryx-table__sort" @click="emit('clear')">
      {{ messages.table.clearAll }}
    </button>
  </div>
</template>
