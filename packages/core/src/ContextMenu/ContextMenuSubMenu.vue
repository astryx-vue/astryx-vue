<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { ContextMenuItemData, ContextMenuSubMenuEmits, ContextMenuSubMenuProps, ContextMenuSubMenuSlots } from './types.js'
import { computed, nextTick, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useDismiss } from '../composables/useDismiss.js'
import { useOverflow } from '../composables/useOverflow.js'
import Icon from '../Icon/Icon.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useContextMenu, useContextMenuSize } from './context.js'
import ContextMenuItems from './ContextMenuItems.vue'
import { useMenuNav } from './menuNav.js'
import '../../styles/context-menu.css'

defineOptions({ name: 'AstryxContextMenuSubMenu', inheritAttrs: false })

const props = withDefaults(defineProps<ContextMenuSubMenuProps>(), {
  isDisabled: false,
})

const emit = defineEmits<ContextMenuSubMenuEmits>()
defineSlots<ContextMenuSubMenuSlots>()
const attrs = useAttrs()

const menu = useContextMenu()
const size = useContextMenuSize()
const GAP = 4

const row = useTemplateRef<HTMLElement>('row')
const flyout = useTemplateRef<HTMLElement>('flyout')
const isOpen = ref(false)

const flyoutId = `astryx-context-menu-submenu-${useId()}`
const flyoutLabel = computed(() => (typeof props.label === 'string' ? props.label : menu?.menuLabel.value ?? 'Submenu'))
const showsFlyout = computed(() => isOpen.value && (menu?.isOpen.value ?? true))

const { position } = usePositionedLayer({
  anchor: row,
  layer: flyout,
  isOpen: showsFlyout,
  placement: computed(() => 'end' as const),
  alignment: computed(() => 'start' as const),
  gap: GAP,
})

const flyoutStyle = computed(() => ({
  left: `${position.value.left}px`,
  top: `${position.value.top}px`,
}))

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

function open(focusFirstRow: boolean): void {
  if (props.isDisabled)
    return
  if (isOpen.value) {
    if (focusFirstRow)
      nav.focusFirst()
    return
  }
  isOpen.value = true
  emit('openChange', true)
  if (focusFirstRow)
    void nextTick(() => nav.focusFirst())
}

function close(focusRow: boolean): void {
  if (!isOpen.value)
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
  if (!isOpen.value)
    return
  void nextTick(() => {
    const active = row.value?.ownerDocument.activeElement
    const isKept = active instanceof Node
      && (row.value?.contains(active) === true || flyout.value?.contains(active) === true)
    if (!isKept)
      close(false)
  })
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
  if (event.pointerType !== 'mouse')
    return
  open(false)
}

// The close of the root menu takes this level with it, so a stale flyout is
// never left floating over the page.
watch(() => menu?.isOpen.value, (open) => {
  if (open === false)
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
    :aria-expanded="showsFlyout"
    aria-haspopup="menu"
    class="astryx-context-menu-item astryx-context-menu-item--submenu"
    :class="attrs.class"
    :data-disabled="isDisabled || undefined"
    :data-size="size"
    role="menuitem"
    :style="attrs.style as StyleValue"
    :tabindex="isDisabled ? undefined : -1"
    @click="open(false)"
    @focusout="onRowFocusOut"
    @keydown="onRowKeyDown"
    @pointerenter="onRowPointerEnter"
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
        <Icon class="astryx-context-menu-item__chevron" icon="chevronRight" color="secondary" size="sm" />
      </slot>
    </span>
  </div>

  <Teleport to="body">
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
      >
        <slot>
          <ContextMenuItems :items="items ?? []" @select="onNestedSelect" />
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>
