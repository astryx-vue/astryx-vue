<script setup lang="ts">
import type { TextColor } from '../Text/types.js'
import type { TimestampTooltipLine } from './tooltipEntries.js'
import type { TimestampFormat, TimestampProps } from './types.js'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
// 服务端渲染（含静态预渲染）和 hydration 这一趟都不能读当前时间，否则同一份值
// 会写出依赖渲染时刻和时区的 HTML。依赖时钟的格式先渲染完整的 UTC 日期时间，
// 客户端挂载后再换成正常输出；绝对格式自始至终不读时钟。
const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

function parseValue(value: string | number): Date {
  if (typeof value === 'number')
    return new Date(value < 1e12 ? value * 1000 : value)
  return new Date(value)
}

const date = computed(() => parseValue(props.value))
const valid = computed(() => !Number.isNaN(date.value.getTime()))
const iso = computed(() => valid.value ? date.value.toISOString() : '')

function isRelative(format: TimestampFormat): boolean {
  return format === 'relative' || format === 'relative_short'
}

/** 相对读数和按新旧切换的 auto 都取决于当前时间，其余格式只看值本身。 */
const readsClock = computed(() => props.format === 'auto' || isRelative(props.format))

/**
 * 只有客户端能读时钟：服务端没有 onMounted，hydration 那一趟也在 onMounted 之前。
 * 挂载时读一次，之后 format 换成依赖时钟的格式时再补读。
 */
function readClock(): void {
  if (readsClock.value && now.value === null)
    now.value = new Date()
}

onMounted(readClock)
watch(() => props.format, readClock)

const isClockPending = computed(() => readsClock.value && now.value === null)

const diffSeconds = computed(() => now.value === null ? 0 : Math.round((now.value.getTime() - date.value.getTime()) / 1000))

const effectiveFormat = computed<TimestampFormat>(() => {
  // 还没读到时钟时（服务端渲染、hydration）一律按完整日期时间渲染。
  if (isClockPending.value)
    return 'date_time'
  if (props.format !== 'auto')
    return props.format
  return Math.abs(diffSeconds.value) <= props.autoThreshold ? 'relative' : 'date_time'
})

const displayText = computed(() => {
  if (!valid.value)
    return ''
  const format = effectiveFormat.value
  if (format === 'relative')
    return formatRelativeTime(date.value, now.value ?? date.value, locale.value, 'long')
  if (format === 'relative_short')
    return formatRelativeTime(date.value, now.value ?? date.value, locale.value, 'narrow')
  if (format === 'auto')
    return ''
  // 占位文本写成带标签的 UTC，服务端和时区不同的客户端才会得到同一段文本。
  return formatInstant(date.value, format, locale.value, isClockPending.value
    ? { timeZone: 'UTC', isTimezoneShown: true }
    : { isTimezoneShown: props.isTimezoneShown })
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
