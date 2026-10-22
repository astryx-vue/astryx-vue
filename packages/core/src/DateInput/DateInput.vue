<script setup lang="ts">
import type { FieldStatusInput, FieldStatusType } from '../Field/types.js'
import type { DateInputEmits, DateInputProps, DateInputSlots, DateInputStatus } from './types.js'
import { computed, defineComponent, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import Calendar from '../Calendar/Calendar.vue'
import { toCalendarDate } from '../Calendar/calendarDate.js'
import { isCalendarDateDisabled } from '../Calendar/useCalendarConstraints.js'
import { resolveDatePresentation, resolveDateSurface } from '../composables/useDatePresentation.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { usePendingChange } from '../composables/usePendingChange.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import Popover from '../Popover/Popover.vue'
import Spinner from '../Spinner/Spinner.vue'
import { formatInstant } from '../Timestamp/formatInstant.js'
import { isImeKeyEvent } from '../utils/ime.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import NativeDateField from './NativeDateField.vue'
import TouchDateSheet from './TouchDateSheet.vue'
import '../../styles/date-input.css'

defineOptions({ name: 'AstryxDateInput', inheritAttrs: false })

const props = withDefaults(defineProps<DateInputProps>(), {
  modelValue: null,
  disabled: false,
  clearable: false,
  size: 'md',
  statusVariant: 'attached',
  format: 'date_long',
  isLoading: false,
  numberOfMonths: 1,
})

const emit = defineEmits<DateInputEmits>()
defineSlots<DateInputSlots>()
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'DateInput',
  props,
  attrs,
  reservedAttrs: ['id', 'value', 'type', 'disabled', 'readonly', 'name', 'min', 'max', 'placeholder', 'aria-labelledby', 'aria-describedby', 'aria-required', 'aria-busy', 'aria-disabled', 'aria-invalid', 'aria-expanded', 'aria-controls', 'aria-haspopup'],
})
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const ariaRequired = useAriaRequired(props)

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
const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const isOpen = ref(false)
const inputValue = ref('')
const disabledMessageId = `${generatedId}-disabled`

const pending = usePendingChange(() => props.changeAction)
const busy = computed(() => props.isLoading || pending.busy.value)
const locked = computed(() => props.disabled || busy.value)
const disabledMessage = computed(() => (props.disabledMessage?.trim() || props.disabledReason?.trim()) || undefined)
const showsDisabledMessage = computed(() => locked.value && disabledMessage.value != null)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const showsClear = computed(() => (props.hasClear || props.clearable) && Boolean(props.modelValue) && !locked.value)
const policy = computed(() => resolveDatePresentation(props.presentation, props.nativePicker))
const surface = computed(() => resolveDateSurface(policy.value, isCoarsePointer.value))
const useSheet = computed(() => surface.value === 'sheet')
const popupWidth = computed(() => props.numberOfMonths === 2 ? 'min(36rem, calc(100vw - 16px))' : 280)

function allowed(date: Date): boolean {
  return !isCalendarDateDisabled(toCalendarDate(date), {
    min: props.min,
    max: props.max,
    isDateDisabled: props.isDateDisabled,
    dateConstraints: props.dateConstraints,
  })
}

function commit(value: Date | null): void {
  if (locked.value)
    return
  emit('update:modelValue', value)
  emit('change', value)
  void pending.run(value)
}

