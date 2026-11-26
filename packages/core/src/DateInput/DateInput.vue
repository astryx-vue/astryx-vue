<script setup lang="ts">
import type { FieldStatusType } from '../Field/types.js'
import type { DateInputEmits, DateInputProps, DateInputSlots } from './types.js'
import { computed, defineComponent, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import Calendar from '../Calendar/Calendar.vue'
import { toCalendarDate } from '../Calendar/calendarDate.js'
import { isCalendarDateDisabled } from '../Calendar/useCalendarConstraints.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { resolveDatePresentation, resolveDateSurface } from '../composables/useDatePresentation.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { usePendingChange } from '../composables/usePendingChange.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import { useInputGroupDisabled } from '../InputGroup/context.js'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { dateInputMessages } from '../locale/messages/date-input.js'
import Popover from '../Popover/Popover.vue'
import { useSize } from '../SizeContext/SizeContext.js'
import Spinner from '../Spinner/Spinner.vue'
import { isImeKeyEvent } from '../utils/ime.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { formatCommittedDate, parseTypedDate, resolveDateStatus, toIsoDate } from './dateText.js'
import NativeDateField from './NativeDateField.vue'
import TouchDateSheet from './TouchDateSheet.vue'
import { useCalendarDismiss } from './useCalendarDismiss.js'
import '../../styles/date-input.css'

defineOptions({ name: 'AstryxDateInput', inheritAttrs: false })

const props = withDefaults(defineProps<DateInputProps>(), {
  modelValue: null,
  disabled: false,
  clearable: false,
  statusVariant: 'attached',
  format: 'date_long',
  isLoading: false,
  numberOfMonths: 1,
})

const emit = defineEmits<DateInputEmits>()

defineSlots<DateInputSlots>()

// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')

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
const messages = useComponentMessages({ dateInput: dateInputMessages })
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
const isDisabled = useInputGroupDisabled(() => props.disabled)
const locked = computed(() => isDisabled.value || busy.value)
const disabledMessage = computed(() => (props.disabledMessage?.trim() || props.disabledReason?.trim()) || undefined)
const showsDisabledMessage = computed(() => locked.value && disabledMessage.value != null)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const showsClear = computed(() => (props.hasClear || props.clearable) && Boolean(props.modelValue) && !locked.value)
const policy = computed(() => resolveDatePresentation(props.presentation, props.nativePicker))
const surface = computed(() => resolveDateSurface(policy.value, isCoarsePointer.value))
const useSheet = computed(() => surface.value === 'sheet')
const popupWidth = computed(() => props.numberOfMonths === 2 ? 'min(36rem, calc(100vw - 16px))' : 280)
const popoverOpen = computed(() => !useSheet.value && isOpen.value)

function popupElement(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.getElementById(popupId.value)
}

// 系统日期控件那一路由 NativeDateField 自己播报。底部面板开着时从面板里播报，
// 面板外的公共播报区域被模态面板挡住了。
useBusyAnnouncement(
  () => busy.value && surface.value !== 'native',
  () => messages.value.dateInput.loading,
  () => (useSheet.value && isOpen.value ? popupElement() : null) ?? containerRef.value,
)

const dismiss = useCalendarDismiss({
  isOpen: popoverOpen,
  field: () => containerRef.value,
  input: () => inputRef.value,
  popup: popupElement,
  close: () => {
    isOpen.value = false
  },
})

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

function formatCommitted(date: Date | null): string {
  return formatCommittedDate(date, props.format, locale.value)
}

const parseDate = parseTypedDate

function syncDisplayValue(): void {
  inputValue.value = formatCommitted(props.modelValue)
}

watch(() => [props.modelValue, props.format, locale.value] as const, syncDisplayValue, { immediate: true })

const statusValue = computed(() => resolveDateStatus(props.status))
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
  const forwarded = parts.forwardedAttrs()
  if (locked.value)
    delete forwarded.onClick
  return forwarded
}

function onInput(event: Event): void {
  // 禁用和忙碌都不再走原生 `disabled`，输入要自己挡住（spec:AST-085 FR2）。
  if (useSheet.value || locked.value || (event instanceof InputEvent && event.isComposing))
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

function onToggleClick(event: MouseEvent): void {
  if (locked.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  if (useSheet.value)
    openCalendar()
}

/** 输入框里有还没变成值的文字。 */
function hasDraft(): boolean {
  return inputValue.value !== formatCommitted(props.modelValue)
}

function commitDraft(): void {
  const parsed = parseDate(inputValue.value.trim())
  if (parsed && allowed(parsed))
    modelValueRef.value = parsed
  syncDisplayValue()
}

function onInputKeyDown(event: KeyboardEvent): void {
  if (isImeKeyEvent(event))
    return
  if (event.key === 'Enter') {
    // 有打了一半的文字时先收下它，不然表单会带着旧值提交；禁用或忙碌的字段也不能提交表单。
    // 其余时候 Enter 和普通文本框一样，交给浏览器提交表单。
    if (locked.value || hasDraft()) {
      event.preventDefault()
      if (!locked.value)
        commitDraft()
    }
    return
  }
  if (locked.value || isOpen.value)
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
    :disabled="isDisabled"
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
        :class="[statusType ? `status-${statusType}` : undefined, `size-${size}`, parts.controlClass()]"
        :style="parts.controlStyle()"
        :data-status="statusType"
        :data-presentation="useSheet ? 'bottom-sheet' : 'popover'"
        @focusout="dismiss.onFieldFocusOut"
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
          :has-light-dismiss="false"
          role="dialog"
          :label="dialogLabel"
          @open-change="onOpenChange"
        >
          <div class="astryx-date-input-wrapper" :data-disabled="isDisabled ? 'true' : undefined" :data-busy="busy || undefined" :data-size="size" :data-status="statusType">
            <span v-if="$slots.prefix" class="astryx-date-input-prefix">
              <slot name="prefix" />
            </span>
            <button
              type="button"
              class="astryx-date-input-toggle"
              :aria-disabled="locked || undefined"
              :aria-describedby="showsDisabledMessage ? disabledMessageId : undefined"
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
              :readonly="useSheet || locked"
              :aria-disabled="locked || undefined"
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
            <Spinner v-if="busy" class="astryx-date-input-spinner" size="sm" aria-hidden="true" />
            <FieldIcon v-else-if="statusType && props.statusVariant !== 'tooltip'" :type="statusType" />
          </div>
          <template #content>
            <div v-if="popoverOpen" :id="popupId">
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
              :is-disabled="isDisabled"
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
          :value="props.modelValue ? toIsoDate(props.modelValue) : ''"
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
