<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { DropdownMenuEmits, DropdownMenuProps, DropdownMenuSlots, DropdownMenuTriggerProps } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, useAttrs, useId, useSlots, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import Button from '../Button/Button.vue'
import { useDismiss } from '../composables/useDismiss.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { useTypeahead } from '../composables/useTypeahead.js'
import Icon from '../Icon/Icon.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { dropdownMenuContextKey } from './context.js'
import { activateMenuItem, MENU_ITEM_ROLES } from './menuItemRoles.js'
import { DropdownMenuItems } from './renderItems.js'
import { useMenuDrillIn } from './useMenuDrillIn.js'
import { useMenuFocus } from './useMenuFocus.js'
import { useMenuRegions } from './useMenuRegions.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenu', inheritAttrs: false })

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  alignment: 'start',
  button: () => ({ label: 'Menu' }),
  hasChevron: true,
  placement: 'below',
  presentation: 'popover',
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
useScrollbars(surfaceRef)
const popoverRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const anchorWidth = ref(0)
const regionFocus = ref(false)
let suppressRegionRing = false
const shouldFocusOnOpen = shallowRef(false)
const focusLastOnOpen = shallowRef(false)
let openModality: 'keyboard' | 'pointer' = 'keyboard'
let armedTriggerClickGuard = false

const COMPACT_TOUCH_QUERY = '(max-width: 639px) and (pointer: coarse) and (hover: none)'
const isCompactTouch = useMediaQuery(COMPACT_TOUCH_QUERY)
const hasRegions = computed(() => slots.header != null || slots.footer != null)
const { drillIn, host, isDrilled } = useMenuDrillIn(isOpen, COMPACT_TOUCH_QUERY)
const positionedEl = computed(() => (hasRegions.value ? popoverRef.value : surfaceRef.value))
const isSheet = computed(() => props.presentation === 'bottom-sheet' || (props.presentation === 'adaptive' && isCompactTouch.value))
const sheetOpen = computed({
  get: () => isSheet.value && isOpen.value,
  set: (open: boolean) => {
    if (!open)
      closeMenu()
  },
})

const buttonProps = computed(() => props.button ?? {})
const sheetLabel = computed(() => typeof buttonProps.value.label === 'string' ? buttonProps.value.label : 'Menu')
const menuSize = computed(() => buttonProps.value.size ?? 'md')
const isIconOnly = computed(() => buttonProps.value.isIconOnly === true)
const hasChevron = computed(() => props.hasChevron && !isIconOnly.value)

const surfaceId = computed(() => {
  const provided = attrs.id
  return typeof provided === 'string' && provided.length > 0 ? provided : menuId
})

const menuLabel = computed(() => {
  const explicit = attrs['aria-label']
  if (typeof explicit === 'string' && explicit.length > 0)
    return explicit
  return typeof buttonProps.value.label === 'string' ? buttonProps.value.label : undefined
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
  layer: positionedEl,
  isOpen: layerIsOpen,
  placement: computed(() => props.placement),
  alignment: computed(() => props.alignment),
  gap: GAP,
})

watch(isOpen, (nowOpen) => {
  layerIsOpen.value = nowOpen && !isSheet.value
})

