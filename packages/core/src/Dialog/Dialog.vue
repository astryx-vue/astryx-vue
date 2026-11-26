<script setup lang="ts">
import type { LayerFocusRecord } from '../layer/layerFocusReturn.js'
import type { DialogPadding, DialogProps } from './types.js'
import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useFocusTrap, useScrollLock } from '../composables/index.js'
import { isLayerFocusStranded, restoreLayerFocus, trackLayerFocus } from '../layer/layerFocusReturn.js'
import { createModalOutletHandle } from '../layer/modalOutlet.js'
import { provideLayerMountTarget } from '../layer/mount.js'
import { resetLayerScopedContext } from '../layer/scopedProvide.js'
import { useBackdropPress } from '../layer/useBackdropPress.js'
import { provideLayoutContainer } from '../Layout/context.js'
import { DIALOG_CONTEXT_KEY } from './context.js'
import { findInitialFocusTarget } from './initialFocus.js'
import { formatDialogSize, resolveDialogPositionOffsets } from './position.js'
import '../../styles/dialog.css'

defineOptions({ name: 'AstryxDialog', inheritAttrs: false })
const props = withDefaults(defineProps<DialogProps>(), {
  isInline: false,
  width: 400,
  maxHeight: '75vh',
  position: undefined,
  variant: 'standard',
  purpose: 'info',
  padding: undefined,
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()
const attrs = useAttrs()

// 对话框内容是这一层的成员边界：外面组里的尺寸、禁用、选中值都不再算数。
resetLayerScopedContext()
provideLayoutContainer('dialog')

const titleId = `astryx-dialog-title-${useId()}`
const hasTitle = ref(false)
const isInlineRef = computed(() => props.isInline)
provide(DIALOG_CONTEXT_KEY, {
  titleId,
  isInline: isInlineRef,
  registerTitle: (isMounted: boolean) => {
    hasTitle.value = isMounted
  },
})

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')
// 浮层挂载点：Dialog 打开时浮层挂进来，否则会压在模态遮罩下面看不见。
const layerHostRef = ref<HTMLElement | null>(null)
provideLayerMountTarget(layerHostRef)
let triggerElement: HTMLElement | null = null
const isScrollLocked = ref(false)
useScrollLock(isScrollLocked)

const isFullscreen = computed(() => props.variant === 'fullscreen')
const dialogRole = computed(() => (attrs.role as string | undefined) ?? (props.purpose === 'required' ? 'alertdialog' : undefined))

const rootStyle = computed(() => {
  if (isFullscreen.value)
    return undefined
  const style: Record<string, string> = {
    width: formatDialogSize(props.width),
    maxHeight: formatDialogSize(props.maxHeight),
  }
  if (props.position) {
    const offsets = resolveDialogPositionOffsets(props.position)
    style.margin = '0'
    style.top = offsets.top
    style.bottom = offsets.bottom
    style.insetInlineStart = offsets.insetInlineStart
    style.insetInlineEnd = offsets.insetInlineEnd
  }
  return style
})

const innerStyle = computed(() => {
  if (props.padding == null)
    return undefined
  return { '--_dialog-padding': `var(--astryx-spacing-${paddingToken(props.padding)})` }
})

function paddingToken(value: DialogPadding): string {
  return String(value).replace('.', '-')
}

/** 对话框未设置 aria-label 或 aria-labelledby 时，才使用标题作为默认名称。 */
function resolvedLabelledBy(): string | undefined {
  if (attrs['aria-labelledby'] != null)
    return attrs['aria-labelledby'] as string
  if (attrs['aria-label'] != null)
    return undefined
  return hasTitle.value ? titleId : undefined
}

function rootAttrs(): Record<string, unknown> {
  const { 'aria-labelledby': _labelledBy, ...rest } = attrs
  return rest
}

function getDialogDirection(trigger: HTMLElement, distance = 16): { x: number, y: number } {
  const rect = trigger.getBoundingClientRect()
  // 触发器自己的窗口：第二个文档（iframe、画中画）里量出的位置按那个窗口的视口算。
  const view = trigger.ownerDocument.defaultView ?? window
  const dx = rect.left + rect.width / 2 - view.innerWidth / 2
  const dy = rect.top + rect.height / 2 - view.innerHeight / 2
  const length = Math.sqrt(dx * dx + dy * dy) || 1
  return {
    x: Math.round((dx / length) * distance),
    y: Math.round((dy / length) * distance),
  }
}

function applyEntryDirection(dialog: HTMLDialogElement): void {
  const trigger = triggerElement
  if (trigger && trigger !== document.body) {
    const direction = getDialogDirection(trigger)
    dialog.style.setProperty('--dialog-dir-x', `${direction.x}px`)
    dialog.style.setProperty('--dialog-dir-y', `${direction.y}px`)
    return
  }
  dialog.style.setProperty('--dialog-dir-x', '0px')
  dialog.style.setProperty('--dialog-dir-y', '16px')
}

function lockScroll(): void {
  isScrollLocked.value = true
}

function unlockScroll(): void {
  isScrollLocked.value = false
}

const isDialogOpen = computed(() => {
  if (props.isInline)
    return false
  return dialogRef.value?.open ?? false
})

// 打开期间同时充当全局 toast 的挂载点。
const modalOutlet = createModalOutletHandle()
const attachModalOutlet = modalOutlet.attach
const detachModalOutlet = modalOutlet.detach

function initialFocusTarget(): HTMLElement | null {
  const dialog = dialogRef.value
  return dialog ? findInitialFocusTarget(dialog) : null
}

// 使用共享的焦点管理
useFocusTrap({
  container: dialogRef,
  isEnabled: isDialogOpen,
  initialFocus: initialFocusTarget,
})

// 焦点归还：打开时记下打开者；关闭时只救被困在对话框里（或掉到 body 上）的焦点，
// 调用方自己挪走的焦点不动。打开者没了就沿共用的候选链找落点，永远不落到 body。
let focusRecord: LayerFocusRecord | null = null

function returnFocus(record: LayerFocusRecord, dialog: HTMLDialogElement | null, wasStranded: boolean): void {
  if (wasStranded)
    restoreLayerFocus(record, { layer: dialog, name: 'Dialog' })
  record.stop()
}

function openDialog(): void {
  if (props.isInline)
    return
  const dialog = dialogRef.value
  if (!dialog || dialog.open)
    return
  // 对话框所在文档正拿着焦点时，打开者在那个文档里（iframe、画中画窗口里的控件）。
  const focusDocument = dialog.ownerDocument.hasFocus() ? dialog.ownerDocument : document
  triggerElement = focusDocument.activeElement as HTMLElement | null
  focusRecord?.stop()
  focusRecord = trackLayerFocus({
    getLayer: () => dialogRef.value,
    opener: triggerElement instanceof HTMLElement ? triggerElement : null,
  })
  applyEntryDirection(dialog)
  dialog.showModal()
  initialFocusTarget()?.focus({ preventScroll: true })
  attachModalOutlet(dialog)
  lockScroll()
}

function closeDialog(): void {
  if (props.isInline)
    return
  const dialog = dialogRef.value
  const record = focusRecord
  focusRecord = null
  // 关闭之前先看焦点是否被困住：原生 close() 自己也会挪焦点。
  const wasStranded = record != null && isLayerFocusStranded(record, dialog)
  if (dialog?.open)
    dialog.close()
  if (record != null)
    returnFocus(record, dialog, wasStranded)
  detachModalOutlet()
  unlockScroll()
}

function onCancel(event: Event): void {
  // 内部元素也会发 cancel：文件选择器被取消时就会冒上来，那不是关闭请求。
  if (event.target !== dialogRef.value)
    return
  // 阻止浏览器直接关闭，关闭权交给父组件通过 isOpen 决定。
  event.preventDefault()
  if (props.purpose !== 'required')
    emit('openChange', false)
}

// 只有按下和松手都在遮罩上、而且这一下没先关掉框里的弹出框，才算点遮罩。
const backdropPress = useBackdropPress(() => dialogRef.value, () => {
  if (props.purpose === 'info')
    emit('openChange', false)
})

watch(() => props.isOpen, (open) => {
  if (open)
    openDialog()
  else
    closeDialog()
}, { flush: 'post' })

onMounted(() => {
  if (props.isOpen)
    openDialog()
})

onBeforeUnmount(() => {
  detachModalOutlet()
  unlockScroll()
  // 打开着就被卸载（只在打开时渲染、或随整个视图一起移除）：等它离开文档后再把焦点送出去。
  const record = focusRecord
  focusRecord = null
  if (record == null)
    return
  const dialog = dialogRef.value
  const wasStranded = isLayerFocusStranded(record, dialog)
  queueMicrotask(() => returnFocus(record, null, wasStranded))
})
</script>

<template>
  <template v-if="isInline">
    <div
      v-if="isOpen"
      v-bind="rootAttrs()"
      class="astryx-dialog astryx-dialog--inline astryx-layer"
      :class="{ 'astryx-dialog--fullscreen': isFullscreen }"
      :data-variant="variant"
      :data-padded="padding == null ? undefined : ''"
      :aria-labelledby="resolvedLabelledBy()"
      :style="rootStyle"
    >
      <div class="astryx-dialog__inner" :style="innerStyle">
        <slot />
      </div>
    </div>
  </template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 遮罩点击只作用于原生 dialog 元素本身；Escape 由原生 cancel 事件处理。 -->
  <dialog
    v-else
    ref="dialogRef"
    v-bind="rootAttrs()"
    class="astryx-dialog astryx-layer"
    :class="{ 'astryx-dialog--fullscreen': isFullscreen }"
    :data-variant="variant"
    :data-padded="padding == null ? undefined : ''"
    :role="dialogRole"
    aria-modal="true"
    :aria-labelledby="resolvedLabelledBy()"
    :style="rootStyle"
    @pointerdown="backdropPress.onPointerDown"
    @click="backdropPress.onClick"
    @cancel="onCancel"
  >
    <div class="astryx-dialog__inner" :style="innerStyle">
      <slot />
    </div>
    <div ref="layerHostRef" class="astryx-dialog__layer-host" />
  </dialog>
</template>
