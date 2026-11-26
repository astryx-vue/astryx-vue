<script setup lang="ts">
import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { PickerWheelOption } from './PickerWheel.vue'
import { computed, nextTick, onMounted, ref, shallowRef, useTemplateRef } from 'vue'
import { toCalendarDate } from '../Calendar/calendarDate.js'
import { isCalendarDateDisabled } from '../Calendar/useCalendarConstraints.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { formatCalendarMonth } from '../locale/format.js'
import { calendarMessages } from '../locale/messages/calendar.js'
import { dateInputMessages } from '../locale/messages/date-input.js'
import { clampMonthIndex, fromMonthIndex, monthIndex, reachableMonthRange } from './monthRange.js'
import PickerWheel from './PickerWheel.vue'
import TouchMonthGrid from './TouchMonthGrid.vue'

const props = withDefaults(defineProps<{
  selected?: Date | null
  min?: Date
  max?: Date
  isDateDisabled?: (date: Date) => boolean
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  weekStartsOn?: WeekStartsOn
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
const wheelsOpen = ref(false)
const dragX = ref<number | null>(null)
const coarse = useMediaQuery('(pointer: coarse)')
const titleRef = useTemplateRef<HTMLButtonElement>('title')
const prevRef = useTemplateRef<HTMLButtonElement>('prev')
const nextRef = useTemplateRef<HTMLButtonElement>('next')
// 今天在服务端和浏览器上可能不是同一天，所以挂载之后才读；在那之前面板什么都不画，
// 服务端渲染出来的标记和水合时一致。
const today = shallowRef<Date | null>(null)
const range = computed(() => reachableMonthRange(props.min, props.max, today.value ?? undefined))
const view = ref(0)
const cursor = computed(() => fromMonthIndex(view.value))

onMounted(() => {
  const now = new Date()
  const opening = props.selected ?? now
  today.value = now
  view.value = clampMonthIndex(monthIndex(opening.getFullYear(), opening.getMonth() + 1), range.value.min, range.value.max)
})
const monthLabel = computed(() => formatCalendarMonth(cursor.value.year, cursor.value.month, locale.value))
const resolvedSaveLabel = computed(() => props.saveLabel ?? messages.value.dateInput.savePicking)
const rtl = computed(() => typeof document !== 'undefined' && document.documentElement.dir === 'rtl')
const canPrev = computed(() => view.value > range.value.min)
const canNext = computed(() => view.value < range.value.max)
const prevIcon = computed(() => rtl.value ? 'chevronRight' : 'chevronLeft')
const nextIcon = computed(() => rtl.value ? 'chevronLeft' : 'chevronRight')

const monthOptions = computed<PickerWheelOption[]>(() => {
  const formatter = new Intl.DateTimeFormat(locale.value, { month: 'long' })
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    const target = monthIndex(cursor.value.year, month)
    return {
      value: String(month),
      label: formatter.format(new Date(cursor.value.year, index, 1)),
      disabled: target < range.value.min || target > range.value.max,
    }
  })
})

const yearOptions = computed<PickerWheelOption[]>(() => {
  const start = fromMonthIndex(range.value.min).year
  const end = fromMonthIndex(range.value.max).year
  const options: PickerWheelOption[] = []
  for (let year = start; year <= end; year += 1) {
    const january = monthIndex(year, 1)
    const december = monthIndex(year, 12)
    options.push({
      value: String(year),
      label: String(year),
      disabled: december < range.value.min || january > range.value.max,
    })
  }
  return options
})

/**
 * 翻到 `target` 月。到了可选范围的头，那一头的箭头会消失，消失的元素会丢掉焦点：
 * 焦点在它上面时，先等另一个箭头画出来，再把焦点交给它；两个箭头都消失就交给月份标题。
 */
function showMonth(target: number): void {
  const prevHides = target <= range.value.min
  const nextHides = target >= range.value.max
  const active = typeof document === 'undefined' ? null : document.activeElement
  const onPrev = prevHides && active != null && active === prevRef.value
  const onNext = nextHides && active != null && active === nextRef.value
  view.value = target
  if (!onPrev && !onNext)
    return
  const otherHides = onPrev ? nextHides : prevHides
  void nextTick(() => {
    const destination = otherHides ? titleRef.value : onPrev ? nextRef.value : prevRef.value
    destination?.focus({ preventScroll: true })
  })
}

function move(amount: number): void {
  showMonth(clampMonthIndex(view.value + amount, range.value.min, range.value.max))
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
function carrySelection(target: number): void {
  const selected = props.selected
  if (!coarse.value || !selected)
    return
  const { year, month } = fromMonthIndex(target)
  const lastDay = new Date(year, month, 0).getDate()
  let date = new Date(year, month - 1, Math.min(selected.getDate(), lastDay))
  if (props.min && date < props.min)
    date = new Date(props.min.getFullYear(), props.min.getMonth(), props.min.getDate())
  if (props.max && date > props.max)
    date = new Date(props.max.getFullYear(), props.max.getMonth(), props.max.getDate())
  if (allowed(date) && date.getTime() !== selected.getTime())
    emit('pick', date)
}

function setMonth(value: string): void {
  const target = monthIndex(cursor.value.year, Number(value))
  if (target < range.value.min || target > range.value.max)
    return
  view.value = target
  carrySelection(target)
}

function setYear(value: string): void {
  const year = Number(value)
  const target = clampMonthIndex(monthIndex(year, cursor.value.month), range.value.min, range.value.max)
  if (fromMonthIndex(target).year !== year)
    return
  view.value = target
  carrySelection(target)
}

function onReset(): void {
  if (props.isDisabled)
    return
  const now = new Date()
  view.value = clampMonthIndex(monthIndex(now.getFullYear(), now.getMonth() + 1), range.value.min, range.value.max)
  wheelsOpen.value = false
  emit('reset')
}

function onPointerDown(event: PointerEvent): void {
  dragX.value = event.clientX
}

function onPointerUp(event: PointerEvent): void {
  if (dragX.value == null)
    return
  const delta = event.clientX - dragX.value
  dragX.value = null
  if (Math.abs(delta) < 48)
    return
  const towardNext = rtl.value ? delta > 0 : delta < 0
  move(towardNext ? 1 : -1)
}

function onView(year: number, month: number): void {
  showMonth(clampMonthIndex(monthIndex(year, month), range.value.min, range.value.max))
}
</script>

<template>
  <div v-if="today" class="astryx-date-touch">
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
    <div v-else @pointerdown="onPointerDown" @pointerup="onPointerUp">
      <TouchMonthGrid
        :year="cursor.year"
        :month="cursor.month"
        :selected="selected"
        :min="min"
        :max="max"
        :is-date-disabled="isDateDisabled"
        :date-constraints="dateConstraints"
        :week-starts-on="weekStartsOn"
        :today="today"
        @pick="emit('pick', $event)"
        @update:view="onView"
      />
    </div>
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