const surfaceStyle = computed<CSSProperties>(() => {
  if (isSheet.value)
    return {}
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

const typeahead = useTypeahead({
  getItemLabels: () => focusNav.getItems().map((row) => {
    const label = row.querySelector('.astryx-item__label')
    return label?.textContent ?? row.textContent ?? ''
  }),
  getCurrentIndex: () => {
    const active = typeof document !== 'undefined' ? document.activeElement : null
    return focusNav.getItems().findIndex(row => row === active || row.contains(active as Node))
  },
  onMatch: index => focusNav.focusItem(index),
})

useDismiss({
  container: positionedEl,
  trigger: anchorRef,
  isEnabled: computed(() => isOpen.value && !isSheet.value),
  onDismiss: closeMenu,
  onEscape: () => {
    if (drillIn.value.viewStack.length > 0) {
      drillIn.value.pop()
      return
    }
    closeMenu()
  },
})

function emitOpenChange(next: boolean): void {
  localIsOpen.value = next
  open.value = next
  emit('openChange', next)
}

function focusSurface(): void {
  suppressRegionRing = openModality === 'pointer'
  surfaceRef.value?.focus({ preventScroll: true })
  suppressRegionRing = false
}

function onSurfaceFocus(event: FocusEvent): void {
  if (event.target !== surfaceRef.value) {
    regionFocus.value = false
    return
  }
  regionFocus.value = hasRegions.value && !suppressRegionRing
}

function assignHost(element: unknown): void {
  host.value = element instanceof HTMLElement ? element : null
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

watch(isOpen, async (nowOpen) => {
  layerIsOpen.value = nowOpen && !isSheet.value
  if (nowOpen) {
    anchorWidth.value = anchorRef.value?.getBoundingClientRect().width ?? 0
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

  typeahead.reset()
  const active = typeof document !== 'undefined' ? document.activeElement : null
  const surface = surfaceRef.value
  const focusWasLost = active == null || active === (typeof document !== 'undefined' ? document.body : null)
  if (focusWasLost || (surface != null && surface.contains(active as Node)))
    getTriggerControl()?.focus({ preventScroll: true })
})

const regions = useMenuRegions({
  closeMenu,
  footer: footerRef,
  hasRegions,
  header: headerRef,
  menu: surfaceRef,
})

function onSurfaceKeydown(event: KeyboardEvent): void {
  if (!focusNav.ownsEvent(event)) {
    if (event.key === 'Tab' && hasRegions.value) {
      event.preventDefault()
      regions.focusRegion(event.shiftKey ? 'previous' : 'next')
    }
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (event.repeat)
      return
    const focused = typeof document !== 'undefined' ? document.activeElement : null
    if (focused instanceof HTMLElement && MENU_ITEM_ROLES.has(focused.getAttribute('role') ?? ''))
      activateMenuItem(focused, event)
    return
  }
  if (regions.onMenuTab(event))
    return
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

provide(dropdownMenuContextKey, {
  closeMenu,
  drillIn,
  focusRegion: regions.focusRegion,
  hasRegions,
  isOpen,
  menuLabel,
  menuSize,
})

onMounted(() => {
  if (!isOpen.value)
    return
  layerIsOpen.value = true
  anchorWidth.value = anchorRef.value?.getBoundingClientRect().width ?? 0
})

onBeforeUnmount(() => {
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

  <BottomSheet
    v-if="isSheet"
    v-model:is-open="sheetOpen"
    height="hug"
    :label="sheetLabel"
    :padding="2"
  >
    <div
      v-if="slots.header"
      ref="headerRef"
      class="astryx-dropdown-menu-region"
      @keydown="regions.onRegionKeydown"
    >
      <slot name="header" />
    </div>
    <div
      :id="surfaceId"
      ref="surfaceRef"
      v-bind="forwardedAttrs"
      :aria-labelledby="menuAriaLabelledBy"
      :aria-label="menuAriaLabel"
      class="astryx-dropdown-menu is-sheet"
      :class="attrs.class"
      role="menu"
      tabindex="-1"
      @keydown="onSurfaceKeydown"
    >
      <div class="astryx-dropdown-menu-tree" :hidden="isDrilled || undefined" :inert="isDrilled || undefined">
        <DropdownMenuItems v-if="items != null" :items="items" />
        <slot v-else />
      </div>
      <div :ref="assignHost" class="astryx-dropdown-menu-tree" />
    </div>
    <div
      v-if="slots.footer"
      ref="footerRef"
      class="astryx-dropdown-menu-region"
      @keydown="regions.onRegionKeydown"
    >
      <slot name="footer" />
    </div>
  </BottomSheet>
  <Teleport v-else to="body">
    <Transition name="astryx-dropdown-menu">
      <div
        v-if="hasRegions"
        v-show="isOpen"
        ref="popoverRef"
        class="astryx-dropdown-menu-popover"
        :data-placement="position.placement"
        :style="[surfaceStyle, attrs.style as CSSProperties]"
      >
        <div
          v-if="slots.header"
          ref="headerRef"
          class="astryx-dropdown-menu-region"
          @keydown="regions.onRegionKeydown"
        >
          <slot name="header" />
        </div>
        <div
          :id="surfaceId"
          ref="surfaceRef"
          v-bind="forwardedAttrs"
          :aria-labelledby="menuAriaLabelledBy"
          :aria-label="menuAriaLabel"
          class="astryx-dropdown-menu is-in-frame"
          :class="attrs.class"
          :data-region-focus="regionFocus || undefined"
          role="menu"
          tabindex="0"
          @focus="onSurfaceFocus"
          @keydown="onSurfaceKeydown"
        >
          <div class="astryx-dropdown-menu-tree" :hidden="isDrilled || undefined" :inert="isDrilled || undefined">
            <DropdownMenuItems v-if="items != null" :items="items" />
            <slot v-else />
          </div>
          <div :ref="assignHost" class="astryx-dropdown-menu-tree" />
        </div>
        <div
          v-if="slots.footer"
          ref="footerRef"
          class="astryx-dropdown-menu-region"
          @keydown="regions.onRegionKeydown"
        >
          <slot name="footer" />
        </div>
      </div>
      <div
        v-else
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
        @focus="onSurfaceFocus"
        @keydown="onSurfaceKeydown"
      >
        <div class="astryx-dropdown-menu-tree" :hidden="isDrilled || undefined" :inert="isDrilled || undefined">
          <DropdownMenuItems v-if="items != null" :items="items" />
          <slot v-else />
        </div>
        <div :ref="assignHost" class="astryx-dropdown-menu-tree" />
      </div>
    </Transition>
  </Teleport>
</template>
