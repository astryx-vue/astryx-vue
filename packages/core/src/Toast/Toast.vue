<script setup lang="ts">
import type { ToastContentScope, ToastDismissReason, ToastOptions, ToastSlots } from './types.js'
import type { ToastGestureDirection } from './useToastGesture.js'
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useComponentMessages } from '../locale/context.js'
import { toastMessages } from '../locale/messages/toast.js'
import MediaTheme from '../Theme/MediaTheme.vue'
import { useTheme } from '../Theme/useTheme.js'
import { TOAST_VIEWPORT_KEY } from './context.js'
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
  /**
   * 同一个 `uniqueID` 的新提示原地覆盖这张卡片时会变，自动关闭的计时随之重新开始。
   */
  timerKey?: number
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
// 悬停、焦点、手势、窗口失焦各自按住计时器，各自结束才算数：
// 只有最后一个条件放开，计时才继续。
type PauseSource = 'pointer' | 'focus' | 'gesture' | 'window'
const pauseSources = new Set<PauseSource>()
const timer = ref<ReturnType<typeof setTimeout> | null>(null)
const startTime = ref<number | null>(null)

const isAlert = computed(() => props.type === 'error')
// 只有视口里的卡片是 live 区域；单独渲染的 Toast 不带 live 角色。
const isInViewport = inject(TOAST_VIEWPORT_KEY, false)
const role = computed(() => isInViewport ? (isAlert.value ? 'alert' : 'status') : undefined)
const ariaLive = computed(() => isInViewport ? (isAlert.value ? 'assertive' : 'polite') : undefined)
const messages = useComponentMessages({ toast: toastMessages })
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
  isTimerPaused: () => pauseSources.has('gesture'),
  pauseTimer: () => pauseTimer('gesture'),
  resumeTimer: () => resumeTimer('gesture'),
  dismiss: () => dismiss('manual'),
})

function startTimer() {
  if (!autoHide.value || pauseSources.size > 0)
    return
  if (timer.value)
    clearTimeout(timer.value)
  startTime.value = Date.now()
  timer.value = setTimeout(() => {
    dismiss('auto')
  }, remaining.value)
}

function pauseTimer(source: PauseSource) {
  if (!autoHide.value)
    return
  const wasRunning = pauseSources.size === 0
  pauseSources.add(source)
  if (!wasRunning)
    return
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  if (startTime.value != null) {
    const elapsed = Date.now() - startTime.value
    remaining.value = Math.max(remaining.value - elapsed, MIN_REMAINING_MS)
  }
}

function resumeTimer(source: PauseSource) {
  if (!autoHide.value || !pauseSources.delete(source))
    return
  startTimer()
}

function handleClose() {
  dismiss('manual')
}

// A toast should not expire while the user is in another window or tab.
function onWindowBlur(): void {
  pauseTimer('window')
}

function onWindowFocus(): void {
  resumeTimer('window')
}

// 焦点从卡片里的控件上被移除（控件卸载不会触发失焦）时，放掉焦点这一路按住。
function onFocusOut(event: FocusEvent): void {
  const root = event.currentTarget as HTMLElement
  const next = event.relatedTarget
  if (next instanceof Node && root.contains(next))
    return
  resumeTimer('focus')
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

// 同一个 `uniqueID` 的新提示原地覆盖这张卡片：计时从头开始。
watch(() => props.timerKey, () => {
  remaining.value = duration.value
  startTimer()
})

onMounted(() => {
  startTimer()
  if (autoHide.value) {
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('focus', onWindowFocus)
    // 窗口在后台时弹出的提示收不到 blur 事件，从暂停开始，窗口下次获得焦点再继续。
    if (typeof document.hasFocus === 'function' && !document.hasFocus()) {
      pauseTimer('window')
    }
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
    @mouseenter="pauseTimer('pointer')"
    @mouseleave="resumeTimer('pointer')"
    @focusin="pauseTimer('focus')"
    @focusout="onFocusOut"
    @pointerdown="gesture.onPointerDown"
    @pointermove="gesture.onPointerMove"
    @pointerup="gesture.onPointerUp"
    @pointercancel="gesture.onPointerCancel"
    @lostpointercapture="gesture.onPointerCancel"
  >
    <MediaTheme mode="auto" :fallback="mediaFallback" class="astryx-toast__surface">
      <slot v-if="$slots.content" name="content" v-bind="contentScope" />
      <template v-else>
        <div class="astryx-toast__inner">
          <div class="astryx-toast__body">
            <slot>{{ body }}</slot>
          </div>
          <div class="astryx-toast__end">
            <slot name="end">
              <component :is="endContent" v-if="endContent" />
            </slot>
            <IconButton
              class="astryx-toast__close"
              variant="ghost"
              size="sm"
              :label="dismissLabel"
              @click="handleClose"
            >
              <Icon icon="close" size="sm" color="inherit" />
            </IconButton>
          </div>
        </div>
      </template>
    </MediaTheme>
  </div>
</template>
