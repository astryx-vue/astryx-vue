<script setup lang="ts">
import type { PlainDate } from '@astryx-vue/core'
import type { VNodeChild } from 'vue'
import type { CalendarEvent, CalendarInstantEvent } from './types.js'
import { Heading, plainDateIsEqual, plainDateToISO, Text } from '@astryx-vue/core'
import { computed, inject, onMounted, shallowRef, watch } from 'vue'
import { useScheduleContext } from './context.js'
import { eventOccursOnDate, isAllDaySpan, isDayEvent } from './dateMath.js'
import EventPill from './EventPill.vue'
import {
  formatDayNumber,
  formatEventTime,
  formatEventTimeRange,
  formatFullDate,
  formatHour,
  formatTimezoneAbbreviation,
  formatWeekday,
  getEventCategory,
  isEventInPast,
} from './format.js'
import SchedulePopover from './SchedulePopover.vue'
import ScheduleTime from './ScheduleTime.vue'
import TimeGridA11y from './TimeGridA11y.vue'
import {
  blockKeyOf,
  eventIdFromBlockKey,
  formatEventButtonLabel,
  getAllDayEventSegments,
  getCurrentTimeTop,
  getTimedEventLayouts,
  timedBlockStyle,
} from './timeGridGeometry.js'
import { getInitialTimeGridOffset, isSameRangeKey, TimeGridScrollKey } from './timeGridScroll.js'
import { useCurrentTime } from './useCurrentTime.js'
import { useSchedulePopover } from './useSchedulePopover.js'
import { VNodeHost } from './VNodeHost.js'

defineOptions({ name: 'AstryxScheduleTimeGrid' })

const props = defineProps<{
  days: PlainDate[]
  events: ReadonlyArray<CalendarEvent>
  focusDate: PlainDate
  timezoneID: string
  minHour: number
  maxHour: number
  hourHeight: number
  label: string
  renderPopover?: (event: CalendarEvent) => VNodeChild
}>()

const ctx = useScheduleContext()
const currentTime = useCurrentTime()
const memory = inject(TimeGridScrollKey, null)
const viewport = shallowRef<HTMLDivElement | null>(null)

const minHour = computed(() => Math.max(0, Math.min(23, Math.floor(props.minHour))))
const maxHour = computed(() => Math.max(minHour.value + 1, Math.min(24, Math.floor(props.maxHour))))
const hours = computed(() => Array.from({ length: maxHour.value - minHour.value }, (_, index) => minHour.value + index))
const allDayEvents = computed(() => props.events.filter(isAllDaySpan))
const instantEvents = computed(() => props.events.filter((event): event is CalendarInstantEvent => !isAllDaySpan(event)))
const segments = computed(() => getAllDayEventSegments(allDayEvents.value, props.days, props.timezoneID))
const levels = computed(() => segments.value.reduce((count, segment) => Math.max(count, segment.level + 1), 0))
const timezoneLabel = computed(() => formatTimezoneAbbreviation(props.days[0] ?? props.focusDate, props.timezoneID, ctx.locale))
const hasPopover = computed(() => props.renderPopover != null)
const columnCount = computed(() => Math.max(1, props.days.length))
const rangeKey = computed(() => ({
  start: ctx.range.start,
  end: ctx.range.end,
  timezoneID: props.timezoneID,
  minHour: minHour.value,
  maxHour: maxHour.value,
  hourHeight: props.hourHeight,
}))

function layouts(day: PlainDate) {
  return getTimedEventLayouts({
    events: instantEvents.value.filter(event => eventOccursOnDate(event, day, props.timezoneID)),
    day,
    timezoneID: props.timezoneID,
    minHour: minHour.value,
    maxHour: maxHour.value,
  })
}

function past(event: CalendarEvent): boolean {
  return isEventInPast(event, currentTime.value, props.timezoneID)
}

function nowTop(day: PlainDate): number | null {
  if (currentTime.value === 0)
    return null
  return getCurrentTimeTop({
    currentTime: currentTime.value,
    day,
    timezoneID: props.timezoneID,
    minHour: minHour.value,
    maxHour: maxHour.value,
  })
}

function contentOf(event: CalendarEvent): VNodeChild | null {
  return props.renderPopover?.(event) ?? null
}

function labelOf(event: CalendarEvent, day: PlainDate): string {
  return formatEventButtonLabel(event, day, props.timezoneID, ctx.categories, ctx.locale)
}

