<script setup lang="ts">
import type { DismissEscape } from '../layer/dismissStack.js'
import type { LayerFocusRecord } from '../layer/layerFocusReturn.js'
import type { BottomSheetRegistration } from './switcher.js'
import type { BottomSheetPurpose } from './types.js'
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useScrollLock } from '../composables/useScrollLock.js'
import { isLayerFocusStranded, restoreLayerFocus, trackLayerFocus } from '../layer/layerFocusReturn.js'
import { isImeKeyEvent } from '../utils/ime.js'
import { focusSheetOnOpen } from './focusSheetPanel.js'
import { bottomSheetSwitcherKey } from './switcher.js'
import { useSheetLayerDismiss } from './useSheetLayerDismiss.js'
import '../../styles/bottom-sheet.css'

defineOptions({ name: 'AstryxBottomSheetSwitcher', inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** 整段流程的无障碍名。不传时用当前那张底栏的 `label`。 */
  label?: string
  /**
   * 整段流程怎么被关掉。不传时跟当前那张底栏的 `purpose` 走。
   */
  purpose?: BottomSheetPurpose
  /**
   * 是否给整段流程一块遮罩。换页时遮罩留着，直到流程关掉。
   * @default true
   */
  hasScrim?: boolean
}>(), {
  hasScrim: true,
})

const emit = defineEmits<{
  /**
   * 原生 dialog 收到取消请求时先发这个事件。调用 `event.preventDefault()`
   * 可以留住这段流程，不让它关掉。
   */
  cancel: [event: Event]
}>()

const activeSheet = defineModel<string | null>('activeSheet', { default: null })
const retainedId = ref<string | null>(null)
const alignmentOffset = ref(0)
const sheets = shallowRef(new Map<string, BottomSheetRegistration>())
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const isScrollLocked = ref(false)
// 服务端渲染时就有一步开着的流程，水合后直接以静止状态呈现；换过一次步骤后恢复动效。
const isSettled = ref(getCurrentInstance()?.vnode.el != null && activeSheet.value != null)
// 打开期间跟着焦点：关闭或被直接卸载时，把被困住的焦点送回打开者。
let focusRecord: LayerFocusRecord | null = null
let handoffTimer: ReturnType<typeof setTimeout> | undefined

useScrollLock(isScrollLocked)

function registration(id: string | null): BottomSheetRegistration | undefined {
  return id == null ? undefined : sheets.value.get(id)
}

const activeElement = computed(() => registration(activeSheet.value)?.getElement() ?? null)
const flowPurpose = computed(() => props.purpose ?? registration(activeSheet.value)?.purpose() ?? 'info')
const dialogLabel = computed(() => props.label ?? registration(activeSheet.value)?.label() ?? 'Bottom sheet')

useFocusTrap({
  container: activeElement,
  isEnabled: computed(() => activeSheet.value != null && props.hasScrim),
})

function setActive(id: string | null): void {
  const previous = activeSheet.value
  if (previous === id)
    return
  if (handoffTimer != null)
    clearTimeout(handoffTimer)
  if (previous != null && id != null) {
    retainedId.value = previous
    alignmentOffset.value = 0
    activeSheet.value = id
    void nextTick(() => {
      const previousHeight = registration(previous)?.getElement()?.offsetHeight ?? 0
      const nextHeight = registration(id)?.getElement()?.offsetHeight ?? 0
      alignmentOffset.value = Math.max(0, previousHeight - nextHeight)
    })
    handoffTimer = setTimeout(() => {
      if (retainedId.value === previous) {
        retainedId.value = null
        alignmentOffset.value = 0
      }
    }, 420)
    return
  }
  retainedId.value = null
  alignmentOffset.value = 0
  activeSheet.value = id
}

function register(id: string, entry: BottomSheetRegistration): void {
  const next = new Map(sheets.value)
  next.set(id, entry)
  sheets.value = next
}

function unregister(id: string): void {
  const next = new Map(sheets.value)
  next.delete(id)
  sheets.value = next
}

