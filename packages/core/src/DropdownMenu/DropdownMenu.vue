<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { DropdownMenuContextValue } from './context.js'
import type { DropdownMenuFrameState } from './frame.js'
import type { DropdownMenuEmits, DropdownMenuProps, DropdownMenuSlots, DropdownMenuTriggerProps } from './types.js'
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, shallowRef, useAttrs, useId, useSlots, watch } from 'vue'
import Button from '../Button/Button.vue'
import { useFocusReturnVisibility } from '../composables/internal/useFocusReturnVisibility.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { useMenuPress } from '../composables/useMenuPress.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useTypeahead } from '../composables/useTypeahead.js'
import Icon from '../Icon/Icon.vue'
import { clampInlineSize, isIntrinsicInlineSize, LAYER_MAX_INLINE_SIZE } from '../layer/inlineSize.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useAstryxMessages } from '../locale/index.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import DropdownMenuFrame from './DropdownMenuFrame.vue'
import { dropdownMenuFrameKey } from './frame.js'
import { activateMenuItem, MENU_ITEM_ROLES } from './menuItemRoles.js'
import { useMenuDrillIn } from './useMenuDrillIn.js'
import { useMenuFocus } from './useMenuFocus.js'
import { useMenuRegions } from './useMenuRegions.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenu', inheritAttrs: false })
const props = withDefaults(defineProps<DropdownMenuProps>(), {
  alignment: 'start',
  hasChevron: true,
  placement: 'below',
  presentation: 'popover',
})

const emit = defineEmits<DropdownMenuEmits>()
defineSlots<DropdownMenuSlots>()

const attrs = useAttrs()
const slots = useSlots()
const messages = useAstryxMessages()
const focusReturn = useFocusReturnVisibility()

const GAP = 4
const DEFAULT_MAX_WIDTH = 320
const DEFAULT_MAX_HEIGHT = '300px'

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

const COMPACT_TOUCH_QUERY = '(max-width: 768px) and (pointer: coarse)'
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

const buttonProps = computed(() => ({
  label: messages.value.dropdownMenu.label,
  ...props.button,
}))
const sheetLabel = computed(() => typeof buttonProps.value.label === 'string' ? buttonProps.value.label : messages.value.dropdownMenu.label)
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

const dialogLabel = computed(() => menuLabel.value ?? messages.value.dropdownMenu.label)
const dialogId = `${menuId}-dialog`
const popupKind = computed(() => (hasRegions.value ? 'dialog' : 'menu'))
const controlsId = computed(() => (hasRegions.value ? dialogId : surfaceId.value))
const focusRing = computed(() => (focusReturn.isFocusRingSuppressed.value ? 'off' : undefined))
const hasOverflow = useOverflow(surfaceRef, isOpen)

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

// 浮层自己跟踪开合：挂载时就已经展开的受控菜单也要有一次进场。
const layerIsOpen = ref(false)

