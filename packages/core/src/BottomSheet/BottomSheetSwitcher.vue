<script setup lang="ts">
import type { BottomSheetRegistration } from './switcher.js'
import type { BottomSheetPurpose } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useScrollLock } from '../composables/useScrollLock.js'
import { bottomSheetSwitcherKey } from './switcher.js'
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
    if (props.hasScrim)
      element.showModal()
    else
      element.show()
  }
  isScrollLocked.value = props.hasScrim
  void nextTick(() => {
    const panel = activeElement.value
    if (!panel)
      return
    const autofocus = panel.querySelector<HTMLElement>('[data-autofocus]')
    ;(autofocus ?? panel).focus({ preventScroll: true })
  })
}

function closeDialog(): void {
  dialog.value?.close()
  isScrollLocked.value = false
  retainedId.value = null
  alignmentOffset.value = 0
}

function requestClose(): void {
  if (flowPurpose.value === 'required')
    return
  setActive(null)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.isComposing)
    return
  event.preventDefault()
  requestClose()
}

function onCancel(event: Event): void {
  emit('cancel', event)
  // 原生 <dialog> 的 cancel 会自己关掉对话框，所以这里先拦下来；
  // 消费者已经 preventDefault 时视为不同意关闭。
  if (event.defaultPrevented)
    return
  event.preventDefault()
  requestClose()
}

function onDialogClick(event: MouseEvent): void {
  if (event.target !== event.currentTarget)
    return
  if (props.hasScrim && flowPurpose.value === 'info')
    setActive(null)
}

watch(activeSheet, (id) => {
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
    :aria-label="dialogLabel"
    :aria-modal="hasScrim && activeSheet != null ? 'true' : undefined"
    @cancel="onCancel"
    @click="onDialogClick"
    @keydown="onKeydown"
  >
    <slot />
  </dialog>
</template>
