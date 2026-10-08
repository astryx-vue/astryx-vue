<script setup lang="ts">
import type { HoverCardEmits, HoverCardProps, HoverCardSlots } from './types.js'
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, useId, watch } from 'vue'
import { isFocusable } from '../layer/focus.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import '../../styles/hover-card.css'

defineOptions({ name: 'AstryxHoverCard', inheritAttrs: false })

const props = withDefaults(defineProps<HoverCardProps>(), {
  content: '',
  placement: 'above',
  alignment: 'center',
  delay: 300,
  hideDelay: 200,
  focusTrigger: 'auto',
  touchTrigger: 'auto',
  isEnabled: true,
  label: undefined,
  hasHoverIndication: 'auto',
  isOpen: undefined,
  isDefaultOpen: false,
})

const emit = defineEmits<HoverCardEmits>()
defineSlots<HoverCardSlots>()

const GAP = 4
const TOUCH_POINTER_TYPES = new Set(['touch', 'pen'])

const EXPANDABLE_ROLES = new Set([
  'application',
  'button',
  'checkbox',
  'columnheader',
  'combobox',
  'gridcell',
  'link',
  'listbox',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'row',
  'rowheader',
  'switch',
  'tab',
  'treeitem',
])

const BUTTON_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image'])

const ACTION_ROLES = new Set([
  'button',
  'checkbox',
  'combobox',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
])

// aria-expanded is only valid on some roles, so a role-less trigger advertises
// the popup through aria-haspopup / aria-controls alone. Emitting the attribute
// where it is illegal is an aria-allowed-attr defect, while omitting it where it
// might have been legal only costs an inference the user can still make.
function supportsAriaExpanded(element: HTMLElement): boolean {
  const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0]
  if (explicit)
    return EXPANDABLE_ROLES.has(explicit)

  switch (element.tagName) {
    case 'BUTTON':
    case 'SUMMARY':
      return true
    case 'A':
    case 'AREA':
      return element.hasAttribute('href')
    case 'INPUT':
      return BUTTON_INPUT_TYPES.has((element as HTMLInputElement).type?.toLowerCase())
    case 'SELECT':
      return true
    default:
      return false
  }
}

function isEditable(element: HTMLElement): boolean {
  if (element.isContentEditable === true)
    return true
  const attribute = element.getAttribute('contenteditable')
  return attribute != null && attribute !== 'false'
}

function isActionTrigger(element: HTMLElement): boolean {
  const role = element.getAttribute('role')
  if (role != null && role !== '')
    return ACTION_ROLES.has(role)

  switch (element.tagName) {
    case 'BUTTON':
    case 'INPUT':
    case 'LABEL':
    case 'SELECT':
    case 'SUMMARY':
    case 'TEXTAREA':
      return true
    case 'A':
    case 'AREA':
      return element.hasAttribute('href')
    default:
      return isEditable(element)
  }
}

function mergeIds(...ids: (string | null | undefined)[]): string | undefined {
  const kept = ids.filter(Boolean)
  return kept.length > 0 ? kept.join(' ') : undefined
}

// A tap leaves focus on the trigger it activated, and pointing must not decide
// that the next keyboard focus is a touch one — so the modality is read as well
// as the pointer type.
let lastModality: 'keyboard' | 'pointer' = 'keyboard'

function onModalityPointerDown(): void {
  lastModality = 'pointer'
}

function onModalityKeyDown(event: KeyboardEvent): void {
  if (event.metaKey || event.altKey || event.ctrlKey)
    return
  lastModality = 'keyboard'
}

const cardId = `astryx-hover-card-${useId()}`
const wrapperRef = ref<HTMLElement | null>(null)
const surfaceRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isTextTrigger = ref(false)
const isControlled = computed(() => props.isOpen !== undefined)
const isDialog = computed(() => props.label != null && props.label !== '')
const showIndication = computed(() => props.hasHoverIndication === true || (props.hasHoverIndication === 'auto' && isTextTrigger.value))

const { position, detach: detachPosition } = usePositionedLayer({
  anchor: triggerRef,
  layer: surfaceRef,
  isOpen: isVisible,
  placement: computed(() => props.placement),
  alignment: computed(() => props.alignment),
  gap: GAP,
})

const surfaceStyle = computed(() => ({ top: `${position.value.top}px`, left: `${position.value.left}px` }))
const element = computed(() => surfaceRef.value)

let trigger: HTMLElement | null = null
let describedByBefore: string | null = null
let haspopupBefore: string | null = null
let controlsBefore: string | null = null
let expandedBefore: string | null = null
let canExpand = false
let isHoveringContent = false
let isTouchPointer = false
let isEscapeDismissing = false
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

function clearTimers(): void {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  showTimer = undefined
  hideTimer = undefined
}

