<script setup lang="ts">
import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { CalendarMonth, CalendarSystem } from '../utils/calendarSystem.js'
import type { PlainDate } from '../utils/plainDate.js'
import type { PickerWheelOption } from './PickerWheel.vue'
import { computed, nextTick, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { toCalendarDate } from '../Calendar/calendarDate.js'
import { isCalendarDateDisabled } from '../Calendar/useCalendarConstraints.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import Icon from '../Icon/Icon.vue'
import { useCalendarSystem } from '../locale/calendar.js'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { calendarMessages } from '../locale/messages/calendar.js'
import { dateInputMessages } from '../locale/messages/date-input.js'
import { formatCalendarMonthLabel, formatCalendarMonthName, formatCalendarYearLabel } from '../utils/calendarFormat.js'
import {
  calendarAddMonths,
  calendarDayOfMonth,
  calendarMonthFromYearMonth,
  calendarMonthOf,
  calendarMonthsInCalendarYear,
  calendarShiftYears,
  calendarYearMonthOf,
} from '../utils/calendarSystem.js'
import { plainDateAddDays, plainDateFromDate, plainDateToDate, plainDateToISO } from '../utils/plainDate.js'
import { createMonthRows } from './monthRows.js'
import PickerWheel from './PickerWheel.vue'
import { clampMonth, isMonthAfter, isMonthBefore, isMonthOutside, reachableMonths } from './sheetMonths.js'
import TouchMonthScroller from './TouchMonthScroller.vue'

const props = withDefaults(defineProps<{
  selected?: Date | null
  min?: Date
  max?: Date
  isDateDisabled?: (date: Date) => boolean
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  weekStartsOn?: WeekStartsOn
  /** 面板显示的历法。不传时用最近的 `InternationalizationProvider` 的历法。 */
  calendar?: CalendarSystem
  saveLabel?: string
  saveDisabled?: boolean
  /** 字段已禁用：重置整个不做，不清值也不翻回今天。 */
  isDisabled?: boolean
}>(), {
  selected: null,
  saveDisabled: false,
  isDisabled: false,
})

const emit = defineEmits<{
  pick: [date: Date]
  save: []
  reset: []
}>()

const messages = useComponentMessages({ calendar: calendarMessages, dateInput: dateInputMessages })
const locale = useAstryxLocale()
const calendar = useCalendarSystem(() => props.calendar, 'DateInput')
const wheelsOpen = ref(false)
const coarse = useMediaQuery('(pointer: coarse)')
const titleRef = useTemplateRef<HTMLButtonElement>('title')
const prevRef = useTemplateRef<HTMLButtonElement>('prev')
const nextRef = useTemplateRef<HTMLButtonElement>('next')
const monthsRef = useTemplateRef<InstanceType<typeof TouchMonthScroller>>('months')
// 今天在服务端和浏览器上可能不是同一天，所以挂载之后才读；在那之前面板什么都不画，
// 服务端渲染出来的标记和水合时一致。
const today = shallowRef<Date | null>(null)
const range = computed(() => reachableMonths(calendar.value, props.min, props.max, today.value ?? new Date()))
/** 面板显示的历法月，挂载后才有。 */
const view = shallowRef<CalendarMonth | null>(null)
/** 月份滚动器的一排排月份；能翻到的范围一变，滚动器按新的排号重新挂载。 */
const rows = computed(() => createMonthRows(calendar.value, range.value))
const rowsKey = computed(() => `${calendar.value}|${plainDateToISO(range.value.min.start)}|${plainDateToISO(range.value.max.start)}`)

function monthContaining(date: Date | PlainDate): CalendarMonth {
  return clampMonth(calendarMonthOf(calendar.value, date instanceof Date ? plainDateFromDate(date) : date), range.value)
}

onMounted(() => {
  const now = new Date()
  today.value = now
  view.value = monthContaining(props.selected ?? now)
})

watch(calendar, () => {
  if (view.value)
    view.value = monthContaining(view.value.start)
})

const cursor = computed(() => view.value ? calendarYearMonthOf(calendar.value, view.value) : { year: 0, month: 1 })
const monthLabel = computed(() => view.value ? formatCalendarMonthLabel(calendar.value, view.value, locale.value) : '')
const resolvedSaveLabel = computed(() => props.saveLabel ?? messages.value.dateInput.savePicking)
const rtl = computed(() => typeof document !== 'undefined' && document.documentElement.dir === 'rtl')
const canPrev = computed(() => view.value != null && isMonthAfter(view.value, range.value.min))
const canNext = computed(() => view.value != null && isMonthBefore(view.value, range.value.max))
const prevIcon = computed(() => rtl.value ? 'chevronRight' : 'chevronLeft')
const nextIcon = computed(() => rtl.value ? 'chevronLeft' : 'chevronRight')

const monthOptions = computed<PickerWheelOption[]>(() => {
  if (!view.value)
    return []
  const { year } = cursor.value
  return Array.from({ length: calendarMonthsInCalendarYear(calendar.value, year) }, (_, index) => {
    const month = calendarMonthFromYearMonth(calendar.value, { year, month: index + 1 })
    return {
      value: String(index + 1),
      label: formatCalendarMonthName(calendar.value, month, locale.value),
      disabled: isMonthOutside(month, range.value),
    }
  })
})

const yearOptions = computed<PickerWheelOption[]>(() => {
  if (!view.value)
    return []
  const start = calendarYearMonthOf(calendar.value, range.value.min).year
  const end = calendarYearMonthOf(calendar.value, range.value.max).year
  const options: PickerWheelOption[] = []
  for (let year = start; year <= end; year += 1) {
    const at = year === cursor.value.year ? view.value : undefined
    options.push({ value: String(year), label: formatCalendarYearLabel(calendar.value, year, locale.value, at) })
  }
  return options
})

/**
 * 翻到 `target` 月，`scroll` 时让月份滚动器平滑滚过去（滚动器自己滚到的月份不用再滚）。
 * 到了可选范围的头，那一头的箭头会消失，消失的元素会丢掉焦点：
 * 焦点在它上面时，先等另一个箭头画出来，再把焦点交给它；两个箭头都消失就交给月份标题。
 */
function showMonth(target: CalendarMonth, scroll = true): void {
  const prevHides = !isMonthAfter(target, range.value.min)
  const nextHides = !isMonthBefore(target, range.value.max)
  const active = typeof document === 'undefined' ? null : document.activeElement
  const onPrev = prevHides && active != null && active === prevRef.value
  const onNext = nextHides && active != null && active === nextRef.value
  view.value = target
  if (scroll)
    monthsRef.value?.scrollToMonth(rows.value.rowOf(target), 'smooth')
  if (!onPrev && !onNext)
    return
  const otherHides = onPrev ? nextHides : prevHides
  void nextTick(() => {
    const destination = otherHides ? titleRef.value : onPrev ? nextRef.value : prevRef.value
    destination?.focus({ preventScroll: true })
  })
}

function move(amount: number): void {
  if (view.value)
    showMonth(clampMonth(calendarAddMonths(calendar.value, view.value, amount), range.value))
}

function allowed(date: Date): boolean {
  return !isCalendarDateDisabled(toCalendarDate(date), {
    min: props.min,
    max: props.max,
    isDateDisabled: props.isDateDisabled,
    dateConstraints: props.dateConstraints,
  })
}

/**
 * 手指下，月份和年份滚轮像 UIDatePicker 一样带着已选日期走：日子不变，
 * 那个月没有这一天就落在月底，再收进最小最大日期之内。约束拒绝的日子不选，只翻日历。
 * 鼠标下滚轮只翻日历。
 */
function carrySelection(target: CalendarMonth): void {
  const selected = props.selected
  if (!coarse.value || !selected)
    return
  const day = Math.min(calendarDayOfMonth(calendar.value, plainDateFromDate(selected)), target.length)
  let date = plainDateToDate(plainDateAddDays(target.start, day - 1))
  if (props.min && date < props.min)
    date = new Date(props.min.getFullYear(), props.min.getMonth(), props.min.getDate())
  if (props.max && date > props.max)
    date = new Date(props.max.getFullYear(), props.max.getMonth(), props.max.getDate())
  if (allowed(date) && date.getTime() !== selected.getTime())
    emit('pick', date)
}

function setMonth(value: string): void {
  const target = calendarMonthFromYearMonth(calendar.value, { year: cursor.value.year, month: Number(value) })
  if (isMonthOutside(target, range.value))
    return
  view.value = target
  carrySelection(target)
}

function setYear(value: string): void {
  if (!view.value)
    return
  const year = Number(value)
  const shifted = calendarShiftYears(calendar.value, view.value.start, year - cursor.value.year)
  const target = monthContaining(shifted)
  if (calendarYearMonthOf(calendar.value, target).year !== year)
    return
  view.value = target
  carrySelection(target)
}

function onReset(): void {
  if (props.isDisabled)
    return
  const target = monthContaining(new Date())
  if (wheelsOpen.value)
    view.value = target
  else
    showMonth(target)
  wheelsOpen.value = false
  emit('reset')
}

/** 手指或惯性把日历滚到了别的月。滚轮开着时滚轮说了算，滚动器只是被它引导。 */
function onVisible(row: number): void {
  if (!wheelsOpen.value)
    showMonth(rows.value.monthAt(row), false)
}
</script>

<template>
  <div v-if="today && view" class="astryx-date-touch">
    <div class="astryx-date-touch-header">
      <button
        ref="title"
        type="button"
        class="astryx-date-touch-title"
        :aria-expanded="wheelsOpen"
        :aria-label="wheelsOpen ? monthLabel : messages.dateInput.chooseMonthYear(monthLabel)"
        @click="wheelsOpen = !wheelsOpen"
      >
        {{ monthLabel }}
      </button>
      <div v-if="!wheelsOpen" class="astryx-date-touch-nav">
        <button v-if="canPrev" ref="prev" type="button" class="astryx-date-touch-arrow" :aria-label="messages.calendar.previousMonth" @click="move(-1)">
          <Icon :icon="prevIcon" size="sm" />
        </button>
        <button v-if="canNext" ref="next" type="button" class="astryx-date-touch-arrow" :aria-label="messages.calendar.nextMonth" @click="move(1)">
          <Icon :icon="nextIcon" size="sm" />
        </button>
        <button type="button" class="astryx-date-touch-reset" @click="onReset">
          {{ messages.dateInput.resetPicking }}
        </button>
      </div>
    </div>
    <div v-if="wheelsOpen" class="astryx-date-touch-wheels">
      <PickerWheel
        :label="messages.dateInput.monthWheel"
        :options="monthOptions"
        :model-value="String(cursor.month)"
        @update:model-value="setMonth"
      />
      <PickerWheel
        :label="messages.dateInput.yearWheel"
        :options="yearOptions"
        :model-value="String(cursor.year)"
        @update:model-value="setYear"
      />
    </div>
    <TouchMonthScroller
      v-else
      ref="months"
      :key="rowsKey"
      :calendar="calendar"
      :rows="rows"
      :initial-row="rows.rowOf(view)"
      :selected="selected"
      :min="min"
      :max="max"
      :is-date-disabled="isDateDisabled"
      :date-constraints="dateConstraints"
      :week-starts-on="weekStartsOn"
      :today="today"
      @pick="emit('pick', $event)"
      @visible="onVisible"
    />
    <button
      type="button"
      class="astryx-date-touch-save"
      :disabled="!wheelsOpen && saveDisabled"
      @click="wheelsOpen ? (wheelsOpen = false) : emit('save')"
    >
      {{ wheelsOpen ? messages.dateInput.doneChoosingMonth : resolvedSaveLabel }}
    </button>
  </div>
</template>
