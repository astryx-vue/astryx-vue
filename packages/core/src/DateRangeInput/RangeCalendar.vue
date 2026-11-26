<script setup lang="ts">
import type { ISODateRange, WeekStartsOn } from '../composables/useDateRange.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { PlainDate } from '../utils/plainDate.js'
import { computed } from 'vue'
import { buildMonthWeeks } from '../Calendar/useCalendarGrid.js'
import { isDayOutsideSpan, orderRange, resolveWeekStart } from '../composables/useDateRange.js'
import { todayISODate } from '../composables/useMonthGrid.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { formatDayNumber, standaloneShortWeekdayNames, weekdayNames } from '../locale/format.js'
import { calendarMessages } from '../locale/messages/calendar.js'
import { formatCalendarMonthLabel } from '../utils/calendarFormat.js'
import { calendarAddMonths, calendarMonthOf } from '../utils/calendarSystem.js'
import '../../styles/calendar.css'
import '../../styles/date-range-input.css'

const props = withDefaults(defineProps<{
  /** 第一个显示的历法月里的任意一天。 */
  cursor: PlainDate
  calendar: CalendarSystem
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
const messages = useComponentMessages({ calendar: calendarMessages })
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

const months = computed(() => {
  const first = calendarMonthOf(props.calendar, props.cursor)
  return Array.from({ length: props.monthCount }, (_, index) => {
    const month = calendarAddMonths(props.calendar, first, index)
    return {
      key: `${month.start.year}-${month.start.month}-${month.start.day}`,
      label: formatCalendarMonthLabel(props.calendar, month, locale.value),
      weeks: buildMonthWeeks(props.calendar, month, weekStart.value),
    }
  })
})
const headerLabel = computed(() => months.value.map(month => month.label).join(' – '))

const preview = computed<ISODateRange | null>(() => {
  if (props.pending && hover.value && hover.value !== props.pending)
    return orderRange(props.pending, hover.value)
  return props.range
})

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
      <div v-for="month in months" :key="month.key" class="astryx-date-range-month">
        <div class="astryx-calendar-weekdays">
          <div v-for="day in weekDays" :key="day.label" class="astryx-calendar-weekday" :aria-label="day.label">
            {{ day.name }}
          </div>
        </div>
        <div v-for="(week, weekIndex) in month.weeks" :key="weekIndex" class="astryx-calendar-row">
          <button
            v-for="cell in week.days" :key="cell.iso" type="button" class="astryx-calendar-cell"
            :class="{
              'is-other-month': cell.outside,
              'is-today': cell.iso === today,
              'is-selected': cell.iso === preview?.start || cell.iso === preview?.end || cell.iso === pending,
              'is-in-range': inSpan(cell.iso, preview),
              'is-range-start': cell.iso === preview?.start,
              'is-range-end': cell.iso === preview?.end,
              'is-disabled': isDisabled(cell.iso),
            }"
            :aria-disabled="isDisabled(cell.iso) || undefined"
            :aria-pressed="cell.iso === preview?.start || cell.iso === preview?.end || undefined"
            :aria-current="cell.iso === today ? 'date' : undefined"
            @click="isDisabled(cell.iso) ? undefined : emit('select', cell.iso)"
            @mouseenter="hover = isDisabled(cell.iso) ? null : cell.iso"
            @mouseleave="hover = null"
            @focus="hover = isDisabled(cell.iso) ? null : cell.iso"
            @blur="hover = null"
          >
            <span class="astryx-calendar-day">{{ formatDayNumber(cell.day, locale) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
