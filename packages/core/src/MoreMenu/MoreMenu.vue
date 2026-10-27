<script setup lang="ts">
import type { MoreMenuEmits, MoreMenuInitialFocus, MoreMenuProps, MoreMenuResolvedPresentation, MoreMenuSlots } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, shallowRef, useId, useTemplateRef, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/index.js'
import { moreMenuContextKey } from './context.js'
import MoreMenuPanel from './MoreMenuPanel.vue'
import MoreMenuSheet from './MoreMenuSheet.vue'
import '../../styles/more-menu.css'

defineOptions({ name: 'AstryxMoreMenu' })

const props = withDefaults(defineProps<Omit<MoreMenuProps, 'isMenuOpen'>>(), {
  alignment: 'start',
  isDisabled: false,
  isInline: false,
  placement: 'below',
  presentation: 'popover',
  size: 'md',
  variant: 'ghost',
})

const emit = defineEmits<MoreMenuEmits>()
defineSlots<MoreMenuSlots>()

const openModel = defineModel<boolean | undefined>('isMenuOpen', { default: undefined })
const messages = useAstryxMessages()
const menuLabel = computed(() => props.label ?? messages.value.moreMenu.label)

const ADAPTIVE_QUERY = '(max-width: 768px) and (pointer: coarse)'
const SURFACE_SELECTOR = '[data-astryx-more-menu-surface]'

const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<InstanceType<typeof IconButton>>('trigger')
const panel = useTemplateRef<InstanceType<typeof MoreMenuPanel>>('panel')

const menuId = `astryx-more-menu-${useId()}`
const sheetId = `${menuId}-sheet`
const localIsOpen = shallowRef(false)
const pendingFocus = shallowRef<MoreMenuInitialFocus>('none')
const isCompactTouch = shallowRef(false)

// Whether the caller owns the open state is decided once, at setup: a menu that
// starts unbound keeps owning its state for its whole life.
const isControlled = openModel.value !== undefined
const isOpen = computed(() => (isControlled ? openModel.value === true : localIsOpen.value))
const triggerElement = computed<HTMLElement | null>(() => (trigger.value?.element as HTMLElement | undefined) ?? null)

const resolvedPresentation = computed<MoreMenuResolvedPresentation>(() => {
  if (props.isInline)
    return 'popover'

  if (props.presentation === 'adaptive')
    return isCompactTouch.value ? 'bottom-sheet' : 'popover'

  return props.presentation === 'bottom-sheet' ? 'bottom-sheet' : 'popover'
})

const isSheet = computed(() => resolvedPresentation.value === 'bottom-sheet')
const isInlinePreview = computed(() => props.isInline && isOpen.value)

function setOpen(next: boolean): void {
  if (isOpen.value === next)
    return

  if (isControlled) {
    openModel.value = next
    void nextTick(() => {
      // The caller refused the change: nothing is waiting for focus any more.
      if (isOpen.value !== next)
        pendingFocus.value = 'none'
    })
  }
  else {
    localIsOpen.value = next
  }

  emit('openChange', next)
}

function isInsideSurface(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(SURFACE_SELECTOR) != null
}

function isOnTrigger(target: EventTarget | null): boolean {
  const element = root.value

  return element != null && target instanceof Node && element.contains(target)
}

function closeMenu(options: { restoreFocus?: boolean } = {}): void {
  const { restoreFocus = true } = options
  if (!isOpen.value)
    return

  const active = document.activeElement
  // Focus that already moved to a control of its own keeps it; anywhere else —
  // the trigger, the menu itself, a press on nothing — the trigger takes focus
  // back.
  const focusLandedElsewhere = active instanceof HTMLElement
    && active !== document.body
    && active !== triggerElement.value
    && !isInsideSurface(active)

  setOpen(false)
  pendingFocus.value = 'none'

  if (restoreFocus && !focusLandedElsewhere)
    triggerElement.value?.focus({ preventScroll: true })
}

function openMenu(options: { modality: 'keyboard' | 'pointer', focusLast?: boolean }): void {
  if (props.isDisabled || isOpen.value)
    return

  pendingFocus.value = options.modality === 'pointer'
    ? 'container'
    : options.focusLast === true ? 'last' : 'first'

  setOpen(true)
}

