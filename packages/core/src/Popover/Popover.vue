<script setup lang="ts">
import type { PopoverProps } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useId, watch } from 'vue'
import { Button } from '../Button/index.js'
import { focusElement, getFocusables } from '../layer/focus.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import '../../styles/popover.css'

defineOptions({ name: 'AstryxPopover' })
const props = withDefaults(defineProps<PopoverProps>(), {
  placement: 'below',
  alignment: 'start',
  isOpen: undefined,
  isEnabled: true,
  width: undefined,
  padding: 3,
  label: undefined,
  role: 'dialog',
  isModal: true,
  hasCloseButton: true,
  closeButtonLabel: 'Close',
  hasAutoFocus: true,
  hasLightDismiss: true,
  hasEscapeDismiss: true,
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()

const GAP = 4
const popoverId = `astryx-popover-${useId()}`
const anchorRef = ref<HTMLElement | null>(null)
const surfaceRef = ref<HTMLElement | null>(null)
const isOpenState = ref(false)
const anchorWidth = ref(0)

const { position, detach: detachPosition } = usePositionedLayer({
  anchor: anchorRef,
  layer: surfaceRef,
  isOpen: isOpenState,
  placement: computed(() => props.placement),
  alignment: computed(() => props.alignment),
  gap: GAP,
})

const surfaceRole = computed(() => (props.role === 'dialog' ? 'dialog' : undefined))
const surfaceAriaModal = computed(() => (props.role === 'dialog' && props.isModal ? 'true' : undefined))
const surfaceAriaLabel = computed(() => (props.role === 'dialog' ? props.label : undefined))
const surfaceTabIndex = computed(() => (props.role === 'dialog' ? -1 : undefined))
const surfaceStyle = computed(() => {
  const style: Record<string, string> = {
    '--_popover-padding': `var(--astryx-spacing-${String(props.padding).replace('.', '-')})`,
    'top': `${position.value.top}px`,
    'left': `${position.value.left}px`,
  }
  if (props.width != null)
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  else
    style.minWidth = `${anchorWidth.value}px`
  return style
})

let boundButton: HTMLElement | null = null

function setOpen(next: boolean): void {
  if (isOpenState.value === next)
    return
  isOpenState.value = next
  emit('openChange', next)
}

function findTriggerButton(element: HTMLElement | null): HTMLElement | null {
  if (!element)
    return null
  if (element.matches('button, [role="button"]'))
    return element
  return element.querySelector<HTMLElement>('button, [role="button"]')
}

function syncTriggerAttributes(): void {
  if (!boundButton)
    return
  boundButton.setAttribute('aria-haspopup', props.role === 'dialog' ? 'dialog' : 'true')
  boundButton.setAttribute('aria-expanded', String(isOpenState.value))
  boundButton.setAttribute('aria-controls', popoverId)
}

function onTriggerClick(): void {
  if (!props.isEnabled)
    return
  setOpen(!isOpenState.value)
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter' && event.key !== ' ')
    return
  event.preventDefault()
  onTriggerClick()
}

function bindButton(): void {
  const next = findTriggerButton(anchorRef.value)
  if (next === boundButton)
    return
  unbindButton()
  boundButton = next
  if (!next)
    return
  next.addEventListener('click', onTriggerClick)
  if (next.tagName !== 'BUTTON' && next.getAttribute('role') === 'button')
    next.addEventListener('keydown', onTriggerKeydown)
  syncTriggerAttributes()
}

function unbindButton(): void {
  if (!boundButton)
    return
  boundButton.removeEventListener('click', onTriggerClick)
  boundButton.removeEventListener('keydown', onTriggerKeydown)
  boundButton.removeAttribute('aria-haspopup')
  boundButton.removeAttribute('aria-expanded')
  boundButton.removeAttribute('aria-controls')
  boundButton = null
}

function focusInitialTarget(): void {
  const surface = surfaceRef.value
  if (!surface)
    return
  const first = getFocusables(surface).find(element => !element.closest('.astryx-popover__close'))
  if (first && focusElement(first))
    return
  if (props.role === 'dialog')
    focusElement(surface)
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!props.hasLightDismiss || !isOpenState.value)
    return
  const target = event.target as Node
  if (surfaceRef.value?.contains(target) || anchorRef.value?.contains(target))
    return
  setOpen(false)
}

function trapTab(event: KeyboardEvent): void {
  const surface = surfaceRef.value
  if (!surface)
    return
  const items = getFocusables(surface)
  if (items.length === 0) {
    event.preventDefault()
    focusElement(surface)
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  if (!surface.contains(active)) {
    event.preventDefault()
    focusElement(event.shiftKey ? last : first)
    return
  }
  if (event.shiftKey && (active === first || active === surface)) {
    event.preventDefault()
    focusElement(last)
  }
  else if (!event.shiftKey && active === last) {
    event.preventDefault()
    focusElement(first)
  }
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (!isOpenState.value)
    return
  if (event.key === 'Escape' && props.hasEscapeDismiss) {
    setOpen(false)
    return
  }
  if (event.key === 'Tab' && props.isModal && props.role === 'dialog')
    trapTab(event)
}

watch(isOpenState, (open) => {
  syncTriggerAttributes()
  if (open) {
    anchorWidth.value = anchorRef.value?.getBoundingClientRect().width ?? 0
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    document.addEventListener('keydown', onDocumentKeydown)
    if (props.hasAutoFocus && props.role === 'dialog')
      nextTick(focusInitialTarget)
    return
  }
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onDocumentKeydown)
  const hadFocus = surfaceRef.value?.contains(document.activeElement) ?? false
  if (hadFocus && boundButton)
    nextTick(() => focusElement(boundButton as HTMLElement))
})

watch(() => props.isOpen, (open) => {
  if (open === undefined || open === isOpenState.value)
    return
  isOpenState.value = open
})

watch(() => props.isEnabled, (enabled) => {
  if (!enabled && isOpenState.value)
    setOpen(false)
})

onMounted(() => {
  bindButton()
  if (props.isOpen !== undefined)
    isOpenState.value = props.isOpen
})

onUpdated(bindButton)

onBeforeUnmount(() => {
  unbindButton()
  detachPosition()
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <span ref="anchorRef" class="astryx-popover-trigger">
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-show="isOpenState"
      :id="popoverId"
      ref="surfaceRef"
      class="astryx-popover"
      :role="surfaceRole"
      :aria-modal="surfaceAriaModal"
      :aria-label="surfaceAriaLabel"
      :tabindex="surfaceTabIndex"
      :data-placement="position.placement"
      :style="surfaceStyle"
    >
      <slot name="content" />
      <div v-if="hasCloseButton" class="astryx-popover__close">
        <Button variant="secondary" :label="closeButtonLabel" @click="setOpen(false)" />
      </div>
    </div>
  </Teleport>
</template>
