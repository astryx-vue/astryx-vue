<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import type { FieldStatusInput, FieldStatusType } from '../Field/types.js'
import type { NumberInputEmits, NumberInputProps, NumberInputSlots, NumberInputStatus } from './types.js'
import { computed, defineComponent, nextTick, onMounted, shallowRef, toRaw, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useNumberField } from '../composables/useNumberField.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import FieldInfoTip from '../Field/FieldInfoTip.vue'
import InputClearButton from '../Field/InputClearButton.vue'
import { useAriaRequired } from '../FormLayout/context.js'
import { useAstryxMessages } from '../locale/index.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import '../../styles/number-input.css'

defineOptions({ name: 'AstryxNumberInput', inheritAttrs: false })

const props = withDefaults(defineProps<NumberInputProps>(), {
  modelValue: null,
  placeholder: '',
  step: 1,
  size: 'md',
  isWheelEnabled: true,
  statusVariant: 'attached',
})

const emit = defineEmits<NumberInputEmits>()
defineSlots<NumberInputSlots>()

const PassThrough = defineComponent({
  name: 'NumberInputPassThrough',
  setup(_, { slots }) {
    return () => slots.default?.({})
  },
})

const attrs = useAttrs()
const inputElement = useTemplateRef<HTMLInputElement>('input')
const container = useTemplateRef<HTMLDivElement>('container')
const generatedId = `astryx-number-input-${useId()}`
const unitsId = `${generatedId}-units`
const disabledDescriptionId = `${generatedId}-disabled`
const disabledTooltipId = `${generatedId}-tooltip`
const inputId = computed(() => props.id ?? generatedId)
const messages = useAstryxMessages()
const incrementLabel = computed(() => messages.value.numberInput.increment(props.label))
const decrementLabel = computed(() => messages.value.numberInput.decrement(props.label))
const resolvedClearLabel = computed(() => messages.value.numberInput.clear(props.label))
const ariaRequired = useAriaRequired(props)

const isDisabled = computed(() => Boolean(props.isDisabled || props.disabled))
const isReadOnly = computed(() => Boolean(props.isReadOnly))
const isIntegerOnly = computed(() => Boolean(props.isIntegerOnly))
const hasClear = computed(() => Boolean(props.hasClear || props.clearable))
const resolvedName = computed(() => props.htmlName ?? props.name)
const disabledMessage = computed(() => props.disabledMessage ?? props.disabledReason)
const showsDisabledMessage = computed(() => isDisabled.value && !!disabledMessage.value?.trim())
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const icon = computed(() => props.startIcon ? toRaw(props.startIcon) : undefined)
const labelIcon = computed(() => props.labelIcon ? toRaw(props.labelIcon) : undefined)

/** 正在编辑的原始文本；null 表示没有未提交的输入，按聚焦状态决定显示什么 */
const draft = shallowRef<string | null>(null)
const isFocused = shallowRef(false)

const formattedText = computed(() => {
  if (props.modelValue == null)
    return ''
  return props.formatValue?.(props.modelValue) ?? String(props.modelValue)
})

// 聚焦时给原始数字，方便继续编辑；离开后回到格式化文本。
const displayValue = computed(() => {
  if (draft.value !== null)
    return draft.value
  if (props.modelValue == null)
    return ''
  return isFocused.value ? String(props.modelValue) : formattedText.value
})

const NUMBER_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i

