<script setup lang="ts">
import type { TreeListItemData, TreeListProps, TreeListSlots } from './types.js'
import { computed, reactive, useAttrs, useId, useSlots } from 'vue'
import TreeListItem from './TreeListItem.vue'
import { useTreeFocus } from './useTreeFocus.js'
import { useTreeLayoutMotion } from './useTreeLayoutMotion.js'
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

/** 焦点在要收起的分支里面时，先把焦点挪到这一行：分支收起会把里面的节点从页面上拿掉，焦点会掉到 body。树的焦点模型建好后接上。 */
let keepFocusOnCollapsingRow: (id: string) => void = () => {}

function toggle(id: string) {
  const collapsing = currentExpanded(id, props.items)
  if (collapsing)
    keepFocusOnCollapsingRow(id)
  expanded[id] = !collapsing
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

/** 现在展开着的行（祖先也展开着），不管是点击、键盘还是 `items` 让它展开的。 */
const expandedIds = computed<ReadonlySet<string>>(() => {
  const out = new Set<string>()
  const visit = (list: TreeListItemData[]): void => {
    for (const item of list) {
      if (item.children && item.children.length > 0 && currentExpanded(item.id, props.items)) {
        out.add(item.id)
        visit(item.children)
      }
    }
  }
  visit(props.items)
  return out
})

const { treeRef, focusRow, handleKeyDown, handleFocus } = useTreeFocus({
  hasRovingTabIndex: true,
  matchLabelledBy: true,
  // 正在播放收起退场的子组里的行，已经不算树里的行了。
  itemSelector: '[role="treeitem"]:not([data-tree-exiting])',
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
const { exitingIds } = useTreeLayoutMotion({
  animatedLayout: () => props.animatedLayout,
  expandedIds: () => expandedIds.value,
  tree: () => treeRef.value ?? null,
})
keepFocusOnCollapsingRow = (id) => {
  const tree = treeRef.value
  const active = typeof document === 'undefined' ? null : document.activeElement
  if (tree == null || active == null || !tree.contains(active))
    return
  const row = [...tree.querySelectorAll<HTMLElement>('[role="treeitem"]')].find(item => item.dataset.treeId === id)
  const group = row?.querySelector(':scope > [role="group"]')
  if (row != null && group?.contains(active) === true)
    focusRow(row)
}

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
        :exiting-ids="exitingIds"
        :has-expandable-items="hasExpandable"
        :tabbable-id="tabbableId"
        :pos-in-set="index + 1"
        :set-size="items.length"
        @toggle="toggle"
      />
    </ul>
  </div>
</template>
