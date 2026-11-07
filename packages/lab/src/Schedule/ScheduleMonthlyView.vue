<script setup lang="ts">
import type { PlainDate } from '@astryx-vue/core'
import type { MonthChipPlacement } from './monthLayout.js'
import type { ScheduleMonthlyViewOptions } from './monthlyView.js'
import type { CalendarEvent } from './types.js'
import { Heading, plainDateAddDays, plainDateAddMonths, plainDateIsEqual, plainDateSetFirstOfMonth, plainDateToISO, Text } from '@astryx-vue/core'
import { computed, shallowRef } from 'vue'
import { useScheduleContext } from './context.js'
import { enumerateDates } from './dateMath.js'
import { formatFullDate, formatWeekday, formatWeekRange, formatWeekTitle, isEventInPast } from './format.js'
import ListEventRow from './ListEventRow.vue'
import MonthCell from './MonthCell.vue'
import { layoutMonthEvents } from './monthLayout.js'
import { dayKey, formatMonthEventName, getMonthEventsByDay, getWeeks, parseKey, rowKey } from './monthModel.js'
import ScheduleFrame from './ScheduleFrame.vue'
import SchedulePopover from './SchedulePopover.vue'
import ScheduleTitle from './ScheduleTitle.vue'
import { useCurrentTime } from './useCurrentTime.js'
import { useSchedulePopover } from './useSchedulePopover.js'
import { VNodeHost } from './VNodeHost.js'

defineOptions({ name: 'AstryxScheduleMonthlyView' })

const props = defineProps<{ options: ScheduleMonthlyViewOptions }>()
const ctx = useScheduleContext()
const currentTime = useCurrentTime()
const tableRef = shallowRef<HTMLElement | null>(null)

const days = computed(() => enumerateDates(ctx.range.startDate, ctx.range.endDate))
const weeks = computed(() => getWeeks(days.value))
const layout = computed(() => layoutMonthEvents(ctx.events, days.value, ctx.timezoneID))
const overflowByDay = computed(() => new Map(layout.value.overflow.map(day => [day.dayIndex, day.count])))
const eventsByDay = computed(() => getMonthEventsByDay(ctx.events, days.value, ctx.timezoneID))
const chipsByDay = computed(() => {
  const map = new Map<number, MonthChipPlacement[]>()
  for (const chip of layout.value.chips) {
    for (let column = chip.columnStart; column <= chip.columnEnd; column += 1) {
      const index = chip.week * 7 + column
      const list = map.get(index) ?? []
      list.push(chip)
      map.set(index, list)
    }
  }
  for (const list of map.values())
    list.sort((a, b) => a.level - b.level)
  return map
})
const rangeDate = computed(() => ctx.date.toPlainDate())
const monthStart = computed(() => plainDateSetFirstOfMonth(rangeDate.value))
const monthEnd = computed(() => plainDateAddDays(plainDateAddMonths(monthStart.value, 1), -1))
const monthTitle = computed(() => formatWeekTitle(monthStart.value, monthEnd.value, ctx.locale))
const weekdayHeaders = computed(() => days.value.slice(0, 7))

function focusCell(dayISO: string | undefined): void {
  if (dayISO == null)
    return
  tableRef.value?.querySelector<HTMLElement>(`[data-schedule-day="${dayISO}"]`)?.focus()
}

const popover = useSchedulePopover(
  (key) => {
    const parsed = parseKey(key)
    if (parsed == null)
      return monthTitle.value
    if (parsed.kind === 'day') {
      const day = days.value.find(item => plainDateToISO(item) === parsed.dayISO)
      return day == null ? monthTitle.value : formatFullDate(day, ctx.locale)
    }
    return ctx.events.find(event => event.id === parsed.eventID)?.title ?? monthTitle.value
  },
  (key) => {
    const parsed = parseKey(key)
    if (parsed == null)
      return
    if (parsed.kind === 'chip') {
      const chip = layout.value.chips.find(item => `chip/${item.week}:${item.columnStart}/${item.event.id}` === key)
      const day = chip == null ? undefined : days.value[chip.week * 7 + chip.columnStart]
      focusCell(day == null ? undefined : plainDateToISO(day))
      return
    }
    const more = tableRef.value?.querySelector<HTMLElement>(`[data-schedule-popover-trigger="${dayKey(parsed.dayISO)}"]`)
    if (parsed.kind === 'row' && more != null) {
      more.focus()
      return
    }
    focusCell(parsed.dayISO)
  },
)

const openKey = computed(() => popover.openKey.value)
const openParsed = computed(() => parseKey(openKey.value))
const openDay = computed(() => {
  const parsed = openParsed.value
  if (parsed?.kind !== 'day')
    return undefined
  return days.value.find(day => plainDateToISO(day) === parsed.dayISO)
})
const openEvent = computed(() => {
  const parsed = openParsed.value
  if (parsed == null || parsed.kind === 'day')
    return undefined
  return ctx.events.find(event => event.id === parsed.eventID)
})
const openDayEvents = computed(() => openDay.value == null
  ? []
  : eventsByDay.value.get(plainDateToISO(openDay.value)) ?? [])