provide(bottomSheetSwitcherKey, {
  activeId: activeSheet,
  retainedId,
  alignmentOffset,
  setActive,
  register,
  unregister,
})

function openDialog(): void {
  const element = dialog.value
  if (!element)
    return
  if (!element.open) {
    focusRecord?.stop()
    focusRecord = trackLayerFocus({ getLayer: () => dialog.value })
    if (props.hasScrim)
      element.showModal()
    else
      element.show()
  }
  isScrollLocked.value = props.hasScrim
  void nextTick(() => focusSheetOnOpen(activeElement.value, true))
}

function returnFocus(record: LayerFocusRecord, wasStranded: boolean): void {
  if (wasStranded)
    restoreLayerFocus(record, { layer: null, name: 'BottomSheetSwitcher' })
  record.stop()
}

function closeDialog(): void {
  // 关闭之前先看焦点是否被困住：原生 close() 自己也会挪焦点。
  const record = focusRecord
  focusRecord = null
  const wasStranded = record != null && isLayerFocusStranded(record, dialog.value)
  dialog.value?.close()
  if (record != null)
    returnFocus(record, wasStranded)
  isScrollLocked.value = false
  retainedId.value = null
  alignmentOffset.value = 0
}

function requestClose(): void {
  if (flowPurpose.value === 'required')
    return
  setActive(null)
}

const flowVisible = computed(() => activeSheet.value != null || retainedId.value != null)
const layerEscape = computed<DismissEscape>(() => {
  if (activeSheet.value == null || flowPurpose.value === 'required')
    return 'block'
  if (!props.hasScrim)
    return 'ignore'
  return 'close'
})
const layer = useSheetLayerDismiss({
  isActive: flowVisible,
  escape: layerEscape,
  getContainer: () => dialog.value ?? null,
  isPresent: () => dialog.value?.open ?? false,
  onDismiss: requestClose,
})

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !layer.isTop())
    return
  event.preventDefault()
  if (isImeKeyEvent(event))
    return
  requestClose()
}

function onCancel(event: Event): void {
  // 内部元素也会发 cancel：文件选择器被取消时就会冒上来，那不是关闭请求。
  if (event.target !== dialog.value)
    return
  emit('cancel', event)
  // 原生 <dialog> 的 cancel 会自己关掉对话框，所以这里先拦下来；
  // 消费者已经 preventDefault 时视为不同意关闭。
  if (event.defaultPrevented)
    return
  event.preventDefault()
  if (!layer.isTop())
    return
  requestClose()
}

function onDialogClick(event: MouseEvent): void {
  if (event.target !== event.currentTarget)
    return
  if (props.hasScrim && flowPurpose.value === 'info')
    setActive(null)
}

watch(activeSheet, (id, previous) => {
  if (previous != null)
    isSettled.value = false
  if (id)
    openDialog()
  else
    closeDialog()
}, { flush: 'post' })

onMounted(() => {
  if (activeSheet.value)
    openDialog()
})

onBeforeUnmount(() => {
  const record = focusRecord
  focusRecord = null
  if (record != null) {
    const wasStranded = isLayerFocusStranded(record, dialog.value)
    queueMicrotask(() => returnFocus(record, wasStranded))
  }
  if (handoffTimer != null)
    clearTimeout(handoffTimer)
  isScrollLocked.value = false
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 点在对话框空白处才关闭；键盘用 Escape，不给对话框再加一个按钮。 -->
  <dialog
    v-bind="$attrs"
    ref="dialog"
    class="astryx-bottom-sheet-dialog astryx-bottom-sheet-switcher"
    :class="{
      'astryx-bottom-sheet-dialog--scrim': hasScrim,
      'astryx-bottom-sheet-dialog--closing': activeSheet == null,
    }"
    :data-settled="isSettled || undefined"
    :aria-label="dialogLabel"
    :aria-modal="isScrollLocked && activeSheet != null ? 'true' : undefined"
    @cancel="onCancel"
    @click="onDialogClick"
    @keydown="onKeydown"
  >
    <slot />
  </dialog>
</template>
