<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { DropdownMenuSubMenuEmits, DropdownMenuSubMenuProps, DropdownMenuSubMenuSlots } from './types.js'
import type { MenuDrillIn } from './useMenuDrillIn.js'
import { computed, nextTick, onBeforeUnmount, provide, ref, useId, useSlots, watch } from 'vue'
import { useDismiss } from '../composables/useDismiss.js'
import Icon from '../Icon/Icon.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import Item from '../List/Item.vue'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import { dropdownMenuContextKey, useDropdownMenuContext } from './context.js'
import DropdownMenuItem from './DropdownMenuItem.vue'
import { activateMenuItem, MENU_ITEM_ROLES } from './menuItemRoles.js'
import { useMenuFocus } from './useMenuFocus.js'
import { useSubmenuMode } from './useSubmenuMode.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuSubMenu', inheritAttrs: false })
const props = withDefaults(defineProps<DropdownMenuSubMenuProps>(), {
  isDisabled: false,
  hasSpinner: false,
  presentation: 'adaptive',
})

const emit = defineEmits<DropdownMenuSubMenuEmits>()

defineSlots<DropdownMenuSubMenuSlots>()

const INTRINSIC_SIZE = /^(?:auto|min-content|max-content|fit-content|fit-content\(.*\)|inherit|initial|unset|revert|revert-layer)$/i

const slots = useSlots()
const messages = useAstryxMessages()
const menu = useDropdownMenuContext()
const rowComponent = ref<{ element: HTMLElement | null, focus: () => void } | null>(null)
const rowRef = computed(() => rowComponent.value?.element ?? null)
const flyoutRef = ref<HTMLElement | null>(null)
const drillRef = ref<HTMLElement | null>(null)
const flyoutOpen = ref(false)
const viewId = useId()
const menuSize = computed(() => menu?.menuSize.value ?? 'md')
const density = computed(() => (menuSize.value === 'sm' ? 'compact' : 'balanced'))
const hasStart = computed(() => slots.icon != null || props.icon != null)
const stringLabel = computed(() => typeof props.label === 'string' ? props.label : undefined)
const focus = useMenuFocus({ list: flyoutRef })
const drillFocus = useMenuFocus({ list: drillRef })

const mode = useSubmenuMode({
  drillIn: computed(() => menu?.drillIn.value),
  presentation: computed(() => props.presentation),
  viewId,
})
const isDrill = mode.isDrill
const drillOnStack = mode.isOnStack
const drillIsTop = mode.isTop

const isShown = computed(() => isDrill.value ? drillOnStack.value : flyoutOpen.value)
const backLabel = computed(() => {
  const parent = menu?.menuLabel.value
  return parent != null && parent !== ''
    ? messages.value.dropdownMenu.backTo(parent)
    : messages.value.dropdownMenu.back
})

const { position, teleportTarget } = usePositionedLayer({
  anchor: rowRef,
  layer: flyoutRef,
  isOpen: flyoutOpen,
  placement: computed(() => 'end'),
  alignment: computed(() => 'start'),
  gap: 4,
})

const flyoutStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    top: `${position.value.top}px`,
    left: `${position.value.left}px`,
    zIndex: 1001,
  }
  if (props.menuWidth == null)
    return style
  const width = (typeof props.menuWidth === 'number' ? `${props.menuWidth}px` : props.menuWidth).trim()
  if (INTRINSIC_SIZE.test(width))
    style.width = width
  else
    style.minWidth = `min(${width}, calc(100vw - 16px))`
  return style
})

const drillHost = computed(() => isDrill.value ? menu?.drillIn.value.host ?? null : null)

let closeTimer = 0

function cancelClose(): void {
  if (closeTimer !== 0)
    window.clearTimeout(closeTimer)
  closeTimer = 0
}

function scheduleClose(): void {
  if (isDrill.value)
    return
  cancelClose()
  closeTimer = window.setTimeout(() => {
    closeFlyout(false)
  }, 120)
}

async function focusDrillFirst(): Promise<void> {
  await nextTick()
  if (!drillFocus.focusFirst())
    drillRef.value?.focus({ preventScroll: true })
}

async function openFlyout(): Promise<void> {
  if (props.isDisabled)
    return
  if (isDrill.value) {
    const wasOpen = drillOnStack.value
    mode.openDrill()
    if (!wasOpen)
      emit('openChange', true)
    await focusDrillFirst()
    return
  }
  cancelClose()
  if (!flyoutOpen.value)
    emit('openChange', true)
  flyoutOpen.value = true
  await nextTick()
  focus.focusFirst()
}

