<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import type { FieldStatusInput, FieldStatusType } from '../Field/types.js'
import type { NumberInputEmits, NumberInputProps, NumberInputSlots, NumberInputStatus } from './types.js'
import { computed, getCurrentInstance, nextTick, onMounted, shallowRef, toRaw, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { computeSteppedValue, useNumberField } from '../composables/useNumberField.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import FieldInfoTip from '../Field/FieldInfoTip.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import InputClearButton from '../Field/InputClearButton.vue'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import { useInputGroupDisabled } from '../InputGroup/context.js'
import { useMobileKeyboard } from '../keyboard/useMobileKeyboard.js'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { numberInputMessages } from '../locale/messages/number-input.js'
import { useSize } from '../SizeContext/SizeContext.js'
import { withholdCallerHandlers } from '../utils/disabledInteraction.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { parseNumberInput } from './numberInputCommit.js'
import { formatEditableNumber } from './numberParser.js'
import { useStepperHold } from './useStepperHold.js'
import { useTypedNumber } from './useTypedNumber.js'
import '../../styles/number-input.css'

defineOptions({ name: 'AstryxNumberInput', inheritAttrs: false })

const props = withDefaults(defineProps<NumberInputProps>(), {
  modelValue: null,
  placeholder: '',
  step: 1,
  isWheelEnabled: true,
  statusVariant: 'attached',
})

const emit = defineEmits<NumberInputEmits>()

defineSlots<NumberInputSlots>()

// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')

const instance = getCurrentInstance()
const attrs = useAttrs()
const inputElement = useTemplateRef<HTMLInputElement>('input')
// 手机上获得焦点时，输入框自己停到屏幕键盘上方。
useMobileKeyboard(inputElement)
const container = useTemplateRef<HTMLDivElement>('container')
const generatedId = `astryx-number-input-${useId()}`
const unitsId = `${generatedId}-units`
const disabledDescriptionId = `${generatedId}-disabled`
const disabledTooltipId = `${generatedId}-tooltip`
const inputId = computed(() => props.id ?? generatedId)
const messages = useComponentMessages({ numberInput: numberInputMessages })
const locale = useAstryxLocale()
const incrementLabel = computed(() => messages.value.numberInput.increment(props.label))
const decrementLabel = computed(() => messages.value.numberInput.decrement(props.label))
const resolvedClearLabel = computed(() => messages.value.numberInput.clear(props.label))
const ariaRequired = useAriaRequired(props)

const isDisabled = useInputGroupDisabled(() => props.isDisabled || props.disabled)
const isReadOnly = computed(() => Boolean(props.isReadOnly))
const isIntegerOnly = computed(() => Boolean(props.isIntegerOnly))
const hasClear = computed(() => Boolean(props.hasClear || props.clearable))
const resolvedName = computed(() => props.htmlName ?? props.name)
const disabledMessage = computed(() => props.disabledMessage ?? props.disabledReason)
const showsDisabledMessage = computed(() => isDisabled.value && !!disabledMessage.value?.trim())
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const iconName = computed(() => typeof props.startIcon === 'string' && props.startIcon ? props.startIcon : undefined)
const icon = computed(() => props.startIcon && typeof props.startIcon !== 'string' ? toRaw(props.startIcon) : undefined)
const labelIcon = computed(() => props.labelIcon ? toRaw(props.labelIcon) : undefined)

const isFocused = shallowRef(false)
/** 按住步进重复走到的数，按住期间输入框显示它。 */
const heldValue = shallowRef<number | null>(null)

function draftOptions() {
  return {
    min: props.min,
    max: props.max,
    isIntegerOnly: isIntegerOnly.value,
    locale: locale.value,
  }
}

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

/** 调用方是否监听了 `entryErrorChange`。声明过的事件不进 attrs，只能看 vnode 上的 props。 */
function hasEntryErrorListener(): boolean {
  return Boolean(instance?.vnode.props?.onEntryErrorChange)
}

// 一个数没有固定长度，只有 Enter 或失焦才算打完；被拒的草稿留在框里，字段说明为什么。
// 按住步进时输入框显示的是格子上的数，拒绝暂时藏起来。
const typed = useTypedNumber({
  value: () => props.modelValue,
  rules: draftOptions,
  hasClear: () => hasClear.value,
  isDisabled: () => isDisabled.value,
  isHeld: () => heldValue.value !== null,
  status: () => resolvedStatus(props.status),
  hasListener: hasEntryErrorListener,
  message: () => messages.value.numberInput.invalidNumber,
  commitValue: value => numberField.setValue(value),
  reportEntryError: error => emit('entryErrorChange', error),
})
const draft = typed.draft

const formattedText = computed(() => {
  if (props.modelValue == null)
    return ''
  return props.formatValue?.(props.modelValue) ?? String(props.modelValue)
})

// 按住步进时显示重复走到的数；聚焦时给原始数字，方便继续编辑；离开后回到格式化文本。
const displayValue = computed(() => {
  const held = heldValue.value
  if (held !== null)
    return formatEditableNumber(held, locale.value)
  if (draft.value !== null)
    return draft.value
  if (props.modelValue == null)
    return ''
  return isFocused.value ? formatEditableNumber(props.modelValue, locale.value) : formattedText.value
})

/** 步进从草稿的读数走。读不出来就用已经提交的值。 */
const valueForStepping = computed(() => {
  if (draft.value === null)
    return props.modelValue ?? null
  if (draft.value.trim() === '')
    return null
  return parseNumberInput(draft.value, draftOptions()) ?? props.modelValue ?? null
})

// 有 `formatValue`，或失焦留下了被拒的草稿时，表单提交已提交的数，输入框自己不带 name。
const hasHiddenFormInput = computed(() => Boolean(props.formatValue) || typed.isKeptAtBlur.value)
const statusValue = computed(() => typed.fieldStatus.value)
const statusType = computed<FieldStatusType | undefined>(() => statusValue.value?.type)
// 同上游：标签藏起来也照样渲染 Field，隐藏的 <label> 给读屏，width 也落在 Field 上
const fieldBindings = computed(() => ({
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
}))

const parts = useFieldPartStyling({
  component: 'NumberInput',
  props,
  attrs,
  reservedAttrs: ['id', 'value', 'type', 'disabled', 'readonly', 'autofocus', 'role', 'inputmode', 'aria-labelledby', 'aria-describedby', 'aria-required', 'aria-invalid', 'aria-disabled', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-valuetext', 'name'],
})
// 禁用的输入框还留在 Tab 顺序里，浏览器照常派发事件；调用方的处理函数除了聚焦和失焦都不运行。
function inputAttrs(): InputHTMLAttributes {
  return withholdCallerHandlers(parts.forwardedAttrs(), isDisabled.value) as InputHTMLAttributes
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

function stepFrom(current: number | null, direction: 1 | -1): number | null {
  return computeSteppedValue({
    currentValue: current,
    direction,
    min: props.min ?? null,
    max: props.max ?? null,
    step: props.step,
    integerOnly: isIntegerOnly.value,
  })
}

function commitStepped(value: number): void {
  typed.reset()
  if (value !== (props.modelValue ?? null))
    numberField.setValue(value)
}

const stepperHold = useStepperHold({
  heldValue,
  base: () => valueForStepping.value,
  stepFrom,
  isLocked: () => isDisabled.value || isReadOnly.value,
  commit: commitStepped,
})

// 按住期间，步进按钮跟着它显示的数走。
const steppingBase = computed(() => heldValue.value ?? valueForStepping.value)
const canIncrement = computed(() => stepFrom(steppingBase.value, 1) !== steppingBase.value)
const canDecrement = computed(() => stepFrom(steppingBase.value, -1) !== steppingBase.value)

function stepBy(direction: 1 | -1): void {
  if (isDisabled.value || isReadOnly.value)
    return
  const next = stepFrom(valueForStepping.value, direction)
  if (next == null)
    return
  commitStepped(next)
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
  typed.onInput(target.value)
}

async function onFocus(event: FocusEvent): Promise<void> {
  // 失焦时留下的被拒草稿，回来聚焦时还在，可以接着改。
  if (!typed.isKeptAtBlur.value)
    draft.value = null
  // Tab 进来会选中全部文字，方便直接替换。有 `formatValue` 时静止的文字和可编辑的文字不同，
  // 聚焦后换文字会把全选压成光标，所以换完再选一次。
  const input = event.currentTarget as HTMLInputElement
  const shouldReselect = input.value.length > 0
    && input.selectionStart === 0
    && input.selectionEnd === input.value.length
  isFocused.value = true
  disabledTooltip.onTooltipPointerEnter()
  emit('focus', event)
  if (shouldReselect) {
    await nextTick()
    if (input.ownerDocument.activeElement === input)
      input.setSelectionRange(0, input.value.length)
  }
}

function onBlur(event: FocusEvent): void {
  typed.commit('blur')
  isFocused.value = false
  disabledTooltip.onBlur()
  emit('blur', event)
}

function onKeyDown(event: KeyboardEvent): void {
  // 输入法组字期间的 Enter 和方向键属于候选词，不该提交或步进
  if (event.isComposing || event.keyCode === 229)
    return

  if (isDisabled.value) {
    // 禁用的输入框按回车不提交表单，也不运行调用方的回调。
    if (event.key === 'Enter')
      event.preventDefault()
    return
  }

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
    typed.commit('enter')
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

function clearValue(): void {
  if (isDisabled.value || isReadOnly.value)
    return
  typed.reset()
  numberField.setValue(null)
  // 在点按这一下里聚焦：iOS Safari 只有在处理触摸的那一刻聚焦才会弹出键盘。
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

function stepFromButton(direction: 1 | -1, event: MouseEvent): void {
  // 按住松手后跟着来的那一下 click 不再步进；读屏的 click 没有指针，照常步进。
  if (stepperHold.consumeClick(event)) {
    focusInput()
    return
  }
  focusInput()
  stepBy(direction)
}

onMounted(() => {
  if (props.hasAutoFocus)
    focusInput()
})
</script>

<template>
  <Field v-bind="fieldBindings" :class="parts.containerClass.value" :style="parts.containerStyle.value">
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <template #default="field">
      <div
        ref="container"
        class="astryx-number-input" :class="[`size-${size}`, parts.controlClass()]" :style="parts.controlStyle()"
        :data-status="statusType"
        :data-disabled="isDisabled || undefined"
        :data-readonly="isReadOnly || undefined"
        @pointerup="focusFromContainer"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
      >
        <span v-if="$slots.icon || icon || iconName" class="astryx-number-input-icon" aria-hidden="true">
          <slot name="icon"><Icon v-if="iconName" :icon="iconName" size="sm" /><component :is="icon" v-else-if="icon" /></slot>
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
          :name="resolvedName && !isDisabled && !hasHiddenFormInput ? resolvedName : undefined"
          :placeholder="props.placeholder"
          :autocomplete="(props.autoComplete ?? inputAttrs().autocomplete) as InputHTMLAttributes['autocomplete']"
          :readonly="isReadOnly || isDisabled"
          :aria-disabled="isDisabled || undefined"
          :aria-valuemin="props.min ?? undefined"
          :aria-valuemax="props.max ?? undefined"
          :aria-valuenow="props.modelValue ?? undefined"
          :aria-valuetext="props.modelValue == null || !props.formatValue ? undefined : formattedText"
          :aria-required="ariaRequired"
          :aria-invalid="statusType === 'error' || typed.entryError.value != null ? 'true' : undefined"
          :aria-labelledby="labelledBy(field?.labelId)"
          :aria-describedby="describedBy(field?.describedBy)"
          :data-autofocus="props.hasAutoFocus || undefined"
          @input="onInput"
          @keydown="onKeyDown"
          @focus="onFocus"
          @blur="onBlur"
          @wheel="onWheel"
        >
        <span v-if="props.units" :id="unitsId" class="astryx-number-input-units">{{ props.units }}</span>
        <VisuallyHidden as="div" role="alert" aria-live="assertive">
          {{ typed.alertMessage.value }}
        </VisuallyHidden>
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
            v-for="direction in ([1, -1] as const)"
            :key="direction"
            type="button"
            class="astryx-number-input-button astryx-number-input-stepper" :class="direction === 1 ? 'increment' : 'decrement'"
            :data-direction="direction === 1 ? 'increment' : 'decrement'"
            :aria-disabled="isDisabled || isReadOnly || !(direction === 1 ? canIncrement : canDecrement) || undefined"
            :aria-label="direction === 1 ? incrementLabel : decrementLabel"
            tabindex="-1"
            @pointerdown.prevent="stepperHold.start(direction, direction === 1 ? canIncrement : canDecrement, $event)"
            @pointerup="stepperHold.end('release', $event.pointerId)"
            @pointercancel="stepperHold.end('cancel', $event.pointerId)"
            @lostpointercapture="stepperHold.end('cancel', $event.pointerId)"
            @contextmenu="stepperHold.onContextMenu()"
            @click="stepFromButton(direction, $event)"
          >
            <Icon class="astryx-number-input-chevron" icon="numberInput:stepperDown" size="xsm" />
          </button>
        </div>

        <input
          v-if="resolvedName && !isDisabled && hasHiddenFormInput"
          type="hidden"
          :name="resolvedName"
          :value="props.modelValue ?? ''"
        >
      </div>
    </template>
  </Field>
  <VisuallyHidden v-if="showsDisabledMessage" :id="disabledDescriptionId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage" :id="disabledTooltipId" :anchor="container" :open="disabledTooltip.isOpen.value"
    :text="disabledMessage ?? ''" @pointer-enter="disabledTooltip.onTooltipPointerEnter"
    @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
