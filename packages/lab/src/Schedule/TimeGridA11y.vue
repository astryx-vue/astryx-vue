<script setup lang="ts">
import type { PlainDate } from '@astryx-vue/core'
import type { CalendarEvent, CalendarInstantEvent, ScheduleCategory } from './types.js'
import { plainDateIsEqual, plainDateToISO } from '@astryx-vue/core'
import { eventOccursOnDate } from './dateMath.js'
import { formatFullDate, formatHour } from './format.js'
import { eventOverlapsHour, formatTimeGridCellLabel } from './timeGridGeometry.js'

defineOptions({ name: 'AstryxScheduleTimeGridA11y' })

const props = defineProps<{
  allDayEvents: ReadonlyArray<CalendarEvent>
  categories: ReadonlyArray<ScheduleCategory>
  days: ReadonlyArray<PlainDate>
  events: ReadonlyArray<CalendarInstantEvent>
  focusDate: PlainDate
  hours: ReadonlyArray<number>
  locale: string
  timezoneID: string
  timezoneLabel: string
}>()

function allDayOn(day: PlainDate): CalendarEvent[] {
  return props.allDayEvents.filter(event => eventOccursOnDate(event, day, props.timezoneID))
}
</script>

<template>
  <div class="astryx-schedule__sr" role="grid" aria-label="Schedule time grid" aria-readonly="true">
    <div role="row">
      <div role="columnheader" aria-colindex="1">
        Time
      </div>
      <div
        v-for="(day, index) in days"
        :key="plainDateToISO(day)"
        role="columnheader"
        :aria-colindex="index + 2"
        :aria-current="plainDateIsEqual(day, focusDate) ? 'date' : undefined"
      >
        {{ formatFullDate(day, locale) }}
      </div>
    </div>
    <div role="row">
      <div role="rowheader" aria-colindex="1">
        {{ timezoneLabel }} all day
      </div>
      <div
        v-for="(day, index) in days"
        :key="`all-${plainDateToISO(day)}`"
        role="gridcell"
        :aria-colindex="index + 2"
        :aria-label="formatTimeGridCellLabel({
          categories,
          day,
          events: allDayOn(day),
          label: `${formatFullDate(day, locale)} all day`,
          locale,
          timezoneID,
        })"
      />
    </div>
    <div v-for="hour in hours" :key="hour" role="row">
      <div role="rowheader" aria-colindex="1">
        {{ formatHour(hour, locale) }}
      </div>
      <div
        v-for="(day, index) in days"
        :key="`${hour}-${plainDateToISO(day)}`"
        role="gridcell"
        :aria-colindex="index + 2"
        :aria-label="formatTimeGridCellLabel({
          categories,
          day,
          events: events.filter(event => eventOverlapsHour(event, day, hour, timezoneID)),
          label: `${formatFullDate(day, locale)} ${formatHour(hour, locale)}`,
          locale,
          timezoneID,
        })"
      />
    </div>
  </div>
</template>
