<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { DropdownMenuContextValue } from './context.js'
import type { DropdownMenuSubMenuEmits, DropdownMenuSubMenuProps, DropdownMenuSubMenuSlots } from './types.js'
import type { MenuDrillIn } from './useMenuDrillIn.js'
import { computed, nextTick, ref, useId, useSlots, watch } from 'vue'
import { isMenuPressActivation } from '../composables/internal/strayClick.js'
import { useMenuHover } from '../composables/internal/useMenuHover.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useOverflow } from '../composables/useOverflow.js'
import Icon from '../Icon/Icon.vue'
import { clampInlineSize, isIntrinsicInlineSize } from '../layer/inlineSize.js'
import LayerContentBoundary from '../layer/LayerContentBoundary.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import Item from '../List/Item.vue'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import { useDropdownMenuContext } from './context.js'
import DropdownMenuBranch from './DropdownMenuBranch.vue'
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
const hasOverflow = useOverflow(flyoutRef, flyoutOpen)

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
  if (isIntrinsicInlineSize(width))
    style.width = width
  else
    style.minWidth = clampInlineSize(width)
  return style
})

const drillHost = computed(() => isDrill.value ? menu?.drillIn.value.host ?? null : null)

async function focusDrillFirst(): Promise<void> {
  await nextTick()
  if (!drillFocus.focusFirst())
    drillRef.value?.focus({ preventScroll: true })
}

async function openFlyout(options?: { skipAutoFocus?: boolean }): Promise<void> {
  if (props.isDisabled)
    return
  const skipAutoFocus = options?.skipAutoFocus === true
  if (isDrill.value) {
    const wasOpen = drillOnStack.value
    mode.openDrill()
    if (!wasOpen)
      emit('openChange', true)
    if (!skipAutoFocus)
      await focusDrillFirst()
    return
  }
  if (!flyoutOpen.value)
    emit('openChange', true)
  flyoutOpen.value = true
  if (skipAutoFocus)
    return
  await nextTick()
  focus.focusFirst()
}

function closeFlyout(focusRow = true): void {
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
    menu.moveDialogTab(event, true)
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
    event.stopPropagation()
    closeFlyout(false)
    menu.moveDialogTab(event, true)
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

const nestedContext: DropdownMenuContextValue = {
  closeMenu: () => {
    closeFlyout(false)
    menu?.closeMenu()
  },
  drillIn: computed(() => menu?.drillIn.value ?? emptyDrill),
  focusRegion: direction => menu?.focusRegion(direction) ?? false,
  moveDialogTab: (event, fromFlyout) => menu?.moveDialogTab(event, fromFlyout),
  hasRegions: computed(() => menu?.hasRegions.value ?? false),
  isOpen: computed(() => (menu?.isOpen.value ?? true) && isShown.value),
  menuLabel: computed(() => stringLabel.value ?? menu?.menuLabel.value),
  menuSize,
}

const hover = useMenuHover({
  show: options => void openFlyout(options),
  hide: () => closeFlyout(false),
  isOpen: flyoutOpen,
  isEnabled: () => !props.isDisabled && !isDrill.value,
  flyoutRef,
  ownsFocus: false,
})

watch(rowRef, (element) => {
  hover.setTriggerEl(element)
}, { immediate: true })

function onRowClick(event: MouseEvent): void {
  if (isDrill.value) {
    const isPointer = event.detail > 0 || isMenuPressActivation()
    void openFlyout({ skipAutoFocus: isPointer })
    return
  }
  hover.triggerProps.onClick(event)
}

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
    :on-click="onRowClick"
    @keydown.right.prevent.stop="openFlyout()"
    @keydown.enter.prevent.stop="openFlyout()"
    @keydown.space.prevent.stop="openFlyout()"
    @mouseenter="hover.triggerProps.onMouseenter"
    @mouseleave="hover.triggerProps.onMouseleave"
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
      <LayerContentBoundary>
        <DropdownMenuBranch :value="nestedContext">
          <DropdownMenuItem :has-close-on-select="false" :label="backLabel" @click="closeFlyout(true)">
            <template #icon>
              <Icon color="secondary" icon="chevronLeft" size="sm" />
            </template>
          </DropdownMenuItem>
          <slot />
        </DropdownMenuBranch>
      </LayerContentBoundary>
    </div>
  </Teleport>
  <Teleport v-else :to="teleportTarget">
    <div
      v-show="flyoutOpen"
      ref="flyoutRef"
      class="astryx-dropdown-menu astryx-dropdown-submenu"
      role="menu"
      :aria-label="stringLabel"
      :data-overflow="hasOverflow || undefined"
      :style="flyoutStyle"
      tabindex="-1"
      @keydown="onFlyoutKeydown"
      @mouseenter="hover.contentProps.onMouseenter"
      @mouseleave="hover.contentProps.onMouseleave"
    >
      <LayerContentBoundary>
        <DropdownMenuBranch :value="nestedContext">
          <slot />
        </DropdownMenuBranch>
      </LayerContentBoundary>
    </div>
  </Teleport>
</template>