/** 读一段文字里的数字。读不出数字返回 null。 */
function parseInputText(text: string): number | null {
  const trimmed = text.trim()
  if (trimmed === '' || !NUMBER_PATTERN.test(trimmed))
    return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

/** 草稿文本是否有问题：解析不出数字，或者跑出范围 */
const isDraftValid = computed(() => {
  if (draft.value === null || draft.value.trim() === '')
    return true
  const parsed = parseInputText(draft.value)
  if (parsed == null)
    return false
  if (props.min != null && parsed < props.min)
    return false
  if (props.max != null && parsed > props.max)
    return false
  return !isIntegerOnly.value || Number.isInteger(parsed)
})

const modelValueRef = computed<number | null>({
  get: () => props.modelValue ?? null,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const numberField = useNumberField({
  value: modelValueRef,
  min: () => props.min,
  max: () => props.max,
  step: () => props.step,
  disabled: isDisabled,
  readOnly: isReadOnly,
  integerOnly: isIntegerOnly,
  onChange: (value) => {
    modelValueRef.value = value
  },
})

function resolvedStatus(status: NumberInputStatus | undefined): FieldStatusInput | undefined {
  if (status == null || status === 'default')
    return undefined
  if (typeof status === 'string')
    return { type: status }
  return status
}

const statusValue = computed(() => resolvedStatus(props.status))
const statusType = computed<FieldStatusType | undefined>(() => statusValue.value?.type)
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
      isDisabled: isDisabled.value,
      isOptional: props.isOptional,
      isRequired: props.isRequired,
      labelIcon: labelIcon.value,
      labelTooltip: props.labelTooltip,
      status: statusValue.value,
      statusVariant: props.statusVariant,
      width: props.width,
    }
  : {})

// 原生属性透传到输入框，容器自己管 class 和 style。
const controlledAttrs = new Set([
  'class',
  'style',
  'id',
  'value',
  'type',
  'disabled',
  'readonly',
  'autofocus',
  'role',
  'inputmode',
  'aria-labelledby',
  'aria-describedby',
  'aria-required',
  'aria-invalid',
  'aria-disabled',
  'aria-valuenow',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuetext',
  'name',
])
function inputAttrs(): InputHTMLAttributes {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key))) as InputHTMLAttributes
}

function describedBy(fieldIds?: string): string | undefined {
  return [
    attrs['aria-describedby'],
    fieldIds,
    props.units ? unitsId : undefined,
    showsDisabledMessage.value ? disabledDescriptionId : undefined,
  ].filter(Boolean).join(' ') || undefined
}
function labelledBy(fieldLabelId?: string): string | undefined {
  return [fieldLabelId, attrs['aria-labelledby']].filter(Boolean).join(' ') || undefined
}

function stepBy(direction: 1 | -1): void {
  if (isDisabled.value || isReadOnly.value)
    return
  if (numberField.step(direction))
    draft.value = null
}

function focusInput(): void {
  inputElement.value?.focus({ preventScroll: true })
}

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  if (isDisabled.value || isReadOnly.value) {
    target.value = displayValue.value
    return
  }
  const text = target.value
  draft.value = text
  if (text.trim() === '') {
    numberField.setValue(null)
    return
  }
  // 读不出数字时只保留文字，不拦截输入；离开输入框后自然回到上一个值
  const parsed = parseInputText(text)
  if (parsed == null)
    return
  numberField.setValue(parsed)
}

function onFocus(event: FocusEvent): void {
  draft.value = null
  isFocused.value = true
  disabledTooltip.onTooltipPointerEnter()
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  draft.value = null
  isFocused.value = false
  disabledTooltip.onBlur()
  emit('blur', event)
}

function onKeyDown(event: KeyboardEvent): void {
  // 输入法组字期间的 Enter 和方向键属于候选词，不该提交或步进
  if (event.isComposing || event.keyCode === 229)
    return

  const hasModifier = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
  if (!hasModifier && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    emit('keydown', event)
    if (event.defaultPrevented)
      return
    event.preventDefault()
    stepBy(event.key === 'ArrowUp' ? 1 : -1)
    return
  }

  if (event.key === 'Enter') {
    draft.value = null
    emit('enter', event)
  }
  emit('keydown', event)
}

