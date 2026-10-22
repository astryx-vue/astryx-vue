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
  hourFormat: '12h',
  hasSeconds: false,
})

const model = defineModel<string | null>({ default: null })
const messages = useAstryxMessages()
const locale = useAstryxLocale()
const open = ref(false)
const panel = ref<'date' | 'time'>('date')
const draftDate = ref<Date | null | undefined>(undefined)
const draftTime = ref<string | null | undefined>(undefined)

function datePart(value: string | null): Date | null {
  const date = value?.slice(0, 10) ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return null
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year!, month! - 1, day)
}

function timePart(value: string | null): string | null {
  const parsed = parseISOTime(value?.slice(11) ?? '')
  return parsed ? formatISOTime(parsed, props.hasSeconds) : null
}

const dateValue = computed(() => draftDate.value !== undefined ? draftDate.value : datePart(model.value))
const timeValue = computed(() => draftTime.value !== undefined ? draftTime.value : timePart(model.value))
const dateText = computed(() => dateValue.value ? formatInstant(dateValue.value, 'date_long', locale.value) : '')
const timeText = computed(() => timeValue.value ? formatDisplayTime(timeValue.value, props.hourFormat, props.hasSeconds) : '')

function clockBound(value?: string): string | undefined {
  const parsed = parseISOTime(value?.slice(11) ?? '')
  return parsed ? formatISOTime(parsed, true) : undefined
}

function dateBound(value?: string): Date | undefined {
  return datePart(value ?? null) ?? undefined
}

function publish(): void {
  const date = dateValue.value
  const time = timeValue.value
  if (!date || !time)
    return
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const next = `${date.getFullYear()}-${month}-${day}T${time}`
  draftDate.value = undefined
  draftTime.value = undefined
  if (next !== model.value)
    model.value = next
}

function show(next: 'date' | 'time'): void {
  if (props.isDisabled)
    return
  panel.value = next
  open.value = true
}

function onDate(value: Date): void {
  draftDate.value = value
  publish()
}

function onTime(value: string): void {
  draftTime.value = value
  publish()
}

function onReset(): void {
  draftDate.value = null
  draftTime.value = null
  model.value = null
}

function saveDate(): void {
  if (!dateValue.value)
    return
  panel.value = 'time'
}

function close(): void {
  open.value = false
  draftDate.value = undefined
  draftTime.value = undefined
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
        :selected="dateValue"
        :min="dateBound(min)"
        :max="dateBound(max)"
        :date-constraints="dateConstraints"
        :week-starts-on="weekStartsOn"
        :save-label="messages.dateTimeInput.saveDatePicking"
        :save-disabled="!dateValue"
        @pick="onDate"
        @save="saveDate"
        @reset="onReset"
      />
      <div v-else class="astryx-date-time-touch-time">
        <TouchTimeWheels
          :model-value="timeValue"
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
