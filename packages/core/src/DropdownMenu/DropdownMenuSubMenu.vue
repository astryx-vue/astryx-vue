<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { DropdownMenuSubMenuProps, DropdownMenuSubMenuSlots } from './types.js'
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import Item from '../List/Item.vue'
import { useDropdownMenuContext } from './context.js'
import { activateMenuItem, MENU_ITEM_ROLES } from './menuItemRoles.js'
import { useMenuFocus } from './useMenuFocus.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuSubMenu', inheritAttrs: false })

const props = withDefaults(defineProps<DropdownMenuSubMenuProps>(), {
  isDisabled: false,
})

defineSlots<DropdownMenuSubMenuSlots>()

const slots = useSlots()
const menu = useDropdownMenuContext()
const rowComponent = ref<{ element: HTMLElement | null, focus: () => void } | null>(null)
const rowRef = computed(() => rowComponent.value?.element ?? null)
const flyoutRef = ref<HTMLElement | null>(null)
const flyoutOpen = ref(false)
const menuSize = computed(() => menu?.menuSize.value ?? 'md')
const density = computed(() => (menuSize.value === 'sm' ? 'compact' : 'balanced'))
const hasStart = computed(() => slots.icon != null || props.icon != null)
const focus = useMenuFocus({ list: flyoutRef })

const { position } = usePositionedLayer({
  anchor: rowRef,
  layer: flyoutRef,
  isOpen: flyoutOpen,
  placement: computed(() => 'end'),
  alignment: computed(() => 'start'),
  gap: 4,
})

const flyoutStyle = computed<CSSProperties>(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  zIndex: 1001,
}))

let closeTimer = 0

function cancelClose(): void {
  if (closeTimer !== 0)
    window.clearTimeout(closeTimer)
  closeTimer = 0
}

function scheduleClose(): void {
  cancelClose()
  closeTimer = window.setTimeout(() => {
    flyoutOpen.value = false
  }, 120)
}

async function openFlyout(): Promise<void> {
  if (props.isDisabled)
    return
  cancelClose()
  flyoutOpen.value = true
  await nextTick()
  focus.focusFirst()
}

function closeFlyout(): void {
  cancelClose()
  flyoutOpen.value = false
  rowComponent.value?.focus()
}

function onFlyoutKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowLeft' || event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeFlyout()
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
    const focused = document.activeElement
    if (focused instanceof HTMLElement && MENU_ITEM_ROLES.has(focused.getAttribute('role') ?? ''))
      activateMenuItem(focused, event)
    return
  }
  event.stopPropagation()
  focus.handleKeyDown(event)
}

watch(() => menu?.isOpen.value, (open) => {
  if (!open)
    flyoutOpen.value = false
})

onBeforeUnmount(cancelClose)
</script>

<template>
  <Item
    ref="rowComponent"
    class="astryx-dropdown-menu-item"
    role="menuitem"
    aria-haspopup="menu"
    :aria-expanded="flyoutOpen"
    :data-menu-size="menuSize"
    data-variant="default"
    :density="density"
    :description="description"
    :is-disabled="isDisabled"
    :label="label"
    :tabindex="isDisabled ? undefined : -1"
    :on-click="openFlyout"
    @keydown.right.prevent.stop="openFlyout"
    @keydown.enter.prevent.stop="openFlyout"
    @keydown.space.prevent.stop="openFlyout"
    @pointerenter="openFlyout"
    @pointerleave="scheduleClose"
  >
    <template v-if="hasStart" #startContent>
      <slot name="icon">
        <Icon color="secondary" :icon="icon" size="sm" />
      </slot>
    </template>
    <template v-if="slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="slots.description" #description>
      <slot name="description" />
    </template>
    <template #endContent>
      <Icon color="secondary" icon="chevronRight" size="sm" />
    </template>
  </Item>
  <Teleport to="body">
    <div
      v-show="flyoutOpen"
      ref="flyoutRef"
      class="astryx-dropdown-menu astryx-dropdown-submenu"
      role="menu"
      :style="flyoutStyle"
      tabindex="-1"
      @keydown="onFlyoutKeydown"
      @pointerenter="cancelClose"
      @pointerleave="scheduleClose"
    >
      <slot />
    </div>
  </Teleport>
</template>
