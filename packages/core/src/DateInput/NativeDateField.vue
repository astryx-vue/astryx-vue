<script setup lang="ts">
import type { HTMLAttributes, StyleValue } from 'vue'
import type { DateInputProps } from './types.js'
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { toCalendarDate } from '../Calendar/calendarDate.js'
import { isCalendarDateDisabled } from '../Calendar/useCalendarConstraints.js'
import { usePendingChange } from '../composables/usePendingChange.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import { formatInstant } from '../Timestamp/formatInstant.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import '../../styles/date-input.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Pick<DateInputProps, 'id' | 'modelValue' | 'label' | 'description' | 'placeholder' | 'min' | 'max' | 'isDateDisabled' | 'dateConstraints'
  | 'name' | 'isLabelHidden' | 'isOptional' | 'isRequired' | 'labelTooltip' | 'disabled' | 'disabledReason' | 'disabledMessage'
  | 'isLoading' | 'changeAction' | 'hasClear' | 'clearable' | 'clearLabel' | 'size' | 'status' | 'statusVariant' | 'format'
  | 'describedBy' | 'width'> & {
    inputId: string
    containerClass?: HTMLAttributes['class']
    containerStyle?: StyleValue
    controlClass?: HTMLAttributes['class']
    controlStyle?: StyleValue
  }>(), {
  modelValue: null,
  disabled: false,
  clearable: false,
  size: 'md',
  statusVariant: 'attached',
  format: 'date_long',
  isLoading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  'change': [value: Date | null]
}>()

const attrs = useAttrs()
const ariaRequired = useAriaRequired(props)
const messages = useAstryxMessages()
const locale = useAstryxLocale()
const inputRef = useTemplateRef<HTMLInputElement>('input')
const containerRef = useTemplateRef<HTMLDivElement>('container')
const focused = ref(false)
const rejected = ref(false)
const pending = usePendingChange(() => props.changeAction)
const busy = computed(() => props.isLoading || pending.busy.value)
const locked = computed(() => props.disabled || busy.value)
const disabledMessage = computed(() => (props.disabledMessage?.trim() || props.disabledReason?.trim()) || undefined)
const disabledMessageId = `${props.inputId}-disabled`
const showsDisabledMessage = computed(() => locked.value && disabledMessage.value != null)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const showsClear = computed(() => (props.hasClear || props.clearable) && Boolean(props.modelValue) && !locked.value)

function toIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function allowed(date: Date): boolean {
  return !isCalendarDateDisabled(toCalendarDate(date), {
    min: props.min,
    max: props.max,
    isDateDisabled: props.isDateDisabled,
    dateConstraints: props.dateConstraints,
  })
}

const nativeValue = computed(() => props.modelValue ? toIso(props.modelValue) : '')
const overlay = computed(() => {
  if (!props.modelValue)
    return props.placeholder ?? messages.value.dateInput.placeholder
  const iso = toIso(props.modelValue)
  if (typeof props.format === 'function')
    return props.format(iso)
  if (props.format === 'system_date')
    return iso
  return formatInstant(props.modelValue, props.format ?? 'date_long', locale.value)
})
const statusType = computed(() => {
  const status = props.status
  if (status == null || status === 'default')
    return undefined
  return typeof status === 'string' ? status : status.type
})
const statusValue = computed(() => {
  const status = props.status
  if (status == null || status === 'default')
    return undefined
  if (typeof status === 'string')
    return { type: status }
  return status
})
const minIso = computed(() => props.min ? toIso(props.min) : undefined)
const maxIso = computed(() => props.max ? toIso(props.max) : undefined)

function write(value: string): void {
  const input = inputRef.value
  if (input && input.value !== value)
    input.value = value
}

function commit(value: Date | null): void {
  if (locked.value)
    return
  emit('update:modelValue', value)
  emit('change', value)
  void pending.run(value)
}

function read(raw: string): void {
  if (locked.value)
    return
  if (!raw) {
    rejected.value = false
    if (props.modelValue)
      commit(null)
    return
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!match)
    return
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  if (!allowed(date)) {
    rejected.value = true
    return
  }
  rejected.value = false
  if (!props.modelValue || toIso(props.modelValue) !== raw)
    commit(date)
}