function closeFlyout(focusRow = true): void {
  cancelClose()
  if (isDrill.value) {
    if (!mode.closeDrill())
      return
    emit('openChange', false)
    if (focusRow)
      rowComponent.value?.focus()
    return
  }
  if (!flyoutOpen.value)
    return
  flyoutOpen.value = false
  emit('openChange', false)
  if (focusRow)
    rowComponent.value?.focus()
}

function onDrillKeydown(event: KeyboardEvent): void {
  if (event.key === 'Tab' && menu?.hasRegions.value) {
    event.preventDefault()
    event.stopPropagation()
    closeFlyout(false)
    menu.focusRegion(event.shiftKey ? 'previous' : 'next')
    return
  }
  if (event.key === 'ArrowLeft' || event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeFlyout(true)
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
    if (event.repeat)
      return
    const focused = document.activeElement
    if (focused instanceof HTMLElement && MENU_ITEM_ROLES.has(focused.getAttribute('role') ?? ''))
      activateMenuItem(focused, event)
    return
  }
  event.stopPropagation()
  drillFocus.handleKeyDown(event)
}

function onFlyoutKeydown(event: KeyboardEvent): void {
  if (event.key === 'Tab' && menu?.hasRegions.value) {
    event.preventDefault()
    closeFlyout(false)
    menu.focusRegion(event.shiftKey ? 'previous' : 'next')
    return
  }
  if (event.key === 'ArrowLeft' || event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeFlyout(true)
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
    if (event.repeat)
      return
    const focused = document.activeElement
    if (focused instanceof HTMLElement && MENU_ITEM_ROLES.has(focused.getAttribute('role') ?? ''))
      activateMenuItem(focused, event)
    return
  }
  event.stopPropagation()
  focus.handleKeyDown(event)
}

const emptyDrill: MenuDrillIn = {
  host: null,
  isCompactTouch: false,
  pop: () => {},
  push: () => {},
  viewStack: [],
}

provide(dropdownMenuContextKey, {
  closeMenu: () => {
    closeFlyout(false)
    menu?.closeMenu()
  },
  drillIn: computed(() => menu?.drillIn.value ?? emptyDrill),
  focusRegion: direction => menu?.focusRegion(direction) ?? false,
  hasRegions: computed(() => menu?.hasRegions.value ?? false),
  isOpen: computed(() => (menu?.isOpen.value ?? true) && isShown.value),
  menuLabel: computed(() => stringLabel.value ?? menu?.menuLabel.value),
  menuSize,
})

useDismiss({
  container: flyoutRef,
  trigger: rowRef,
  isEnabled: computed(() => flyoutOpen.value && !isDrill.value),
  onDismiss: () => closeFlyout(false),
})

useDismiss({
  container: drillRef,
  isEnabled: drillIsTop,
  onDismiss: () => {
    if (drillIsTop.value)
      closeFlyout(true)
  },
})

watch(() => menu?.isOpen.value, (open) => {
  if (!open)
    flyoutOpen.value = false
})

watch(drillOnStack, (onStack, wasOnStack) => {
  if (wasOnStack === true && !onStack && menu?.isOpen.value)
    rowComponent.value?.focus()
})

onBeforeUnmount(cancelClose)
</script>

<template>
  <Item
    v-bind="$attrs"
    ref="rowComponent"
    class="astryx-dropdown-menu-item"
    role="menuitem"
    aria-haspopup="menu"
    :aria-expanded="isShown"
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
      <span v-if="hasSpinner" class="astryx-dropdown-menu-spinner" aria-hidden="true">
        <Spinner size="sm" />
      </span>
      <Icon v-else color="secondary" icon="chevronRight" size="sm" />
    </template>
  </Item>
  <Teleport v-if="drillHost" :to="drillHost">
    <div
      v-show="drillOnStack"
      ref="drillRef"
      class="astryx-dropdown-menu-drill"
      role="menu"
      :aria-label="stringLabel"
      :hidden="drillIsTop ? undefined : true"
      tabindex="-1"
      @keydown="onDrillKeydown"
    >
      <DropdownMenuItem :has-close-on-select="false" :label="backLabel" @click="closeFlyout(true)">
        <template #icon>
          <Icon color="secondary" icon="chevronLeft" size="sm" />
        </template>
      </DropdownMenuItem>
      <slot />
    </div>
  </Teleport>
  <Teleport v-else :to="teleportTarget">
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
