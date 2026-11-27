<script setup lang="ts">
import type { DismissEscape } from '../layer/dismissStack.js'
import type { LayerFocusRecord } from '../layer/layerFocusReturn.js'
import type { ScrimFade } from './sheetDragExit.js'
import type { BottomSheetEmits, BottomSheetMotion, BottomSheetProps, BottomSheetSlots, BottomSheetState } from './types.js'
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref, toValue, useAttrs, useTemplateRef, watch } from 'vue'
import { focusForLastInput } from '../composables/internal/focusReturn.js'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useRestoreFocus } from '../composables/useRestoreFocus.js'
import { useScrollLock } from '../composables/useScrollLock.js'
import { holdKeptInside } from '../layer/inputHold.js'
import { isLayerFocusStranded, restoreLayerFocus, trackLayerFocus } from '../layer/layerFocusReturn.js'
import { createModalOutletHandle } from '../layer/modalOutlet.js'
import { provideNestedLayerMountTarget } from '../layer/mount.js'
import { isImeKeyEvent } from '../utils/ime.js'
import BottomSheetPanel from './BottomSheetPanel.vue'
import { bottomSheetEscapeKey } from './escape.js'
import { focusSheetOnOpen } from './focusSheetPanel.js'
import { bottomSheetSwitcherKey } from './switcher.js'
import { useSheetLayerDismiss } from './useSheetLayerDismiss.js'
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
const switcher = inject(bottomSheetSwitcherKey, null)
const isEscapeAllowed = inject(bottomSheetEscapeKey, () => true)
provide(bottomSheetEscapeKey, () => true)
const hosted = computed(() => switcher != null && props.sheetId != null)
const retained = computed(() => {
  if (!hosted.value || switcher == null)
    return false
  return switcher.retainedId.value === props.sheetId && switcher.activeId.value !== props.sheetId
})
const open = computed(() => {
  if (!hosted.value || props.sheetId == null)
    return isOpen.value
  return switcher?.activeId.value === props.sheetId || switcher?.retainedId.value === props.sheetId
})
const attrs = useAttrs()
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
provideNestedLayerMountTarget(useTemplateRef<HTMLElement>('layerHost'))
const panel = useTemplateRef<InstanceType<typeof BottomSheetPanel>>('panel')
const isPresented = ref(false)
const scrimOpacity = ref(1)
// 只有真正以模态打开之后才对外说自己是模态：服务端渲染出来、还没水合的抽屉不能带 aria-modal。
const isModalShown = ref(false)
// 服务端渲染时就开着的抽屉，水合后直接以静止状态呈现，不播进场；第一次关闭后恢复动效。
const isSettled = ref(getCurrentInstance()?.vnode.el != null && isOpen.value && !hosted.value && !props.isInline)

const panelState = computed<BottomSheetState>(() => {
  if (retained.value)
    return 'exiting'
  if (open.value)
    return 'open'
  if (props.isInline || hosted.value)
    return 'hidden'
  return isPresented.value ? 'exiting' : 'hidden'
})

const isDismissible = computed(() => props.purpose === 'info')
const isSwipeDismissAllowed = computed(() => props.purpose === 'info' && !props.isInline)

// A swipe's close paces the scrim's fade on its spring.
const scrimFade = ref<ScrimFade | null>(null)
const isClosing = computed(() => !isOpen.value && isPresented.value)
// The scrim follows the drag while open and fades out through the exit.
const dialogStyle = computed(() => ({
  '--_sheet-scrim-opacity': isClosing.value ? '0' : String(scrimOpacity.value),
  '--_sheet-scrim-duration': scrimFade.value == null ? undefined : `${scrimFade.value.durationMs}ms`,
  '--_sheet-scrim-easing': scrimFade.value?.easing,
}))

useFocusTrap({
  container: computed(() => panelElement()),
  isEnabled: computed(() => !hosted.value && isOpen.value && props.hasScrim),
})

