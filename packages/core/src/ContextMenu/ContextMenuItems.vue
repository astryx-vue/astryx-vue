<script setup lang="ts">
import type { ContextMenuDividerData, ContextMenuItemData, ContextMenuItemsProps, ContextMenuOption, ContextMenuSection } from './types.js'
import ContextMenuDivider from './ContextMenuDivider.vue'
import ContextMenuGroup from './ContextMenuGroup.vue'
import ContextMenuItem from './ContextMenuItem.vue'
import ContextMenuSubMenu from './ContextMenuSubMenu.vue'
import '../../styles/context-menu.css'

defineOptions({ name: 'AstryxContextMenuItems' })

defineProps<ContextMenuItemsProps>()

const emit = defineEmits<{
  select: [item: ContextMenuItemData, event: MouseEvent]
}>()

function isDivider(option: ContextMenuOption): option is ContextMenuDividerData {
  return option.type === 'divider'
}

function isSection(option: ContextMenuOption): option is ContextMenuSection {
  return option.type === 'section'
}

function isSubMenu(option: ContextMenuOption): option is ContextMenuItemData {
  return option.type === undefined && option.items != null && option.items.length > 0
}

/**
 * The props a leaf row receives. `items` selects the submenu shape, `id` is
 * identity for the key rather than something the row renders, and `onClick`
 * is delivered through the row's `click` event so it runs once; everything
 * else is a row prop by construction, so the data API cannot silently drop a
 * field it advertises.
 */
function itemProps(option: ContextMenuItemData): Omit<ContextMenuItemData, 'id' | 'items' | 'onClick'> {
  const { id: _id, items: _items, onClick: _onClick, ...rest } = option
  return rest
}

function keyOf(option: ContextMenuOption, index: number): string {
  if (option.type === 'divider')
    return `divider-${index}`
  if (option.type === 'section')
    return `section-${option.id ?? index}`
  return `item-${option.id ?? index}`
}

function onRowClick(option: ContextMenuOption, event: MouseEvent): void {
  if (option.type !== undefined)
    return
  option.onClick?.(event)
  emit('select', option, event)
}

function onNestedSelect(item: ContextMenuItemData, event: MouseEvent): void {
  emit('select', item, event)
}
</script>

<template>
  <template v-for="(option, index) in items" :key="keyOf(option, index)">
    <ContextMenuDivider v-if="isDivider(option)" />
    <ContextMenuGroup v-else-if="isSection(option)" :title="option.title">
      <ContextMenuItems :items="option.items" @select="onNestedSelect" />
    </ContextMenuGroup>
    <ContextMenuSubMenu
      v-else-if="isSubMenu(option)"
      :icon="option.icon"
      :is-disabled="option.isDisabled"
      :items="option.items"
      :label="option.label"
      @select="onNestedSelect"
    />
    <ContextMenuItem
      v-else
      v-bind="itemProps(option as ContextMenuItemData)"
      @click="onRowClick(option, $event)"
    />
  </template>
</template>
