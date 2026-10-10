<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { CalendarEmits, CalendarProps, CalendarSlots } from './types.js'
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref, useId } from 'vue'
import { useCalendar } from '../composables/useCalendar.js'
import { useGridRovingFocus } from '../composables/useGridRovingFocus.js'
import '../../styles/calendar.css'

defineOptions({ name: 'AstryxCalendar' })

const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: null,
  disabled: false,
  label: '日历',
})

const emit = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const calendarId = `astryx-calendar-${useId()}`

const modelValueRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const calendar = useCalendar({
  value: modelValueRef,
  min: props.min,
  max: props.max,
  isDateDisabled: props.isDateDisabled,
  onChange: (value) => {
    modelValueRef.value = value
  },
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

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

function getCellId(rowIndex: number, colIndex: number): string {
  return `${calendarId}-cell-${rowIndex}-${colIndex}`
}

function isToday(date: CalendarDate): boolean {
  return date.compare(todayDate) === 0
}

function onDateClick(date: CalendarDate, rowIndex: number, colIndex: number): void {
  if (props.disabled || calendar.isDisabled(date))
    return
  activeIndex.value = rowIndex * 7 + colIndex
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

function formatMonthYear(): string {
  const date = calendar.focusedDate.value
  return `${date.year} 年 ${date.month} 月`
}
</script>

<template>
  <div
    :id="calendarId"
    class="astryx-calendar"
    :class="{ 'is-disabled': props.disabled }"
    role="application"
    :aria-label="props.label"
  >
    <!-- 头部：月份导航 -->
    <div class="astryx-calendar-header">
      <slot name="header">
        <button
          type="button"
          class="astryx-calendar-nav-button"
          :disabled="props.disabled"
          aria-label="上一月"
          @click="calendar.previousMonth"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <span class="astryx-calendar-month-year">{{ formatMonthYear() }}</span>
        <button
          type="button"
          class="astryx-calendar-nav-button"
          :disabled="props.disabled"
          aria-label="下一月"
          @click="calendar.nextMonth"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </slot>
    </div>

    <!-- 星期标题 -->
    <div class="astryx-calendar-weekdays" role="row">
      <div
        v-for="day in weekDays"
        :key="day"
        class="astryx-calendar-weekday"
        role="columnheader"
        :aria-label="`星期${day}`"
      >
        {{ day }}
      </div>
    </div>

    <!-- 日期网格 -->
    <div
      class="astryx-calendar-grid"
      role="grid"
      :aria-labelledby="calendarId"
      :aria-activedescendant="getCellId(grid.row.value, grid.column.value)"
      tabindex="0"
      @keydown="onKeyDown"
    >
      <div
        v-for="(week, rowIndex) in calendar.dates.value"
        :key="rowIndex"
        class="astryx-calendar-row"
        role="row"
      >
        <div
          v-for="(date, colIndex) in week"
          :id="getCellId(rowIndex, colIndex)"
          :key="colIndex"
          class="astryx-calendar-cell"
          :class="{
            'is-selected': calendar.isSelected(date),
            'is-disabled': calendar.isDisabled(date),
            'is-today': isToday(date),
            'is-other-month': !calendar.isInMonth(date),
            'is-active': activeIndex === rowIndex * 7 + colIndex,
          }"
          role="gridcell"
          :aria-selected="calendar.isSelected(date)"
          :aria-disabled="calendar.isDisabled(date)"
          :aria-current="isToday(date) ? 'date' : undefined"
          tabindex="-1"
          @click="onDateClick(date, rowIndex, colIndex)"
          @keydown.enter="onDateClick(date, rowIndex, colIndex)"
        >
          <slot
            name="day"
            :date="date"
            :is-selected="calendar.isSelected(date)"
            :is-disabled="calendar.isDisabled(date)"
            :is-today="isToday(date)"
            :is-in-month="calendar.isInMonth(date)"
          >
            <span class="astryx-calendar-day">{{ date.day }}</span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
