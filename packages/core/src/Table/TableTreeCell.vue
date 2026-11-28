<script setup lang="ts">
import { computed, onMounted, onUpdated, shallowRef } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useComponentMessages } from '../locale/context.js'
import { tableMessages } from '../locale/messages/table.js'
import { TREE_LEVEL_ATTRIBUTE } from './treeRowAria.js'

defineOptions({ name: 'AstryxTableTreeCell' })

const props = withDefaults(defineProps<{
  level: number
  hasChildren: boolean
  expanded: boolean
  indent?: 'sm' | 'md' | 'lg'
  /** 行的可读名字，拼进展开按钮的名字；空白时用通用的「Expand row」。 */
  rowLabel?: string
}>(), {
  indent: 'md',
})

const emit = defineEmits<{ toggle: [] }>()
const messages = useComponentMessages({ table: tableMessages })
const expander = shallowRef<HTMLButtonElement | null>(null)

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

const label = computed(() => {
  const table = messages.value.table
  const name = props.rowLabel?.trim()
  if (name)
    return props.expanded ? table.treeCollapseRowNamed(name) : table.treeExpandRowNamed(name)
  return props.expanded ? table.treeCollapseRow : table.treeExpandRow
})

/**
 * 披露模式：展开时，按钮用 `aria-controls` 指向它的直接子行。
 * 子行紧跟在这一行后面，层级正好深一级；遇到同级或更浅的行就到头了。
 */
function linkChildRows(): void {
  const button = expander.value
  if (button == null)
    return
  const row = button.closest('tr')
  const ids: string[] = []
  if (row != null && props.hasChildren && props.expanded) {
    for (let next = row.nextElementSibling; next != null; next = next.nextElementSibling) {
      const level = Number(next.getAttribute(TREE_LEVEL_ATTRIBUTE) ?? Number.NaN)
      if (Number.isNaN(level) || level <= props.level)
        break
      if (level === props.level + 1 && next.id !== '')
        ids.push(next.id)
    }
  }
  if (ids.length > 0)
    button.setAttribute('aria-controls', ids.join(' '))
  else
    button.removeAttribute('aria-controls')
}

onMounted(linkChildRows)
onUpdated(linkChildRows)
</script>

<template>
  <div class="astryx-table__tree" :style="treeStyle">
    <button
      v-if="hasChildren"
      ref="expander"
      type="button"
      class="astryx-table__expander"
      :aria-expanded="expanded ? 'true' : 'false'"
      :aria-label="label"
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
