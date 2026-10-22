<script setup lang="ts">
import type { DatePresentation } from '../composables/useDatePresentation.js'
import type { DateTimeInputEmits, DateTimeInputProps } from './types.js'
import { computed, ref, useAttrs, useId, watch } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { usePendingChange } from '../composables/usePendingChange.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import { formatISOTime, parseISOTime } from '../composables/useTimeValue.js'
import DateInput from '../DateInput/DateInput.vue'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import TimeField from '../TimeInput/TimeField.vue'
import { effectivePickerPresentation, resolvePickerPresentation } from '../utils/inputPresentation.js'
import TouchDateTimeField from './TouchDateTimeField.vue'
import '../../styles/date-time-input.css'

defineOptions({ name: 'AstryxDateTimeInput', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<DateTimeInputProps, 'modelValue'>>(), {
  modelValue: null,
  hourFormat: '12h',
  size: 'md',
  hasClear: false,
  hasSeconds: false,
  timeIncrement: 1,
  statusVariant: 'attached',
  isLoading: false,
})

const emit = defineEmits<DateTimeInputEmits>()
const model = defineModel<string | null>({ default: null })
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'DateTimeInput',
  props,
  attrs,
  reservedAttrs: ['id', 'aria-labelledby', 'aria-describedby', 'aria-required', 'aria-busy', 'aria-disabled', 'aria-invalid'],
})
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const coarse = useMediaQuery('(pointer: coarse)')
const messages = useAstryxMessages()
const generatedId = `astryx-date-time-${useId()}`
const draftDate = ref<Date | null | undefined>(undefined)
const draftTime = ref<string | null | undefined>(undefined)
const action = usePendingChange(() => props.changeAction)
const busy = computed(() => props.isLoading || action.busy.value)
const locked = computed(() => props.isDisabled || busy.value)
const datePresentation = computed<DatePresentation | undefined>(() => {
  const value = props.presentation
  if (value == null || value === 'text-input')
    return undefined
  return value
})
const useSheet = computed(() => resolvePickerPresentation(
  effectivePickerPresentation(datePresentation.value, props.nativePicker),
  coarse.value,
) === 'sheet')

function parseDate(value: string | null): Date | null {
  const date = value?.slice(0, 10) ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return null
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function parseTime(value: string | null): string | null {
  const parsed = parseISOTime(value?.slice(11) ?? '')
  return parsed ? formatISOTime(parsed, props.hasSeconds) : null
}

function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** 取 ISO 日期时间里的时间部分，给只用时间的那一半做范围限制。 */
function timePart(value?: string): string | undefined {
  const raw = value?.slice(11) ?? ''
  const parsed = parseISOTime(raw)
  return parsed ? formatISOTime(parsed, true) : undefined
}

const timeMin = computed(() => timePart(props.min))
const timeMax = computed(() => timePart(props.max))

const dateValue = computed(() => draftDate.value !== undefined ? draftDate.value : parseDate(model.value))
const timeValue = computed(() => draftTime.value !== undefined ? draftTime.value : parseTime(model.value))
const clearLabel = computed(() => messages.value.dateTimeInput.clear())
const resolvedTimeLabel = computed(() => props.timeLabel || messages.value.dateTimeInput.timeLabel)

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
    void action.run(next)
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
    void action.run(null)
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
    :class="parts.containerClass.value" :style="parts.containerStyle.value"
    :label="label" :input-id="generatedId" :description="description" :width="width"
    :is-label-hidden="hideLabel" :is-disabled="locked" :is-optional="isOptional" :is-required="isRequired"
    :label-tooltip="labelTooltip" :status="status" :status-variant="statusVariant"
  >
    <template #default="field">
      <div
        class="astryx-date-time-input"
        :class="parts.controlClass()"
        :style="parts.controlStyle()"
        :data-size="size" :data-status="status?.type" :data-disabled="locked || undefined" :aria-busy="busy || undefined"
      >
        <TouchDateTimeField
          v-if="useSheet"
          v-model="model"
          :label="label"
          :input-id="generatedId"
          :described-by="[attrs['aria-describedby'], field.describedBy].filter(Boolean).join(' ') || undefined"
          :placeholder="placeholder"
          :time-placeholder="timePlaceholder"
          :time-label="resolvedTimeLabel"
          :hour-format="hourFormat"
          :has-seconds="hasSeconds"
          :min="min"
          :max="max"
          :date-constraints="dateConstraints"
          :week-starts-on="weekStartsOn"
          :is-disabled="locked"
        />
        <div v-else class="astryx-date-time-fields">
          <DateInput
            :id="generatedId" :model-value="dateValue" :label="messages.dateTimeInput.dateLabel"
            is-label-hidden
            :placeholder="placeholder" :disabled="locked" :size="size" :described-by="[attrs['aria-describedby'], field.describedBy].filter(Boolean).join(' ') || undefined"
            :date-constraints="dateConstraints" :number-of-months="numberOfMonths" :week-starts-on="weekStartsOn"
            :presentation="datePresentation" :native-picker="nativePicker"
            :disabled-message="disabledMessage"
            @update:model-value="onDate"
          />
          <TimeField
            :model-value="timeValue" :label="resolvedTimeLabel" :described-by="[attrs['aria-describedby'], field.describedBy].filter(Boolean).join(' ') || undefined"
            :placeholder="timePlaceholder"
            :hour-format="hourFormat" :presentation="presentation" :native-picker="nativePicker"
            :has-seconds="hasSeconds" :increment="timeIncrement" :option-interval="timeOptionInterval"
            :min="timeMin" :max="timeMax" :size="size" :is-disabled="locked" :is-read-only="isReadOnly"
            :disabled-message="disabledMessage"
            :status="status" @update:model-value="onTime"
          />
        </div>
        <Spinner v-if="busy" size="sm" :aria-label="messages.dateInput.loading" />
        <IconButton
          v-else-if="hasClear && (dateValue || timeValue) && !locked" class="astryx-input-clear-button" variant="ghost" size="sm"
          :label="clearLabel" @click="clear"
        >
          <FieldIcon type="clear" />
        </IconButton>
      </div>
    </template>
  </Field>
</template>
