<script setup lang="ts">
import type { MobileNavEmits, MobileNavProps, MobileNavSide, MobileNavSlots } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useId, useTemplateRef, watch } from 'vue'
import { useScrollLock } from '../composables/internal/scrollLock.js'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useRestoreFocus } from '../composables/useRestoreFocus.js'
import { provideLayerDepth } from '../layer/layerDepth.js'
import { resetLayerScopedContext } from '../layer/scopedProvide.js'
import { useAstryxMessages } from '../locale/index.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { mobileNavKey } from './context.js'
import { useMobileNavLayer } from './useMobileNavLayer.js'
import '../../styles/mobile-nav.css'

defineOptions({ name: 'AstryxMobileNav' })

const props = withDefaults(defineProps<Omit<MobileNavProps, 'isOpen'>>(), {
  side: 'auto',
  width: 320,
})

const emit = defineEmits<Omit<MobileNavEmits, 'update:isOpen'>>()
defineSlots<MobileNavSlots>()

const messages = useAstryxMessages()

// 抽屉内容是这一层的成员边界：外面组里的尺寸、禁用、选中值都不再算数。
resetLayerScopedContext()
provideLayerDepth()

const isOpen = defineModel<boolean>('isOpen', { default: false })
const dialogRef = ref<HTMLDialogElement | null>(null)
const bodyEl = useTemplateRef<HTMLElement>('body')
useScrollbars(bodyEl)
const resolvedSide = ref<'start' | 'end'>(props.side === 'end' ? 'end' : 'start')
const generatedId = `astryx-mobile-nav-${useId()}`
const dialogId = computed(() => props.id || generatedId)
const labelId = computed(() => `${dialogId.value}-label`)

const accessibleName = computed(() => props.label || props.header || messages.value.nav.mobileNav)
const closing = ref(false)
const trapEnabled = computed(() => isOpen.value || closing.value)
const sideIsStart = computed(() => resolvedSide.value === 'start')
const CLOSE_DELAY_MS = 300
let closeTimer: ReturnType<typeof setTimeout> | undefined

useScrollLock(isOpen)
// 启用开关要一直开着。关掉时 shouldRestore 变 false，启用开关如果跟着一起关，焦点就回不去。
useRestoreFocus({ isEnabled: computed(() => true), shouldRestore: trapEnabled })
useFocusTrap({ container: dialogRef, isEnabled: trapEnabled })
provide(mobileNavKey, true)

const layer = useMobileNavLayer({
  getContainer: () => dialogRef.value,
  isOpen,
  onDismiss: () => setOpen(false),
})

function resolveSide(side: MobileNavSide): 'start' | 'end' {
  if (side === 'start' || side === 'end')
    return side
  const active = document.activeElement
  if (active instanceof HTMLElement && active !== document.body) {
    const rect = active.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    return center < window.innerWidth / 2 ? 'start' : 'end'
  }
  return 'start'
}

function clearCloseTimer(): void {
  if (closeTimer !== undefined)
    clearTimeout(closeTimer)
  closeTimer = undefined
}

function finishClose(dialog: HTMLDialogElement): void {
  clearCloseTimer()
  if (typeof dialog.close === 'function' && dialog.open)
    dialog.close()
  else
    dialog.removeAttribute('open')
  closing.value = false
}

function reduceMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function syncDialog(open: boolean): void {
  const dialog = dialogRef.value
  if (!dialog)
    return
  if (open) {
    clearCloseTimer()
    closing.value = false
    resolvedSide.value = resolveSide(props.side)
    if (typeof dialog.showModal === 'function' && !dialog.open)
      dialog.showModal()
    else
      dialog.setAttribute('open', '')
    return
  }
  if (!dialog.open || reduceMotion()) {
    finishClose(dialog)
    return
  }
  closing.value = true
  clearCloseTimer()
  closeTimer = setTimeout(finishClose, CLOSE_DELAY_MS, dialog)
}

function setOpen(next: boolean): void {
  if (isOpen.value === next)
    return
  isOpen.value = next
  emit('openChange', next)
}

function onCancel(event: Event): void {
  event.preventDefault()
  if (!layer.shouldCloseOnCancel())
    return
  setOpen(false)
}

function onDialogClick(event: MouseEvent): void {
  if (event.target === dialogRef.value)
    setOpen(false)
}

watch(isOpen, (open) => {
  // Keep the modal and its focus boundary alive while the exit animation runs.
  if (!open && dialogRef.value?.open && !reduceMotion())
    closing.value = true
  void nextTick(() => syncDialog(open))
})

onMounted(() => {
  if (isOpen.value)
    syncDialog(true)
})

onBeforeUnmount(() => {
  clearCloseTimer()
  const dialog = dialogRef.value
  if (dialog?.open && typeof dialog.close === 'function')
    dialog.close()
  closing.value = false
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点在 dialog 自身上等于点遮罩；键盘用户走原生 cancel。 -->
  <dialog
    :id="dialogId"
    ref="dialogRef"
    class="astryx-mobile-nav astryx-layer"
    :class="[
      sideIsStart ? 'astryx-mobile-nav--start' : 'astryx-mobile-nav--end',
      { 'astryx-mobile-nav--closing': closing },
    ]"
    :style="{ '--astryx-mobile-nav-width': `${width}px` }"
    aria-modal="true"
    :aria-labelledby="$slots.header || header ? labelId : undefined"
    :aria-label="$slots.header || header ? undefined : accessibleName"
    @cancel="onCancel"
    @click="onDialogClick"
  >
    <div class="astryx-mobile-nav__drawer">
      <div class="astryx-mobile-nav__header" :class="{ 'astryx-mobile-nav__header--end': !$slots.header && !header }">
        <div v-if="$slots.header || header" :id="labelId" class="astryx-mobile-nav__title">
          <slot name="header">
            {{ header }}
          </slot>
        </div>
        <button type="button" class="astryx-mobile-nav__close" :aria-label="messages.nav.close" @click="setOpen(false)">
          <span class="astryx-mobile-nav__close-glyph" aria-hidden="true" />
        </button>
      </div>
      <div ref="body" class="astryx-mobile-nav__body">
        <slot />
      </div>
    </div>
  </dialog>
</template>
