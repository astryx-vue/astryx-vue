<script setup lang="ts">
import type { TreeListDensity, TreeListItemData, TreeListVariant } from './types.js'
import { computed } from 'vue'
import Badge from '../Badge/Badge.vue'
import Icon from '../Icon/Icon.vue'
import { isIconGlyph } from '../Icon/glyphs.js'
import { useAstryxMessages } from '../locale/context.js'
import '../../styles/tree-list.css'

defineOptions({ name: 'AstryxTreeListItem' })

const props = defineProps<{
  item: TreeListItemData
  density: TreeListDensity
  variant: TreeListVariant
  nestedLevel: number
  isLast: boolean
  ancestorsIsLast: boolean[]
  expanded: Record<string, boolean>
  hasExpandableItems: boolean
  tabbableId?: string
  posInSet: number
  setSize: number
}>()

const emit = defineEmits<{ toggle: [id: string] }>()
const messages = useAstryxMessages()

const hasChildren = computed(() => (props.item.children?.length ?? 0) > 0)
const isExpanded = computed(() => hasChildren.value && props.expanded[props.item.id] === true)
const reservesChevron = computed(() => !hasChildren.value && props.hasExpandableItems)
const indent = computed(() => reservesChevron.value
  ? `calc(${props.nestedLevel} * var(--tree-list-indent) + var(--astryx-spacing-4, 16px) + var(--astryx-spacing-2, 8px))`
  : `calc(${props.nestedLevel} * var(--tree-list-indent))`)
const childAncestors = computed(() => [...props.ancestorsIsLast, props.isLast])

const branchMargin = 'calc(var(--astryx-spacing-2, 8px) + var(--astryx-spacing-0-5, 2px))'

function branchOffset(level: number) {
  return `calc(${branchMargin} + ${level} * var(--tree-list-indent))`
}

function onRowClick(event: MouseEvent) {
  if (props.item.isDisabled)
    return
  const target = event.target
  if (target instanceof Element && target.closest('button, a, input, select, textarea'))
    return
  if (props.item.onClick)
    props.item.onClick(event)
  else if (hasChildren.value)
    emit('toggle', props.item.id)
}

function onToggle(event: MouseEvent) {
  event.stopPropagation()
  emit('toggle', props.item.id)
}
</script>

<template>
  <li
    class="astryx-tree-list__item"
    role="treeitem"
    :data-tree-id="item.id"
    :data-tree-disabled="item.isDisabled ? 'true' : undefined"
    :aria-level="nestedLevel + 1"
    :aria-posinset="posInSet"
    :aria-setsize="setSize"
    :aria-selected="item.isSelected || undefined"
    :aria-disabled="item.isDisabled || undefined"
    :aria-expanded="hasChildren ? isExpanded : undefined"
    :tabindex="item.id === tabbableId ? 0 : -1"
  >
    <template v-if="variant === 'lineGuides'">
      <span
        v-for="(ancestorIsLast, level) in ancestorsIsLast"
        v-show="!ancestorIsLast && level !== nestedLevel - 1"
        :key="level"
        class="astryx-tree-list__guide"
        :style="{ insetInlineStart: branchOffset(level) }"
      >
        <span class="astryx-tree-list__guide-line" data-span="full" />
      </span>
      <span
        v-if="nestedLevel > 0"
        class="astryx-tree-list__guide"
        :style="{ insetInlineStart: branchOffset(nestedLevel - 1) }"
      >
        <span class="astryx-tree-list__guide-line" :data-span="isLast ? 'last' : 'full'" />
      </span>
    </template>
    <div class="astryx-tree-list__row">
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 键盘由外层 role="tree" 处理，这一层只接指针点击。 -->
      <div
        class="astryx-tree-list__content"
        :data-density="density"
        :data-selected="item.isSelected || undefined"
        :data-disabled="item.isDisabled || undefined"
        :data-interactive="(item.onClick != null || item.href != null || hasChildren) || undefined"
        :data-nested="nestedLevel > 0 || undefined"
        :style="{ '--_tree-indent': indent }"
        @click="onRowClick"
      >
        <button
          v-if="hasChildren"
          type="button"
          class="astryx-tree-list__chevron"
          data-tree-toggle=""
          :data-state="isExpanded ? 'expanded' : 'collapsed'"
          :aria-expanded="isExpanded"
          :aria-label="messages.treeList.toggleChildren"
          :disabled="item.isDisabled"
          tabindex="-1"
          @click="onToggle"
        >
          <Icon icon="chevronRight" size="sm" color="inherit" />
        </button>
        <span v-if="item.icon" class="astryx-tree-list__start">
          <Icon v-if="isIconGlyph(item.icon)" :icon="item.icon" size="sm" />
          <span v-else class="astryx-tree-list__icon">
            <i :class="item.icon" aria-hidden="true" />
          </span>
        </span>
        <a
          v-if="item.href"
          class="astryx-tree-list__action"
          :href="item.href"
          :target="item.target"
          tabindex="-1"
        >
          <span class="astryx-tree-list__label">{{ item.label }}</span>
          <span v-if="item.description" class="astryx-tree-list__description">{{ item.description }}</span>
        </a>
        <button
          v-else-if="item.onClick"
          type="button"
          class="astryx-tree-list__action"
          :disabled="item.isDisabled"
          tabindex="-1"
          @click="item.onClick($event)"
        >
          <span class="astryx-tree-list__label">{{ item.label }}</span>
          <span v-if="item.description" class="astryx-tree-list__description">{{ item.description }}</span>
        </button>
        <span v-else class="astryx-tree-list__main">
          <span class="astryx-tree-list__label">{{ item.label }}</span>
          <span v-if="item.description" class="astryx-tree-list__description">{{ item.description }}</span>
        </span>
        <span v-if="item.badge || item.endIcon" class="astryx-tree-list__end">
          <Badge v-if="item.badge">{{ item.badge }}</Badge>
          <Icon v-else-if="item.endIcon && isIconGlyph(item.endIcon)" :icon="item.endIcon" size="sm" />
          <span v-else-if="item.endIcon" class="astryx-tree-list__icon">
            <i :class="item.endIcon" aria-hidden="true" />
          </span>
        </span>
      </div>
    </div>
    <ul v-if="hasChildren && isExpanded" class="astryx-tree-list__group" role="group">
      <TreeListItem
        v-for="(child, index) in item.children"
        :key="child.id"
        :item="child"
        :density="density"
        :variant="variant"
        :nested-level="nestedLevel + 1"
        :is-last="index === (item.children?.length ?? 1) - 1"
        :ancestors-is-last="childAncestors"
        :expanded="expanded"
        :has-expandable-items="hasExpandableItems"
        :tabbable-id="tabbableId"
        :pos-in-set="index + 1"
        :set-size="item.children?.length ?? 0"
        @toggle="emit('toggle', $event)"
      />
    </ul>
  </li>
</template>
