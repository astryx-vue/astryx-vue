<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { WeekStartsOn } from '../composables/useDateRange.js'
import { CalendarDate as CalendarDay } from '@internationalized/date'
import { computed, shallowRef, watch } from 'vue'
import { formatWeekdayDate, sameCalendarDay, toCalendarDate, weekStartIndex } from '../Calendar/calendarDate.js'
import { isCalendarDateDisabled, isOutsideCalendarBounds } from '../Calendar/useCalendarConstraints.js'
import { buildCalendarWeeks } from '../Calendar/useCalendarGrid.js'
import { resolveCalendarKey } from '../Calendar/useCalendarKeyboard.js'
import { formatCalendarMonth, standaloneShortWeekdayNames, weekdayNames } from '../locale/format.js'
import { useAstryxLocale } from '../locale/index.js'
import '../../styles/calendar.css'

const props = defineProps<{
  year: number
  month: number
  selected?: Date | null
  min?: Date
  max?: Date
  isDateDisabled?: (date: Date) => boolean
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  weekStartsOn?: WeekStartsOn
}>()

const emit = defineEmits<{
  'pick': [date: Date]
  'update:view': [year: number, month: number]
}>()

const locale = useAstryxLocale()
const weekStart = computed(() => weekStartIndex(props.weekStartsOn))
const selectedDate = computed(() => props.selected ? toCalendarDate(props.selected) : null)
const today = toCalendarDate(new Date())
const focused = shallowRef<CalendarDate>(new CalendarDay(props.year, props.month, 1))

const headers = computed(() => {
  const shorts = standaloneShortWeekdayNames(locale.value)
  const longs = weekdayNames(locale.value, 'long')
  return Array.from({ length: 7 }, (_, index) => {
    const day = (index + weekStart.value) % 7
    return { short: shorts[day] ?? '', long: longs[day] ?? '' }
  })
})

const weeks = computed(() => buildCalendarWeeks(props.year, props.month, weekStart.value, false))
const label = computed(() => formatCalendarMonth(props.year, props.month, locale.value))

function blocked(date: CalendarDate): boolean {
  return isCalendarDateDisabled(date, {
    min: props.min,
    max: props.max,
    isDateDisabled: props.isDateDisabled,
    dateConstraints: props.dateConstraints,
  })
}

watch(() => [props.year, props.month] as const, ([year, month]) => {
  if (focused.value.year === year && focused.value.month === month)
    return
  const last = new CalendarDay(year, month, 1).add({ months: 1 }).subtract({ days: 1 }).day
  focused.value = new CalendarDay(year, month, Math.min(focused.value.day, last))
}, { immediate: true })

function pick(date: CalendarDate, outside: boolean): void {
  if (outside || blocked(date))
    return
  focused.value = date
  emit('pick', new Date(date.year, date.month - 1, date.day))
}

function onKeydown(event: KeyboardEvent): void {
  const move = resolveCalendarKey({
    key: event.key,
    rtl: typeof document !== 'undefined' && document.documentElement.dir === 'rtl',
    focused: focused.value,
    weekStartsOn: weekStart.value,
    numberOfMonths: 1,
    viewYear: props.year,
    viewMonth: props.month,
    isOutOfBounds: date => isOutsideCalendarBounds(date, props.min, props.max),
    isDisabled: date => blocked(date),
  })
  if (!move)
    return
  event.preventDefault()
  focused.value = move.date
  if (move.date.year !== props.year || move.date.month !== props.month)
    emit('update:view', move.date.year, move.date.month)
}
</script>

<template>
  <div
    class="astryx-calendar-grid astryx-date-touch-grid"
    role="grid"
    :aria-label="label"
    tabindex="-1"
    @keydown="onKeydown"
  >
    <div class="astryx-calendar-weekdays" role="row">
      <div
        v-for="day in headers"
        :key="day.long"
        class="astryx-calendar-weekday"
        role="columnheader"
        :aria-label="day.long"
      >
        {{ day.short }}
      </div>
    </div>
    <div v-for="(week, rowIndex) in weeks" :key="rowIndex" class="astryx-calendar-row" role="row">
      <div v-for="day in week.days" :key="day.iso" class="astryx-calendar-gridcell" role="gridcell">
        <button
          type="button"
          class="astryx-calendar-cell"
          :class="{
            'is-selected': !!selectedDate && !day.outside && sameCalendarDay(day.date, selectedDate),
            'is-today': !day.outside && sameCalendarDay(day.date, today),
            'is-disabled': day.outside || blocked(day.date),
            'is-other-month': day.outside,
          }"
          :data-date="day.iso"
          :tabindex="!day.outside && sameCalendarDay(day.date, focused) ? 0 : -1"
          :aria-disabled="day.outside || blocked(day.date) || undefined"
          :aria-current="!day.outside && sameCalendarDay(day.date, today) ? 'date' : undefined"
          :aria-label="formatWeekdayDate(day.date, locale)"
          @click="pick(day.date, day.outside)"
        >
          <span class="astryx-calendar-day">{{ day.day }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
