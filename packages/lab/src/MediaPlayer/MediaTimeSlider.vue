<script setup lang="ts">
import type { MediaTimeSliderProps } from './types.js'
import { Slider, useAstryxLocale } from '@astryx-vue/core'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useMediaPlaybackTime, useMediaPlayerContext } from './context.js'
import { formatClock, formatSpokenTime } from './mediaFormat.js'
import MediaTimelineMarker from './MediaTimelineMarker.vue'
import { useMediaPlayerMessages } from './messages.js'
import {
  createTimelineScale,
  findChapter,
  findMarker,
  findMarkersNear,
  MARKER_SPOKEN_REACH,
  sortChapters,
  TIMELINE_KEY_OFFSETS,
  timelineSegments,
} from './timeline.js'

/**
 * 时间轴。拖动时预览时间、松手才跳；方向键跳 5 秒，Page Up / Page Down 跳 10 秒。
 * 时间轴在任何书写方向下都从左往右，因为它表示的是媒体的方向，不是阅读顺序。
 * 轨道上画出已缓冲的范围，以及可选的章节和标记。指针悬停时预览时间、章节和最近的标记。
 */
defineOptions({ name: 'AstryxMediaTimeSlider', inheritAttrs: false })
const props = defineProps<MediaTimeSliderProps>()

const { store, scrubTime, holdControls, wakeControls } = useMediaPlayerContext('MediaTimeSlider')
const messages = useMediaPlayerMessages()
const locale = useAstryxLocale()
const playbackTime = useMediaPlaybackTime()
const duration = computed(() => store.state.value.duration)
const bufferedEnd = computed(() => store.state.value.bufferedEnd)
const isSeekable = computed(() => Number.isFinite(duration.value) && duration.value > 0)
const value = computed(() => isSeekable.value ? Math.min(scrubTime.value ?? playbackTime.value, duration.value) : 0)
const chapters = computed(() => sortChapters(props.chapters))
const markers = computed(() => props.markers ?? [])

const wrapper = ref<HTMLDivElement | null>(null)
const width = ref(0)
const previewX = ref<number | null>(null)
let isPointerDown = false
let pendingTime: number | null = null
// 时间轴的左边缘，每次悬停只量一次：播放时播放头每帧都在重画，不能每次指针移动都量。尺寸变化或滚动后作废。
let wrapperLeft: number | null = null
let resizeObserver: ResizeObserver | null = null

function dropWrapperLeft(): void {
  wrapperLeft = null
}

watch(wrapper, (element) => {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (element == null)
    return
  width.value = element.clientWidth
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(() => {
      wrapperLeft = null
      width.value = element.clientWidth
    })
    resizeObserver.observe(element)
  }
}, { flush: 'post' })

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', dropWrapperLeft, { capture: true })
})

const scale = computed(() => createTimelineScale(width.value, duration.value))
const segments = computed(() => timelineSegments(width.value, duration.value, chapters.value, scale.value))
const playedX = computed(() => scale.value.toX(value.value))
const bufferedX = computed(() => bufferedEnd.value > 0 ? scale.value.toX(bufferedEnd.value) : 0)
const dotMarkers = computed(() => isSeekable.value ? markers.value.filter(marker => marker.content == null) : [])
const buttonMarkers = computed(() => isSeekable.value ? markers.value.filter(marker => marker.content != null) : [])

const preview = computed(() => {
  const time = previewX.value != null ? scale.value.toTime(previewX.value) : scrubTime.value != null ? value.value : null
  const at = previewX.value ?? (scrubTime.value != null ? playedX.value : null)
  if (time == null || at == null)
    return null
  return {
    at,
    time: formatClock(time, duration.value >= 3600),
    chapter: findChapter(chapters.value, time)?.title,
    marker: findMarker(markers.value, time, scale.value.markerReachSeconds)?.label,
  }
})

function clampWidth(size: number, max: number): number {
  return Math.min(Math.max(size, 0), max)
}

/** 读屏念的值：「1 分 5 秒，共 2 分钟」，后面接上所在章节和附近的标记。 */
function spokenValue(time: number): string {
  const text = messages.value
  let spoken = text.timeValue(formatSpokenTime(time, locale.value), formatSpokenTime(duration.value, locale.value))
  const chapter = findChapter(chapters.value, time)
  if (chapter != null)
    spoken = text.timeValueContext(spoken, chapter.title)
  const reach = Math.max(scale.value.markerReachSeconds, MARKER_SPOKEN_REACH)
  for (const marker of findMarkersNear(markers.value, time, reach))
    spoken = text.timeValueContext(spoken, marker.label)
  return spoken
}