function position(): void {
  const element = viewport.value
  if (element == null || currentTime.value === 0)
    return
  const key = rangeKey.value
  if (memory?.key != null && isSameRangeKey(memory.key, key)) {
    if (Math.abs(element.scrollTop - memory.offset) > 1)
      element.scrollTop = memory.offset
    return
  }
  if (element.scrollHeight <= element.clientHeight)
    return
  const offset = getInitialTimeGridOffset({
    currentTime: currentTime.value,
    days: props.days,
    timezoneID: props.timezoneID,
    minHour: minHour.value,
    hourHeight: props.hourHeight,
    scrollHeight: element.scrollHeight,
    clientHeight: element.clientHeight,
  })
  element.scrollTop = offset
  if (memory != null) {
    memory.key = key
    memory.offset = offset
  }
}

function onScroll(event: Event): void {
  const element = event.currentTarget
  if (!(element instanceof HTMLElement) || memory?.key == null || !isSameRangeKey(memory.key, rangeKey.value))
    return
  memory.offset = element.scrollTop
}

function onViewportKeydown(event: KeyboardEvent): void {
  const element = event.currentTarget
  if (!(element instanceof HTMLElement) || document.activeElement !== element)
    return
  const page = element.clientHeight || 240
  const delta = {
    ArrowDown: [0, 48],
    ArrowUp: [0, -48],
    ArrowRight: [48, 0],
    ArrowLeft: [-48, 0],
    PageDown: [0, page],
    PageUp: [0, -page],
  }[event.key]
  if (delta == null)
    return
  element.scrollLeft += delta[0]
  element.scrollTop += delta[1]
  event.preventDefault()
}

onMounted(position)
watch([currentTime, rangeKey, () => props.events], position)

const popover = useSchedulePopover(key => key == null
  ? props.label
  : props.events.find(event => event.id === eventIdFromBlockKey(key))?.title ?? props.label)
const openEvent = computed(() => {
  const key = popover.openKey.value
  return key == null ? undefined : props.events.find(event => event.id === eventIdFromBlockKey(key))
})
const openContent = computed(() => openEvent.value == null ? null : contentOf(openEvent.value))
</script>

