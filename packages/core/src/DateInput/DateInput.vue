<script setup lang="ts">
import type { FieldStatusInput, FieldStatusType } from '../Field/types.js'
import type { DateInputEmits, DateInputProps, DateInputSlots, DateInputStatus } from './types.js'
import { computed, defineComponent, ref, useId, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import Calendar from '../Calendar/Calendar.vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import Popover from '../Popover/Popover.vue'
import { formatInstant } from '../Timestamp/formatInstant.js'
import '../../styles/date-input.css'

defineOptions({ name: 'AstryxDateInput' })

const props = withDefaults(defineProps<DateInputProps>(), {
  modelValue: null,
  disabled: false,
  clearable: false,
  size: 'md',
  statusVariant: 'attached',
  format: 'date_long',
  presentation: 'popover',
})

const emit = defineEmits<DateInputEmits>()
defineSlots<DateInputSlots>()

const TOUCH_POINTER_QUERY = '(pointer: coarse)'

const PassThrough = defineComponent({
  name: 'DateInputPassThrough',
  setup(_, { slots }) {
    return () => slots.default?.({})
  },
})

const generatedId = `astryx-date-input-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const popupId = computed(() => `${inputId.value}-popup`)
const messages = useAstryxMessages()
const locale = useAstryxLocale()
const isCoarsePointer = useMediaQuery(TOUCH_POINTER_QUERY)
const resolvedPlaceholder = computed(() => props.placeholder ?? messages.value.dateInput.placeholder)
const resolvedClearLabel = computed(() => props.clearLabel ?? messages.value.dateInput.clear(props.label))
const dialogLabel = computed(() => props.label || messages.value.dateInput.dialogLabel)
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const isOpen = ref(false)
const inputValue = ref('')

const modelValueRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

function toIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatCommitted(date: Date | null): string {
  if (!date)
    return ''
  const iso = toIso(date)
  const format = props.format
  if (typeof format === 'function')
    return format(iso)
  if (format === 'system_date')
    return iso
  return formatInstant(date, format, locale.value)
}

function parseDate(str: string): Date | null {
  if (!str.trim())
    return null

  const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (match) {
    const [, year, month, day] = match
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (!Number.isNaN(date.getTime()) && date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day))
      return date
  }

  return null
}

function syncDisplayValue(): void {
  inputValue.value = formatCommitted(props.modelValue)
}

watch(() => [props.modelValue, props.format, locale.value] as const, syncDisplayValue, { immediate: true })

function resolvedStatus(status: DateInputStatus | undefined): FieldStatusInput | undefined {
  if (status == null || status === 'default')
    return undefined
  if (typeof status === 'string')
    return { type: status }
  return status
}

const statusValue = computed(() => resolvedStatus(props.status))
const statusType = computed<FieldStatusType | undefined>(() => statusValue.value?.type)
const useSheet = computed(() => {
  if (props.presentation === 'bottom-sheet')
    return true
  if (props.presentation === 'adaptive-bottom-sheet')
    return isCoarsePointer.value
  return false
})
const showsField = computed(() => {
  if (props.isLabelHidden && !props.description && !statusValue.value?.message)
    return false
  return Boolean(props.label || props.description || statusValue.value?.message)
})
const shell = computed(() => showsField.value ? Field : PassThrough)
const fieldBindings = computed(() => showsField.value
  ? {
      label: props.label ?? '',
      inputId: inputId.value,
      description: props.description,
      isLabelHidden: props.isLabelHidden || !props.label,
      isDisabled: props.disabled,
      status: statusValue.value,
      statusVariant: props.statusVariant,
    }
  : {})
const toggleLabel = computed(() => isOpen.value
  ? messages.value.dateInput.closeCalendar
  : messages.value.dateInput.openCalendar)

function describedBy(fieldIds?: string): string | undefined {
  return [props.describedBy, fieldIds].filter(Boolean).join(' ') || undefined
}

function onInput(event: Event): void {
  if (useSheet.value)
    return
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  inputValue.value = target.value

  const parsed = parseDate(value)
  if (parsed)
    modelValueRef.value = parsed
}

function onBlur(): void {
  if (!parseDate(inputValue.value.trim()))
    syncDisplayValue()
}

function onOpenChange(open: boolean): void {
  if (!useSheet.value)
    isOpen.value = open
}

function openCalendar(): void {
  if (!props.disabled)
    isOpen.value = true
}

function onToggleClick(): void {
  if (useSheet.value)
    openCalendar()
}

function onInputKeyDown(event: KeyboardEvent): void {
  if (props.disabled || isOpen.value)
    return
  if (event.key === 'ArrowDown' || (event.altKey && event.key === 'ArrowDown')) {
    event.preventDefault()
    openCalendar()
  }
}

function onCalendarChange(date: Date | null): void {
  modelValueRef.value = date
  isOpen.value = false
  inputRef.value?.blur()
}

function onClear(event: Event): void {
  event.stopPropagation()
  modelValueRef.value = null
  inputValue.value = ''
  isOpen.value = false
}

syncDisplayValue()
</script>

<template>
  <component :is="shell" v-bind="fieldBindings">
    <template #default="field">
      <div
        class="astryx-date-input"
        :class="[statusType ? `status-${statusType}` : undefined, `size-${props.size}`]"
        :data-status="statusType"
        :data-presentation="useSheet ? 'bottom-sheet' : 'popover'"
      >
        <Popover
          :is-open="useSheet ? false : isOpen"
          :is-enabled="!useSheet && !props.disabled"
          placement="below"
          alignment="start"
          :padding="0"
          :width="248"
          :has-close-button="false"
          :is-modal="false"
          :has-auto-focus="true"
          role="dialog"
          :label="dialogLabel"
          @open-change="onOpenChange"
        >
          <div class="astryx-date-input-wrapper" :data-disabled="props.disabled ? 'true' : undefined" :data-size="props.size" :data-status="statusType">
            <span v-if="$slots.prefix" class="astryx-date-input-prefix">
              <slot name="prefix" />
            </span>
            <button
              type="button"
              class="astryx-date-input-toggle"
              :disabled="props.disabled"
              :aria-label="toggleLabel"
              @click="onToggleClick"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" stroke-width="1.5" />
                <path d="M3 6H13" stroke="currentColor" stroke-width="1.5" />
                <path d="M5 3V5M11 3V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
            <input
              :id="inputId"
              ref="inputRef"
              type="text"
              class="astryx-date-input-field"
              role="combobox"
              :value="inputValue"
              :placeholder="resolvedPlaceholder"
              :disabled="props.disabled"
              :readonly="useSheet"
              :inputmode="useSheet ? 'none' : undefined"
              :aria-label="showsField ? undefined : props.label"
              :aria-labelledby="showsField ? field?.labelId : undefined"
              :aria-describedby="describedBy(field?.describedBy)"
              :aria-invalid="statusType === 'error' ? 'true' : undefined"
              :aria-controls="popupId"
              :aria-expanded="isOpen"
              aria-haspopup="dialog"
              :title="props.disabledReason"
              autocomplete="off"
              @input="onInput"
              @blur="onBlur"
              @click="openCalendar"
              @keydown="onInputKeyDown"
            >
            <button
              v-if="props.clearable && props.modelValue"
              type="button"
              class="astryx-date-input-clear"
              :aria-label="resolvedClearLabel"
              tabindex="-1"
              @click="onClear"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
            <span v-else-if="$slots.suffix" class="astryx-date-input-suffix">
              <slot name="suffix" />
            </span>
            <FieldIcon v-if="statusType && props.statusVariant !== 'tooltip'" :type="statusType" />
          </div>
          <template #content>
            <div v-if="!useSheet" :id="popupId">
              <Calendar
                :model-value="props.modelValue"
                :min="props.min"
                :max="props.max"
                :is-date-disabled="props.isDateDisabled"
                @update:model-value="onCalendarChange"
              />
            </div>
          </template>
        </Popover>
        <BottomSheet
          v-if="useSheet"
          v-model:is-open="isOpen"
          :label="dialogLabel"
          height="hug"
          :padding="0"
        >
          <div :id="popupId">
            <Calendar
              :model-value="props.modelValue"
              :min="props.min"
              :max="props.max"
              :is-date-disabled="props.isDateDisabled"
              @update:model-value="onCalendarChange"
            />
          </div>
        </BottomSheet>

        <input
          v-if="props.name"
          type="hidden"
          :name="props.name"
          :value="props.modelValue ? toIso(props.modelValue) : ''"
        >
      </div>
    </template>
  </component>
</template>