function onTriggerClick(event: MouseEvent): void {
  if (props.isDisabled)
    return

  if (isOpen.value) {
    closeMenu()
    return
  }

  // `detail` 0 marks a synthesized click (a screen reader or assistive
  // activation): those users need the first row the way a keyboard open gets it.
  openMenu({ modality: event.detail === 0 ? 'keyboard' : 'pointer' })
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (props.isDisabled)
    return

  if (!isOpen.value) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter' && event.key !== ' ')
      return

    event.preventDefault()
    if (event.repeat)
      return

    openMenu({ modality: 'keyboard', focusLast: event.key === 'ArrowUp' })
    return
  }

  // Open with focus still on the trigger has nothing in the tab order to reach
  // a row, so ArrowDown walks in the way a keyboard open would land.
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (panel.value?.focusFirst() !== true)
      panel.value?.focusContainer()
  }
}

function onDocumentPointerUp(event: PointerEvent): void {
  // Under a mouse, releasing off the menu dismisses it. A finger leaves it
  // open: its highlight follows the finger, and only a row or a tap elsewhere
  // settles the gesture.
  if (event.pointerType !== 'mouse')
    return

  dismissFromPointer(event.target)
}

function onDocumentClick(event: MouseEvent): void {
  dismissFromPointer(event.target)
}

function dismissFromPointer(target: EventTarget | null): void {
  if (!isOpen.value || isInsideSurface(target) || isOnTrigger(target))
    return

  // The surface is gone, but a control the press landed on keeps its focus.
  closeMenu({ restoreFocus: false })
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !isOpen.value)
    return

  // A focus inside the menu is the menu's own Escape to handle.
  if (isInsideSurface(event.target))
    return

  closeMenu()
}

function addDocumentListeners(): void {
  document.addEventListener('pointerup', onDocumentPointerUp)
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
}

function removeDocumentListeners(): void {
  document.removeEventListener('pointerup', onDocumentPointerUp)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
}

watch(isOpen, (open) => {
  removeDocumentListeners()
  if (!open) {
    pendingFocus.value = 'none'
    return
  }

  // The sheet is modal: its scrim owns dismissal, and the page behind it must
  // not be reachable.
  if (!isSheet.value)
    addDocumentListeners()
})

watch(openModel, (open, previous) => {
  if (open !== true || previous === true)
    return

  // A controlled parent opened the menu from outside; a keyboard-style open
  // lands on the first row, unless this very turn already asked for something
  // else.
  if (pendingFocus.value === 'none' && !isInlinePreview.value)
    pendingFocus.value = 'first'
})

provide(moreMenuContextKey, {
  closeMenu,
  menuSize: computed(() => props.size),
})

let query: MediaQueryList | null = null

function syncCompactTouch(event?: MediaQueryListEvent): void {
  isCompactTouch.value = event?.matches ?? query?.matches ?? false
}

onMounted(() => {
  if (typeof window.matchMedia !== 'function')
    return

  query = window.matchMedia(ADAPTIVE_QUERY)
  syncCompactTouch()
  query.addEventListener?.('change', syncCompactTouch)
})

onBeforeUnmount(() => {
  query?.removeEventListener?.('change', syncCompactTouch)
  removeDocumentListeners()
})

function focus(options?: FocusOptions): void {
  triggerElement.value?.focus(options)
}

function blur(): void {
  triggerElement.value?.blur()
}

defineExpose({
  blur,
  element: triggerElement,
  focus,
})
</script>

<template>
  <span
    ref="root"
    class="astryx-more-menu"
    :class="{ 'astryx-more-menu--inline': isInline }"
    :data-disabled="isDisabled || undefined"
    :data-open="isOpen || undefined"
    :data-presentation="resolvedPresentation"
    :data-size="size"
    :data-variant="variant"
  >
    <IconButton
      ref="trigger"
      :aria-controls="isSheet ? sheetId : menuId"
      :aria-expanded="isOpen"
      :aria-haspopup="isSheet ? 'dialog' : 'menu'"
      :is-disabled="isDisabled"
      :label="menuLabel"
      :size="size"
      :tooltip="isOpen ? undefined : menuLabel"
      :variant="variant"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
    >
      <slot name="icon">
        <Icon icon="moreHorizontal" />
      </slot>
    </IconButton>

    <MoreMenuPanel
      v-if="!isSheet"
      :id="menuId"
      ref="panel"
      :alignment="alignment"
      :anchor="triggerElement"
      :initial-focus="pendingFocus"
      :is-inline="isInline"
      :is-open="isOpen"
      :items="items"
      :label="menuLabel"
      :placement="placement"
      @close="closeMenu()"
    />

    <MoreMenuSheet
      v-else
      :id="sheetId"
      :initial-focus="pendingFocus"
      :is-open="isOpen"
      :items="items"
      :label="menuLabel"
      @close="closeMenu()"
    />
  </span>
</template>
