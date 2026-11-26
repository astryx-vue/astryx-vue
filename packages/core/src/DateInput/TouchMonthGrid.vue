<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { CalendarMonth, CalendarSystem } from '../utils/calendarSystem.js'
import type { PlainDate } from '../utils/plainDate.js'
import { computed, shallowRef, watch } from 'vue'
import { formatWeekdayDate, sameCalendarDay, toCalendarDate, weekStartIndex } from '../Calendar/calendarDate.js'
import { toCalendarDay } from '../Calendar/calendarMonths.js'
import { isCalendarDateDisabled, isOutsideCalendarBounds } from '../Calendar/useCalendarConstraints.js'
import { buildMonthWeeks } from '../Calendar/useCalendarGrid.js'
import { resolveCalendarKey } from '../Calendar/useCalendarKeyboard.js'
import { formatDayNumber, standaloneShortWeekdayNames, weekdayNames } from '../locale/format.js'
import { useAstryxLocale } from '../locale/index.js'
import { formatCalendarMonthLabel } from '../utils/calendarFormat.js'
import { calendarDayOfMonth, isInCalendarMonth } from '../utils/calendarSystem.js'
import '../../styles/calendar.css'

const props = defineProps<{
  calendar: CalendarSystem
  /** 显示的历法月。 */
  month: CalendarMonth
  selected?: Date | null
  min?: Date
  max?: Date
  isDateDisabled?: (date: Date) => boolean
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  weekStartsOn?: WeekStartsOn
  /** 今天。由面板在挂载后读好传进来，服务端渲染和水合时不读时钟。 */
  today: Date
}>()

const emit = defineEmits<{
  'pick': [date: Date]
  /** 键盘把焦点挪出了这个月，参数是焦点落到的那天。 */
  'update:view': [date: PlainDate]
}>()

const locale = useAstryxLocale()
const weekStart = computed(() => weekStartIndex(props.weekStartsOn))
const selectedDate = computed(() => props.selected ? toCalendarDate(props.selected) : null)
const todayDate = computed(() => toCalendarDate(props.today))
const focused = shallowRef<CalendarDate>(toCalendarDay(props.month.start))

const headers = computed(() => {
  const shorts = standaloneShortWeekdayNames(locale.value)
  const longs = weekdayNames(locale.value, 'long')
  return Array.from({ length: 7 }, (_, index) => {
    const day = (index + weekStart.value) % 7
    return { short: shorts[day] ?? '', long: longs[day] ?? '' }
  })
})

const weeks = computed(() => buildMonthWeeks(props.calendar, props.month, weekStart.value, false))
const label = computed(() => formatCalendarMonthLabel(props.calendar, props.month, locale.value))

function blocked(date: CalendarDate): boolean {
  return isCalendarDateDisabled(date, {
    min: props.min,
    max: props.max,
    isDateDisabled: props.isDateDisabled,
    dateConstraints: props.dateConstraints,
  })
}

// 翻到别的月时焦点跟过去，保留第几天，那个月没有这一天就落在月底。
watch(() => props.month, (month) => {
  if (isInCalendarMonth(focused.value, month))
    return
  const day = Math.min(calendarDayOfMonth(props.calendar, focused.value), month.length)
  focused.value = toCalendarDay(month.start).add({ days: day - 1 })
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
    viewStart: toCalendarDay(props.month.start),
    calendar: props.calendar,
    isOutOfBounds: date => isOutsideCalendarBounds(date, props.min, props.max),
    isDisabled: date => blocked(date),
  })
  if (!move)
    return
  event.preventDefault()
  focused.value = move.date
  if (!isInCalendarMonth(move.date, props.month))
    emit('update:view', { year: move.date.year, month: move.date.month, day: move.date.day })
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
            'is-today': !day.outside && sameCalendarDay(day.date, todayDate),
            'is-disabled': day.outside || blocked(day.date),
            'is-other-month': day.outside,
          }"
          :data-date="day.iso"
          :tabindex="!day.outside && sameCalendarDay(day.date, focused) ? 0 : -1"
          :aria-disabled="day.outside || blocked(day.date) || undefined"
          :aria-current="!day.outside && sameCalendarDay(day.date, todayDate) ? 'date' : undefined"
          :aria-label="formatWeekdayDate(day.date, locale, calendar)"
          @click="pick(day.date, day.outside)"
        >
          <span class="astryx-calendar-day">{{ formatDayNumber(day.day, locale) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
