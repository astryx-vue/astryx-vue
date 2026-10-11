<script setup lang="ts">
import type { BottomSheetEmits, BottomSheetMotion, BottomSheetProps, BottomSheetSlots, BottomSheetState } from './types.js'
import { computed, onBeforeUnmount, onMounted, ref, toValue, useAttrs, useTemplateRef, watch } from 'vue'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useRestoreFocus } from '../composables/useRestoreFocus.js'
import { useScrollLock } from '../composables/useScrollLock.js'
import BottomSheetPanel from './BottomSheetPanel.vue'
import '../../styles/bottom-sheet.css'

defineOptions({ name: 'AstryxBottomSheet', inheritAttrs: false })

const props = withDefaults(defineProps<BottomSheetProps>(), {
  isInline: false,
  height: 'capped',
  snapPoints: undefined,
  padding: undefined,
  purpose: 'info',
  hasScrim: true,
  finalFocusRef: null,
})

const emit = defineEmits<BottomSheetEmits>()
defineSlots<BottomSheetSlots>()

const isOpen = defineModel<boolean>('isOpen', { default: false })
const attrs = useAttrs()
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const panel = useTemplateRef<InstanceType<typeof BottomSheetPanel>>('panel')
const isPresented = ref(false)
const scrimOpacity = ref(1)

const panelState = computed<BottomSheetState>(() => {
  if (isOpen.value)
    return 'open'
  if (props.isInline)
    return 'hidden'
  return isPresented.value ? 'exiting' : 'hidden'
})

const isDismissible = computed(() => props.purpose === 'info')
const isSwipeDismissAllowed = computed(() => props.purpose === 'info' && !props.isInline)

const dialogStyle = computed(() => ({ '--_sheet-scrim-opacity': String(scrimOpacity.value) }))

useFocusTrap({
  container: computed(() => panelElement()),
  isEnabled: computed(() => isOpen.value && props.hasScrim),
})

useRestoreFocus({
  isEnabled: computed(() => !props.isInline),
  shouldRestore: isOpen,
})

/** The dialog carries the accessible name; the panel keeps every other attribute. */
const dialogLabel = computed(() => {
  if (attrs['aria-labelledby'] != null)
    return undefined
  return (attrs['aria-label'] as string | undefined) ?? props.label
})

const labelledBy = computed(() => attrs['aria-labelledby'] as string | undefined)

function panelAttrs(): Record<string, unknown> {
  const { 'aria-label': _label, 'aria-labelledby': _labelledBy, ...rest } = attrs
  return rest
}

const isScrollLocked = ref(false)
useScrollLock(isScrollLocked)

function lockScroll(): void {
  if (typeof document === 'undefined')
    return
  isScrollLocked.value = true
}

function unlockScroll(): void {
  if (typeof document === 'undefined')
    return
  isScrollLocked.value = false
}

function panelElement(): HTMLElement | null {
  return panel.value?.element ?? null
}

function focusPanel(): void {
  const element = panelElement()
  if (!element || typeof document === 'undefined')
    return
  const active = document.activeElement
  if (active != null && element.contains(active))
    return
  const autofocus = element.querySelector<HTMLElement>('[data-autofocus]')
  if (autofocus != null)
    autofocus.focus({ preventScroll: true })
  else if (props.hasScrim)
    element.focus({ preventScroll: true })
}

function openSheet(): void {
  if (props.isInline || typeof document === 'undefined')
    return
  const dialogElement = dialog.value
  if (!dialogElement)
    return
  isPresented.value = true
  if (!dialogElement.open) {
    if (props.hasScrim) {
      dialogElement.showModal()
    }
    else {
      dialogElement.show()
    }
  }
  if (props.hasScrim)
    lockScroll()
  focusPanel()
}

function closeSheet(): void {
  dialog.value?.close()
  unlockScroll()
  isPresented.value = false
  const target = toValue(props.finalFocusRef)
  if (target?.isConnected)
    target.focus()
}

function requestClose(): void {
  isOpen.value = false
  emit('openChange', false)
}

function dismissOnEscape(): void {
  if (props.purpose === 'required')
    return
  requestClose()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape')
    return
  event.preventDefault()
  if (event.isComposing || event.keyCode === 229)
    return
  dismissOnEscape()
}

function onCancel(event: Event): void {
  event.preventDefault()
  dismissOnEscape()
}

function onDialogClick(event: MouseEvent): void {
  if (event.target !== event.currentTarget)
    return
  if (props.hasScrim && isDismissible.value)
    requestClose()
}

function onPanelMotionComplete(motion: BottomSheetMotion): void {
  emit('motionComplete', motion)
  if (motion === 'exiting')
    closeSheet()
}

watch(isOpen, (open) => {
  if (open)
    openSheet()
}, { flush: 'post' })

onMounted(() => {
  if (isOpen.value)
    openSheet()
})

onBeforeUnmount(() => {
  unlockScroll()
})

defineExpose({
  element: computed(() => panelElement()),
  focus: (options?: FocusOptions) => panelElement()?.focus(options),
  blur: () => panelElement()?.blur(),
})
</script>

<template>
  <div v-if="isInline" class="astryx-bottom-sheet-inline">
    <div v-if="isOpen" class="astryx-bottom-sheet__positioner astryx-bottom-sheet__positioner--inline">
      <BottomSheetPanel
        ref="panel"
        v-bind="panelAttrs()"
        :state="panelState"
        :label="label"
        :height="height"
        :padding="padding"
        :snap-points="snapPoints"
        :is-swipe-dismiss-allowed="false"
        @snap="emit('snap', $event)"
      >
        <slot />
      </BottomSheetPanel>
    </div>
  </div>
  <dialog
    v-else
    ref="dialog"
    class="astryx-bottom-sheet-dialog"
    :class="{
      'astryx-bottom-sheet-dialog--scrim': hasScrim,
      'astryx-bottom-sheet-dialog--closing': !isOpen && isPresented,
    }"
    :aria-label="dialogLabel"
    :aria-labelledby="labelledBy"
    :aria-modal="hasScrim && isOpen ? 'true' : undefined"
    :aria-hidden="!isOpen && isPresented ? 'true' : undefined"
    :role="purpose === 'required' ? 'alertdialog' : undefined"
    :inert="!isOpen && isPresented ? true : undefined"
    :style="dialogStyle"
    @cancel="onCancel"
    @click="onDialogClick"
    @keydown="onKeydown"
  >
    <div class="astryx-bottom-sheet__positioner">
      <BottomSheetPanel
        ref="panel"
        v-bind="panelAttrs()"
        :state="panelState"
        :label="label"
        :height="height"
        :padding="padding"
        :snap-points="snapPoints"
        :is-swipe-dismiss-allowed="isSwipeDismissAllowed"
        @dismiss="requestClose"
        @scrim-opacity="scrimOpacity = $event"
        @snap="emit('snap', $event)"
        @motion-start="emit('motionStart', $event)"
        @motion-complete="onPanelMotionComplete"
      >
        <slot />
      </BottomSheetPanel>
    </div>
    <div class="astryx-bottom-sheet__edge-tint" aria-hidden="true" />
  </dialog>
</template>
