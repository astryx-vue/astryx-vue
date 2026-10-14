<script setup lang="ts">
import type { ISODateRange, WeekStartsOn } from '../composables/useDateRange.js'
import { computed } from 'vue'
import { isDayOutsideSpan, orderRange, resolveWeekStart } from '../composables/useDateRange.js'
import { addMonths, buildMonthGrid, todayISODate } from '../composables/useMonthGrid.js'
import Icon from '../Icon/Icon.vue'
import { formatCalendarMonth, standaloneShortWeekdayNames, weekdayNames } from '../locale/format.js'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import '../../styles/calendar.css'
import '../../styles/date-range-input.css'

const props = withDefaults(defineProps<{
  cursorYear: number
  cursorMonth: number
  monthCount?: number
  range?: ISODateRange | null
  pending?: string | null
  min?: string
  max?: string
  minRangeSpan?: number
  maxRangeSpan?: number
  weekStartsOn?: WeekStartsOn
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
}>(), {
  monthCount: 2,
  range: null,
  pending: null,
  minRangeSpan: 1,
})

const emit = defineEmits<{
  select: [day: string]
  shift: [amount: number]
}>()

const locale = useAstryxLocale()
const messages = useAstryxMessages()
const hover = defineModel<string | null>('hover', { default: null })
const today = todayISODate()
const weekStart = computed(() => resolveWeekStart(props.weekStartsOn ?? (locale.value === 'zh-CN' ? 1 : 0)))
const weekDays = computed(() => {
  const names = standaloneShortWeekdayNames(locale.value)
  const labels = weekdayNames(locale.value, 'long')
  const start = weekStart.value
  return Array.from({ length: 7 }, (_, index) => ({
    name: names[(index + start) % 7],
    label: labels[(index + start) % 7],
  }))
})

const months = computed(() => Array.from({ length: props.monthCount }, (_, index) => {
  const cursor = addMonths(props.cursorYear, props.cursorMonth, index)
  return {
    ...cursor,
    label: formatCalendarMonth(cursor.year, cursor.month, locale.value),
    weeks: buildMonthGrid(cursor.year, cursor.month, weekStart.value),
  }
}))
const headerLabel = computed(() => months.value.map(month => month.label).join(' – '))

const preview = computed<ISODateRange | null>(() => {
  if (props.pending && hover.value && hover.value !== props.pending)
    return orderRange(props.pending, hover.value)
  return props.range
})

function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

function inSpan(day: string, range: ISODateRange | null): boolean {
  return range != null && day >= range.start && day <= range.end
}

function dayDate(day: string): Date {
  const [year, month, date] = day.split('-').map(Number)
  return new Date(year!, month! - 1, date)
}

function isDisabled(day: string): boolean {
  if (props.min && day < props.min)
    return true
  if (props.max && day > props.max)
    return true
  if (props.dateConstraints?.some(constraint => !constraint(dayDate(day))))
    return true
  return isDayOutsideSpan(props.pending, day, props.minRangeSpan, props.maxRangeSpan)
}
</script>

<template>
  <div class="astryx-calendar astryx-date-range-calendar">
    <div class="astryx-calendar-header">
      <button type="button" class="astryx-calendar-nav-button" :aria-label="messages.calendar.previousMonth" @click="emit('shift', -1)">
        <Icon icon="chevronLeft" size="sm" />
      </button>
      <span class="astryx-calendar-month-year">{{ headerLabel }}</span>
      <button type="button" class="astryx-calendar-nav-button" :aria-label="messages.calendar.nextMonth" @click="emit('shift', 1)">
        <Icon icon="chevronRight" size="sm" />
      </button>
    </div>
    <div class="astryx-date-range-months">
      <div v-for="month in months" :key="`${month.year}-${month.month}`" class="astryx-date-range-month">
        <div class="astryx-calendar-weekdays">
          <div v-for="day in weekDays" :key="day.label" class="astryx-calendar-weekday" :aria-label="day.label">
            {{ day.name }}
          </div>
        </div>
        <div v-for="(week, weekIndex) in month.weeks" :key="weekIndex" class="astryx-calendar-row">
          <button
            v-for="day in week" :key="day" type="button" class="astryx-calendar-cell"
            :class="{
              'is-other-month': monthKey(day) !== `${month.year}-${String(month.month).padStart(2, '0')}`,
              'is-today': day === today,
              'is-selected': day === preview?.start || day === preview?.end || day === pending,
              'is-in-range': inSpan(day, preview),
              'is-range-start': day === preview?.start,
              'is-range-end': day === preview?.end,
              'is-disabled': isDisabled(day),
            }"
            :disabled="isDisabled(day)"
            :aria-pressed="day === preview?.start || day === preview?.end || undefined"
            :aria-current="day === today ? 'date' : undefined"
            @click="emit('select', day)"
            @mouseenter="hover = day"
            @mouseleave="hover = null"
            @focus="hover = day"
            @blur="hover = null"
          >
            <span class="astryx-calendar-day">{{ Number(day.slice(8)) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