function setOpen(next: boolean): void {
  if (isVisible.value === next)
    return
  isVisible.value = next
  emit('openChange', next)
}

function showNow(): void {
  clearTimers()
  if (!props.isEnabled)
    return
  setOpen(true)
}

function hideNow(): void {
  clearTimers()
  isHoveringContent = false
  if (isControlled.value)
    return
  setOpen(false)
}

function scheduleShow(): void {
  if (!props.isEnabled || isControlled.value)
    return
  clearTimers()
  showTimer = setTimeout(() => {
    showTimer = undefined
    setOpen(true)
  }, props.delay)
}

function scheduleHide(): void {
  if (isControlled.value)
    return
  clearTimers()
  hideTimer = setTimeout(() => {
    hideTimer = undefined
    if (!isHoveringContent)
      setOpen(false)
  }, props.hideDelay)
}

function onPointerEnter(event: PointerEvent): void {
  isTouchPointer = event.pointerType === 'touch'
}

function onMouseEnter(): void {
  if (isTouchPointer)
    return
  scheduleShow()
}

function onMouseLeave(): void {
  if (isTouchPointer)
    return
  scheduleHide()
}

function onPointerDown(event: PointerEvent): void {
  const isTouch = TOUCH_POINTER_TYPES.has(event.pointerType)
  isTouchPointer = isTouch
  if (!isTouch || isControlled.value)
    return

  const mode = props.touchTrigger === 'auto'
    ? (trigger != null && isActionTrigger(trigger) ? 'none' : 'tap')
    : props.touchTrigger

  if (mode === 'none' || !props.isEnabled) {
    hideNow()
    return
  }

  if (isVisible.value)
    hideNow()
  else
    showNow()
}

function onFocusIn(): void {
  if (!props.isEnabled)
    return
  if (isTouchPointer && lastModality === 'pointer')
    return
  if (isEscapeDismissing) {
    isEscapeDismissing = false
    return
  }
  showNow()
}

function onFocusOut(event: FocusEvent): void {
  const related = event.relatedTarget as HTMLElement | null
  if (related && surfaceRef.value?.contains(related))
    return
  scheduleHide()
}

function onContentMouseEnter(): void {
  if (isTouchPointer)
    return
  isHoveringContent = true
  clearTimers()
}

function onContentMouseLeave(): void {
  if (isTouchPointer)
    return
  isHoveringContent = false
  scheduleHide()
}

function onContentFocusOut(event: FocusEvent): void {
  const related = event.relatedTarget as HTMLElement | null
  if (related && surfaceRef.value?.contains(related))
    return
  if (related && triggerRef.value?.contains(related))
    return
  scheduleHide()
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !isVisible.value)
    return
  clearTimers()
  isHoveringContent = false
  if (isControlled.value) {
    emit('openChange', false)
    return
  }
  const hadFocus = surfaceRef.value?.contains(document.activeElement) ?? false
  setOpen(false)
  if (hadFocus && triggerRef.value) {
    isEscapeDismissing = true
    triggerRef.value.focus()
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!TOUCH_POINTER_TYPES.has(event.pointerType) || !isVisible.value || isControlled.value)
    return
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || surfaceRef.value?.contains(target))
    return
  hideNow()
}

function applyTriggerAttributes(): void {
  const active = triggerRef.value
  if (!active)
    return

  if (isDialog.value) {
    active.setAttribute('aria-haspopup', 'dialog')
    if (isVisible.value)
      active.setAttribute('aria-controls', mergeIds(controlsBefore, cardId) ?? '')
    else if (controlsBefore)
      active.setAttribute('aria-controls', controlsBefore)
    else
      active.removeAttribute('aria-controls')

    if (canExpand)
      active.setAttribute('aria-expanded', String(isVisible.value))
    else if (expandedBefore)
      active.setAttribute('aria-expanded', expandedBefore)
    else
      active.removeAttribute('aria-expanded')
    return
  }

  active.setAttribute('aria-describedby', mergeIds(describedByBefore, cardId) ?? '')
}

function restoreTriggerAttributes(): void {
  const active = triggerRef.value
  if (!active)
    return

  if (describedByBefore)
    active.setAttribute('aria-describedby', describedByBefore)
  else
    active.removeAttribute('aria-describedby')

  if (haspopupBefore)
    active.setAttribute('aria-haspopup', haspopupBefore)
  else
    active.removeAttribute('aria-haspopup')

  if (controlsBefore)
    active.setAttribute('aria-controls', controlsBefore)
  else
    active.removeAttribute('aria-controls')

  if (expandedBefore)
    active.setAttribute('aria-expanded', expandedBefore)
  else
    active.removeAttribute('aria-expanded')
}

