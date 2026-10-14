<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { CalendarEmits, CalendarHandle, CalendarProps, CalendarRangeValue, CalendarSlots } from './types.js'
import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useHandleRef } from '../composables/useHandleRef.js'
import Icon from '../Icon/Icon.vue'
import { formatCalendarMonth, standaloneShortWeekdayNames, weekdayNames } from '../locale/format.js'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import {
  dateISO,
  formatWeekdayDate,
  fromCalendarDate,
  initialCalendarFocus,
  sameCalendarDay,
  shiftMonth,
  toCalendarDate,
  weekFieldName,
  weekStartIndex,
} from './calendarDate.js'
import { isCalendarDateDisabled, isOutsideCalendarBounds } from './useCalendarConstraints.js'
import { buildCalendarWeeks } from './useCalendarGrid.js'
import { resolveCalendarKey } from './useCalendarKeyboard.js'
import '../../styles/calendar.css'

defineOptions({ name: 'AstryxCalendar' })

const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: null,
  mode: 'single',
  range: null,
  numberOfMonths: 1,
  disabled: false,
  hasOutsideDays: true,
  hasWeekNumbers: false,
  hasVariableRowCount: false,
  weekStartsOn: 0,
  minRangeSpan: 1,
})

const emit = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const locale = useAstryxLocale()
const messages = useAstryxMessages()
const announce = useAnnounce()
const rootRef = useTemplateRef<HTMLElement>('root')
const monthCount = computed<1 | 2>(() => props.numberOfMonths === 2 ? 2 : 1)
const weekStart = computed(() => weekStartIndex(props.weekStartsOn))
const todayDate = toCalendarDate(new Date())
const pending = shallowRef<CalendarDate | null>(null)
const hover = shallowRef<CalendarDate | null>(null)

const opened = initialCalendarFocus({
  focusDate: props.focusDate,
  selected: props.mode === 'single' ? props.modelValue : null,
  rangeStart: props.range?.start ?? null,
  min: props.min,
  max: props.max,
  numberOfMonths: monthCount.value,
  today: fromCalendarDate(todayDate),
})
const view = shallowRef(shiftMonth(opened, 0))
const focused = shallowRef<CalendarDate>(opened)

const rtl = computed(() => {
  if (typeof document !== 'undefined' && document.documentElement.dir === 'rtl')
    return true
  return /^(?:ar|he|fa|ur)\b/i.test(locale.value)
})
const resolvedLabel = computed(() => props.label ?? messages.value.calendar.label)
const weekName = computed(() => weekFieldName(locale.value))
const headers = computed(() => {
  const short = standaloneShortWeekdayNames(locale.value)
  const long = weekdayNames(locale.value, 'long')
  const start = weekStart.value
  return Array.from({ length: 7 }, (_, index) => ({
    short: short[(index + start) % 7]!,
    long: long[(index + start) % 7]!,
  }))
})

function constraints() {
  return {
    min: props.min,
    max: props.max,
    isDateDisabled: props.isDateDisabled,
    dateConstraints: props.dateConstraints,
    minRangeSpan: props.mode === 'range' ? props.minRangeSpan : undefined,
    maxRangeSpan: props.mode === 'range' ? props.maxRangeSpan : undefined,
    rangeAnchor: props.mode === 'range' ? pending.value : null,
  }
}

function blocked(date: CalendarDate): boolean {
  return isCalendarDateDisabled(date, constraints())
}

function visible(date: CalendarDate): boolean {
  const start = view.value.year * 12 + view.value.month
  const index = date.year * 12 + date.month
  return index >= start && index < start + monthCount.value
}

function seed(month: CalendarDate): CalendarDate {
  const candidates: CalendarDate[] = []
  if (props.mode === 'single' && props.modelValue)
    candidates.push(toCalendarDate(props.modelValue))
  candidates.push(todayDate)
  for (const date of candidates) {
    if (date.year === month.year && date.month === month.month && !blocked(date))
      return date
  }
  for (const week of buildCalendarWeeks(month.year, month.month, weekStart.value, false)) {
    for (const day of week.days) {
      if (!day.outside && !blocked(day.date))
        return day.date
    }
  }
  return shiftMonth(month, 0)
}

