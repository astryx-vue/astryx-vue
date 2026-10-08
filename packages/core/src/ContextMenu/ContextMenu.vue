<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { ContextMenuEmits, ContextMenuItemData, ContextMenuProps, ContextMenuSlots } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { contextMenuContextKey } from './context.js'
import ContextMenuItems from './ContextMenuItems.vue'
import { MENU_BOUNDARY_SELECTOR, useMenuNav } from './menuNav.js'
import { useLongPress } from './useLongPress.js'
import { useMenuOverflow } from './useMenuOverflow.js'
import { resetMenuPress, useMenuPress } from './useMenuPress.js'
import '../../styles/context-menu.css'

defineOptions({ name: 'AstryxContextMenu', inheritAttrs: false })

const props = withDefaults(defineProps<ContextMenuProps>(), {
  label: 'Context menu',
  isDisabled: false,
  size: 'md',
  triggerAs: 'div',
})

const emit = defineEmits<ContextMenuEmits>()
defineSlots<ContextMenuSlots>()
const attrs = useAttrs()

/**
 * `class` and `style` describe the painted menu surface, the way upstream's
 * `className`/`style` do; everything else describes the trigger area.
 */
const triggerAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

/** Where the menu's own corner sits relative to the cursor point. */
const GAP = 0
const DEFAULT_MIN_WIDTH = 160

const openModel = defineModel<boolean | undefined>('isOpen', { default: undefined })
const localIsOpen = ref(false)
const isOpen = computed(() => openModel.value ?? localIsOpen.value)

const menuId = `astryx-context-menu-${useId()}`
const trigger = useTemplateRef<HTMLElement>('trigger')
const cursorAnchor = useTemplateRef<HTMLElement>('cursorAnchor')
const panel = useTemplateRef<HTMLElement>('panel')
const cursorPoint = ref({ x: 0, y: 0 })

let previouslyFocused: HTMLElement | null = null

const { position, update: updatePosition } = usePositionedLayer({
  anchor: cursorAnchor,
  layer: panel,
  isOpen,
  placement: computed(() => 'below' as const),
  alignment: computed(() => 'start' as const),
  gap: GAP,
})

const nav = useMenuNav({
  menuRef: panel,
  onClose: () => closeMenu({ restoreFocus: true }),
})

const hasOverflow = useMenuOverflow(panel, isOpen)

const menuPress = useMenuPress({
  menuRef: panel,
  isEnabled: () => isOpen.value,
  onDismiss: () => closeMenu(),
})

const longPress = useLongPress({
  isDisabled: () => props.isDisabled,
  onLongPress: (point) => {
    const rect = trigger.value?.getBoundingClientRect()
    openAt(
      rect == null ? point.x : point.x - rect.left,
      rect == null ? point.y : point.y - rect.top,
    )
  },
})

function formatSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

const panelStyle = computed(() => {
  const style: Record<string, string> = {
    'left': `${position.value.left}px`,
    'top': `${position.value.top}px`,
    '--_context-menu-min-width': formatSize(props.menuWidth ?? DEFAULT_MIN_WIDTH),
  }
  if (props.menuWidth != null)
    style['--_context-menu-width'] = formatSize(props.menuWidth)
  return style
})

function restoreFocus(): void {
  const target = previouslyFocused
  previouslyFocused = null
  if (target != null && target.isConnected)
    target.focus()
}

function focusPanelOrFirstRow(): void {
  if (!nav.focusFirst())
    panel.value?.focus({ preventScroll: true })
}

function attachDismissListeners(): void {
  const doc = panel.value?.ownerDocument
  doc?.addEventListener('mousedown', onDocumentMouseDown)
  doc?.addEventListener('keydown', onDocumentKeydown)
}

function detachDismissListeners(): void {
  const doc = panel.value?.ownerDocument
  doc?.removeEventListener('mousedown', onDocumentMouseDown)
  doc?.removeEventListener('keydown', onDocumentKeydown)
}

function setOpen(next: boolean): void {
  if (isOpen.value === next)
    return
  openModel.value = next
  localIsOpen.value = next
  emit('openChange', next)
}

/** Close the menu, optionally handing focus back to where it was before. */
function closeMenu(options: { restoreFocus?: boolean } = {}): void {
  if (!isOpen.value)
    return
  const active = panel.value?.ownerDocument.activeElement
  const hadFocus = active != null && panel.value?.contains(active) === true
  setOpen(false)
  if (options.restoreFocus === true || hadFocus)
    restoreFocus()
}

/**
 * Place the zero-size cursor anchor at a point in the trigger's local space and
 * open the menu there. Anchoring inside the trigger, rather than storing
 * viewport coordinates on the panel, is what makes the menu follow its content
 * on scroll and flip against the viewport edges.
 */
