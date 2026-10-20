<script setup lang="ts">
import type { MobileNavEmits, MobileNavProps, MobileNavSide, MobileNavSlots } from './types.js'
import { computed, nextTick, onMounted, provide, ref, useId, useTemplateRef, watch } from 'vue'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useRestoreFocus } from '../composables/useRestoreFocus.js'
import { useAstryxMessages } from '../locale/index.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { mobileNavKey } from './context.js'
import '../../styles/mobile-nav.css'

defineOptions({ name: 'AstryxMobileNav' })

const props = withDefaults(defineProps<Omit<MobileNavProps, 'isOpen'>>(), {
  side: 'auto',
  width: 320,
})

const emit = defineEmits<Omit<MobileNavEmits, 'update:isOpen'>>()
defineSlots<MobileNavSlots>()

const messages = useAstryxMessages()
const isOpen = defineModel<boolean>('isOpen', { default: false })
const dialogRef = ref<HTMLDialogElement | null>(null)
const bodyEl = useTemplateRef<HTMLElement>('body')
useScrollbars(bodyEl)
const resolvedSide = ref<'start' | 'end'>(props.side === 'end' ? 'end' : 'start')
const generatedId = `astryx-mobile-nav-${useId()}`
const dialogId = computed(() => props.id || generatedId)
const labelId = computed(() => `${dialogId.value}-label`)
let previousOverflow = ''

const accessibleName = computed(() => props.label || props.header || messages.value.nav.mobileNav)
const trapEnabled = computed(() => isOpen.value)
const sideIsStart = computed(() => resolvedSide.value === 'start')

useRestoreFocus({ isEnabled: trapEnabled, shouldRestore: trapEnabled })
useFocusTrap({ container: dialogRef, isEnabled: trapEnabled })
provide(mobileNavKey, true)

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

function lockScroll(lock: boolean): void {
  if (typeof document === 'undefined')
    return
  if (lock) {
    previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'clip'
    return
  }
  document.documentElement.style.overflow = previousOverflow
}

function syncDialog(open: boolean): void {
  const dialog = dialogRef.value
  if (!dialog)
    return
  if (open) {
    resolvedSide.value = resolveSide(props.side)
    lockScroll(true)
    if (typeof dialog.showModal === 'function' && !dialog.open)
      dialog.showModal()
    else
      dialog.setAttribute('open', '')
    return
  }
  lockScroll(false)
  if (typeof dialog.close === 'function' && dialog.open)
    dialog.close()
  else
    dialog.removeAttribute('open')
}

function setOpen(next: boolean): void {
  if (isOpen.value === next)
    return
  isOpen.value = next
  emit('openChange', next)
}

function onCancel(event: Event): void {
  event.preventDefault()
  setOpen(false)
}

function onDialogClick(event: MouseEvent): void {
  if (event.target === dialogRef.value)
    setOpen(false)
}

watch(isOpen, (open) => {
  void nextTick(() => syncDialog(open))
})

onMounted(() => {
  if (isOpen.value)
    syncDialog(true)
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点在 dialog 自身上等于点遮罩；键盘用户走原生 cancel。 -->
  <dialog
    :id="dialogId"
    ref="dialogRef"
    class="astryx-mobile-nav"
    :class="sideIsStart ? 'astryx-mobile-nav--start' : 'astryx-mobile-nav--end'"
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
