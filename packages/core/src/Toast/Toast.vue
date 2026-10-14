<script setup lang="ts">
import type { ToastOptions } from './types.js'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import '../../styles/toast.css'

const props = withDefaults(defineProps<ToastOptions & {
  /**
   * Set by the viewport once the toast is asked to close. Keeps the toast
   * mounted so it can play its exit transition.
   */
  isExiting?: boolean
}>(), {
  type: 'info',
  autoClose: true,
  duration: 5000,
  isExiting: false,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

defineSlots<{
  default: () => unknown
  end: () => unknown
}>()

const remaining = ref(props.duration)
const isPaused = ref(false)
const timer = ref<ReturnType<typeof setTimeout> | null>(null)
const startTime = ref<number | null>(null)

const isAlert = computed(() => props.type === 'error')
const role = computed(() => isAlert.value ? 'alert' : 'status')
const ariaLive = computed(() => isAlert.value ? 'assertive' : 'polite')

const classes = computed(() => [
  'astryx-toast',
  `astryx-toast--type-${props.type}`,
  { 'astryx-toast--exiting': props.isExiting },
])

function startTimer() {
  if (!props.autoClose || isPaused.value)
    return
  if (timer.value)
    clearTimeout(timer.value)
  startTime.value = Date.now()
  timer.value = setTimeout(() => {
    emit('close')
  }, remaining.value)
}

function pauseTimer() {
  if (!props.autoClose || isPaused.value)
    return
  isPaused.value = true
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  if (startTime.value != null) {
    const elapsed = Date.now() - startTime.value
    remaining.value = Math.max(remaining.value - elapsed, 0)
  }
}

function resumeTimer() {
  if (!props.autoClose || !isPaused.value)
    return
  isPaused.value = false
  startTimer()
}

function handleClose() {
  emit('close')
}

watch(() => props.isExiting, (exiting) => {
  if (!exiting || !timer.value)
    return
  clearTimeout(timer.value)
  timer.value = null
})

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer.value)
    clearTimeout(timer.value)
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- toast pauses auto-dismiss on hover/focus -->
  <div
    :class="classes"
    :role="role"
    :aria-live="ariaLive"
    aria-atomic="true"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
    @focusin="pauseTimer"
    @focusout="resumeTimer"
  >
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
      aria-label="Close"
      @click="handleClose"
    >
      ×
    </button>
  </div>
</template>
