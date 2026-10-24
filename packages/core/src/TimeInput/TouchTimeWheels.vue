<script setup lang="ts">
import type { HourFormat } from '../composables/useTimeValue.js'
import type { PickerWheelOption } from '../DateInput/PickerWheel.vue'
import { computed } from 'vue'
import { formatISOTime, isTimeInRange, parseISOTime } from '../composables/useTimeValue.js'
import PickerWheel from '../DateInput/PickerWheel.vue'
import { useAstryxMessages } from '../locale/index.js'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  hourFormat?: HourFormat
  hasSeconds?: boolean
  min?: string
  max?: string
}>(), {
  modelValue: null,
  hourFormat: '12h',
  hasSeconds: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const messages = useAstryxMessages()
const parsed = computed(() => props.modelValue ? parseISOTime(props.modelValue) : null)
const hour24 = computed(() => parsed.value?.hours ?? 0)
const minute = computed(() => parsed.value?.minutes ?? 0)
const second = computed(() => parsed.value?.seconds ?? 0)
const isPm = computed(() => hour24.value >= 12)
const hour12 = computed(() => hour24.value % 12 || 12)

function inRange(hours: number, minutes: number, seconds: number): boolean {
  return isTimeInRange(formatISOTime({ hours, minutes, seconds }, props.hasSeconds), props.min, props.max)
}

function hourAllowed(hours: number): boolean {
  for (let value = 0; value < 60; value += 1) {
    if (inRange(hours, value, 0))
      return true
  }
  return false
}

function commit(hours: number, minutes: number, seconds: number): void {
  if (inRange(hours, minutes, seconds)) {
    emit('update:modelValue', formatISOTime({ hours, minutes, seconds }, props.hasSeconds))
    return
  }
  for (let value = 0; value < 60; value += 1) {
    if (inRange(hours, value, 0)) {
      emit('update:modelValue', formatISOTime({ hours, minutes: value, seconds: 0 }, props.hasSeconds))
      return
    }
  }
}

function from12(hour: number, pm: boolean): number {
  if (hour === 12)
    return pm ? 12 : 0
  return pm ? hour + 12 : hour
}

const hourOptions = computed<PickerWheelOption[]>(() => {
  if (props.hourFormat === '24h') {
    return Array.from({ length: 24 }, (_, hour) => ({
      value: String(hour),
      label: String(hour).padStart(2, '0'),
      disabled: !hourAllowed(hour),
    }))
  }
  return Array.from({ length: 12 }, (_, index) => {
    const hour = index + 1
    return {
      value: String(hour),
      label: String(hour),
      disabled: !hourAllowed(from12(hour, isPm.value)),
    }
  })
})

const minuteOptions = computed<PickerWheelOption[]>(() => Array.from({ length: 60 }, (_, value) => ({
  value: String(value),
  label: String(value).padStart(2, '0'),
  disabled: !inRange(hour24.value, value, second.value),
})))

const secondOptions = computed<PickerWheelOption[]>(() => Array.from({ length: 60 }, (_, value) => ({
  value: String(value),
  label: String(value).padStart(2, '0'),
  disabled: !inRange(hour24.value, minute.value, value),
})))

const meridiemOptions = computed<PickerWheelOption[]>(() => [
  { value: 'am', label: messages.value.dateTimeInput.meridiemAM, disabled: !hourAllowed(from12(hour12.value, false)) },
  { value: 'pm', label: messages.value.dateTimeInput.meridiemPM, disabled: !hourAllowed(from12(hour12.value, true)) },
])

function onHour(value: string): void {
  const hour = props.hourFormat === '24h' ? Number(value) : from12(Number(value), isPm.value)
  commit(hour, minute.value, second.value)
}

function onMeridiem(value: string): void {
  commit(from12(hour12.value, value === 'pm'), minute.value, second.value)
}
</script>

<template>
  <div class="astryx-time-wheels">
    <PickerWheel
      :label="messages.dateTimeInput.hourWheel"
      :options="hourOptions"
      :model-value="hourFormat === '24h' ? String(hour24) : String(hour12)"
      @update:model-value="onHour"
    />
    <PickerWheel
      :label="messages.dateTimeInput.minuteWheel"
      :options="minuteOptions"
      :model-value="String(minute)"
      @update:model-value="commit(hour24, Number($event), second)"
    />
    <PickerWheel
      v-if="hasSeconds"
      :label="messages.dateTimeInput.secondWheel"
      :options="secondOptions"
      :model-value="String(second)"
      @update:model-value="commit(hour24, minute, Number($event))"
    />
    <PickerWheel
      v-if="hourFormat === '12h'"
      :label="messages.dateTimeInput.meridiemWheel"
      :options="meridiemOptions"
      :model-value="isPm ? 'pm' : 'am'"
      @update:model-value="onMeridiem"
    />
  </div>
</template>
