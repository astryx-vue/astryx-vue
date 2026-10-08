<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { SegmentedControlEmits, SegmentedControlProps, SegmentedControlSlots } from './types.js'
import { computed, onBeforeUnmount, onMounted, onScopeDispose, onUpdated, provide, shallowRef, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { invokeNativeEventHandler } from '../Button/eventHandlers.js'
import { segmentedControlContextKey } from './context.js'
import '../../styles/segmented-control.css'

defineOptions({ name: 'AstryxSegmentedControl', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<SegmentedControlProps, 'modelValue'>>(), {
  size: 'md',
  layout: 'hug',
  isDisabled: false,
})

const emit = defineEmits<SegmentedControlEmits>()
defineSlots<SegmentedControlSlots>()
const model = defineModel<string>({ required: true })

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')
const tooltipId = `astryx-segmented-control-${useId()}-tooltip`
const element = computed(() => root.value ?? null)

defineExpose({ element })

// =============================================================================
// Selection
// =============================================================================

const showsDisabledMessage = computed(() => props.isDisabled && !!props.disabledMessage?.trim())

function select(value: string): void {
  if (props.isDisabled || value === model.value)
    return

  model.value = value
  emit('change', value)
}

provide(segmentedControlContextKey, {
  value: computed(() => model.value),
  size: computed(() => props.size),
  layout: computed(() => props.layout),
  isDisabled: computed(() => props.isDisabled),
  hasDisabledMessage: showsDisabledMessage,
  select,
})

// =============================================================================
// Roving tab stop
// =============================================================================

const ITEM_SELECTOR = '[role="radio"]'

function getItems(): HTMLElement[] {
  const element = root.value

  return element == null ? [] : Array.from(element.querySelectorAll<HTMLElement>(ITEM_SELECTOR))
}

function isItemDisabled(item: HTMLElement): boolean {
  return item.getAttribute('aria-disabled') === 'true'
    || (item as HTMLButtonElement).disabled === true
    || item.hasAttribute('disabled')
}

function setTabIndex(item: HTMLElement, value: 0 | -1): void {
  if (item.getAttribute('tabindex') !== String(value))
    item.setAttribute('tabindex', String(value))
}

/**
 * Keep exactly one enabled segment tabbable. The segment that already carries
 * the tab stop keeps it; when the selected value matches no segment (or the
 * matching one is disabled) the first enabled segment is promoted instead.
 */
function syncTabStops(): void {
  const items = getItems()
  if (items.length === 0)
    return

  const enabled = items.filter(item => !isItemDisabled(item))
  if (enabled.length === 0)
    return

  const tabbable = enabled.find(item => item.getAttribute('tabindex') === '0') ?? enabled[0]

  for (const item of items)
    setTabIndex(item, item === tabbable ? 0 : -1)
}

onMounted(syncTabStops)
onUpdated(syncTabStops)

// =============================================================================
// Keyboard navigation
// =============================================================================

function isRtl(): boolean {
  const element = root.value

  return element != null && typeof window !== 'undefined' && window.getComputedStyle(element).direction === 'rtl'
}

function findEnabledIndex(items: HTMLElement[], start: number, step: 1 | -1, wrap: boolean): number {
  let index = start

  for (let visited = 0; visited < items.length; visited += 1) {
    if (index < 0 || index >= items.length) {
      if (!wrap)
        return -1

      index = (index + items.length) % items.length
    }

    const item = items[index]
    if (item != null && !isItemDisabled(item))
      return index

    index += step
  }

  return -1
}

function focusIndex(items: HTMLElement[], index: number): void {
  const target = items[index]
  if (target == null)
    return

  for (const item of items)
    setTabIndex(item, item === target ? 0 : -1)

  target.focus()
}

function handleKeydown(event: KeyboardEvent): void {
  invokeNativeEventHandler(attrs.onKeydown ?? attrs.onKeyDown, event)

  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey)
    return

  const items = getItems()
  if (items.length === 0)
    return

  const rtl = (event.key === 'ArrowRight' || event.key === 'ArrowLeft') && isRtl()
  const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight'
  const previousKey = rtl ? 'ArrowRight' : 'ArrowLeft'
  const active = typeof document === 'undefined' ? null : document.activeElement
  const currentIndex = items.findIndex(item => item === active || item.contains(active))
  let targetIndex = -1

  if (event.key === nextKey) {
    targetIndex = findEnabledIndex(items, currentIndex === -1 ? 0 : currentIndex + 1, 1, true)
  }
  else if (event.key === previousKey) {
    targetIndex = findEnabledIndex(items, currentIndex === -1 ? items.length - 1 : currentIndex - 1, -1, true)
  }
  else if (event.key === 'Home') {
    targetIndex = findEnabledIndex(items, 0, 1, false)
  }
  else if (event.key === 'End') {
    targetIndex = findEnabledIndex(items, items.length - 1, -1, false)
  }
  else {
    return
  }

  event.preventDefault()

  if (targetIndex !== -1 && targetIndex !== currentIndex)
    focusIndex(items, targetIndex)
}

// The navigation keys are listened for on the element rather than bound in the
// template: the radiogroup is not itself focusable, so binding a key handler to
// it would advertise a control the user cannot reach.
onMounted(() => root.value?.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => root.value?.removeEventListener('keydown', handleKeydown))

// =============================================================================
// Focus
// =============================================================================

function matchesFocusVisible(element: HTMLElement): boolean {
  try {
    return element.matches(':focus-visible')
  }
  catch {
    return false
  }
}

function handleFocusIn(event: FocusEvent): void {
  invokeNativeEventHandler(attrs.onFocusin ?? attrs.onFocusIn, event)

  if (event.defaultPrevented)
    return

  syncTabStops()

  if (showsDisabledMessage.value) {
    const target = event.target
    if (target instanceof HTMLElement && matchesFocusVisible(target))
      showTooltip()
  }

  if (props.isDisabled)
    return

  // Only a move WITHIN the group selects: tabbing in from outside must stay a
  // pure focus move, or traversal alone would rewrite the value.
  if (!(event.currentTarget as Node | null)?.contains(event.relatedTarget as Node | null))
    return

  const focused = (event.target as HTMLElement | null)?.closest<HTMLElement>('[role="radio"][data-value]')

  if (focused == null || focused.getAttribute('aria-disabled') === 'true')
    return

  const next = focused.dataset.value
  if (next != null)
    select(next)
}

// =============================================================================
// Disabled-reason tooltip
// =============================================================================

const TOOLTIP_SHOW_DELAY = 200
const TOOLTIP_HIDE_DELAY = 100
const isTooltipOpen = shallowRef(false)
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

function clearTimers(): void {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  showTimer = undefined
  hideTimer = undefined
}

function showTooltip(): void {
  if (!showsDisabledMessage.value)
    return

  clearTimers()
  isTooltipOpen.value = true
}

function hideTooltip(): void {
  clearTimers()
  isTooltipOpen.value = false
}

function scheduleShowTooltip(): void {
  if (!showsDisabledMessage.value)
    return

  clearTimers()
  showTimer = setTimeout(showTooltip, TOOLTIP_SHOW_DELAY)
}

function scheduleHideTooltip(): void {
  if (!showsDisabledMessage.value)
    return

  clearTimers()
  hideTimer = setTimeout(hideTooltip, TOOLTIP_HIDE_DELAY)
}

onScopeDispose(clearTimers)

// =============================================================================
// Attributes
// =============================================================================

const controlledAttrs = new Set([
  'aria-describedby',
  'aria-disabled',
  'aria-label',
  'class',
  'onFocusIn',
  'onFocusin',
  'onKeyDown',
  'onKeydown',
  'role',
  'style',
])

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)),
))

const rootClass = computed(() => ['astryx-segmented-control', attrs.class])
const rootStyle = computed(() => attrs.style as StyleValue)

const describedBy = computed(() => [
  attrs['aria-describedby'],
  showsDisabledMessage.value ? tooltipId : undefined,
].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :aria-describedby="describedBy"
    :aria-disabled="isDisabled || undefined"
    :aria-label="label"
    :class="rootClass"
    :data-disabled="isDisabled || undefined"
    :data-disabled-message="showsDisabledMessage || undefined"
    :data-layout="layout"
    :data-size="size"
    :style="rootStyle"
    role="radiogroup"
    @focusin="handleFocusIn"
    @focusout="scheduleHideTooltip"
    @pointerenter="scheduleShowTooltip"
    @pointerleave="scheduleHideTooltip"
  >
    <slot />
  </div>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="tooltipId"
    :anchor="root"
    :open="isTooltipOpen"
    :text="disabledMessage ?? ''"
    @pointer-enter="clearTimers"
    @pointer-leave="scheduleHideTooltip"
  />
</template>
