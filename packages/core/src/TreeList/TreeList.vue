<script setup lang="ts">
import type { TreeListItemData, TreeListProps, TreeListSlots } from './types.js'
import { computed, reactive, useAttrs, useId, useSlots } from 'vue'
import TreeListItem from './TreeListItem.vue'
import { useTreeFocus } from './useTreeFocus.js'
import '../../styles/tree-list.css'

defineOptions({ name: 'AstryxTreeList', inheritAttrs: false })

const props = withDefaults(defineProps<TreeListProps>(), {
  density: 'balanced',
  variant: 'lineGuides',
})

defineSlots<TreeListSlots>()

const attrs = useAttrs()
const slots = useSlots()
const headerId = `astryx-tree-list-${useId()}`
const hasHeader = computed(() => props.header != null || slots.header != null)

const rootAttrs = computed(() => {
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class' || key === 'style' || key === 'onKeydown' || key === 'onKeyDown')
      continue
    if (key === 'aria-label' || key === 'aria-labelledby')
      continue
    rest[key] = value
  }
  return rest
})

const treeLabel = computed(() => {
  if (hasHeader.value)
    return undefined
  const fromAttr = attrs['aria-label']
  if (typeof fromAttr === 'string')
    return fromAttr
  return props.label
})

const treeLabelledBy = computed(() => {
  if (hasHeader.value)
    return headerId
  const fromAttr = attrs['aria-labelledby']
  return typeof fromAttr === 'string' ? fromAttr : undefined
})
const expanded = reactive<Record<string, boolean>>({})

function walk(items: TreeListItemData[], visit: (item: TreeListItemData) => void) {
  for (const item of items) {
    visit(item)
    if (item.children)
      walk(item.children, visit)
  }
}

walk(props.items, (item) => {
  if (item.isExpanded && item.children && item.children.length > 0)
    expanded[item.id] = true
})

function currentExpanded(id: string, items: TreeListItemData[]): boolean {
  let found = false
  let seeded = false
  walk(items, (item) => {
    if (item.id === id) {
      found = true
      seeded = item.isExpanded === true
    }
  })
  if (!found)
    return false
  return id in expanded ? expanded[id] === true : seeded
}

function toggle(id: string) {
  expanded[id] = !currentExpanded(id, props.items)
}

const hasExpandable = computed(() => {
  let found = false
  walk(props.items, (item) => {
    if (item.children && item.children.length > 0)
      found = true
  })
  return found
})

function initialTabbable(items: TreeListItemData[]): string | undefined {
  let firstEnabled: string | undefined
  const visit = (list: TreeListItemData[]): string | undefined => {
    for (const item of list) {
      if (item.isSelected && item.isDisabled !== true)
        return item.id
      if (firstEnabled == null && item.isDisabled !== true)
        firstEnabled = item.id
      if (item.children && item.children.length > 0) {
        const selected = visit(item.children)
        if (selected != null)
          return selected
      }
    }
    return undefined
  }
  return visit(items) ?? firstEnabled ?? items[0]?.id
}

const tabbableId = computed(() => initialTabbable(props.items))

const { treeRef, handleKeyDown, handleFocus } = useTreeFocus({
  hasRovingTabIndex: true,
  matchLabelledBy: true,
  onToggleExpand: toggle,
  onActivate: (current) => {
    const candidates = current.querySelectorAll<HTMLElement>('a[href], button:not([data-tree-toggle])')
    for (const candidate of candidates) {
      if (candidate.closest('[role="treeitem"]') === current) {
        candidate.click()
        return true
      }
    }
    return false
  },
})

function callKeydown(listener: unknown, event: KeyboardEvent): void {
  if (typeof listener === 'function')
    listener(event)
  else if (Array.isArray(listener))
    listener.forEach(entry => callKeydown(entry, event))
}

function onKeyDown(event: KeyboardEvent) {
  callKeydown(attrs.onKeydown ?? attrs.onKeyDown, event)
  if (event.defaultPrevented)
    return
  if (treeRef.value != null && event.target instanceof Node && treeRef.value.contains(event.target))
    handleKeyDown(event)
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 方向键从内部 role="tree" 冒泡上来，这一层只负责转发给树的键盘逻辑。 -->
  <div
    v-bind="rootAttrs"
    class="astryx-tree-list"
    :class="attrs.class"
    :style="attrs.style"
    :data-density="density"
    :data-variant="variant"
    @keydown="onKeyDown"
  >
    <div v-if="hasHeader" :id="headerId" class="astryx-tree-list__header">
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <ul
      ref="treeRef"
      class="astryx-tree-list__list"
      role="tree"
      :aria-label="treeLabel"
      :aria-labelledby="treeLabelledBy"
      @focus="handleFocus"
    >
      <TreeListItem
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :density="density"
        :variant="variant"
        :nested-level="0"
        :is-last="index === items.length - 1"
        :ancestors-is-last="[]"
        :expanded="expanded"
        :has-expandable-items="hasExpandable"
        :tabbable-id="tabbableId"
        :pos-in-set="index + 1"
        :set-size="items.length"
        @toggle="toggle"
      />
    </ul>
  </div>
</template>