useRestoreFocus({
  isEnabled: computed(() => !props.isInline && !hosted.value),
  shouldRestore: isOpen,
  preventScroll: true,
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
  if (typeof document === 'undefined')
    return
  focusSheetOnOpen(panelElement(), props.hasScrim)
}

// 打开期间跟着焦点：抽屉被直接卸载（没有关闭动作）时，靠它把被困住的焦点送回打开者。
let focusRecord: LayerFocusRecord | null = null

// 独立的模态抽屉打开期间充当全局 toast 的挂载点，toast 才不会被它盖住、点不到。
const modalOutlet = createModalOutletHandle()

function openSheet(): void {
  if (props.isInline || typeof document === 'undefined')
    return
  const dialogElement = dialog.value
  if (!dialogElement)
    return
  isPresented.value = true
  if (!dialogElement.open) {
    focusRecord?.stop()
    focusRecord = trackLayerFocus({ getLayer: () => dialog.value })
    if (props.hasScrim) {
      dialogElement.showModal()
      isModalShown.value = true
      if (!hosted.value)
        modalOutlet.attach(dialogElement)
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
  modalOutlet.detach()
  dialog.value?.close()
  unlockScroll()
  isPresented.value = false
  isModalShown.value = false
  focusRecord?.stop()
  focusRecord = null
  const target = toValue(props.finalFocusRef)
  if (target?.isConnected)
    focusForLastInput(target, { preventScroll: true })
}

const layerActive = computed(() => !hosted.value && !props.isInline && (isOpen.value || isPresented.value))
const layerEscape = computed<DismissEscape>(() => {
  if (!isOpen.value || props.purpose === 'required' || !isEscapeAllowed())
    return 'block'
  if (!props.hasScrim)
    return 'ignore'
  return 'close'
})
const layer = useSheetLayerDismiss({
  isActive: layerActive,
  escape: layerEscape,
  getContainer: () => dialog.value ?? null,
  isPresent: () => dialog.value?.open ?? false,
  onDismiss: () => {
    if (!isOpen.value || props.purpose === 'required')
      return
    requestClose()
  },
})

function requestClose(): void {
  if (hosted.value && props.sheetId != null) {
    if (switcher?.activeId.value === props.sheetId)
      switcher.setActive(null)
    emit('openChange', false)
    return
  }
  isOpen.value = false
  emit('openChange', false)
}

function dismissOnEscape(): void {
  if (props.purpose === 'required' || !isEscapeAllowed())
    return
  requestClose()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !layer.isTop())
    return
  event.preventDefault()
  if (isImeKeyEvent(event))
    return
  dismissOnEscape()
}

function onCancel(event: Event): void {
  // 内部元素也会发 cancel：文件选择器被取消时就会冒上来，那不是关闭请求。
  if (event.target !== dialog.value)
    return
  event.preventDefault()
  if (!layer.isTop())
    return
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

watch(isOpen, (value) => {
  if (hosted.value || !value)
    return
  openSheet()
}, { flush: 'post' })

watch(isOpen, (value) => {
  if (value) {
    scrimOpacity.value = 1
    return
  }
  isSettled.value = false
  isModalShown.value = false
})

// 关闭中的抽屉交给浮层运行时的输入暂挡：页面照常可点；焦点还留在里面时内容不藏，
// 只放行 Tab，焦点一离开就整个变成 inert。退场结束或重新打开时放开。
const isExiting = computed(() => !hosted.value && !props.isInline && !isOpen.value && isPresented.value)
let releaseExitHold: (() => void) | null = null
watch(isExiting, (exiting) => {
  releaseExitHold?.()
  releaseExitHold = null
  const element = dialog.value
  if (exiting && element != null)
    releaseExitHold = holdKeptInside(element, new Promise<never>(() => {}))
}, { flush: 'post' })

onMounted(() => {
  if (hosted.value && props.sheetId != null) {
    switcher?.register(props.sheetId, {
      getElement: () => panelElement(),
      label: () => props.label,
      purpose: () => props.purpose,
    })
    return
  }
  if (isOpen.value)
    openSheet()
})

onBeforeUnmount(() => {
  // 打开着就被卸载：等它离开文档后，把被困住的焦点按共用的候选链送出去。
  const record = focusRecord
  focusRecord = null
  if (record != null) {
    const wasStranded = isLayerFocusStranded(record, dialog.value)
    queueMicrotask(() => {
      if (wasStranded)
        restoreLayerFocus(record, { layer: null, name: 'BottomSheet' })
      record.stop()
    })
  }
  releaseExitHold?.()
  releaseExitHold = null
  modalOutlet.detach()
  if (props.sheetId != null)
    switcher?.unregister(props.sheetId)
  unlockScroll()
})

defineExpose({
  element: computed(() => panelElement()),
  focus: (options?: FocusOptions) => panelElement()?.focus(options),
  blur: () => panelElement()?.blur(),
})
</script>

<template>
  <template v-if="hosted">
    <div
      v-if="open"
      class="astryx-bottom-sheet__positioner"
      :class="retained ? 'astryx-bottom-sheet__positioner--retained' : 'astryx-bottom-sheet__positioner--active'"
      :style="retained ? { '--_sheet-align': `${switcher?.alignmentOffset.value ?? 0}px` } : undefined"
      :inert="retained || undefined"
    >
      <BottomSheetPanel
        ref="panel"
        v-bind="panelAttrs()"
        :state="panelState"
        :label="label"
        :height="height"
        :padding="padding"
        :snap-points="snapPoints"
        :is-swipe-dismiss-allowed="purpose === 'info'"
        @dismiss="requestClose"
        @snap="emit('snap', $event)"
        @motion-start="emit('motionStart', $event)"
        @motion-complete="emit('motionComplete', $event)"
      >
        <slot />
      </BottomSheetPanel>
    </div>
  </template>
  <div v-else-if="isInline" class="astryx-bottom-sheet-inline">
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
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 点在 dialog 自身上等于点遮罩；键盘走原生 cancel 和下面的 keydown。 -->
  <dialog
    v-else
    ref="dialog"
    class="astryx-bottom-sheet-dialog"
    :class="{
      'astryx-bottom-sheet-dialog--scrim': hasScrim,
      'astryx-bottom-sheet-dialog--closing': isClosing,
    }"
    :data-settled="isSettled || undefined"
    :aria-label="dialogLabel"
    :aria-labelledby="labelledBy"
    :aria-modal="hasScrim && isModalShown ? 'true' : undefined"
    :role="purpose === 'required' ? 'alertdialog' : undefined"
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
        @scrim-fade="scrimFade = $event"
        @snap="emit('snap', $event)"
        @motion-start="emit('motionStart', $event)"
        @motion-complete="onPanelMotionComplete"
      >
        <slot />
      </BottomSheetPanel>
    </div>
    <div class="astryx-bottom-sheet__edge-tint" aria-hidden="true" />
    <div ref="layerHost" class="astryx-bottom-sheet__layer-host" />
  </dialog>
</template>
