<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/context.js'

defineOptions({ name: 'AstryxTableTreeCell' })

const props = withDefaults(defineProps<{
  level: number
  hasChildren: boolean
  expanded: boolean
  indent?: 'sm' | 'md' | 'lg'
}>(), {
  indent: 'md',
})

const emit = defineEmits<{ toggle: [] }>()
const messages = useAstryxMessages()

const step = computed(() => {
  if (props.indent === 'sm')
    return 'var(--astryx-spacing-3, 12px)'
  if (props.indent === 'lg')
    return 'var(--astryx-spacing-6, 24px)'
  return 'var(--astryx-spacing-4, 16px)'
})

const treeStyle = computed(() => ({
  '--astryx-table-tree-level': String(props.level),
  '--astryx-table-tree-step': step.value,
}))
</script>

<template>
  <div class="astryx-table__tree" :style="treeStyle">
    <button
      v-if="hasChildren"
      type="button"
      class="astryx-table__expander"
      :aria-expanded="expanded ? 'true' : 'false'"
      :aria-label="expanded ? messages.table.collapseRow : messages.table.expandRow"
      @click.stop="emit('toggle')"
    >
      <span class="astryx-table__chevron-icon" :class="{ 'is-expanded': expanded }">
        <Icon icon="chevronRight" size="xsm" />
      </span>
    </button>
    <span v-else class="astryx-table__tree-spacer" />
    <span class="astryx-table__tree-label">
      <slot />
    </span>
  </div>
</template>