<template>
  <TimeGridA11y
    v-if="!hasPopover"
    :all-day-events="allDayEvents"
    :categories="ctx.categories"
    :days="days"
    :events="instantEvents"
    :focus-date="focusDate"
    :hours="hours"
    :locale="ctx.locale"
    :timezone-i-d="timezoneID"
    :timezone-label="timezoneLabel"
  />
  <div class="astryx-schedule__time-frame">
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- role=region 加 tabindex 后，方向键和翻页键只滚动这一张时间格。 -->
    <div
      ref="viewport"
      class="astryx-schedule__time-grid"
      role="region"
      :aria-label="`${label} time grid`"
      tabindex="0"
      v-bind="popover.containerProps"
      @scroll="onScroll"
      @keydown="onViewportKeydown"
    >
      <div
        class="astryx-schedule__time-content"
        :style="{ '--days': String(columnCount), 'minWidth': `${60 + columnCount * 140}px` }"
      >
        <div class="astryx-schedule__time-corner" aria-hidden="true" />
        <div
          v-for="(day, index) in days"
          :key="plainDateToISO(day)"
          class="astryx-schedule__time-head"
          :class="{ 'is-last': index === days.length - 1 }"
          :style="{ gridColumn: String(index + 2) }"
          aria-hidden="true"
        >
          <Heading :level="ctx.headingLevel" color="secondary" display="block">
            <span class="astryx-schedule__time-head-line">
              {{ formatWeekday(day, 'short', ctx.locale) }}
              <span class="astryx-schedule__time-date" :class="{ 'is-current': plainDateIsEqual(day, focusDate) }">
                {{ formatDayNumber(day, ctx.locale) }}
              </span>
            </span>
          </Heading>
        </div>
        <div class="astryx-schedule__all-day-label" aria-hidden="true">
          <Text type="supporting" color="secondary" weight="bold">
            {{ timezoneLabel }}
          </Text>
        </div>
        <div
          class="astryx-schedule__all-day"
          :style="{ '--levels': String(levels) }"
          v-bind="hasPopover ? { 'role': 'group', 'aria-label': 'All-day events' } : { 'aria-hidden': 'true' }"
        >
          <div
            v-for="(day, index) in days"
            :key="`cell-${plainDateToISO(day)}`"
            class="astryx-schedule__all-day-cell"
            :class="{ 'is-last': index === days.length - 1 }"
            :style="{ gridColumn: String(index + 1) }"
            aria-hidden="true"
          />
          <div
            v-for="segment in segments"
            :key="`${segment.event.id}-${segment.columnStart}`"
            class="astryx-schedule__all-day-span"
            :style="{
              gridColumn: `${segment.columnStart + 1} / ${segment.columnEnd + 2}`,
              marginBlockStart: `${2 + segment.level * 27}px`,
            }"
          >
            <button
              v-if="hasPopover && contentOf(segment.event) != null"
              type="button"
              class="astryx-schedule__event-button"
              :aria-label="labelOf(segment.event, days[segment.columnStart] ?? focusDate)"
              :data-schedule-event-block="blockKeyOf(segment.event.id, plainDateToISO(days[segment.columnStart] ?? focusDate))"
              v-bind="popover.getTriggerProps(blockKeyOf(segment.event.id, plainDateToISO(days[segment.columnStart] ?? focusDate)))"
            >
              <EventPill
                :event="segment.event"
                :past="past(segment.event)"
                :lead="isDayEvent(segment.event) ? 'time' : 'title'"
                :time-label="isDayEvent(segment.event) ? null : formatEventTimeRange(segment.event, timezoneID, ctx.locale)"
              />
            </button>
            <div v-else :aria-label="hasPopover ? labelOf(segment.event, days[segment.columnStart] ?? focusDate) : undefined">
              <EventPill
                :event="segment.event"
                :past="past(segment.event)"
                :lead="isDayEvent(segment.event) ? 'time' : 'title'"
                :time-label="isDayEvent(segment.event) ? null : formatEventTimeRange(segment.event, timezoneID, ctx.locale)"
              />
            </div>
          </div>
        </div>
        <div class="astryx-schedule__hours" aria-hidden="true">
          <div
            v-for="(hour, index) in hours.slice(1)"
            :key="hour"
            class="astryx-schedule__hour"
            :style="{ top: `${(index + 1) * hourHeight - 1}px` }"
          >
            <ScheduleTime>{{ formatHour(hour, ctx.locale) }}</ScheduleTime>
          </div>
        </div>
        <div
          v-for="(day, index) in days"
          :key="`col-${plainDateToISO(day)}`"
          class="astryx-schedule__column"
          :class="{ 'is-last': index === days.length - 1 }"
          :style="{ 'gridColumn': String(index + 2), '--hour': `${hourHeight}px` }"
          v-bind="hasPopover ? { 'role': 'group', 'aria-label': formatFullDate(day, ctx.locale) } : { 'aria-hidden': 'true' }"
        >
          <div v-for="(hour, hourIndex) in hours" :key="hour" class="astryx-schedule__slot" :class="{ 'is-last': hourIndex === hours.length - 1 }" />
          <template v-for="block in layouts(day)" :key="block.event.id">
            <button
              v-if="hasPopover && contentOf(block.event) != null"
              type="button"
              class="astryx-schedule__event-button astryx-schedule__block"
              :data-color="getEventCategory(block.event, ctx.categories).color"
              :data-past="past(block.event) ? 'true' : undefined"
              :style="timedBlockStyle(block)"
              :aria-label="labelOf(block.event, day)"
              :data-schedule-event-block="blockKeyOf(block.event.id, plainDateToISO(day))"
              v-bind="popover.getTriggerProps(blockKeyOf(block.event.id, plainDateToISO(day)))"
            >
              <span class="astryx-schedule__pill-title">{{ block.event.title }}</span>
              <span class="astryx-schedule__event-time">
                <ScheduleTime>{{ formatEventTime(block.event, day, timezoneID, ctx.locale) }}</ScheduleTime>
              </span>
            </button>
            <div
              v-else
              class="astryx-schedule__block"
              :data-color="getEventCategory(block.event, ctx.categories).color"
              :data-past="past(block.event) ? 'true' : undefined"
              :style="timedBlockStyle(block)"
              :aria-label="hasPopover ? labelOf(block.event, day) : undefined"
            >
              <span class="astryx-schedule__pill-title">{{ block.event.title }}</span>
              <span class="astryx-schedule__event-time">
                <ScheduleTime>{{ formatEventTime(block.event, day, timezoneID, ctx.locale) }}</ScheduleTime>
              </span>
            </div>
          </template>
          <div v-if="nowTop(day) != null" class="astryx-schedule__now" :style="{ top: `calc(${nowTop(day)}% + 2px)` }" aria-hidden="true" />
        </div>
      </div>
    </div>
    <div class="astryx-schedule__time-ring" aria-hidden="true" />
  </div>
  <SchedulePopover v-if="hasPopover" :popover="popover">
    <div v-if="openContent != null" :aria-label="`${openEvent?.title ?? label} details`">
      <VNodeHost :nodes="openContent" />
    </div>
  </SchedulePopover>
</template>