focused.value = seed(view.value)

const months = computed(() => Array.from({ length: monthCount.value }, (_, index) => {
  const cursor = shiftMonth(view.value, index)
  return {
    year: cursor.year,
    month: cursor.month,
    label: formatCalendarMonth(cursor.year, cursor.month, locale.value),
    weeks: buildCalendarWeeks(cursor.year, cursor.month, weekStart.value, props.hasVariableRowCount),
  }
}))
const headerLabel = computed(() => months.value.map(month => month.label).join(' – '))
const canPrevious = computed(() => {
  if (!props.min)
    return true
  const min = toCalendarDate(props.min)
  return min.year < view.value.year || (min.year === view.value.year && min.month < view.value.month)
})
const canNext = computed(() => {
  if (!props.max)
    return true
  const max = toCalendarDate(props.max)
  const last = shiftMonth(view.value, monthCount.value - 1)
  return max.year > last.year || (max.year === last.year && max.month > last.month)
})

const selectedSingle = computed(() => props.mode === 'single' && props.modelValue ? toCalendarDate(props.modelValue) : null)
const committedStart = computed(() => props.mode === 'range' && props.range?.start ? toCalendarDate(props.range.start) : null)
const committedEnd = computed(() => props.mode === 'range' && props.range?.end ? toCalendarDate(props.range.end) : null)
const preview = computed(() => {
  if (!pending.value || !hover.value || sameCalendarDay(pending.value, hover.value))
    return null
  if (blocked(hover.value))
    return null
  return pending.value.compare(hover.value) <= 0
    ? { start: pending.value, end: hover.value }
    : { start: hover.value, end: pending.value }
})
const visualStart = computed(() => preview.value?.start ?? pending.value ?? committedStart.value)
const visualEnd = computed(() => preview.value?.end ?? (pending.value ? null : committedEnd.value))

function setView(next: CalendarDate, keep?: CalendarDate): void {
  view.value = shiftMonth(next, 0)
  emit('update:focusDate', fromCalendarDate(view.value))
  if (keep)
    focused.value = keep
  else if (!visible(focused.value))
    focused.value = seed(view.value)
}

function focusStop(): void {
  void nextTick(() => {
    rootRef.value?.querySelector<HTMLButtonElement>('.astryx-calendar-cell[tabindex="0"]')?.focus()
  })
}

function shift(amount: number): void {
  if (props.disabled)
    return
  if (amount < 0 && !canPrevious.value)
    return
  if (amount > 0 && !canNext.value)
    return
  setView(shiftMonth(view.value, amount))
  focusStop()
}

function navigateTo(date: Date): void {
  const target = toCalendarDate(date)
  const landing = blocked(target) ? seed(target) : target
  setView(target, landing)
  focusStop()
}

const handle: CalendarHandle = { navigateTo }
useHandleRef(() => props.handleRef, handle)
defineExpose(handle)

watch(() => props.focusDate ? dateISO(props.focusDate) : '', (iso) => {
  if (!iso || !props.focusDate)
    return
  const next = toCalendarDate(props.focusDate)
  if (next.year === view.value.year && next.month === view.value.month)
    return
  view.value = shiftMonth(next, 0)
  if (!visible(focused.value))
    focused.value = seed(view.value)
})

watch(headerLabel, label => announce(label))

function inSpan(date: CalendarDate, start: CalendarDate | null, end: CalendarDate | null): boolean {
  return !!start && !!end && date.compare(start) >= 0 && date.compare(end) <= 0
}

interface DayView {
  iso: string
  date: CalendarDate
  text: number
  outside: boolean
  shown: boolean
  disabled: boolean
  selected: boolean
  inRange: boolean
  rangeStart: boolean
  rangeEnd: boolean
  today: boolean
  tab: boolean
  roundStart: boolean
  roundEnd: boolean
  label: string
}

