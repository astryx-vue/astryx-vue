<script setup lang="ts">
import type { ListItemProps } from '../List/types.js'
import type { MoreMenuItem, MoreMenuSheetRowEmits, MoreMenuSheetRowProps } from './types.js'
import { computed } from 'vue'
import Icon from '../Icon/Icon.vue'
import ListItem from '../List/ListItem.vue'
import { isSubmenuItem } from './menuItems.js'
import { isModifiedClick } from './menuNav.js'
import '../../styles/more-menu.css'

defineOptions({ name: 'AstryxMoreMenuSheetRow' })

const props = defineProps<MoreMenuSheetRowProps>()

const emit = defineEmits<MoreMenuSheetRowEmits>()

const item = computed<MoreMenuItem>(() => props.item)
const isDestructive = computed(() => item.value.variant === 'destructive')
const isSubmenu = computed(() => isSubmenuItem(item.value))
const isLink = computed(() => item.value.href != null && !item.value.isDisabled)
const iconColor = computed(() => (isDestructive.value ? 'error' : 'secondary'))

const rowProps = computed<ListItemProps>(() => ({
  description: item.value.description,
  href: isLink.value ? item.value.href : undefined,
  isDisabled: item.value.isDisabled,
  label: item.value.label,
  rel: isLink.value ? item.value.rel : undefined,
  target: isLink.value ? item.value.target : undefined,
}))

function activate(event: MouseEvent): void {
  if (item.value.isDisabled) {
    // A disabled row has no address to follow, but a stray click must still not
    // navigate anywhere.
    event.preventDefault()
    return
  }

  if (isSubmenu.value) {
    emit('drillIn', item.value, props.rowId)
    return
  }

  // A modified click on a link row belongs to the browser: it opens the address
  // its own way, so the row's action stays out of it. The sheet still closes,
  // because the row acted.
  if (isLink.value && isModifiedClick(event)) {
    emit('select', { ...item.value, onClick: undefined }, event)
    return
  }

  emit('select', item.value, event)
}

function handleClick(event: MouseEvent): void {
  activate(event)
}

function handleClickCapture(event: MouseEvent): void {
  // A link row's own anchor owns the click, so ListItem leaves it alone. The
  // capture phase is this row's only chance to run before the browser follows
  // the address. A row that renders no anchor acts through ListItem's own
  // click, which calls `activate` a single time.
  if (isLink.value)
    activate(event)
}
</script>

<template>
  <ListItem
    :class="{ 'astryx-more-menu__sheet-item--destructive': isDestructive }"
    :data-astryx-sheet-row="rowId"
    density="spacious"
    :on-click="isLink ? undefined : handleClick"
    v-bind="rowProps"
    @click.capture="handleClickCapture"
  >
    <template v-if="item.icon != null" #startContent>
      <Icon :color="iconColor" :icon="item.icon" size="sm" />
    </template>
    <template v-if="isSubmenu" #endContent>
      <Icon class="astryx-more-menu__caret" icon="chevronRight" size="sm" />
    </template>
    <template v-else-if="item.endContent != null" #endContent>
      <span class="astryx-more-menu__item-hint">{{ item.endContent }}</span>
    </template>
  </ListItem>
</template>
