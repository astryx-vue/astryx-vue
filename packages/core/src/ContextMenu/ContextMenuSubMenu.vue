<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { ContextMenuItemData, ContextMenuSubMenuEmits, ContextMenuSubMenuProps, ContextMenuSubMenuSlots } from './types.js'
import { computed, inject, nextTick, provide, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useDismiss } from '../composables/useDismiss.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useSubmenuMode } from '../DropdownMenu/useSubmenuMode.js'
import Icon from '../Icon/Icon.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import { submenuAncestorOpenKey, useContextMenu, useContextMenuSize } from './context.js'
import ContextMenuItem from './ContextMenuItem.vue'
import ContextMenuItems from './ContextMenuItems.vue'
import { useMenuNav } from './menuNav.js'
import { useSubmenuHover } from './useSubmenuHover.js'
import '../../styles/context-menu.css'

defineOptions({ name: 'AstryxContextMenuSubMenu', inheritAttrs: false })

const props = withDefaults(defineProps<ContextMenuSubMenuProps>(), {
  isDisabled: false,
  hasSpinner: false,
  presentation: 'adaptive',
})

const emit = defineEmits<ContextMenuSubMenuEmits>()
defineSlots<ContextMenuSubMenuSlots>()
const attrs = useAttrs()

const menu = useContextMenu()
const size = useContextMenuSize()
const messages = useAstryxMessages()
const GAP = 4
const viewId = useId()
const mode = useSubmenuMode({
  drillIn: computed(() => menu?.drillIn.value),
  presentation: computed(() => props.presentation),
  viewId,
})
const isDrill = mode.isDrill
const drillOnStack = mode.isOnStack
const drillIsTop = mode.isTop
const drillHost = computed(() => isDrill.value ? menu?.drillIn.value.host ?? null : null)
const backLabel = computed(() => {
  const parent = menu?.menuLabel.value
  return parent != null && parent !== ''
    ? messages.value.dropdownMenu.backTo(parent)
    : messages.value.dropdownMenu.back
})

const row = useTemplateRef<HTMLElement>('row')
const flyout = useTemplateRef<HTMLElement>('flyout')
const isOpen = ref(false)

const flyoutId = `astryx-context-menu-submenu-${useId()}`
const flyoutLabel = computed(() => (typeof props.label === 'string' ? props.label : menu?.menuLabel.value ?? 'Submenu'))
const ancestorOpen = inject(submenuAncestorOpenKey, computed(() => true))
const showsFlyout = computed(() => isOpen.value && (menu?.isOpen.value ?? true) && ancestorOpen.value)

// Nested flyouts teleport to body, so a closed ancestor would otherwise leave
// them on screen. Descendants read this level's visibility and close with it.
provide(submenuAncestorOpenKey, showsFlyout)

const { position } = usePositionedLayer({
  anchor: row,
  layer: flyout,
  isOpen: showsFlyout,
  placement: computed(() => 'end' as const),
  alignment: computed(() => 'start' as const),
  gap: GAP,
})

const flyoutStyle = computed(() => {
  const style: Record<string, string> = {
    left: `${position.value.left}px`,
    top: `${position.value.top}px`,
  }
  if (props.menuWidth != null)
    style.minWidth = `min(${typeof props.menuWidth === 'number' ? `${props.menuWidth}px` : props.menuWidth}, calc(100vw - 16px))`
  return style
})

const hasOverflow = useOverflow(flyout, showsFlyout)

const nav = useMenuNav({
  menuRef: flyout,
  onClose: (reason) => {
    // Escape closes this level and hands focus back to its row. Tab leaves the
    // whole menu, not just this level.
    if (reason === 'escape')
      close(true)
    else
      menu?.closeMenu({ restoreFocus: true })
  },
})

// 注册到 Escape 栈，确保子菜单优先处理 Escape（最内层优先）
useDismiss({
  container: flyout,
  trigger: row,
  isEnabled: showsFlyout,
  enableEscape: computed(() => true),
  onDismiss: () => close(true),
})

const hover = useSubmenuHover({
  isEnabled: () => !props.isDisabled,
  isOpen: () => isOpen.value,
  flyout,
  openFromHover,
  openPinned: () => open(false),
  closeFromPointer: () => close(false),
})

function open(focusFirstRow: boolean): void {
  if (props.isDisabled)
    return
  if (isDrill.value) {
    const wasOpen = drillOnStack.value
    mode.openDrill()
    if (!wasOpen)
      emit('openChange', true)
    if (focusFirstRow)
      void nextTick(() => nav.focusFirst())
    return
  }
  if (isOpen.value) {
    if (focusFirstRow)
      nav.focusFirst()
    return
  }
  isOpen.value = true
  emit('openChange', true)
  // Keyboard and click pin the flyout: leaving the row into empty space must
  // not dismiss a surface the person opened on purpose.
  hover.notePinned()
  if (focusFirstRow)
    void nextTick(() => nav.focusFirst())
}

function openFromHover(): void {
  if (props.isDisabled || isOpen.value)
    return
  isOpen.value = true
  emit('openChange', true)
  hover.noteHoverOpened()
}

function close(focusRow: boolean): void {
  if (isDrill.value) {
    if (!mode.closeDrill())
      return
    emit('openChange', false)
    if (focusRow)
      row.value?.focus()
    return
  }
  const wasOpen = isOpen.value
  hover.markClosed()
  if (!wasOpen)
    return
  isOpen.value = false
  nav.resetTypeahead()
  emit('openChange', false)
  if (focusRow)
    row.value?.focus()
}