function openAt(localX: number, localY: number): void {
  cursorPoint.value = { x: localX, y: localY }
  previouslyFocused = trigger.value?.ownerDocument.activeElement instanceof HTMLElement
    ? trigger.value.ownerDocument.activeElement
    : null
  setOpen(true)
}

function onTriggerContextMenu(event: MouseEvent): void {
  if (props.isDisabled)
    return
  event.preventDefault()
  const rect = trigger.value?.getBoundingClientRect()
  // A keyboard-invoked contextmenu (Shift+F10 or the context-menu key) reports
  // the point (0, 0) in several browsers; anchor to the trigger's bottom-left
  // instead, so the menu is reachable without a pointer.
  const isKeyboardInvoked = event.clientX === 0 && event.clientY === 0 && event.detail === 0
  openAt(
    isKeyboardInvoked || rect == null ? 0 : event.clientX - rect.left,
    isKeyboardInvoked || rect == null ? (rect?.height ?? 0) : event.clientY - rect.top,
  )
}

function onTriggerPointerDown(event: PointerEvent): void {
  if (event.pointerType === 'mouse')
    return
  // A mouse opens the menu with a right-click; a finger has no right button,
  // so a held press is what opens it.
  longPress.start({ x: event.clientX, y: event.clientY })
}

function onTriggerPointerMove(event: PointerEvent): void {
  if (event.pointerType === 'mouse')
    return
  longPress.moveTo({ x: event.clientX, y: event.clientY })
}

function onDocumentMouseDown(event: MouseEvent): void {
  const target = event.target
  if (panel.value != null && target instanceof Node && panel.value.contains(target))
    return
  closeMenu()
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.isComposing || !isOpen.value)
    return
  // A nested flyout owns its own Escape.
  const target = event.target
  if (target instanceof Element) {
    const owner = target.closest(MENU_BOUNDARY_SELECTOR)
    if (owner != null && owner !== panel.value)
      return
  }
  event.preventDefault()
  closeMenu({ restoreFocus: true })
}

function onSelect(item: ContextMenuItemData, event: MouseEvent): void {
  emit('select', item, event)
}

provide(contextMenuContextKey, {
  closeMenu,
  isOpen,
  menuLabel: computed(() => props.label),
  menuSize: computed(() => props.size),
})

function applyOpenState(next: boolean): void {
  if (next) {
    attachDismissListeners()
    updatePosition()
    void nextTick(focusPanelOrFirstRow)
    return
  }
  detachDismissListeners()
  nav.resetTypeahead()
}

watch(isOpen, applyOpenState)

// A menu that is already open on mount — a bound `is-open`, a restored state —
// gets the same wiring as one opened later, since its watch never fired.
onMounted(() => {
  if (isOpen.value)
    applyOpenState(true)
})

watch(() => props.isDisabled, (isDisabled) => {
  if (isDisabled)
    closeMenu()
})

onBeforeUnmount(() => {
  detachDismissListeners()
  resetMenuPress()
})

const element = computed(() => trigger.value ?? null)

defineExpose({
  blur: () => trigger.value?.blur(),
  close: () => closeMenu({ restoreFocus: true }),
  element,
  focus: () => trigger.value?.focus(),
  open: () => openAt(0, 0),
})
</script>

<template>
  <component
    :is="triggerAs === 'span' ? 'span' : 'div'"
    ref="trigger"
    v-bind="triggerAttrs"
    class="astryx-context-menu-trigger"
    :data-disabled="isDisabled || undefined"
    :data-open="isOpen ? 'open' : undefined"
    @contextmenu="onTriggerContextMenu"
    @pointercancel="longPress.cancel"
    @pointerdown="onTriggerPointerDown"
    @pointermove="onTriggerPointerMove"
    @pointerup="longPress.cancel"
  >
    <slot />
    <span
      ref="cursorAnchor"
      aria-hidden="true"
      class="astryx-context-menu-anchor"
      :style="{ left: `${cursorPoint.x}px`, top: `${cursorPoint.y}px` }"
    />
  </component>

  <Teleport to="body">
    <Transition name="astryx-context-menu">
      <div
        v-show="isOpen"
        :id="menuId"
        ref="panel"
        :aria-label="label"
        class="astryx-context-menu"
        :class="attrs.class"
        :data-overflow="hasOverflow || undefined"
        :data-placement="position.placement"
        :data-size="size"
        :data-width="menuWidth != null ? 'custom' : undefined"
        data-astryx-menu-press
        role="menu"
        :style="[panelStyle, attrs.style as StyleValue]"
        tabindex="-1"
        @contextmenu.prevent
        @keydown="nav.handleKeyDown"
        @pointerdown="menuPress.onPointerDown"
      >
        <ContextMenuItems
          v-if="items != null"
          :items="items"
          @select="onSelect"
        />
        <slot v-else name="content" />
      </div>
    </Transition>
  </Teleport>
</template>
