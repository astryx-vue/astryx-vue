<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { CalendarEmits, CalendarProps, CalendarRangeValue, CalendarSlots } from './types.js'
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref, useId } from 'vue'
import { useCalendar } from '../composables/useCalendar.js'
import { useGridRovingFocus } from '../composables/useGridRovingFocus.js'
import { formatCalendarMonth, weekdayNames } from '../locale/format.js'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import '../../styles/calendar.css'

defineOptions({ name: 'AstryxCalendar' })

const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: null,
  mode: 'single',
  range: null,
  numberOfMonths: 1,
  disabled: false,
})

const emit = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const calendarId = `astryx-calendar-${useId()}`
const locale = useAstryxLocale()
const messages = useAstryxMessages()
const resolvedLabel = computed(() => props.label ?? messages.value.calendar.label)
const weekDays = computed(() => weekdayNames(locale.value, 'narrow'))
const weekDayLabels = computed(() => weekdayNames(locale.value, 'long'))

const modelValueRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const calendar = useCalendar({
  value: modelValueRef,
  initialDate: props.focusDate,
  min: props.min,
  max: props.max,
  isDateDisabled: props.isDateDisabled,
  onChange: (value) => {
    modelValueRef.value = value
  },
})

const months = computed(() => {
  const first = calendar.focusedDate.value
  return props.numberOfMonths === 2 ? [first, first.add({ months: 1 })] : [first]
})

const timeZone = getLocalTimeZone()
const todayDate = today(timeZone)

// 网格导航
const activeIndex = ref(0)
const isEnabled = computed(() => !props.disabled)

const grid = useGridRovingFocus({
  rows: computed(() => 6), // 6 weeks
  columns: computed(() => 7), // 7 days
  activeIndex,
  isEnabled,
  isDisabled: (row, col) => {
    const dateIndex = row * 7 + col
    const allDates = calendar.dates.value.flat()
    const date = allDates[dateIndex]
    return date ? calendar.isDisabled(date) : true
  },
  onChange: (index) => {
    activeIndex.value = index
  },
})

function getCellId(rowIndex: number, colIndex: number): string {
  return `${calendarId}-cell-${rowIndex}-${colIndex}`
}

function isToday(date: CalendarDate): boolean {
  return date.compare(todayDate) === 0
}

function sameDay(date: Date | null, day: CalendarDate): boolean {
  return !!date && date.getFullYear() === day.year && date.getMonth() + 1 === day.month && date.getDate() === day.day
}

function isRangeStart(date: CalendarDate): boolean {
  return props.mode === 'range' && sameDay(props.range?.start ?? null, date)
}

function isRangeEnd(date: CalendarDate): boolean {
  return props.mode === 'range' && sameDay(props.range?.end ?? null, date)
}

function isInRange(date: CalendarDate): boolean {
  if (props.mode !== 'range')
    return false
  const start = props.range?.start
  const end = props.range?.end
  if (!start || !end)
    return false
  const day = new Date(date.year, date.month - 1, date.day)
  const from = start < end ? start : end
  const to = start < end ? end : start
  return day > from && day < to
}

function selectRange(date: CalendarDate): void {
  const day = new Date(date.year, date.month - 1, date.day)
  const start = props.range?.start ?? null
  const end = props.range?.end ?? null
  const next: CalendarRangeValue = !start || end
    ? { start: day, end: null }
    : day < start
      ? { start: day, end: start }
      : { start, end: day }
  emit('update:range', next)
  emit('change', day)
}

function onDateClick(date: CalendarDate, rowIndex: number, colIndex: number): void {
  if (props.disabled || calendar.isDisabled(date))
    return
  activeIndex.value = rowIndex * 7 + colIndex
  if (props.mode === 'range') {
    selectRange(date)
    return
  }
  calendar.select(date)
}

