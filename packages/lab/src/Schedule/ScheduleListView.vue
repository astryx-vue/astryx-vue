<script setup lang="ts">
import type { CalendarEvent } from './types.js'
import { Heading, plainDateAddDays, plainDateFromInstant, plainDateIsEqual, plainDateToISO } from '@astryx-vue/core'
import { computed } from 'vue'
import { useScheduleContext } from './context.js'
import { enumerateDates, eventOccursOnDate, isDayEvent } from './dateMath.js'
import { formatDayNumber, formatFullDate, formatWeekday, formatWeekTitle, isEventInPast } from './format.js'
import ListEventRow from './ListEventRow.vue'
import ScheduleFrame from './ScheduleFrame.vue'
import ScheduleTitle from './ScheduleTitle.vue'
import { useCurrentTime } from './useCurrentTime.js'

defineOptions({ name: 'AstryxScheduleListView' })

const ctx = useScheduleContext()
const currentTime = useCurrentTime()
const days = computed(() => enumerateDates(ctx.range.startDate, ctx.range.endDate))
const endDate = computed(() => plainDateAddDays(ctx.range.endDate, -1))
const titleLabel = computed(() => formatWeekTitle(ctx.range.startDate, endDate.value, ctx.locale))
const today = computed(() => plainDateFromInstant(currentTime.value, ctx.timezoneID))

const visibleDays = computed(() => days.value.flatMap((day) => {
  const dayEvents = ctx.events.filter(event => eventOccursOnDate(event, day, ctx.timezoneID))
  const isCurrentDay = currentTime.value !== 0 && plainDateIsEqual(day, today.value)
  const isBaseDay = plainDateIsEqual(day, ctx.range.startDate)
  if (dayEvents.length === 0 && !isCurrentDay && !isBaseDay)
    return []
  return [{ day, dayEvents, isCurrentDay }]
}))

function rows(events: ReadonlyArray<CalendarEvent>, isCurrentDay: boolean): Array<{ kind: 'event', event: CalendarEvent } | { kind: 'now' }> {
  const items: Array<{ kind: 'event', event: CalendarEvent } | { kind: 'now' }> = events.map(event => ({ kind: 'event', event }))
  if (!isCurrentDay || ctx.isLoading || currentTime.value === 0)
    return items
  const marker = { kind: 'now' as const }
  const index = events.findIndex(event => !isDayEvent(event) && event.start > currentTime.value)
  if (index < 0)
    return [...items, marker]
  return [...items.slice(0, index), marker, ...items.slice(index)]
}
</script>

<template>
  <ScheduleFrame :title-label="titleLabel" :is-loading="ctx.isLoading">
    <template #title>
      <ScheduleTitle :start="ctx.range.startDate" :end="endDate" />
    </template>
    <div class="astryx-schedule__list">
      <section
        v-for="(record, index) in visibleDays"
        :key="plainDateToISO(record.day)"
        class="astryx-schedule__list-day"
        :class="{ 'is-last': index === visibleDays.length - 1 }"
      >
        <Heading
          :level="ctx.headingLevel"
          color="secondary"
          display="block"
          class="astryx-schedule__list-heading"
          :aria-label="formatFullDate(record.day, ctx.locale)"
          :aria-current="record.isCurrentDay ? 'date' : undefined"
        >
          <span class="astryx-schedule__list-number" :class="{ 'is-current': record.isCurrentDay }">
            <span class="astryx-schedule__list-number-text">{{ formatDayNumber(record.day, ctx.locale) }}</span>
          </span>
          {{ formatWeekday(record.day, 'short', ctx.locale) }}
        </Heading>
        <div class="astryx-schedule__list-events">
          <template v-for="(row, rowIndex) in rows(record.dayEvents, record.isCurrentDay)" :key="row.kind === 'now' ? 'now' : row.event.id">
            <div v-if="row.kind === 'now'" class="astryx-schedule__list-now" aria-hidden="true" />
            <ListEventRow
              v-else
              :event="row.event"
              :past="isEventInPast(row.event, currentTime, ctx.timezoneID)"
              :data-row="rowIndex"
            />
          </template>
        </div>
      </section>
    </div>
  </ScheduleFrame>
</template>