function shouldListenFocus(target: HTMLElement): boolean {
  return props.focusTrigger === 'always' || (props.focusTrigger === 'auto' && isFocusable(target))
}

function resolveTrigger(): HTMLElement | null {
  const wrapper = wrapperRef.value
  if (!wrapper)
    return null
  const child = wrapper.firstElementChild as HTMLElement | null
  isTextTrigger.value = child == null && (wrapper.textContent ?? '').trim() !== ''
  if (child)
    return child
  if (isTextTrigger.value) {
    wrapper.tabIndex = 0
    return wrapper
  }
  return null
}

function bindTrigger(): void {
  const next = resolveTrigger()
  if (next === trigger)
    return
  unbindTrigger()
  trigger = next
  triggerRef.value = next
  if (!next)
    return

  describedByBefore = next.getAttribute('aria-describedby')
  haspopupBefore = next.getAttribute('aria-haspopup')
  controlsBefore = next.getAttribute('aria-controls')
  expandedBefore = next.getAttribute('aria-expanded')
  canExpand = supportsAriaExpanded(next)

  next.addEventListener('pointerenter', onPointerEnter as EventListener)
  next.addEventListener('mouseenter', onMouseEnter)
  next.addEventListener('mouseleave', onMouseLeave)
  next.addEventListener('pointerdown', onPointerDown as EventListener)
  if (shouldListenFocus(next)) {
    next.addEventListener('focusin', onFocusIn)
    next.addEventListener('focusout', onFocusOut)
  }
  applyTriggerAttributes()
}

function unbindTrigger(): void {
  if (!trigger)
    return
  trigger.removeEventListener('pointerenter', onPointerEnter as EventListener)
  trigger.removeEventListener('mouseenter', onMouseEnter)
  trigger.removeEventListener('mouseleave', onMouseLeave)
  trigger.removeEventListener('pointerdown', onPointerDown as EventListener)
  trigger.removeEventListener('focusin', onFocusIn)
  trigger.removeEventListener('focusout', onFocusOut)
  restoreTriggerAttributes()
  trigger = null
  triggerRef.value = null
  describedByBefore = null
  haspopupBefore = null
  controlsBefore = null
  expandedBefore = null
  canExpand = false
}

function show(): void {
  showNow()
}

function hide(): void {
  clearTimers()
  isHoveringContent = false
  setOpen(false)
}

defineExpose({ element, show, hide })

watch(isVisible, (visible) => {
  applyTriggerAttributes()
  if (visible) {
    document.addEventListener('keydown', onDocumentKeydown)
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    return
  }
  document.removeEventListener('keydown', onDocumentKeydown)
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})

watch(() => props.isOpen, (open) => {
  clearTimers()
  if (open === undefined)
    return
  setOpen(open)
})

watch(() => props.isEnabled, (enabled) => {
  if (!enabled)
    hideNow()
})

onMounted(() => {
  document.addEventListener('pointerdown', onModalityPointerDown, { capture: true, passive: true })
  document.addEventListener('keydown', onModalityKeyDown, { capture: true, passive: true })
  bindTrigger()
  // The initial controlled value is synced without reporting it back: the
  // consumer's own prop is not news to them.
  if (props.isOpen !== undefined)
    isVisible.value = props.isOpen
  else if (props.isDefaultOpen)
    setOpen(true)
})

onUpdated(bindTrigger)

onBeforeUnmount(() => {
  clearTimers()
  unbindTrigger()
  detachPosition()
  document.removeEventListener('pointerdown', onModalityPointerDown, true)
  document.removeEventListener('keydown', onModalityKeyDown, true)
  document.removeEventListener('keydown', onDocumentKeydown)
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<template>
  <span
    ref="wrapperRef"
    v-bind="$attrs"
    class="astryx-hover-card__trigger"
    :class="{
      'astryx-hover-card__trigger--text': isTextTrigger,
      'astryx-hover-card__trigger--indicated': isTextTrigger && showIndication,
    }"
  >
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="astryx-hover-card">
      <!-- eslint-disable-next-line vue-a11y/mouse-events-have-key-events, vue-a11y/no-static-element-interactions -- The card's pointer handlers only keep it open while the pointer is inside it; opening and closing by keyboard are handled on the trigger and by Escape. -->
      <div
        v-show="isVisible"
        :id="cardId"
        ref="surfaceRef"
        class="astryx-hover-card"
        :role="isDialog ? 'dialog' : 'group'"
        :aria-label="isDialog ? label : undefined"
        :data-placement="position.placement"
        :style="surfaceStyle"
        @mouseenter="onContentMouseEnter"
        @mouseleave="onContentMouseLeave"
        @focusout="onContentFocusOut"
      >
        <div class="astryx-hover-card__content">
          <slot name="content">
            {{ content }}
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