function onWheel(event: WheelEvent): void {
  if (!props.isWheelEnabled || isDisabled.value || isReadOnly.value)
    return
  // 只有聚焦在当前输入框上、且没有组合键时，滚轮才改值
  if (document.activeElement !== inputElement.value)
    return
  if (event.deltaY === 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
    return
  event.preventDefault()
  event.stopPropagation()
  stepBy(event.deltaY < 0 ? 1 : -1)
}

async function clearValue(): Promise<void> {
  if (isDisabled.value || isReadOnly.value)
    return
  draft.value = null
  numberField.setValue(null)
  await nextTick()
  focusInput()
}

function focusFromContainer(event: MouseEvent): void {
  if (isDisabled.value)
    return
  const target = event.target
  if (target instanceof Element && target.closest('input,button,a,select,textarea,[role="button"]'))
    return
  if (inputElement.value?.ownerDocument.getSelection()?.toString())
    return
  focusInput()
}

function stepFromButton(direction: 1 | -1): void {
  focusInput()
  stepBy(direction)
}

onMounted(() => {
  if (props.hasAutoFocus)
    focusInput()
})
</script>

<template>
  <component :is="shell" v-bind="fieldBindings">
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <template #default="field">
      <div
        ref="container"
        class="astryx-number-input" :class="[`size-${props.size}`, attrs.class]" :style="attrs.style"
        :data-status="statusType"
        :data-disabled="isDisabled || undefined"
        :data-readonly="isReadOnly || undefined"
        @pointerup="focusFromContainer"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
      >
        <span v-if="$slots.icon || icon" class="astryx-number-input-icon" aria-hidden="true">
          <slot name="icon"><component :is="icon" v-if="icon" /></slot>
        </span>
        <input
          :id="inputId"
          ref="input"
          v-bind="inputAttrs()"
          type="text"
          class="astryx-number-input-field"
          :inputmode="isIntegerOnly ? 'numeric' : 'decimal'"
          role="spinbutton"
          :value="displayValue"
          :name="resolvedName && !isDisabled && !props.formatValue ? resolvedName : undefined"
          :placeholder="props.placeholder"
          :autocomplete="(props.autoComplete ?? inputAttrs().autocomplete) as InputHTMLAttributes['autocomplete']"
          :disabled="isDisabled && !showsDisabledMessage"
          :readonly="isReadOnly || showsDisabledMessage"
          :aria-disabled="showsDisabledMessage || undefined"
          :aria-valuemin="props.min ?? undefined"
          :aria-valuemax="props.max ?? undefined"
          :aria-valuenow="props.modelValue ?? undefined"
          :aria-valuetext="props.modelValue == null || !props.formatValue ? undefined : formattedText"
          :aria-required="ariaRequired"
          :aria-invalid="statusType === 'error' || !isDraftValid ? 'true' : undefined"
          :aria-labelledby="labelledBy(field?.labelId)"
          :aria-describedby="describedBy(field?.describedBy)"
          :data-autofocus="props.hasAutoFocus || undefined"
          :aria-label="showsField ? undefined : props.label"
          @input="onInput"
          @keydown="onKeyDown"
          @focus="onFocus"
          @blur="onBlur"
          @wheel="onWheel"
        >
        <span v-if="props.units" :id="unitsId" class="astryx-number-input-units">{{ props.units }}</span>
        <InputClearButton
          v-if="hasClear && props.modelValue != null && !isDisabled && !isReadOnly"
          class="astryx-number-input-clear"
          :label="resolvedClearLabel"
          @click="clearValue"
        />
        <FieldInfoTip
          v-if="statusValue?.message && props.statusVariant === 'tooltip'"
          :text="statusValue.message" :type="statusValue.type"
        />
        <FieldIcon v-else-if="statusValue" :type="statusValue.type" />
        <div v-if="props.hasNumberSteppers" class="astryx-number-input-buttons">
          <button
            type="button"
            class="astryx-number-input-button increment"
            :disabled="isDisabled || isReadOnly || !numberField.canIncrement.value"
            :aria-label="incrementLabel"
            tabindex="-1"
            @pointerdown.prevent
            @click="stepFromButton(1)"
          >
            <svg class="astryx-number-input-chevron" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true" fill="none">
              <path d="M1.5 1.75 6 6.25 10.5 1.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            class="astryx-number-input-button decrement"
            :disabled="isDisabled || isReadOnly || !numberField.canDecrement.value"
            :aria-label="decrementLabel"
            tabindex="-1"
            @pointerdown.prevent
            @click="stepFromButton(-1)"
          >
            <svg class="astryx-number-input-chevron" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true" fill="none">
              <path d="M1.5 1.75 6 6.25 10.5 1.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <input
          v-if="resolvedName && !isDisabled && props.formatValue"
          type="hidden"
          :name="resolvedName"
          :value="props.modelValue ?? ''"
        >
      </div>
    </template>
  </component>
  <VisuallyHidden v-if="showsDisabledMessage" :id="disabledDescriptionId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage" :id="disabledTooltipId" :anchor="container" :open="disabledTooltip.isOpen.value"
    :text="disabledMessage ?? ''" @pointer-enter="disabledTooltip.onTooltipPointerEnter"
    @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
