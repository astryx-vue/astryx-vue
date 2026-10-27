<script setup lang="ts">
import type { ToastContentScope, ToastDismissReason, ToastOptions, ToastSlots } from './types.js'
import type { ToastGestureDirection } from './useToastGesture.js'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAstryxMessages } from '../locale/context.js'
import MediaTheme from '../Theme/MediaTheme.vue'
import { useTheme } from '../Theme/useTheme.js'
import { resolveAutoHide, resolveAutoHideDuration } from './options.js'
import { useToastGesture } from './useToastGesture.js'

import '../../styles/toast.css'

const props = withDefaults(defineProps<Omit<ToastOptions, 'onDismiss' | 'onHide'> & {
  /**
   * Set by the viewport once the toast is asked to close. Keeps the toast
   * mounted so it can play its exit transition.
   */
  isExiting?: boolean
  /**
   * 朝哪边滑出。1 向下，-1 向上。视口按提示贴在屏幕上沿还是下沿传入。
   */
  swipeDirection?: ToastGestureDirection
}>(), {
  type: 'info',
  isExiting: false,
  swipeDirection: 1,
  // `undefined` keeps an absent boolean prop absent instead of casting it to
  // false, so the resolved default can still follow the toast type.
  isAutoHide: undefined,
  autoClose: undefined,
})

const emit = defineEmits<{
  /** 卡片自己关掉了提示，带上原因。 */
  dismiss: [reason: ToastDismissReason]
  /** `dismiss` 的旧名字。 */
  close: []
}>()

defineSlots<ToastSlots>()

const duration = computed(() => resolveAutoHideDuration(props))
const autoHide = computed(() => resolveAutoHide(props))
const remaining = ref(duration.value)
const isPaused = ref(false)
const timer = ref<ReturnType<typeof setTimeout> | null>(null)
const startTime = ref<number | null>(null)

const isAlert = computed(() => props.type === 'error')
const role = computed(() => isAlert.value ? 'alert' : 'status')
const ariaLive = computed(() => isAlert.value ? 'assertive' : 'polite')
const messages = useAstryxMessages()
const theme = useTheme()
const mediaFallback = computed(() => isAlert.value || theme.mode.value === 'light' ? 'dark' : 'light')
const dismissLabel = computed(() => messages.value.toast.dismiss)

const classes = computed(() => [
  'astryx-toast',
  `astryx-toast--type-${props.type}`,
  { 'astryx-toast--exiting': props.isExiting },
])

// A pause never takes back more than the whole duration, but it also never
// leaves a toast that is already running with less than a second, so a short
// hover cannot expire it on the way out.
const MIN_REMAINING_MS = 1000

const contentScope = computed<ToastContentScope>(() => ({
  body: props.body,
  endContent: props.endContent,
  type: props.type,
  isAutoHide: autoHide.value,
  autoHideDuration: duration.value,
  dismiss: () => dismiss('manual'),
}))

function dismiss(reason: ToastDismissReason): void {
  emit('dismiss', reason)
  emit('close')
}

const gesture = useToastGesture({
  direction: () => props.swipeDirection,
  enabled: () => !props.isExiting,
  canPauseTimer: () => autoHide.value,
  isTimerPaused: () => isPaused.value,
  pauseTimer,
  resumeTimer,
  dismiss: () => dismiss('manual'),
})

function startTimer() {
  if (!autoHide.value || isPaused.value)
    return
  if (timer.value)
    clearTimeout(timer.value)
  startTime.value = Date.now()
  timer.value = setTimeout(() => {
    dismiss('auto')
  }, remaining.value)
}

function pauseTimer() {
  if (!autoHide.value || isPaused.value)
    return
  isPaused.value = true
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  if (startTime.value != null) {
    const elapsed = Date.now() - startTime.value
    remaining.value = Math.max(remaining.value - elapsed, MIN_REMAINING_MS)
  }
}

function resumeTimer() {
  if (!autoHide.value || !isPaused.value)
    return
  isPaused.value = false
  startTimer()
}

function handleClose() {
  dismiss('manual')
}

// A toast should not expire while the user is in another window or tab.
function onWindowBlur(): void {
  pauseTimer()
}

function onWindowFocus(): void {
  resumeTimer()
}

watch(() => props.isExiting, (exiting) => {
  if (!exiting || !timer.value)
    return
  clearTimeout(timer.value)
  timer.value = null
})

// A new duration restarts the countdown, so a toast that is already showing
// gets the full new time instead of the leftover of the old one.
watch(duration, (next) => {
  remaining.value = next
  startTimer()
})

onMounted(() => {
  startTimer()
  if (autoHide.value) {
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('focus', onWindowFocus)
  }
})

onUnmounted(() => {
  if (timer.value)
    clearTimeout(timer.value)
  window.removeEventListener('blur', onWindowBlur)
  window.removeEventListener('focus', onWindowFocus)
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- toast pauses auto-dismiss on hover/focus -->
  <div
    :ref="gesture.setRoot"
    :class="classes"
    :role="role"
    :aria-live="ariaLive"
    aria-atomic="true"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
    @focusin="pauseTimer"
    @focusout="resumeTimer"
    @pointerdown="gesture.onPointerDown"
    @pointermove="gesture.onPointerMove"
    @pointerup="gesture.onPointerUp"
    @pointercancel="gesture.onPointerCancel"
    @lostpointercapture="gesture.onPointerCancel"
  >
    <MediaTheme mode="auto" :fallback="mediaFallback" class="astryx-toast__surface">
      <slot v-if="$slots.content" name="content" v-bind="contentScope" />
      <template v-else>
        <span class="astryx-toast__body">
          <slot>{{ body }}</slot>
        </span>
        <span v-if="endContent || $slots.end" class="astryx-toast__end">
          <slot name="end">
            <component :is="endContent" v-if="endContent" />
          </slot>
        </span>
        <button
          type="button"
          class="astryx-toast__close"
          :aria-label="dismissLabel"
          @click="handleClose"
        >
          ×
        </button>
      </template>
    </MediaTheme>
  </div>
</template>
