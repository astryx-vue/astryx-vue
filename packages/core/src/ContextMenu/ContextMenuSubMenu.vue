<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { ContextMenuItemData, ContextMenuSubMenuEmits, ContextMenuSubMenuProps, ContextMenuSubMenuSlots } from './types.js'
import { computed, inject, nextTick, provide, ref, useAttrs, useId, useSlots, useTemplateRef, watch } from 'vue'
import { focusForLastInput } from '../composables/internal/focusReturn.js'
import { keepDisabledRowUnfocused } from '../composables/internal/menuActivation.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useDropdownMenuMessages } from '../DropdownMenu/useDropdownMenuMessages.js'
import { useSubmenuMode } from '../DropdownMenu/useSubmenuMode.js'
import Icon from '../Icon/Icon.vue'
import LayerContentBoundary from '../layer/LayerContentBoundary.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import Spinner from '../Spinner/Spinner.vue'
import { readAccessibleName } from '../utils/accessibleName.js'
import { isImeKeyEvent } from '../utils/ime.js'
import { contextMenuContextKey, submenuAncestorOpenKey, useContextMenu, useContextMenuSize } from './context.js'
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
const messages = useDropdownMenuMessages()
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
const slots = useSlots()
const stringLabel = computed(() => (typeof props.label === 'string' && props.label !== '' ? props.label : undefined))
// 标签是节点（label 插槽）时，渲染在自己的元素里：展开的视图用它命名，
// 嵌套视图的返回行用打开这一层时读到的文字。
const hasNodeLabel = computed(() => stringLabel.value == null && slots.label != null)
const nodeLabelId = `astryx-context-submenu-label-${useId()}`
const nodeLabelText = ref<string | undefined>()
const flyoutLabel = computed(() => stringLabel.value ?? menu?.menuLabel.value ?? 'Submenu')
const viewAriaLabel = computed(() => (hasNodeLabel.value ? undefined : flyoutLabel.value))
const viewLabelledBy = computed(() => (hasNodeLabel.value ? nodeLabelId : undefined))
const ancestorOpen = inject(submenuAncestorOpenKey, computed(() => true))
const showsFlyout = computed(() => isOpen.value && (menu?.isOpen.value ?? true) && ancestorOpen.value)

// Nested flyouts teleport to body, so a closed ancestor would otherwise leave
// them on screen. Descendants read this level's visibility and close with it.
provide(submenuAncestorOpenKey, showsFlyout)

const isShown = computed(() => (isDrill.value ? drillOnStack.value : showsFlyout.value))
watch(isShown, (shown) => {
  if (shown && hasNodeLabel.value)
    nodeLabelText.value = readAccessibleName(document.getElementById(nodeLabelId))
})

// 下一层的行读到的菜单名是这一层的名字：嵌套视图的返回行写「返回到 这一层」。
if (menu != null) {
  provide(contextMenuContextKey, {
    ...menu,
    menuLabel: computed(() => stringLabel.value ?? (hasNodeLabel.value ? nodeLabelText.value : undefined) ?? menu.menuLabel.value),
  })
}

const { position, teleportTarget } = usePositionedLayer({
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
  dismissOnEscape: 'close',
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
  if (props.isDisabled || isImeKeyEvent(event))
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
  focusForLastInput(element, { preventScroll: true })
}

function onFlyoutKeyDown(event: KeyboardEvent): void {
  if (isImeKeyEvent(event))
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
    tabindex="-1"
    @click="onRowClick"
    @focusout="onRowFocusOut"
    @mousedown="isDisabled && keepDisabledRowUnfocused($event)"
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
      <span :id="hasNodeLabel ? nodeLabelId : undefined" class="astryx-context-menu-item__label" data-menu-item-label>
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
      :aria-label="viewAriaLabel"
      :aria-labelledby="viewLabelledBy"
      :hidden="drillIsTop ? undefined : true"
      tabindex="-1"
      @keydown="onFlyoutKeyDown"
    >
      <LayerContentBoundary>
        <ContextMenuItem :has-close-on-select="false" :label="backLabel" @click="close(true)">
          <template #icon>
            <Icon color="secondary" icon="chevronLeft" size="sm" />
          </template>
        </ContextMenuItem>
        <slot>
          <ContextMenuItems :items="items ?? []" @select="onNestedSelect" />
        </slot>
      </LayerContentBoundary>
    </div>
  </Teleport>
  <Teleport v-else :to="teleportTarget">
    <Transition name="astryx-context-menu-flyout">
      <div
        v-show="showsFlyout"
        :id="flyoutId"
        ref="flyout"
        :aria-label="viewAriaLabel"
        :aria-labelledby="viewLabelledBy"
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
        <LayerContentBoundary>
          <slot>
            <ContextMenuItems :items="items ?? []" @select="onNestedSelect" />
          </slot>
        </LayerContentBoundary>
      </div>
    </Transition>
  </Teleport>
</template>