function onRowKeyDown(event: KeyboardEvent): void {
  if (props.isDisabled || event.isComposing)
    return
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
    event.preventDefault()
    open(true)
    return
  }
  // Every other key moves the highlight off this row, so this level closes and
  // leaves the key to the parent menu.
  close(false)
}

function onRowFocusOut(): void {
  // A hover-opened flyout is dismissed by the pointer delay, not by focus.
  // Moving the highlight onto a sibling would otherwise close it in the same
  // frame and skip that delay. A pinned flyout still closes when focus leaves.
  if (!isOpen.value || hover.isHoverDriven())
    return
  void nextTick(() => {
    if (!isOpen.value || hover.isHoverDriven())
      return
    const active = row.value?.ownerDocument.activeElement
    const isKept = active instanceof Node
      && (row.value?.contains(active) === true || flyout.value?.contains(active) === true)
    if (!isKept)
      close(false)
  })
}

function onRowClick(event: MouseEvent): void {
  hover.onTriggerClick(event)
}

function onRowPointerMove(event: PointerEvent): void {
  if (props.isDisabled || event.pointerType !== 'mouse')
    return
  const element = row.value
  if (element == null || element === element.ownerDocument.activeElement)
    return
  // Same single highlight as a plain row: hover moves focus onto the row.
  element.focus({ preventScroll: true })
}

function onFlyoutKeyDown(event: KeyboardEvent): void {
  if (event.isComposing)
    return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    close(true)
    return
  }
  nav.handleKeyDown(event)
}

function onNestedSelect(item: ContextMenuItemData, event: MouseEvent): void {
  emit('select', item, event)
}

function onRowPointerEnter(event: PointerEvent): void {
  hover.onTriggerPointerEnter(event)
}

// The close of the root menu takes this level with it, so a stale flyout is
// never left floating over the page.
watch(() => menu?.isOpen.value, (menuOpen) => {
  if (menuOpen === false) {
    // A pending hover must not open a flyout after the root menu is gone.
    hover.cancel()
    close(false)
  }
})

watch(ancestorOpen, (visible) => {
  if (visible)
    return
  hover.cancel()
  close(false)
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/interactive-supports-focus -- The dynamic tabindex is -1 while enabled, the only state that is focusable, and is removed while disabled. -->
  <div
    ref="row"
    v-bind="attrs"
    :aria-controls="flyoutId"
    :aria-disabled="isDisabled || undefined"
    :aria-expanded="showsFlyout || drillOnStack"
    aria-haspopup="menu"
    class="astryx-context-menu-item astryx-context-menu-item--submenu"
    :class="attrs.class"
    :data-disabled="isDisabled || undefined"
    :data-size="size"
    role="menuitem"
    :style="attrs.style as StyleValue"
    :tabindex="isDisabled ? undefined : -1"
    @click="onRowClick"
    @focusout="onRowFocusOut"
    @keydown="onRowKeyDown"
    @pointerenter="onRowPointerEnter"
    @pointerleave="hover.onTriggerPointerLeave"
    @pointermove="onRowPointerMove"
  >
    <span v-if="icon != null || $slots.icon" class="astryx-context-menu-item__start">
      <slot name="icon">
        <Icon :icon="icon" color="secondary" size="sm" />
      </slot>
    </span>
    <span class="astryx-context-menu-item__content">
      <span class="astryx-context-menu-item__label" data-menu-item-label>
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="description != null || $slots.description"
        class="astryx-context-menu-item__description"
      >
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span class="astryx-context-menu-item__end">
      <slot name="endContent">
        <span v-if="hasSpinner" aria-hidden="true">
          <Spinner size="sm" />
        </span>
        <Icon v-else class="astryx-context-menu-item__chevron" icon="chevronRight" color="secondary" size="sm" />
      </slot>
    </span>
  </div>

  <Teleport v-if="drillHost" :to="drillHost">
    <div
      v-show="drillOnStack"
      ref="flyout"
      class="astryx-context-menu astryx-context-menu--flyout"
      role="menu"
      :aria-label="flyoutLabel"
      :hidden="drillIsTop ? undefined : true"
      tabindex="-1"
      @keydown="onFlyoutKeyDown"
    >
      <ContextMenuItem :has-close-on-select="false" :label="backLabel" @click="close(true)">
        <template #icon>
          <Icon color="secondary" icon="chevronLeft" size="sm" />
        </template>
      </ContextMenuItem>
      <slot>
        <ContextMenuItems :items="items ?? []" @select="onNestedSelect" />
      </slot>
    </div>
  </Teleport>
  <Teleport v-else to="body">
    <Transition name="astryx-context-menu-flyout">
      <div
        v-show="showsFlyout"
        :id="flyoutId"
        ref="flyout"
        :aria-label="flyoutLabel"
        class="astryx-context-menu astryx-context-menu--flyout"
        :data-overflow="hasOverflow || undefined"
        :data-placement="position.placement"
        :data-size="size"
        role="menu"
        :style="flyoutStyle"
        tabindex="-1"
        @contextmenu.prevent
        @keydown="onFlyoutKeyDown"
        @pointerenter="hover.onFlyoutPointerEnter"
        @pointerleave="hover.onFlyoutPointerLeave"
      >
        <slot>
          <ContextMenuItems :items="items ?? []" @select="onNestedSelect" />
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>
