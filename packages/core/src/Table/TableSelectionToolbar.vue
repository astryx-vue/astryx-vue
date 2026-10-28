<script setup lang="ts">
import type { TableSelectionToolbarProps, TableSelectionToolbarSlots } from './types.js'
import { computed } from 'vue'
import Button from '../Button/Button.vue'
import { useAstryxMessages } from '../locale/context.js'
import Toolbar from '../Toolbar/Toolbar.vue'
import '../../styles/table.css'

defineOptions({ name: 'AstryxTableSelectionToolbar' })

const props = withDefaults(defineProps<TableSelectionToolbarProps>(), {
  count: 0,
  size: 'sm',
  variant: 'muted',
})

const emit = defineEmits<{ clear: [] }>()
defineSlots<TableSelectionToolbarSlots>()

const messages = useAstryxMessages()

/** 有 selection 就用它的计数，否则回落到 count。 */
const effectiveCount = computed(() => props.selection?.selectedCount ?? props.count)
/** 走 selection 时，一个都没选中就整条不渲染。 */
const isVisible = computed(() => props.selection == null || props.selection.hasSelection)
const resolvedLabel = computed(() => props.label ?? messages.value.table.bulkActionsLabel)
const resolvedClearLabel = computed(() => props.clearLabel ?? messages.value.table.clearAll)
const resolvedCountLabel = computed(() => messages.value.table.selectedCount(effectiveCount.value))

function clearSelection(): void {
  props.selection?.clearSelection()
  emit('clear')
}
</script>

<template>
  <Toolbar
    v-if="isVisible"
    class="astryx-table-selection-toolbar"
    :label="resolvedLabel"
    :size="size"
    :variant="variant"
  >
    <template v-if="$slots.start || $slots.default" #start>
      <slot name="start">
        <slot name="default" />
      </slot>
    </template>
    <template #end>
      <span class="astryx-table-selection-toolbar__label">
        <slot name="label" :count="effectiveCount">{{ resolvedCountLabel }}</slot>
      </span>
      <Button
        class="astryx-table-selection-toolbar__clear"
        :label="resolvedClearLabel"
        :size="size"
        variant="ghost"
        @click="clearSelection"
      />
    </template>
  </Toolbar>
</template>