function onKeyDown(event: KeyboardEvent): void {
  if (props.disabled)
    return

  // 处理网格导航
  grid.onKeyDown(event)

  // Enter 或 Space 选择当前日期
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const allDates = calendar.dates.value.flat()
    const date = allDates[activeIndex.value]
    if (date && !calendar.isDisabled(date)) {
      calendar.select(date)
    }
  }
}
</script>

<template>
  <div
    :id="calendarId"
    class="astryx-calendar"
    :class="{ 'is-disabled': props.disabled }"
    :data-months="props.numberOfMonths"
    role="application"
    :aria-label="resolvedLabel"
  >
    <div v-for="(month, monthIndex) in months" :key="`${month.year}-${month.month}`" class="astryx-calendar-month">
      <div class="astryx-calendar-header">
        <slot v-if="monthIndex === 0" name="header">
          <button
            type="button"
            class="astryx-calendar-nav-button"
            :disabled="props.disabled"
            :aria-label="messages.calendar.previousMonth"
            @click="calendar.previousMonth"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <span class="astryx-calendar-month-year">{{ formatCalendarMonth(month.year, month.month, locale) }}</span>
          <button
            v-if="props.numberOfMonths === 1"
            type="button"
            class="astryx-calendar-nav-button"
            :disabled="props.disabled"
            :aria-label="messages.calendar.nextMonth"
            @click="calendar.nextMonth"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </slot>
        <template v-else>
          <span class="astryx-calendar-month-year">{{ formatCalendarMonth(month.year, month.month, locale) }}</span>
          <button
            type="button"
            class="astryx-calendar-nav-button"
            :disabled="props.disabled"
            :aria-label="messages.calendar.nextMonth"
            @click="calendar.nextMonth"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </template>
      </div>

      <div class="astryx-calendar-weekdays" role="row">
        <div
          v-for="(day, index) in weekDays"
          :key="index"
          class="astryx-calendar-weekday"
          role="columnheader"
          :aria-label="weekDayLabels[index]"
        >
          {{ day }}
        </div>
      </div>

      <div
        class="astryx-calendar-grid"
        role="grid"
        :aria-labelledby="calendarId"
        :aria-activedescendant="monthIndex === 0 ? getCellId(grid.row.value, grid.column.value) : undefined"
        tabindex="0"
        @keydown="monthIndex === 0 ? onKeyDown($event) : undefined"
      >
        <div
          v-for="(week, rowIndex) in calendar.datesFor(month)"
          :key="rowIndex"
          class="astryx-calendar-row"
          role="row"
        >
          <div
            v-for="(date, colIndex) in week"
            :id="monthIndex === 0 ? getCellId(rowIndex, colIndex) : undefined"
            :key="colIndex"
            class="astryx-calendar-cell"
            :class="{
              'is-selected': props.mode === 'range' ? (isRangeStart(date) || isRangeEnd(date)) : calendar.isSelected(date),
              'is-range-start': isRangeStart(date),
              'is-range-end': isRangeEnd(date),
              'is-in-range': isInRange(date),
              'is-disabled': calendar.isDisabled(date),
              'is-today': isToday(date),
              'is-other-month': date.month !== month.month || date.year !== month.year,
              'is-active': monthIndex === 0 && activeIndex === rowIndex * 7 + colIndex,
            }"
            role="gridcell"
            :aria-selected="props.mode === 'range' ? (isRangeStart(date) || isRangeEnd(date)) : calendar.isSelected(date)"
            :aria-disabled="calendar.isDisabled(date)"
            :aria-current="isToday(date) ? 'date' : undefined"
            tabindex="-1"
            @click="onDateClick(date, rowIndex, colIndex)"
            @keydown.enter="onDateClick(date, rowIndex, colIndex)"
          >
            <slot
              name="day"
              :date="date"
              :is-selected="props.mode === 'range' ? (isRangeStart(date) || isRangeEnd(date)) : calendar.isSelected(date)"
              :is-disabled="calendar.isDisabled(date)"
              :is-today="isToday(date)"
              :is-in-month="date.month === month.month && date.year === month.year"
            >
              <span class="astryx-calendar-day">{{ date.day }}</span>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
