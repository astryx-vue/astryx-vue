<script setup lang="ts">
import type { PopoverProps } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useId, watch, watchEffect } from 'vue'
import { Button } from '../Button/index.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useRestoreFocus } from '../composables/useRestoreFocus.js'
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
  anchor: undefined,
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()

const GAP = 4
const DEFAULT_MAX_WIDTH = 320
const popoverId = `astryx-popover-${useId()}`
const wrapperRef = ref<HTMLElement | null>(null)
const anchorRef = ref<HTMLElement | null>(null)
const surfaceRef = ref<HTMLElement | null>(null)
const isOpenState = ref(false)
const anchorWidth = ref(0)

// The layer follows the external anchor when there is one, and the wrapper
// around the trigger content otherwise.
watchEffect(() => {
  anchorRef.value = triggerHost()
})

function triggerHost(): HTMLElement | null {
  return props.anchor ?? wrapperRef.value
}

const { position, detach: detachPosition } = usePositionedLayer({
  anchor: anchorRef,
  layer: surfaceRef,
  isOpen: isOpenState,
  placement: computed(() => props.placement),
  alignment: computed(() => props.alignment),
  gap: GAP,
})

const isModalDialog = computed(() => props.role === 'dialog' && props.isModal)

useFocusTrap({
  container: surfaceRef,
  isEnabled: computed(() => isOpenState.value && isModalDialog.value),
})

useRestoreFocus({
  isEnabled: computed(() => props.role === 'dialog'),
  shouldRestore: isOpenState,
})

useDismiss({
  container: surfaceRef,
  trigger: anchorRef,
  isEnabled: computed(() => isOpenState.value && props.hasLightDismiss),
  enableEscape: computed(() => props.hasEscapeDismiss),
  onDismiss: () => setOpen(false),
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
  if (props.width != null) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  else {
    style.minWidth = `min(${anchorWidth.value}px, ${DEFAULT_MAX_WIDTH}px)`
    style.maxWidth = `min(${DEFAULT_MAX_WIDTH}px, calc(100vw - 16px))`
  }
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
  const next = findTriggerButton(triggerHost())
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

watch(isOpenState, (open) => {
  syncTriggerAttributes()
  if (open) {
    anchorWidth.value = triggerHost()?.getBoundingClientRect().width ?? 0
    if (props.hasAutoFocus && props.role === 'dialog')
      nextTick(focusInitialTarget)
    return
  }
  const hadFocus = surfaceRef.value?.contains(typeof document !== 'undefined' ? document.activeElement : null) ?? false
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

watch(() => props.anchor, () => {
  void nextTick(bindButton)
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
})
</script>

<template>
  <span v-if="!anchor" ref="wrapperRef" class="astryx-popover-trigger">
    <slot />
  </span>
  <slot v-else />
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
      <div class="astryx-popover__body">
        <slot name="content" />
      </div>
      <div v-if="hasCloseButton" class="astryx-popover__close">
        <Button variant="secondary" :label="closeButtonLabel" @click="setOpen(false)" />
      </div>
    </div>
  </Teleport>
</template>
