<script setup lang="ts">
import type { TextColor } from '../Text/types.js'
import type { TimestampTooltipLine } from './tooltipEntries.js'
import type { TimestampFormat, TimestampProps } from './types.js'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/context.js'
import Text from '../Text/Text.vue'
import { formatInstant } from './formatInstant.js'
import { formatRelativeTime } from './formatRelativeTime.js'
import TimestampHoverCard from './TimestampHoverCard.vue'
import { formatTooltipLines } from './tooltipEntries.js'
import '../../styles/timestamp.css'

defineOptions({ name: 'AstryxTimestamp', inheritAttrs: false })

const props = withDefaults(defineProps<TimestampProps>(), {
  format: 'auto',
  autoThreshold: 7 * 86400,
  hasTooltip: true,
  isTimezoneShown: false,
  isLive: false,
  type: 'supporting',
  color: 'secondary',
})

const locale = useAstryxLocale()
const messages = useAstryxMessages()
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

function parseValue(value: string | number): Date {
  if (typeof value === 'number')
    return new Date(value < 1e12 ? value * 1000 : value)
  return new Date(value)
}

const date = computed(() => parseValue(props.value))
const valid = computed(() => !Number.isNaN(date.value.getTime()))
const iso = computed(() => valid.value ? date.value.toISOString() : '')

const diffSeconds = computed(() => Math.round((now.value.getTime() - date.value.getTime()) / 1000))

const effectiveFormat = computed<TimestampFormat>(() => {
  if (props.format !== 'auto')
    return props.format
  return Math.abs(diffSeconds.value) <= props.autoThreshold ? 'relative' : 'date_time'
})

function isRelative(format: TimestampFormat): boolean {
  return format === 'relative' || format === 'relative_short'
}

const displayText = computed(() => {
  if (!valid.value)
    return ''
  const format = effectiveFormat.value
  if (format === 'relative')
    return formatRelativeTime(date.value, now.value, locale.value, 'long')
  if (format === 'relative_short')
    return formatRelativeTime(date.value, now.value, locale.value, 'narrow')
  if (format === 'auto')
    return ''
  return formatInstant(date.value, format, locale.value, { isTimezoneShown: props.isTimezoneShown })
})

const ariaLabel = computed(() => valid.value && isRelative(effectiveFormat.value)
  ? formatInstant(date.value, 'full', locale.value, { timeZoneNameStyle: 'long' })
  : undefined)

const entries = computed(() => props.tooltipEntries != null && props.tooltipEntries.length > 0
  ? props.tooltipEntries
  : undefined)

const showTooltip = computed(() => props.hasTooltip && valid.value && (isRelative(effectiveFormat.value) || entries.value != null))

const lines = computed<TimestampTooltipLine[]>(() => {
  if (!valid.value)
    return []
  if (entries.value == null)
    return [{ value: formatInstant(date.value, 'full', locale.value), isCopyable: true }]
  return formatTooltipLines(date.value, entries.value, locale.value)
})

const textColor = computed<TextColor>(() => props.color === 'disabled' ? 'inherit' : props.color)

function liveInterval(seconds: number): number {
  const abs = Math.abs(seconds)
  if (abs < 60)
    return 1000
  if (abs < 3600)
    return 30_000
  if (abs < 86400)
    return 60_000
  return 300_000
}

function stop() {
  clearInterval(timer)
  timer = undefined
}

watch([() => props.isLive, effectiveFormat, diffSeconds, valid], () => {
  stop()
  if (!props.isLive || !valid.value || !isRelative(effectiveFormat.value))
    return
  timer = setInterval(() => {
    now.value = new Date()
  }, liveInterval(diffSeconds.value))
}, { immediate: true })

onBeforeUnmount(stop)
</script>

<template>
  <TimestampHoverCard
    v-if="valid && showTooltip"
    :lines="lines"
    :label="messages.timestamp.detailsLabel"
  >
    <Text
      class="astryx-timestamp"
      :class="$attrs.class"
      :style="$attrs.style"
      :type="type"
      :size="size"
      :color="textColor"
      :weight="weight"
      :data-color="color"
      :data-format="effectiveFormat"
    >
      <time
        class="astryx-timestamp__time"
        :datetime="iso"
        :aria-label="ariaLabel"
        :tabindex="showTooltip ? 0 : undefined"
      >{{ displayText }}</time>
    </Text>
  </TimestampHoverCard>
  <Text
    v-else-if="valid"
    class="astryx-timestamp"
    :class="$attrs.class"
    :style="$attrs.style"
    :type="type"
    :size="size"
    :color="textColor"
    :weight="weight"
    :data-color="color"
    :data-format="effectiveFormat"
  >
    <time class="astryx-timestamp__time" :datetime="iso" :aria-label="ariaLabel">{{ displayText }}</time>
  </Text>
</template>