function paint(week: { days: { date: CalendarDate, iso: string, outside: boolean, day: number }[] }): DayView[] {
  const start = visualStart.value
  const end = visualEnd.value
  return week.days.map((day, index) => {
    const outside = day.outside
    const disabled = outside || blocked(day.date)
    const continues = !outside && !blocked(day.date) && inSpan(day.date, start, end)
    const previous = index > 0 ? week.days[index - 1]! : null
    const next = index < 6 ? week.days[index + 1]! : null
    const previousContinues = !!previous && !previous.outside && !blocked(previous.date) && inSpan(previous.date, start, end)
    const nextContinues = !!next && !next.outside && !blocked(next.date) && inSpan(next.date, start, end)
    const isStart = !!start && !outside && sameCalendarDay(day.date, start)
    const isEnd = !!end && !outside && sameCalendarDay(day.date, end)
    const selected = !outside && (
      (props.mode === 'single' && !!selectedSingle.value && sameCalendarDay(day.date, selectedSingle.value))
      || isStart
      || isEnd
    )
    const named = formatWeekdayDate(day.date, locale.value)
    let label = named
    if (props.mode === 'range' && isStart && isEnd)
      label = messages.value.calendar.rangeBoth(named)
    else if (props.mode === 'range' && isStart)
      label = messages.value.calendar.rangeStartName(named)
    else if (props.mode === 'range' && isEnd)
      label = messages.value.calendar.rangeEndName(named)
    return {
      iso: day.iso,
      date: day.date,
      text: day.day,
      outside,
      shown: props.hasOutsideDays || !outside,
      disabled,
      selected,
      inRange: continues && !isStart && !isEnd,
      rangeStart: isStart,
      rangeEnd: isEnd,
      today: !outside && sameCalendarDay(day.date, todayDate),
      tab: !outside && !props.disabled && sameCalendarDay(day.date, focused.value),
      roundStart: continues && (isStart || index === 0 || !previousContinues),
      roundEnd: continues && (isEnd || index === 6 || !nextContinues),
      label,
    }
  })
}

function pick(date: CalendarDate): void {
  if (props.disabled || blocked(date))
    return
  focused.value = date
  if (props.mode !== 'range') {
    const value = fromCalendarDate(date)
    emit('update:modelValue', value)
    emit('change', value)
    return
  }
  if (!pending.value) {
    pending.value = date
    const value = fromCalendarDate(date)
    emit('update:range', { start: value, end: null })
    emit('change', value)
    announce(messages.value.calendar.rangeStart(formatWeekdayDate(date, locale.value)))
    return
  }
  if (sameCalendarDay(date, pending.value) && props.minRangeSpan > 1) {
    pending.value = null
    hover.value = null
    emit('update:range', { start: null, end: null })
    emit('change', null)
    announce(messages.value.calendar.rangeCleared(formatWeekdayDate(date, locale.value)))
    return
  }
  const start = pending.value.compare(date) <= 0 ? pending.value : date
  const end = pending.value.compare(date) <= 0 ? date : pending.value
  pending.value = null
  hover.value = null
  const value: CalendarRangeValue = { start: fromCalendarDate(start), end: fromCalendarDate(end) }
  emit('update:range', value)
  emit('change', value.end)
  announce(messages.value.calendar.rangeComplete(
    formatWeekdayDate(start, locale.value),
    formatWeekdayDate(end, locale.value),
  ))
}

function onKeyDown(event: KeyboardEvent): void {
  if (props.disabled)
    return
  if (event.key === 'Escape' && pending.value) {
    event.preventDefault()
    event.stopPropagation()
    const date = pending.value
    pending.value = null
    hover.value = null
    emit('update:range', { start: null, end: null })
    announce(messages.value.calendar.rangeCleared(formatWeekdayDate(date, locale.value)))
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!blocked(focused.value))
      pick(focused.value)
    return
  }
  const move = resolveCalendarKey({
    key: event.key,
    rtl: rtl.value,
    focused: focused.value,
    weekStartsOn: weekStart.value,
    numberOfMonths: monthCount.value,
    viewYear: view.value.year,
    viewMonth: view.value.month,
    isOutOfBounds: date => isOutsideCalendarBounds(date, props.min, props.max),
    isDisabled: date => isCalendarDateDisabled(date, constraints()),
  })
  if (!move)
    return
  event.preventDefault()
  if (move.view)
    setView(move.view, move.date)
  else
    focused.value = move.date
  focusStop()
}
</script>