function openRow(event: CalendarEvent, day: PlainDate): void {
  popover.switchTo(rowKey(plainDateToISO(day), event.id))
}

function rowLabel(event: CalendarEvent, day: PlainDate): string {
  return formatMonthEventName(event, formatFullDate(day, ctx.locale), ctx.timezoneID, ctx.categories, ctx.locale)
}

const openContent = computed(() => {
  const event = openEvent.value
  if (event == null)
    return null
  return props.options.renderPopover?.(event) ?? null
})

function weekKey(week: ReadonlyArray<PlainDate>): string {
  return plainDateToISO(week[0] ?? monthStart.value)
}

function weekRange(week: ReadonlyArray<PlainDate>): string {
  const start = week[0]
  const end = week[week.length - 1]
  if (start == null || end == null)
    return ''
  return formatWeekRange(start, end, ctx.timezoneID, ctx.locale)
}

function onMonthKeydown(event: KeyboardEvent): void {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement) || document.activeElement !== target)
    return
  const step = event.key === 'ArrowRight' ? 48 : event.key === 'ArrowLeft' ? -48 : 0
  if (step === 0)
    return
  target.scrollLeft += step
  event.preventDefault()
}
</script>

<template>
  <ScheduleFrame :title-label="monthTitle" :is-loading="ctx.isLoading">
    <template #title>
      <ScheduleTitle :start="monthStart" :end="monthEnd" />
    </template>
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- role=table 加 tabindex 后，左右方向键只滚动这一张月历。 -->
    <div
      ref="tableRef"
      class="astryx-schedule__month"
      role="table"
      :aria-label="monthTitle"
      tabindex="0"
      v-bind="popover.containerProps"
      @keydown="onMonthKeydown"
    >
      <div class="astryx-schedule__weekdays" role="row">
        <div class="astryx-schedule__sr" role="columnheader" aria-colindex="1">
          Week
        </div>
        <div
          v-for="(day, index) in weekdayHeaders"
          :key="plainDateToISO(day)"
          class="astryx-schedule__weekday"
          role="columnheader"
          :aria-label="formatWeekday(day, 'long', ctx.locale)"
          :aria-colindex="index + 2"
        >
          <Heading :level="ctx.headingLevel" color="secondary" display="block">
            {{ formatWeekday(day, 'short', ctx.locale) }}
          </Heading>
        </div>
      </div>
      <div class="astryx-schedule__month-surface">
        <div class="astryx-schedule__month-grid">
          <div v-for="(week, weekIndex) in weeks" :key="weekKey(week)" class="astryx-schedule__month-row" role="row">
            <div class="astryx-schedule__sr" role="rowheader" aria-colindex="1">
              {{ weekRange(week) }}
            </div>
            <MonthCell
              v-for="(day, column) in week"
              :key="plainDateToISO(day)"
              :day="day"
              :days="days"
              :column="column"
              :is-outside="day.month !== rangeDate.month"
              :is-last-column="column === 6"
              :is-last-row="weekIndex === weeks.length - 1"
              :is-focus="plainDateIsEqual(day, ctx.focusDate.toPlainDate())"
              :cell-chips="chipsByDay.get(weekIndex * 7 + column) ?? []"
              :day-events="eventsByDay.get(plainDateToISO(day)) ?? []"
              :hidden-count="overflowByDay.get(weekIndex * 7 + column)"
              :current-time="currentTime"
              :render-popover="options.renderPopover"
              :popover="popover"
            />
          </div>
        </div>
      </div>
    </div>
    <SchedulePopover :popover="popover">
      <div v-if="openDay" class="astryx-schedule__day-popover" :aria-label="`${formatFullDate(openDay, ctx.locale)} events`">
        <Text type="supporting" weight="bold" color="secondary">
          {{ formatFullDate(openDay, ctx.locale) }}
        </Text>
        <ul class="astryx-schedule__day-events">
          <li v-for="event in openDayEvents" :key="event.id">
            <button
              v-if="options.renderPopover?.(event) != null"
              type="button"
              class="astryx-schedule__event-button astryx-schedule__day-event"
              :aria-label="rowLabel(event, openDay)"
              @click="openRow(event, openDay)"
            >
              <ListEventRow :event="event" :past="isEventInPast(event, currentTime, ctx.timezoneID)" />
            </button>
            <ListEventRow v-else :event="event" :past="isEventInPast(event, currentTime, ctx.timezoneID)" />
          </li>
        </ul>
      </div>
      <div v-else-if="openContent != null" :aria-label="`${openEvent?.title ?? monthTitle} details`">
        <VNodeHost :nodes="openContent" />
      </div>
    </SchedulePopover>
  </ScheduleFrame>
</template>
