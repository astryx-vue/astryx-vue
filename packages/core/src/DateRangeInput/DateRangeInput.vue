<script setup lang="ts">
import type { DateRange, DateRangeInputEmits, DateRangeInputProps, DateRangePreset } from './types.js'
import { computed, shallowRef, useId } from 'vue'
import { applyRangeClick, formatDateRange, isRangeWithinSpan } from '../composables/useDateRange.js'
import { addMonths, todayISODate } from '../composables/useMonthGrid.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import Popover from '../Popover/Popover.vue'
import RangeCalendar from './RangeCalendar.vue'
import '../../styles/bordered-control.css'
import '../../styles/date-range-input.css'

defineOptions({ name: 'AstryxDateRangeInput' })

const props = withDefaults(defineProps<Omit<DateRangeInputProps, 'modelValue'>>(), {
  modelValue: null,
  monthCount: 2,
  minRangeSpan: 1,
  hasClear: true,
  size: 'md',
  statusVariant: 'attached',
})

const emit = defineEmits<DateRangeInputEmits>()
const model = defineModel<DateRange | null>({ default: null })
const messages = useAstryxMessages()
const locale = useAstryxLocale()
const generatedId = `astryx-date-range-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const open = shallowRef(false)
const pending = shallowRef<string | null>(null)
const today = todayISODate()
const cursor = shallowRef({ year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) })

const display = computed(() => formatDateRange(model.value, locale.value))
const placeholder = computed(() => props.placeholder ?? messages.value.dateRangeInput.placeholder)
const clearLabel = computed(() => props.clearLabel ?? messages.value.dateRangeInput.clear(props.label))

function commit(value: DateRange | null): void {
  model.value = value
  emit('change', value)
}

function onSelect(day: string): void {
  const result = applyRangeClick(pending.value, day, props.minRangeSpan, props.maxRangeSpan)
  pending.value = result.pending
  if (result.commit) {
    commit(result.commit)
    open.value = false
  }
}

function onShift(amount: number): void {
  cursor.value = addMonths(cursor.value.year, cursor.value.month, amount)
}

function onOpenChange(next: boolean): void {
  open.value = next
  if (next && model.value) {
    cursor.value = { year: Number(model.value.start.slice(0, 4)), month: Number(model.value.start.slice(5, 7)) }
    pending.value = null
  }
  if (!next)
    pending.value = null
}

function applyPreset(preset: DateRangePreset): void {
  const range = preset.getRange()
  if (!isRangeWithinSpan(range, props.minRangeSpan, props.maxRangeSpan))
    return
  commit(range)
  pending.value = null
  open.value = false
}

function presetDisabled(preset: DateRangePreset): boolean {
  return !isRangeWithinSpan(preset.getRange(), props.minRangeSpan, props.maxRangeSpan)
}

function clear(): void {
  pending.value = null
  commit(null)
  open.value = false
}
</script>

<template>
  <Field
    :label="label" :input-id="inputId" :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :status="status" :status-variant="statusVariant"
  >
    <template #default="field">
      <Popover
        :is-open="open" :is-enabled="!isDisabled" placement="below" alignment="start"
        :padding="0" width="min(40rem, calc(100vw - 16px))" :has-close-button="false" :is-modal="false"
        role="dialog" :label="messages.dateRangeInput.dialogLabel" @open-change="onOpenChange"
      >
        <div
          class="astryx-date-range-input astryx-bordered-control" :data-size="size"
          :data-status="status?.type" :data-disabled="isDisabled || undefined"
        >
          <button
            :id="inputId" type="button" class="astryx-date-range-trigger" :disabled="isDisabled"
            :aria-describedby="field.describedBy" :aria-invalid="status?.type === 'error' || undefined"
          >
            <Icon class="astryx-date-range-icon" icon="calendar" size="sm" />
            <span class="astryx-date-range-value" :data-placeholder="!display || undefined">{{ display || placeholder }}</span>
          </button>
          <IconButton v-if="hasClear && model && !isDisabled" class="astryx-input-clear-button" variant="ghost" size="sm" :label="clearLabel" @click="clear">
            <FieldIcon type="clear" />
          </IconButton>
          <FieldIcon v-if="status" :type="status.type" />
        </div>
        <template #content>
          <div class="astryx-date-range-popover">
            <div class="astryx-date-range-panel">
              <div v-if="presets?.length" class="astryx-date-range-presets">
                <button
                  v-for="preset in presets" :key="preset.label" type="button" class="astryx-date-range-preset"
                  :disabled="presetDisabled(preset)" @click="applyPreset(preset)"
                >
                  {{ preset.label }}
                </button>
              </div>
              <RangeCalendar
                :cursor-year="cursor.year" :cursor-month="cursor.month" :month-count="monthCount"
                :range="model" :pending="pending" :min="min" :max="max"
                :min-range-span="minRangeSpan" :max-range-span="maxRangeSpan" :week-starts-on="weekStartsOn"
                @select="onSelect" @shift="onShift"
              />
            </div>
          </div>
        </template>
      </Popover>
    </template>
  </Field>
</template>
