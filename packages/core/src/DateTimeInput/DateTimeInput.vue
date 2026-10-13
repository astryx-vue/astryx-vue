<script setup lang="ts">
import type { DateTimeInputEmits, DateTimeInputProps } from './types.js'
import { computed, ref, useId, watch } from 'vue'
import DateInput from '../DateInput/DateInput.vue'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/index.js'
import TimeField from '../TimeInput/TimeField.vue'
import '../../styles/date-time-input.css'

defineOptions({ name: 'AstryxDateTimeInput' })

withDefaults(defineProps<Omit<DateTimeInputProps, 'modelValue'>>(), {
  modelValue: null,
  hourFormat: '12h',
  size: 'md',
  hasClear: false,
  statusVariant: 'attached',
})

const emit = defineEmits<DateTimeInputEmits>()
const model = defineModel<string | null>({ default: null })
const messages = useAstryxMessages()
const generatedId = `astryx-date-time-${useId()}`
const draftDate = ref<Date | null | undefined>(undefined)
const draftTime = ref<string | null | undefined>(undefined)

function parseDate(value: string | null): Date | null {
  const date = value?.slice(0, 10) ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return null
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function parseTime(value: string | null): string | null {
  const time = value?.slice(11, 16) ?? ''
  return /^\d{2}:\d{2}$/.test(time) ? time : null
}

function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const dateValue = computed(() => draftDate.value !== undefined ? draftDate.value : parseDate(model.value))
const timeValue = computed(() => draftTime.value !== undefined ? draftTime.value : parseTime(model.value))
const clearLabel = computed(() => messages.value.dateTimeInput.clear())

function publish(): void {
  const date = dateValue.value
  const time = timeValue.value
  const next = date && time ? `${formatDate(date)}T${time}` : null
  if (next != null) {
    draftDate.value = undefined
    draftTime.value = undefined
  }
  if (next !== model.value) {
    model.value = next
    emit('change', next)
  }
}

function onDate(value: Date | null): void {
  draftDate.value = value
  publish()
}

function onTime(value: string | null): void {
  draftTime.value = value
  publish()
}

function clear(): void {
  draftDate.value = null
  draftTime.value = null
  if (model.value !== null) {
    model.value = null
    emit('change', null)
  }
}

watch(model, (value) => {
  if (value) {
    draftDate.value = undefined
    draftTime.value = undefined
  }
})
</script>

<template>
  <Field
    :label="label" :input-id="generatedId" :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :status="status" :status-variant="statusVariant"
  >
    <template #default="field">
      <div class="astryx-date-time-input" :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined">
        <div class="astryx-date-time-fields">
          <DateInput
            :id="generatedId" :model-value="dateValue" :label="messages.dateTimeInput.dateLabel"
            format="system_date" is-label-hidden
            :placeholder="placeholder" :disabled="isDisabled" :size="size" :described-by="field.describedBy"
            @update:model-value="onDate"
          />
          <TimeField
            :model-value="timeValue" :label="messages.dateTimeInput.timeLabel" :described-by="field.describedBy"
            :hour-format="hourFormat" :presentation="presentation" :native-picker="nativePicker"
            :min="min" :max="max" :size="size" :is-disabled="isDisabled" :is-read-only="isReadOnly"
            :status="status" @update:model-value="onTime"
          />
        </div>
        <IconButton
          v-if="hasClear && (dateValue || timeValue) && !isDisabled" class="astryx-input-clear-button" variant="ghost" size="sm"
          :label="clearLabel" @click="clear"
        >
          <FieldIcon type="clear" />
        </IconButton>
      </div>
    </template>
  </Field>
</template>