<template>
  <div
    ref="root"
    class="astryx-calendar"
    :class="{ 'is-disabled': disabled }"
    :data-months="monthCount"
    :data-mode="mode"
    :data-week-numbers="hasWeekNumbers || undefined"
    :aria-label="resolvedLabel"
  >
    <div class="astryx-calendar-header">
      <slot name="header">
        <button
          type="button"
          class="astryx-calendar-nav-button"
          :disabled="disabled || !canPrevious"
          :aria-label="messages.calendar.previousMonth"
          @click="shift(-1)"
        >
          <Icon icon="chevronLeft" size="sm" />
        </button>
        <span class="astryx-calendar-month-year">{{ headerLabel }}</span>
        <button
          type="button"
          class="astryx-calendar-nav-button"
          :disabled="disabled || !canNext"
          :aria-label="messages.calendar.nextMonth"
          @click="shift(1)"
        >
          <Icon icon="chevronRight" size="sm" />
        </button>
      </slot>
    </div>
    <div class="astryx-calendar-months">
      <section
        v-for="month in months"
        :key="`${month.year}-${month.month}`"
        class="astryx-calendar-month"
      >
        <div
          class="astryx-calendar-grid"
          role="grid"
          :aria-label="month.label"
          :aria-multiselectable="mode === 'range' ? 'true' : undefined"
          :data-week-numbers="hasWeekNumbers || undefined"
          tabindex="-1"
          @keydown="onKeyDown"
        >
          <div class="astryx-calendar-weekdays" role="row">
            <div v-if="hasWeekNumbers" class="astryx-calendar-weekday" role="columnheader">
              <VisuallyHidden>{{ weekName }}</VisuallyHidden>
            </div>
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
          <div
            v-for="(week, rowIndex) in month.weeks"
            :key="`${month.year}-${month.month}-${rowIndex}`"
            class="astryx-calendar-row"
            role="row"
          >
            <div v-if="hasWeekNumbers" class="astryx-calendar-week-number" role="rowheader">
              {{ week.number }}
            </div>
            <div
              v-for="day in paint(week)"
              :key="day.iso"
              class="astryx-calendar-gridcell"
              role="gridcell"
              :aria-selected="day.selected || day.inRange"
            >
              <button
                v-if="day.shown"
                type="button"
                class="astryx-calendar-cell"
                :class="{
                  'is-selected': day.selected,
                  'is-range-start': day.rangeStart,
                  'is-range-end': day.rangeEnd,
                  'is-in-range': day.inRange,
                  'is-round-start': day.roundStart,
                  'is-round-end': day.roundEnd,
                  'is-disabled': day.disabled,
                  'is-today': day.today,
                  'is-other-month': day.outside,
                }"
                :data-date="day.iso"
                :tabindex="day.tab ? 0 : -1"
                :aria-disabled="day.disabled || undefined"
                :aria-current="day.today ? 'date' : undefined"
                :aria-label="day.label"
                @click="day.outside ? undefined : pick(day.date)"
                @mouseenter="hover = day.outside || day.disabled ? null : day.date"
                @mouseleave="hover = null"
                @blur="hover = null"
                @focus="focused = day.outside ? focused : day.date"
              >
                <slot
                  name="day"
                  :date="day.date"
                  :is-selected="day.selected"
                  :is-disabled="day.disabled"
                  :is-today="day.today"
                  :is-in-month="!day.outside"
                >
                  <span class="astryx-calendar-day">{{ day.text }}</span>
                </slot>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