const modelValueRef = computed({
  get: () => props.modelValue,
  set: value => commit(value),
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
const showsField = computed(() => Boolean(props.label || props.description || statusValue.value?.message))
const shell = computed(() => showsField.value ? Field : PassThrough)
const fieldBindings = computed(() => showsField.value
  ? {
      label: props.label ?? '',
      inputId: inputId.value,
      description: props.description,
      isLabelHidden: hideLabel.value || !props.label,
      isDisabled: locked.value,
      isOptional: props.isOptional,
      isRequired: props.isRequired,
      labelTooltip: props.labelTooltip,
      width: props.width,
      status: statusValue.value,
      statusVariant: props.statusVariant,
    }
  : {})
const toggleLabel = computed(() => isOpen.value
  ? messages.value.dateInput.closeCalendar
  : messages.value.dateInput.openCalendar)

function describedBy(fieldIds?: string): string | undefined {
  return [attrs['aria-describedby'], props.describedBy, fieldIds, showsDisabledMessage.value ? disabledMessageId : undefined].filter(Boolean).join(' ') || undefined
}

function inputAttrs(): Record<string, unknown> {
  return parts.forwardedAttrs()
}

function onInput(event: Event): void {
  if (useSheet.value || (event instanceof InputEvent && event.isComposing))
    return
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  inputValue.value = target.value

  const parsed = parseDate(value)
  if (parsed && allowed(parsed))
    modelValueRef.value = parsed
}

function onBlur(): void {
  disabledTooltip.onBlur()
  if (!parseDate(inputValue.value.trim()))
    syncDisplayValue()
}

function onOpenChange(open: boolean): void {
  if (!useSheet.value)
    isOpen.value = open
}

function openCalendar(): void {
  if (!locked.value)
    isOpen.value = true
}

function onToggleClick(): void {
  if (useSheet.value)
    openCalendar()
}

function onInputKeyDown(event: KeyboardEvent): void {
  if (isImeKeyEvent(event) || locked.value || isOpen.value)
    return
  if (event.key === 'ArrowDown' || (event.altKey && event.key === 'ArrowDown')) {
    event.preventDefault()
    openCalendar()
  }
}

function onCalendarChange(date: Date | null): void {
  modelValueRef.value = date
  if (!useSheet.value) {
    isOpen.value = false
    inputRef.value?.blur()
  }
}

function onSheetSave(): void {
  isOpen.value = false
}

function onSheetReset(): void {
  modelValueRef.value = null
}

function onClear(event: Event): void {
  event.stopPropagation()
  modelValueRef.value = null
  inputValue.value = ''
  isOpen.value = false
  inputRef.value?.focus({ preventScroll: true })
}

function onToggleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    disabledTooltip.hideImmediately()
}

defineExpose({
  inputValue,
  isOpen,
  onCalendarChange,
  onClear,
  parseDate,
})

syncDisplayValue()
</script>

<template>
  <NativeDateField
    v-if="surface === 'native'"
    :input-id="inputId"
    :model-value="modelValue"
    :label="label"
    :description="description"
    :placeholder="resolvedPlaceholder"
    :min="min"
    :max="max"
    :is-date-disabled="isDateDisabled"
    :date-constraints="dateConstraints"
    :name="name"
    :is-label-hidden="hideLabel"
    :is-optional="isOptional"
    :is-required="isRequired"
    :label-tooltip="labelTooltip"
    :disabled="disabled"
    :disabled-reason="disabledReason"
    :is-loading="busy"
    :clearable="clearable"
    :clear-label="resolvedClearLabel"
    :size="size"
    :status="status"
    :status-variant="statusVariant"
    :format="format"
    :described-by="[attrs['aria-describedby'], props.describedBy].filter(Boolean).join(' ') || undefined"
    :disabled-message="disabledMessage"
    :width="width"
    :container-class="parts.containerClass.value"
    :container-style="parts.containerStyle.value"
    :control-class="parts.controlClass()"
    :control-style="parts.controlStyle()"
    v-bind="inputAttrs()"
    @update:model-value="commit"
  />
  <component :is="shell" v-else v-bind="fieldBindings" :class="parts.containerClass.value" :style="parts.containerStyle.value">
    <template #default="field">
      <div
        ref="containerRef"
        class="astryx-date-input"
        :class="[statusType ? `status-${statusType}` : undefined, `size-${props.size}`, parts.controlClass()]"
        :style="parts.controlStyle()"
        :data-status="statusType"
        :data-presentation="useSheet ? 'bottom-sheet' : 'popover'"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
      >
        <Popover
          :is-open="useSheet ? false : isOpen"
          :is-enabled="!useSheet && !locked"
          placement="below"
          alignment="start"
          :padding="0"
          :width="popupWidth"
          :has-close-button="false"
          :is-modal="false"
          :has-auto-focus="true"
          role="dialog"
          :label="dialogLabel"
          @open-change="onOpenChange"
        >
          <div class="astryx-date-input-wrapper" :data-disabled="locked ? 'true' : undefined" :data-size="props.size" :data-status="statusType">
            <span v-if="$slots.prefix" class="astryx-date-input-prefix">
              <slot name="prefix" />
            </span>
            <button
              type="button"
              class="astryx-date-input-toggle"
              :disabled="locked"
              :aria-label="toggleLabel"
              @click="onToggleClick"
              @keydown="onToggleKeyDown"
            >
              <Icon icon="calendar" size="sm" />
            </button>
            <input
              v-bind="inputAttrs()"
              :id="inputId"
              ref="inputRef"
              type="text"
              class="astryx-date-input-field"
              role="combobox"
              :value="inputValue"
              :placeholder="resolvedPlaceholder"
              :disabled="locked && !showsDisabledMessage"
              :readonly="useSheet || showsDisabledMessage"
              :aria-disabled="showsDisabledMessage || undefined"
              :inputmode="useSheet ? 'none' : undefined"
              :aria-label="showsField ? undefined : props.label"
              :aria-labelledby="showsField ? field?.labelId : undefined"
              :aria-describedby="describedBy(field?.describedBy)"
              :aria-invalid="statusType === 'error' ? 'true' : undefined"
              :aria-required="ariaRequired"
              :aria-busy="busy || undefined"
              :aria-controls="popupId"
              :aria-expanded="isOpen"
              aria-haspopup="dialog"
              autocomplete="off"
              @input="onInput"
              @blur="onBlur"
              @focus="disabledTooltip.onFocus"
              @click="openCalendar"
              @keydown="onInputKeyDown"
            >
            <button
              v-if="showsClear"
              type="button"
              class="astryx-date-input-clear"
              :aria-label="resolvedClearLabel"
              tabindex="-1"
              @click="onClear"
            >
              <Icon icon="close" size="sm" />
            </button>
            <span v-else-if="$slots.suffix" class="astryx-date-input-suffix">
              <slot name="suffix" />
            </span>
            <Spinner v-if="busy" class="astryx-date-input-spinner" size="sm" :aria-label="messages.dateInput.loading" />
            <FieldIcon v-else-if="statusType && props.statusVariant !== 'tooltip'" :type="statusType" />
          </div>
          <template #content>
            <div v-if="!useSheet" :id="popupId">
              <Calendar
                :model-value="props.modelValue"
                :min="props.min"
                :max="props.max"
                :is-date-disabled="props.isDateDisabled"
                :date-constraints="props.dateConstraints"
                :number-of-months="props.numberOfMonths"
                :week-starts-on="props.weekStartsOn"
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
            <TouchDateSheet
              :selected="props.modelValue"
              :min="props.min"
              :max="props.max"
              :is-date-disabled="props.isDateDisabled"
              :date-constraints="props.dateConstraints"
              :week-starts-on="props.weekStartsOn"
              @pick="onCalendarChange"
              @save="onSheetSave"
              @reset="onSheetReset"
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
  <VisuallyHidden v-if="showsDisabledMessage && surface !== 'native'" :id="disabledMessageId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage && surface !== 'native'"
    :id="`${disabledMessageId}-tooltip`" :anchor="containerRef" :open="disabledTooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter" @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
