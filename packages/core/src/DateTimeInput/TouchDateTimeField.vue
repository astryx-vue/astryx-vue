<script setup lang="ts">
import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { HourFormat } from '../composables/useTimeValue.js'
import { computed, ref } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import { formatDisplayTime, formatISOTime, parseISOTime } from '../composables/useTimeValue.js'
import TouchDateSheet from '../DateInput/TouchDateSheet.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import TouchTimeWheels from '../TimeInput/TouchTimeWheels.vue'
import { formatInstant } from '../Timestamp/formatInstant.js'

const props = withDefaults(defineProps<{
  label: string
  inputId: string
  date?: Date | null
  time?: string | null
  describedBy?: string
  placeholder?: string
  timePlaceholder?: string
  timeLabel?: string
  hourFormat?: HourFormat
  hasSeconds?: boolean
  min?: string
  max?: string
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  weekStartsOn?: WeekStartsOn
  isDisabled?: boolean
}>(), {
  date: null,
  time: null,
  hourFormat: '12h',
  hasSeconds: false,
})

const emit = defineEmits<{
  pickDate: [value: Date]
  pickTime: [value: string]
  reset: []
}>()
const messages = useAstryxMessages()
const locale = useAstryxLocale()
const open = ref(false)
const panel = ref<'date' | 'time'>('date')

function datePart(value: string | null): Date | null {
  const date = value?.slice(0, 10) ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return null
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year!, month! - 1, day)
}

const dateText = computed(() => props.date ? formatInstant(props.date, 'date_long', locale.value) : '')
const timeText = computed(() => props.time ? formatDisplayTime(props.time, props.hourFormat, props.hasSeconds) : '')

function clockBound(value?: string): string | undefined {
  const parsed = parseISOTime(value?.slice(11) ?? '')
  return parsed ? formatISOTime(parsed, true) : undefined
}

function dateBound(value?: string): Date | undefined {
  return datePart(value ?? null) ?? undefined
}

function show(next: 'date' | 'time'): void {
  if (props.isDisabled)
    return
  panel.value = next
  open.value = true
}

function onDate(value: Date): void {
  if (props.isDisabled)
    return
  emit('pickDate', value)
}

function onTime(value: string): void {
  if (props.isDisabled)
    return
  emit('pickTime', value)
}

function onReset(): void {
  if (props.isDisabled)
    return
  emit('reset')
}

function saveDate(): void {
  if (!props.date)
    return
  panel.value = 'time'
}

function close(): void {
  open.value = false
}
</script>

<template>
  <div class="astryx-date-time-fields" data-presentation="bottom-sheet">
    <button
      type="button"
      class="astryx-date-touch-segment"
      :disabled="isDisabled"
      :aria-describedby="describedBy"
      @click="show('date')"
    >
      <Icon class="astryx-date-time-toggle-icon" icon="calendar" size="sm" />
      <span :data-placeholder="!dateText || undefined">{{ dateText || placeholder || messages.dateTimeInput.placeholder }}</span>
    </button>
    <button
      :id="inputId"
      type="button"
      class="astryx-date-touch-segment"
      :disabled="isDisabled"
      :aria-label="timeLabel || messages.dateTimeInput.timeLabel"
      :aria-describedby="describedBy"
      @click="show('time')"
    >
      <Icon class="astryx-date-time-clock-icon" icon="clock" size="sm" />
      <span :data-placeholder="!timeText || undefined">{{ timeText || timePlaceholder || messages.dateTimeInput.timePlaceholder }}</span>
    </button>
  </div>
  <BottomSheet v-model:is-open="open" :label="messages.dateTimeInput.dialogLabel" height="hug" :padding="0">
    <div class="astryx-date-time-touch">
      <div class="astryx-date-time-touch-tabs" role="tablist" :aria-label="messages.dateTimeInput.pickerMode">
        <button type="button" role="tab" :aria-selected="panel === 'date'" @click="panel = 'date'">
          {{ messages.dateTimeInput.dateLabel }}
        </button>
        <button type="button" role="tab" :aria-selected="panel === 'time'" @click="panel = 'time'">
          {{ messages.dateTimeInput.timeLabel }}
        </button>
      </div>
      <TouchDateSheet
        v-if="panel === 'date'"
        :selected="date"
        :min="dateBound(min)"
        :max="dateBound(max)"
        :date-constraints="dateConstraints"
        :week-starts-on="weekStartsOn"
        :save-label="messages.dateTimeInput.saveDatePicking"
        :save-disabled="!date"
        @pick="onDate"
        @save="saveDate"
        @reset="onReset"
      />
      <div v-else class="astryx-date-time-touch-time">
        <TouchTimeWheels
          :model-value="time"
          :hour-format="hourFormat"
          :has-seconds="hasSeconds"
          :min="clockBound(min)"
          :max="clockBound(max)"
          @update:model-value="onTime"
        />
        <button type="button" class="astryx-date-touch-save" @click="close">
          {{ messages.dateInput.savePicking }}
        </button>
      </div>
    </div>
  </BottomSheet>
</template>
