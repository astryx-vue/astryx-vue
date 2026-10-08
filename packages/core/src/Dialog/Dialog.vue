<script setup lang="ts">
import type { DialogPadding, DialogProps } from './types.js'
import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { DIALOG_CONTEXT_KEY } from './context.js'
import { formatDialogSize, resolveDialogPositionOffsets } from './position.js'
import '../../styles/dialog.css'

defineOptions({ name: 'AstryxDialog', inheritAttrs: false })
const props = withDefaults(defineProps<DialogProps>(), {
  isInline: false,
  width: 400,
  maxHeight: '75dvh',
  position: undefined,
  variant: 'standard',
  purpose: 'info',
  padding: undefined,
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()
const attrs = useAttrs()

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
let triggerElement: HTMLElement | null = null
let previousBodyOverflow: string | null = null

const isFullscreen = computed(() => props.variant === 'fullscreen')
const dialogRole = computed(() => (props.purpose === 'required' ? 'alertdialog' : undefined))

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
  const dx = rect.left + rect.width / 2 - window.innerWidth / 2
  const dy = rect.top + rect.height / 2 - window.innerHeight / 2
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
  if (previousBodyOverflow !== null)
    return
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function unlockScroll(): void {
  if (previousBodyOverflow === null)
    return
  document.body.style.overflow = previousBodyOverflow
  previousBodyOverflow = null
}

/** 先使对话框进入模态，再应用焦点请求。显式请求优先于标题默认焦点。 */
function focusInitialTarget(dialog: HTMLDialogElement): void {
  const target = dialog.querySelector<HTMLElement>('[data-autofocus]')
    ?? dialog.querySelector<HTMLElement>('[data-dialog-default-focus]')
  target?.focus()
}

function openDialog(): void {
  if (props.isInline)
    return
  const dialog = dialogRef.value
  if (!dialog || dialog.open)
    return
  triggerElement = document.activeElement as HTMLElement | null
  applyEntryDirection(dialog)
  dialog.showModal()
  lockScroll()
  focusInitialTarget(dialog)
}

function closeDialog(): void {
  if (props.isInline)
    return
  const dialog = dialogRef.value
  if (dialog?.open)
    dialog.close()
  unlockScroll()
  const trigger = triggerElement
  triggerElement = null
  if (trigger?.isConnected)
    trigger.focus()
}

function onCancel(event: Event): void {
  // 阻止浏览器直接关闭，关闭权交给父组件通过 isOpen 决定。
  event.preventDefault()
  if (props.purpose !== 'required')
    emit('openChange', false)
}

function onBackdropClick(event: MouseEvent): void {
  if (event.target === event.currentTarget && props.purpose === 'info')
    emit('openChange', false)
}

watch(() => props.isOpen, (open) => {
  if (open)
    openDialog()
  else
    closeDialog()
})

onMounted(() => {
  if (props.isOpen)
    openDialog()
})

onBeforeUnmount(() => {
  unlockScroll()
})
</script>

<template>
  <template v-if="isInline">
    <div
      v-if="isOpen"
      v-bind="rootAttrs()"
      class="astryx-dialog astryx-dialog--inline"
      :class="{ 'astryx-dialog--fullscreen': isFullscreen }"
      :data-variant="variant"
      :data-padded="padding == null ? undefined : ''"
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
    class="astryx-dialog"
    :class="{ 'astryx-dialog--fullscreen': isFullscreen }"
    :data-variant="variant"
    :data-padded="padding == null ? undefined : ''"
    :role="dialogRole"
    aria-modal="true"
    :aria-labelledby="resolvedLabelledBy()"
    :style="rootStyle"
    @click="onBackdropClick"
    @cancel="onCancel"
  >
    <div class="astryx-dialog__inner" :style="innerStyle">
      <slot />
    </div>
  </dialog>
</template>
