<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { DropdownMenuEmits, DropdownMenuProps, DropdownMenuSlots, DropdownMenuTriggerProps } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, useAttrs, useId, useSlots, watch } from 'vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { dropdownMenuContextKey } from './context.js'
import { activateMenuItem, MENU_ITEM_ROLES } from './menuItemRoles.js'
import { DropdownMenuItems } from './renderItems.js'
import { useMenuFocus } from './useMenuFocus.js'
import { useMenuTypeahead } from './useMenuTypeahead.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenu', inheritAttrs: false })

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  alignment: 'start',
  button: () => ({ label: 'Menu' }),
  hasChevron: true,
  placement: 'below',
})

const emit = defineEmits<DropdownMenuEmits>()
defineSlots<DropdownMenuSlots>()

const attrs = useAttrs()
const slots = useSlots()

const GAP = 4
const DEFAULT_MAX_WIDTH = 320
const DEFAULT_MAX_HEIGHT = '300px'
const INTRINSIC_SIZE = /^(?:auto|min-content|max-content|fit-content|fit-content\(.*\)|inherit|initial|unset|revert|revert-layer)$/i

const open = defineModel<boolean | undefined>('isMenuOpen', { default: undefined })

const localIsOpen = shallowRef(false)
const isOpen = computed(() => open.value ?? localIsOpen.value)

const uid = useId()
const menuId = `astryx-dropdown-menu-${uid}`
const triggerId = `astryx-dropdown-menu-trigger-${uid}`

const anchorRef = ref<HTMLElement | null>(null)
const surfaceRef = ref<HTMLElement | null>(null)
const anchorWidth = ref(0)
const shouldFocusOnOpen = shallowRef(false)
const focusLastOnOpen = shallowRef(false)
let openModality: 'keyboard' | 'pointer' = 'keyboard'
let armedTriggerClickGuard = false

const buttonProps = computed(() => props.button ?? {})
const menuSize = computed(() => buttonProps.value.size ?? 'md')
const isIconOnly = computed(() => buttonProps.value.isIconOnly === true)
const hasChevron = computed(() => props.hasChevron && !isIconOnly.value)

const surfaceId = computed(() => {
  const provided = attrs.id
  return typeof provided === 'string' && provided.length > 0 ? provided : menuId
})

const menuAriaLabel = computed(() => {
  const explicit = attrs['aria-label']
  if (typeof explicit === 'string')
    return explicit
  if (slots.trigger != null)
    return undefined
  return typeof buttonProps.value.label === 'string' ? buttonProps.value.label : undefined
})

const menuAriaLabelledBy = computed(() => {
  const explicit = attrs['aria-labelledby']
  if (typeof explicit === 'string')
    return explicit
  if (menuAriaLabel.value != null)
    return undefined
  return slots.trigger != null ? triggerId : undefined
})

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => !['class', 'style', 'id', 'aria-label', 'aria-labelledby'].includes(key)),
))

/**
 * The layer tracks its own open state so a menu that mounts already open still
 * gets one open transition: the layer's own watcher only reacts to a change,
 * and a controlled menu renders open from the first frame.
 */
const layerIsOpen = ref(false)

const { position, detach: detachPosition } = usePositionedLayer({
  anchor: anchorRef,
  layer: surfaceRef,
  isOpen: layerIsOpen,
  placement: computed(() => props.placement),
  alignment: computed(() => props.alignment),
  gap: GAP,
})

watch(isOpen, (nowOpen) => {
  layerIsOpen.value = nowOpen
})

const surfaceStyle = computed<CSSProperties>(() => {
  const style: Record<string, string> = {
    'top': `${position.value.top}px`,
    'left': `${position.value.left}px`,
    '--_dropdown-menu-max-block': `min(${props.menuMaxHeight == null ? DEFAULT_MAX_HEIGHT : `${props.menuMaxHeight}px`}, calc(100dvh - 16px))`,
    // Whatever width the menu prefers, the viewport keeps the last word.
    'maxWidth': props.menuWidth == null
      ? `min(${DEFAULT_MAX_WIDTH}px, calc(100vw - 16px))`
      : 'calc(100vw - 16px)',
  }

  if (props.menuWidth == null) {
    style.minWidth = `min(${anchorWidth.value}px, ${DEFAULT_MAX_WIDTH}px)`
    return style
  }

  const width = (typeof props.menuWidth === 'number' ? `${props.menuWidth}px` : props.menuWidth).trim()
  if (INTRINSIC_SIZE.test(width))
    style.width = width
  else
    style.minWidth = `min(${width}, calc(100vw - 16px))`

  return style
})

const focusNav = useMenuFocus({ list: surfaceRef })

const typeahead = useMenuTypeahead({
  getItemLabels: () => focusNav.getItems().map((row) => {
    const label = row.querySelector('.astryx-item__label')
    return label?.textContent ?? row.textContent ?? ''
  }),
  getCurrentIndex: () => {
    const active = document.activeElement
    return focusNav.getItems().findIndex(row => row === active || row.contains(active))
  },
  onMatch: index => focusNav.focusItem(index),
})

function emitOpenChange(next: boolean): void {
  localIsOpen.value = next
  open.value = next
  emit('openChange', next)
}

function focusSurface(): void {
  surfaceRef.value?.focus({ preventScroll: true })
}

function openMenu(modality: 'keyboard' | 'pointer'): void {
  if (isOpen.value)
    return
  openModality = modality
  shouldFocusOnOpen.value = true
  emitOpenChange(true)
}

function closeMenu(): void {
  if (!isOpen.value)
    return
  emitOpenChange(false)
}

