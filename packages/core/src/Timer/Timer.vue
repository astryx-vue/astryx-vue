<script setup lang="ts">
import type { TextColor } from '../Text/types.js'
import type { TimerProps } from './types.js'
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import Text from '../Text/Text.vue'
import { getElapsedMilliseconds, getMillisecondsUntilNextChange, getPresentation, resolveTimerFormat } from './format.js'
import '../../styles/timer.css'

defineOptions({ name: 'AstryxTimer', inheritAttrs: false })

const props = withDefaults(defineProps<TimerProps>(), {
  format: 'elapsed',
  type: 'supporting',
  color: 'secondary',
})

const timeEl = useTemplateRef<HTMLTimeElement>('time')
const mountTime = Date.now()
let timeoutId: ReturnType<typeof setTimeout> | undefined

const inheritsType = computed(() => props.type === 'inherit')
const textColor = computed<TextColor>(() => props.color === 'disabled' ? 'inherit' : props.color)
const textType = computed(() => props.type === 'inherit' ? 'supporting' : props.type)

function stop(): void {
  if (timeoutId !== undefined)
    clearTimeout(timeoutId)
  timeoutId = undefined
}

function tick(): void {
  const start = props.startTime !== undefined && Number.isFinite(props.startTime)
    ? props.startTime
    : mountTime
  const now = Date.now()
  const elapsed = getElapsedMilliseconds(now, start)
  const presentation = getPresentation(elapsed, resolveTimerFormat(props.format))
  const node = timeEl.value
  if (node != null) {
    if (node.textContent !== presentation.text)
      node.textContent = presentation.text
    if (node.dateTime !== presentation.dateTime)
      node.dateTime = presentation.dateTime
  }
  timeoutId = setTimeout(tick, getMillisecondsUntilNextChange(now, start, elapsed, resolveTimerFormat(props.format)))
}

function start(): void {
  stop()
  tick()
}

onMounted(start)
watch(() => [props.startTime, props.format] as const, start)
onBeforeUnmount(stop)
</script>

<template>
  <Text
    v-if="!inheritsType"
    class="astryx-timer"
    :class="$attrs.class"
    :style="$attrs.style"
    :type="textType"
    :size="size"
    :color="textColor"
    :weight="weight"
    :data-color="color"
    data-component="timer"
  >
    <time ref="time" class="astryx-timer__time" datetime="PT0S">0s</time>
  </Text>
  <time
    v-else
    ref="time"
    class="astryx-timer astryx-timer__time"
    :class="$attrs.class"
    :style="$attrs.style"
    :data-color="color"
    data-component="timer"
    datetime="PT0S"
  >0s</time>
</template>