function onNative(): void {
  read(inputRef.value?.value ?? '')
}

function onFocus(): void {
  focused.value = true
}

function onBlur(): void {
  focused.value = false
  rejected.value = false
  read(inputRef.value?.value ?? '')
  write(nativeValue.value)
}

function onInputFocus(event: FocusEvent): void {
  onFocus()
  disabledTooltip.onFocus(event)
}

function onInputBlur(): void {
  disabledTooltip.onBlur()
  onBlur()
}

function openPicker(): void {
  if (locked.value)
    return
  const input = inputRef.value
  if (!input)
    return
  input.focus()
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker()
    }
    catch {
      // Some browsers throw without a user gesture. Focus still opens the control.
    }
  }
}

function onClear(event: Event): void {
  event.stopPropagation()
  commit(null)
  write('')
}

onMounted(() => {
  write(nativeValue.value)
  const input = inputRef.value
  input?.addEventListener('input', onNative)
  input?.addEventListener('change', onNative)
})

onBeforeUnmount(() => {
  const input = inputRef.value
  input?.removeEventListener('input', onNative)
  input?.removeEventListener('change', onNative)
})

watch(nativeValue, (value) => {
  if (!focused.value)
    write(value)
})
</script>

<template>
  <Field
    :class="containerClass"
    :style="containerStyle"
    :label="label || messages.dateInput.dialogLabel"
    :input-id="inputId"
    :description="description"
    :width="width"
    :is-label-hidden="isLabelHidden || !label"
    :is-disabled="locked"
    :is-optional="isOptional"
    :is-required="isRequired"
    :label-tooltip="labelTooltip"
    :status="statusValue"
    :status-variant="statusVariant"
  >
    <template #default="field">
      <div
        ref="containerRef"
        class="astryx-date-input"
        :class="[statusType ? `status-${statusType}` : undefined, `size-${size}`, controlClass]"
        :style="controlStyle"
        :data-status="statusType"
        data-presentation="native"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
      >
        <div
          class="astryx-date-input-wrapper"
          :data-disabled="locked ? 'true' : undefined"
          :data-size="size"
          :data-status="statusType"
        >
          <button
            type="button"
            class="astryx-date-input-toggle"
            :disabled="locked"
            :aria-label="messages.dateInput.openCalendar"
            tabindex="-1"
            @click="openPicker"
          >
            <Icon icon="calendar" size="sm" />
          </button>
          <span class="astryx-date-input-native">
            <input
              v-bind="attrs"
              :id="inputId"
              ref="input"
              class="astryx-date-input-field"
              type="date"
              :min="minIso"
              :max="maxIso"
              :disabled="locked && !showsDisabledMessage"
              :name="name"
              :aria-label="label ? undefined : messages.dateInput.dialogLabel"
              :aria-labelledby="label ? field.labelId : undefined"
              :aria-describedby="[describedBy, field.describedBy].filter(Boolean).join(' ') || undefined"
              :aria-disabled="showsDisabledMessage || undefined"
              :aria-invalid="statusType === 'error' || rejected ? 'true' : undefined"
              :aria-required="ariaRequired"
              :aria-busy="busy || undefined"
              autocomplete="off"
              @focus="onInputFocus"
              @blur="onInputBlur"
            >
            <span class="astryx-date-input-overlay" :data-placeholder="modelValue ? undefined : 'true'" aria-hidden="true">
              {{ overlay }}
            </span>
          </span>
          <button
            v-if="showsClear"
            type="button"
            class="astryx-date-input-clear"
            :aria-label="clearLabel || messages.dateInput.clear(label)"
            tabindex="-1"
            @click="onClear"
          >
            <Icon icon="close" size="sm" />
          </button>
          <Spinner v-if="busy" size="sm" :aria-label="messages.dateInput.loading" />
          <FieldIcon v-else-if="statusType && statusVariant !== 'tooltip'" :type="statusType" />
        </div>
        <div class="astryx-date-input-alert" role="alert">
          {{ rejected ? messages.dateInput.invalidDate : '' }}
        </div>
      </div>
    </template>
  </Field>
  <VisuallyHidden v-if="showsDisabledMessage" :id="disabledMessageId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="`${disabledMessageId}-tooltip`" :anchor="containerRef" :open="disabledTooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter" @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
