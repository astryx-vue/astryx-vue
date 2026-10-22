<script setup lang="ts">
import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { PickerWheelOption } from './PickerWheel.vue'
import { computed, ref } from 'vue'
import Icon from '../Icon/Icon.vue'
import { formatCalendarMonth } from '../locale/format.js'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
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
}>(), {
  selected: null,
  saveDisabled: false,
})

const emit = defineEmits<{
  pick: [date: Date]
  save: []
  reset: []
}>()

const messages = useAstryxMessages()
const locale = useAstryxLocale()
const wheelsOpen = ref(false)
const dragX = ref<number | null>(null)
const range = computed(() => reachableMonthRange(props.min, props.max))
const initial = props.selected ?? new Date()
const view = ref(clampMonthIndex(monthIndex(initial.getFullYear(), initial.getMonth() + 1), range.value.min, range.value.max))
const cursor = computed(() => fromMonthIndex(view.value))
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

function move(amount: number): void {
  view.value = clampMonthIndex(view.value + amount, range.value.min, range.value.max)
}

function setMonth(value: string): void {
  const target = monthIndex(cursor.value.year, Number(value))
  if (target < range.value.min || target > range.value.max)
    return
  view.value = target
}

function setYear(value: string): void {
  const year = Number(value)
  const target = clampMonthIndex(monthIndex(year, cursor.value.month), range.value.min, range.value.max)
  if (fromMonthIndex(target).year !== year)
    return
  view.value = target
}

function onReset(): void {
  const today = new Date()
  view.value = clampMonthIndex(monthIndex(today.getFullYear(), today.getMonth() + 1), range.value.min, range.value.max)
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
  view.value = clampMonthIndex(monthIndex(year, month), range.value.min, range.value.max)
}
</script>

<template>
  <div class="astryx-date-touch">
    <div class="astryx-date-touch-header">
      <button
        type="button"
        class="astryx-date-touch-title"
        :aria-expanded="wheelsOpen"
        :aria-label="wheelsOpen ? monthLabel : messages.dateInput.chooseMonthYear(monthLabel)"
        @click="wheelsOpen = !wheelsOpen"
      >
        {{ monthLabel }}
      </button>
      <div v-if="!wheelsOpen" class="astryx-date-touch-nav">
        <button v-if="canPrev" type="button" class="astryx-date-touch-arrow" :aria-label="messages.calendar.previousMonth" @click="move(-1)">
          <Icon :icon="prevIcon" size="sm" />
        </button>
        <button v-if="canNext" type="button" class="astryx-date-touch-arrow" :aria-label="messages.calendar.nextMonth" @click="move(1)">
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