function onChange(time: number): void {
  if (isPointerDown) {
    pendingTime = time
    scrubTime.value = time
  }
  else {
    store.actions.seek(time)
  }
}

function commit(): void {
  const time = pendingTime
  isPointerDown = false
  pendingTime = null
  scrubTime.value = null
  holdControls('scrub', false)
  if (time != null)
    store.actions.seek(time)
}

function onPointerenter(): void {
  wrapperLeft = null
  window.addEventListener('scroll', dropWrapperLeft, { capture: true, passive: true })
}

function onPointermove(event: PointerEvent): void {
  const element = wrapper.value
  if (event.pointerType === 'touch' || element == null || !isSeekable.value)
    return
  wrapperLeft ??= element.getBoundingClientRect().left
  previewX.value = event.clientX - wrapperLeft
}

function onPointerleave(): void {
  previewX.value = null
  window.removeEventListener('scroll', dropWrapperLeft, { capture: true })
}

function onPointerdownCapture(): void {
  if (!isSeekable.value)
    return
  isPointerDown = true
  holdControls('scrub', true)
}

function onPointerEndCapture(): void {
  if (isPointerDown)
    commit()
}

// 只有滑块自己的键才跳，其他元素冒上来的键不管。
function onKeydownCapture(event: KeyboardEvent): void {
  const offset = TIMELINE_KEY_OFFSETS[event.key]
  const isSliderKey = event.target instanceof Element && event.target.getAttribute('role') === 'slider'
  if (offset == null || !isSliderKey || !isSeekable.value || event.altKey || event.ctrlKey || event.metaKey)
    return
  event.preventDefault()
  event.stopPropagation()
  store.actions.seekBy(offset)
  wakeControls()
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 这一层只接里面滑块冒上来的指针和按键，焦点在滑块上。 -->
  <div
    ref="wrapper"
    class="astryx-media-timeline"
    dir="ltr"
    @pointerenter="onPointerenter"
    @pointermove="onPointermove"
    @pointerleave="onPointerleave"
    @keydown.capture="onKeydownCapture"
    @pointerdown.capture="onPointerdownCapture"
    @pointerup.capture="onPointerEndCapture"
    @pointercancel.capture="onPointerEndCapture"
  >
    <div class="astryx-media-timeline__layer" :data-disabled="!isSeekable || undefined" aria-hidden="true">
      <div
        v-for="segment in segments"
        :key="segment.start"
        class="astryx-media-timeline__segment"
        :style="{ insetInlineStart: `${segment.start}px`, width: `${segment.width}px` }"
      >
        <div class="astryx-media-timeline__buffered" :style="{ width: `${clampWidth(bufferedX - segment.start, segment.width)}px` }" />
        <div class="astryx-media-timeline__played" :style="{ width: `${clampWidth(playedX - segment.start, segment.width)}px` }" />
      </div>
      <div
        v-for="marker in dotMarkers"
        :key="`${marker.time}-${marker.label}`"
        class="astryx-media-timeline__marker"
        data-media-marker=""
        :style="{ insetInlineStart: `${scale.toX(marker.time)}px` }"
      />
      <div class="astryx-media-timeline__thumb" :style="{ insetInlineStart: `${playedX}px` }" />
      <div v-if="preview" class="astryx-media-timeline__preview" :style="{ insetInlineStart: `${preview.at}px` }">
        <span class="astryx-media-timeline__preview-time">{{ preview.time }}</span>
        <span v-if="preview.chapter != null" class="astryx-media-timeline__preview-line">{{ preview.chapter }}</span>
        <span v-if="preview.marker != null" class="astryx-media-timeline__preview-line">{{ preview.marker }}</span>
      </div>
    </div>
    <div class="astryx-media-timeline__slider">
      <Slider
        v-bind="$attrs"
        class="astryx-media-time-slider"
        :model-value="value"
        :label="messages.seek"
        is-label-hidden
        :min="0"
        :max="isSeekable ? duration : 1"
        :step="0.01"
        :is-disabled="!isSeekable"
        value-display="none"
        :format-value="spokenValue"
        width="100%"
        @change="onChange"
      />
    </div>
    <div v-if="buttonMarkers.length > 0" class="astryx-media-timeline__marker-buttons">
      <MediaTimelineMarker
        v-for="marker in buttonMarkers"
        :key="`${marker.time}-${marker.label}`"
        :marker="marker"
        :x="scale.toX(marker.time)"
        @press="store.actions.seek(marker.time)"
        @open-change="isOpen => holdControls('menu', isOpen)"
      />
    </div>
  </div>
</template>
