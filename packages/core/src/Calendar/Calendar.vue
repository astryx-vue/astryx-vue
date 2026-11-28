<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { CalendarEmits, CalendarHandle, CalendarProps, CalendarRangeValue, CalendarSlots } from './types.js'
import { computed, nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useHandleRef } from '../composables/useHandleRef.js'
import Icon from '../Icon/Icon.vue'
import { useCalendarSystem } from '../locale/calendar.js'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { formatDayNumber, standaloneShortWeekdayNames, weekdayNames } from '../locale/format.js'
import { calendarMessages } from '../locale/messages/calendar.js'
import { formatCalendarMonthLabel } from '../utils/calendarFormat.js'
import { calendarDayOfMonth, isInCalendarMonth } from '../utils/calendarSystem.js'
import { plainDateToISO } from '../utils/plainDate.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import {
  dateISO,
  formatWeekdayDate,
  fromCalendarDate,
  sameCalendarDay,
  toCalendarDate,
  weekFieldName,
  weekStartIndex,
} from './calendarDate.js'
import { addMonthStarts, isSameMonth, isWithinMonths, monthOf, monthStartOf } from './calendarMonths.js'
import { paintCalendarWeek } from './paintCalendarWeek.js'
import { isCalendarDateDisabled, isOutsideCalendarBounds } from './useCalendarConstraints.js'
import { buildMonthWeeks, firstEnabledDay } from './useCalendarGrid.js'
import { resolveCalendarKey } from './useCalendarKeyboard.js'
import { useCalendarToday } from './useCalendarToday.js'
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
const calendar = useCalendarSystem(() => props.calendar, 'Calendar')
const messages = useComponentMessages({ calendar: calendarMessages })
const announce = useAnnounce()
const rootRef = useTemplateRef<HTMLElement>('root')
const monthCount = computed<1 | 2>(() => props.numberOfMonths === 2 ? 2 : 1)
const weekStart = computed(() => weekStartIndex(props.weekStartsOn))
const { hasExplicitOpening, isMonthPending, isResolvingToday, openingFocus, resolveToday, today } = useCalendarToday(props, monthCount, calendar)
const pending = shallowRef<CalendarDate | null>(null)
const hover = shallowRef<CalendarDate | null>(null)

const opened = openingFocus(today.value)
const view = shallowRef(monthStartOf(calendar.value, opened))
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
  return isWithinMonths(calendar.value, date, view.value, monthCount.value)
}

/** 在 `date` 所在的历法月里找键盘焦点的落点：先选中值，再今天，再第一个可选的日子。 */
function seed(date: CalendarDate): CalendarDate {
  const month = monthOf(calendar.value, date)
  const candidates: CalendarDate[] = []
  if (props.mode === 'single' && props.modelValue)
    candidates.push(toCalendarDate(props.modelValue))
  if (today.value != null)
    candidates.push(today.value)
  const known = candidates.find(candidate => isInCalendarMonth(candidate, month) && !blocked(candidate))
  return known ?? firstEnabledDay(month, blocked) ?? monthStartOf(calendar.value, date)
}

focused.value = seed(view.value)

const months = computed(() => Array.from({ length: monthCount.value }, (_, index) => {
  const month = monthOf(calendar.value, addMonthStarts(calendar.value, view.value, index))
  const focusDay = isInCalendarMonth(focused.value, month) ? calendarDayOfMonth(calendar.value, focused.value) : undefined
  return {
    key: plainDateToISO(month.start),
    label: formatCalendarMonthLabel(calendar.value, month, locale.value, focusDay),
    weeks: buildMonthWeeks(calendar.value, month, weekStart.value, props.hasVariableRowCount),
  }
}))
const headerLabel = computed(() => months.value.map(month => month.label).join(' – '))
const canPrevious = computed(() => !props.min || toCalendarDate(props.min).compare(view.value) < 0)
const canNext = computed(() => !props.max || toCalendarDate(props.max).compare(addMonthStarts(calendar.value, view.value, monthCount.value)) >= 0)

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
  view.value = monthStartOf(calendar.value, next)
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
  setView(addMonthStarts(calendar.value, view.value, amount))
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
  if (isSameMonth(calendar.value, next, view.value))
    return
  view.value = monthStartOf(calendar.value, next)
  if (!visible(focused.value))
    focused.value = seed(view.value)
})

watch(headerLabel, (label) => {
  if (!isResolvingToday())
    announce(label)
}, { flush: 'sync' })

onMounted(() => resolveToday((known) => {
  if (hasExplicitOpening)
    return
  view.value = monthStartOf(calendar.value, openingFocus(known))
  focused.value = seed(view.value)
}))

watch(calendar, () => {
  view.value = monthStartOf(calendar.value, focused.value)
})

function nameOf(date: CalendarDate): string {
  return formatWeekdayDate(date, locale.value, calendar.value)
}

function dayLabel(date: CalendarDate, isStart: boolean, isEnd: boolean): string {
  const named = nameOf(date)
  if (props.mode !== 'range')
    return named
  if (isStart && isEnd)
    return messages.value.calendar.rangeBoth(named)
  if (isStart)
    return messages.value.calendar.rangeStartName(named)
  if (isEnd)
    return messages.value.calendar.rangeEndName(named)
  return named
}

const paintContext = computed(() => ({
  start: visualStart.value,
  end: visualEnd.value,
  preview: preview.value != null,
  selected: selectedSingle.value,
  today: today.value,
  focused: focused.value,
  hasOutsideDays: props.hasOutsideDays,
  disabled: props.disabled,
  blocked,
  label: dayLabel,
}))

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
    announce(messages.value.calendar.rangeStart(nameOf(date)))
    return
  }
  if (sameCalendarDay(date, pending.value) && props.minRangeSpan > 1) {
    pending.value = null
    hover.value = null
    emit('update:range', { start: null, end: null })
    emit('change', null)
    announce(messages.value.calendar.rangeCleared(nameOf(date)))
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
    nameOf(start),
    nameOf(end),
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
    announce(messages.value.calendar.rangeCleared(nameOf(date)))
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
    shiftKey: event.shiftKey,
    rtl: rtl.value,
    focused: focused.value,
    weekStartsOn: weekStart.value,
    numberOfMonths: monthCount.value,
    viewStart: view.value,
    calendar: calendar.value,
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
    :data-month-pending="isMonthPending || undefined"
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
        <span class="astryx-calendar-month-year">{{ isMonthPending ? '' : headerLabel }}</span>
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
        :key="month.key"
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
            :key="`${month.key}-${rowIndex}`"
            class="astryx-calendar-row"
            role="row"
          >
            <div v-if="hasWeekNumbers" class="astryx-calendar-week-number" role="rowheader">
              {{ formatDayNumber(week.number, locale) }}
            </div>
            <div
              v-for="day in paintCalendarWeek(week, paintContext)"
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
                  'astryx-calendar-range': day.inRange && !day.preview,
                  'astryx-calendar-range-preview': day.inRange && day.preview,
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
                :data-start="day.bandStart ? 'start' : undefined"
                :data-end="day.bandEnd ? 'end' : undefined"
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
                  <span class="astryx-calendar-day">{{ formatDayNumber(day.text, locale) }}</span>
                </slot>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