function getTriggerControl(): HTMLElement | null {
  const anchor = anchorRef.value
  if (anchor == null)
    return null
  if (anchor.matches('button, a[href], [role="button"], [tabindex]'))
    return anchor
  return anchor.querySelector<HTMLElement>('button, a[href], [role="button"], [tabindex]')
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!isOpen.value)
    return
  const target = event.target
  if (!(target instanceof Node))
    return
  if (surfaceRef.value?.contains(target) || anchorRef.value?.contains(target))
    return
  closeMenu()
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (!isOpen.value || event.key !== 'Escape')
    return
  event.preventDefault()
  closeMenu()
}

function attachDismissListeners(): void {
  anchorWidth.value = anchorRef.value?.getBoundingClientRect().width ?? 0
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  document.addEventListener('keydown', onDocumentKeydown)
}

function detachDismissListeners(): void {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onDocumentKeydown)
}

watch(isOpen, async (nowOpen) => {
  if (nowOpen) {
    attachDismissListeners()
    await nextTick()
    if (!shouldFocusOnOpen.value)
      return
    shouldFocusOnOpen.value = false
    const hasFocusedRow = focusLastOnOpen.value ? focusNav.focusLast() : focusNav.focusFirst()
    focusLastOnOpen.value = false
    if (openModality === 'pointer' || !hasFocusedRow)
      focusSurface()
    openModality = 'keyboard'
    return
  }

  detachDismissListeners()
  typeahead.reset()
  const active = document.activeElement
  const surface = surfaceRef.value
  const focusWasLost = active == null || active === document.body
  // A press outside that landed on a focusable control has already put focus
  // where the user meant it; only a lost focus comes back to the trigger.
  if (focusWasLost || (surface != null && surface.contains(active)))
    getTriggerControl()?.focus({ preventScroll: true })
})

function onSurfaceKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    // The key that opened the menu, held down, auto-repeats into the menu once
    // focus has moved there; a repeat is never an activation.
    if (event.repeat)
      return
    const focused = document.activeElement
    if (focused instanceof HTMLElement && MENU_ITEM_ROLES.has(focused.getAttribute('role') ?? ''))
      activateMenuItem(focused, event)
    return
  }
  // APG menu-button pattern: Tab closes the menu. Closing returns focus to the
  // trigger, and the browser's default Tab then continues from there.
  if (event.key === 'Tab') {
    closeMenu()
    return
  }
  if (typeahead.onKeyDown(event)) {
    event.preventDefault()
    return
  }
  focusNav.handleKeyDown(event)
}

function onTriggerClick(event: MouseEvent): void {
  // Enter and Space already opened the menu; the activation's own click, if the
  // browser still reports one, is spent.
  if (armedTriggerClickGuard) {
    armedTriggerClickGuard = false
    return
  }
  if (isOpen.value) {
    emit('click')
    closeMenu()
    return
  }
  // detail === 0 marks a synthesized click from assistive technology, which is
  // treated as a keyboard open so those users land on the first row too.
  openMenu(event.detail === 0 ? 'keyboard' : 'pointer')
  emit('click')
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (!isOpen.value) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter' && event.key !== ' ')
      return
    event.preventDefault()
    if (event.repeat)
      return
    if (event.key === 'Enter' || event.key === ' ') {
      armedTriggerClickGuard = true
      setTimeout(() => {
        armedTriggerClickGuard = false
      }, 0)
    }
    focusLastOnOpen.value = event.key === 'ArrowUp'
    openMenu('keyboard')
    return
  }
  // Open with focus still on the trigger — a menu that mounted open, or a
  // pointer open followed by Shift+Tab — has nothing in the tab order to reach
  // its rows, so ArrowDown walks in the way a keyboard open would land.
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!focusNav.focusFirst())
      focusSurface()
  }
}

const triggerProps = computed<DropdownMenuTriggerProps>(() => ({
  'id': triggerId,
  'aria-haspopup': 'menu',
  'aria-expanded': isOpen.value,
  'aria-controls': surfaceId.value,
  'onClick': onTriggerClick,
  'onKeyDown': onTriggerKeydown,
}))

provide(dropdownMenuContextKey, { closeMenu, menuSize })

onMounted(() => {
  if (!isOpen.value)
    return
  layerIsOpen.value = true
  attachDismissListeners()
})

onBeforeUnmount(() => {
  detachDismissListeners()
  detachPosition()
})
</script>

<template>
  <span
    ref="anchorRef"
    class="astryx-dropdown-menu-trigger"
    :data-open="isOpen ? 'true' : undefined"
  >
    <slot v-if="slots.trigger" name="trigger" v-bind="triggerProps" />
    <Button
      v-else
      v-bind="buttonProps"
      :id="triggerId"
      :aria-controls="surfaceId"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      :tooltip="isOpen ? undefined : buttonProps.tooltip"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
    >
      <template v-if="hasChevron" #end>
        <Icon color="inherit" icon="chevronDown" size="sm" />
      </template>
    </Button>
  </span>

  <Teleport to="body">
    <Transition name="astryx-dropdown-menu">
      <div
        v-show="isOpen"
        :id="surfaceId"
        ref="surfaceRef"
        v-bind="forwardedAttrs"
        :aria-labelledby="menuAriaLabelledBy"
        :aria-label="menuAriaLabel"
        class="astryx-dropdown-menu"
        :class="attrs.class"
        :data-placement="position.placement"
        role="menu"
        :style="[surfaceStyle, attrs.style as CSSProperties]"
        tabindex="-1"
        @keydown="onSurfaceKeydown"
      >
        <DropdownMenuItems v-if="items != null" :items="items" />
        <slot v-else />
      </div>
    </Transition>
  </Teleport>
</template>