const { position, teleportTarget, detach: detachPosition } = usePositionedLayer({
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
    'maxWidth': props.menuWidth == null ? clampInlineSize(`${DEFAULT_MAX_WIDTH}px`) : LAYER_MAX_INLINE_SIZE,
  }

  if (props.menuWidth == null) {
    style.minWidth = `min(${anchorWidth.value}px, ${DEFAULT_MAX_WIDTH}px)`
    return style
  }

  const width = (typeof props.menuWidth === 'number' ? `${props.menuWidth}px` : props.menuWidth).trim()
  if (isIntrinsicInlineSize(width))
    style.width = width
  else
    style.minWidth = clampInlineSize(width)

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

function assignElement(target: { value: HTMLElement | null }, element: unknown): void {
  target.value = element instanceof HTMLElement ? element : null
}

function assignHost(element: unknown): void {
  host.value = element instanceof HTMLElement ? element : null
}

function isTriggerDisabled(): boolean {
  const control = getTriggerControl()
  return control?.matches(':disabled, [aria-disabled="true"]') === true
}

function openMenu(modality: 'keyboard' | 'pointer'): boolean {
  if (isTriggerDisabled() || isOpen.value)
    return false
  focusReturn.resetFocusReturn()
  openModality = modality
  shouldFocusOnOpen.value = true
  emitOpenChange(true)
  return true
}

const press = useMenuPress({
  menuRef: surfaceRef,
  triggerRef: anchorRef,
  isEnabled: () => !isSheet.value && !isTriggerDisabled(),
  onTriggerPress: () => {
    if (isOpen.value) {
      closeMenu()
      return false
    }
    return openMenu('pointer')
  },
  onDismiss: () => closeMenu(),
})

function closeMenu(): void {
  if (!isOpen.value)
    return
  focusReturn.prepareFocusReturn()
  press.cancel()
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
  if (focusWasLost || (surface != null && surface.contains(active as Node))) {
    await nextTick()
    getTriggerControl()?.focus({ preventScroll: true })
  }
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
    if (event.key === 'Tab' && hasRegions.value)
      regions.moveDialogTab(event, true)
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
  if (event.key === 'Tab') {
    if (hasRegions.value)
      regions.moveDialogTab(event)
    else
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
  // Enter, Space, and a press that already opened the menu spend their click.
  if (armedTriggerClickGuard || press.isTriggerClickFromPress()) {
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
  'aria-haspopup': popupKind.value,
  'aria-expanded': isOpen.value,
  'aria-controls': controlsId.value,
  'data-astryx-focus-ring': focusRing.value,
  'onClick': onTriggerClick,
  'onKeyDown': onTriggerKeydown,
  'onFocus': focusReturn.onFocusReturnTargetFocus,
}))

const menuContext: DropdownMenuContextValue = markRaw({
  closeMenu,
  drillIn,
  focusRegion: regions.focusRegion,
  moveDialogTab: regions.moveDialogTab,
  hasRegions,
  isOpen,
  menuLabel,
  menuSize,
})

const paintedStyle = computed(() => [surfaceStyle.value, attrs.style as CSSProperties])
const menuBindings = computed(() => ({
  ...forwardedAttrs.value,
  ...press.menuProps,
}))

provide(dropdownMenuFrameKey, reactive({
  isSheet,
  sheetOpen,
  sheetLabel,
  hasRegions,
  isOpen,
  isDrilled,
  hasOverflow,
  regionFocus,
  surfaceId,
  dialogId,
  dialogLabel,
  menuAriaLabel,
  menuAriaLabelledBy,
  forwardedAttrs,
  menuBindings,
  surfaceClass: computed(() => attrs.class),
  surfaceStyle: paintedStyle,
  placement: computed(() => position.value.placement),
  teleportTarget,
  items: computed(() => props.items),
  menuContext,
  regions,
  setSurface: (element: unknown) => assignElement(surfaceRef, element),
  setPopover: (element: unknown) => assignElement(popoverRef, element),
  setHeader: (element: unknown) => assignElement(headerRef, element),
  setFooter: (element: unknown) => assignElement(footerRef, element),
  setHost: assignHost,
  onSurfaceKeydown,
  onSurfaceFocus,
}) as unknown as DropdownMenuFrameState)

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
    @contextmenu="press.triggerProps.onContextmenu"
    @focusin="focusReturn.onFocusReturnTargetFocus"
    @pointerdown="press.triggerProps.onPointerdown"
  >
    <slot v-if="slots.trigger" name="trigger" v-bind="triggerProps" />
    <Button
      v-else
      v-bind="buttonProps"
      :id="triggerId"
      :aria-controls="controlsId"
      :aria-expanded="isOpen"
      :aria-haspopup="popupKind"
      :data-astryx-focus-ring="focusRing"
      :tooltip="isOpen ? undefined : buttonProps.tooltip"
      @click="onTriggerClick"
      @focus="focusReturn.onFocusReturnTargetFocus"
      @keydown="onTriggerKeydown"
    >
      <template v-if="hasChevron" #end>
        <Icon color="inherit" icon="chevronDown" size="sm" />
      </template>
    </Button>
  </span>
  <DropdownMenuFrame>
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
  </DropdownMenuFrame>
</template>
