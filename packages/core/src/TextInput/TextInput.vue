<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import type { TextInputEmits, TextInputProps, TextInputSlots } from './types.js'
import { computed, onMounted, shallowRef, toRaw, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonSpinner from '../Button/ButtonSpinner.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { useDevWarning } from '../composables/useDevWarning.js'
import { useInputContainer } from '../composables/useInputContainer.js'
import { useInputStatusIcon } from '../composables/useInputStatusIcon.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import InputClearButton from '../Field/InputClearButton.vue'
import { textEntryTraitAttributes } from '../Field/textEntryTraits.js'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import { useInputGroupContext, useInputGroupDisabled } from '../InputGroup/context.js'
import { useMobileKeyboard } from '../keyboard/useMobileKeyboard.js'
import { useComponentMessages } from '../locale/context.js'
import { fieldMessages } from '../locale/messages/field.js'
import { textInputMessages } from '../locale/messages/text-input.js'
import { useSize } from '../SizeContext/SizeContext.js'
import { withholdCallerHandlers } from '../utils/disabledInteraction.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { useTextInputAction } from './useTextInputAction.js'
import '../../styles/text-input.css'

defineOptions({ name: 'AstryxTextInput', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<TextInputProps, 'modelValue'>>(), {
  type: 'text',
  statusVariant: 'attached',
  loadingLabel: 'Loading',
  hasSpellCheck: undefined,
  hasAutoCorrect: undefined,
})

const emit = defineEmits<TextInputEmits>()
defineSlots<TextInputSlots>()
// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')
const disabled = useInputGroupDisabled(() => props.isDisabled)
const ariaRequired = useAriaRequired(props)
const messages = useComponentMessages({ textInput: textInputMessages, field: fieldMessages })
const inputGroup = useInputGroupContext()
const model = defineModel<string>({ required: true })
const attrs = useAttrs()
const input = useTemplateRef<HTMLInputElement>('input')
// 手机上获得焦点时，输入框自己停到屏幕键盘上方。
useMobileKeyboard(input)
const container = useTemplateRef<HTMLDivElement>('container')
const generatedId = `astryx-text-input-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const isComposing = shallowRef(false)
const disabledDescriptionId = `${generatedId}-disabled`
const disabledTooltipId = `${generatedId}-tooltip`
const showsDisabledMessage = computed(() => disabled.value && !!props.disabledMessage?.trim())
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const iconName = computed(() => typeof props.startIcon === 'string' && props.startIcon ? props.startIcon : undefined)
const icon = computed(() => props.startIcon && typeof props.startIcon !== 'string' ? toRaw(props.startIcon) : undefined)
// 只写 error、没写说明的状态：用一句隐藏文字顶上，读屏才知道值有错。在 InputGroup 里由组的状态负责。
const hasMessagelessError = computed(() => !inputGroup && props.status?.type === 'error' && !props.status.message)
const fallbackId = `${generatedId}-error`
useDevWarning('TextInput', 'an error status has no message, so only colour and an icon show the error. Give status.message the text that says what is wrong.', hasMessagelessError)
const action = useTextInputAction({
  model,
  changeAction: () => props.changeAction,
  emitChange: (value, event) => emit('change', value, event),
  emitError: (error, value, event) => emit('actionError', error, value, event),
})
const busy = computed(() => props.isLoading || action.isPending.value)
// 加载圈只是装饰；忙碌由输入框自己念一次（在对话框里就写进那个对话框）。
useBusyAnnouncement(busy, () => props.loadingLabel, () => container.value)
const element = computed(() => input.value ?? null)

function focus(options?: FocusOptions): void {
  input.value?.focus(options)
}
function blur(): void {
  input.value?.blur()
}
function select(): void {
  input.value?.select()
}
defineExpose({ element, focus, blur, select })

const parts = useFieldPartStyling({
  component: 'TextInput',
  props,
  attrs,
  reservedAttrs: ['id', 'value', 'type', 'disabled', 'readonly', 'autofocus', 'aria-labelledby', 'aria-describedby', 'aria-required', 'aria-busy', 'aria-disabled'],
})
// 禁用的输入框还留在 Tab 顺序里，浏览器照常派发事件；调用方的处理函数除了聚焦和失焦都不运行。
function inputAttrs(): InputHTMLAttributes {
  return withholdCallerHandlers(parts.forwardedAttrs(), disabled.value) as InputHTMLAttributes
}
// 软键盘属性；没传的不渲染，浏览器保持默认。
const entryAttrs = computed(() => ({
  ...textEntryTraitAttributes(props),
  ...(props.hasSpellCheck != null ? { spellcheck: props.hasSpellCheck } : {}),
}))
function describedBy(fieldIds?: string): string | undefined {
  return [attrs['aria-describedby'], fieldIds, hasMessagelessError.value ? fallbackId : undefined, showsDisabledMessage.value ? disabledDescriptionId : undefined].filter(Boolean).join(' ') || undefined
}
function labelledBy(labelId: string): string {
  return [labelId, attrs['aria-labelledby']].filter(Boolean).join(' ')
}
function acceptInput(event: Event): void {
  if (disabled.value || props.isReadOnly) {
    if (input.value)
      input.value.value = action.value.value
    return
  }
  if (isComposing.value || (event instanceof InputEvent && event.isComposing))
    return
  const value = input.value?.value ?? ''
  if (value !== action.value.value)
    action.commit(value, event)
}
function compositionEnd(event: CompositionEvent): void {
  isComposing.value = false
  acceptInput(event)
}
function keydown(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    disabledTooltip.hideImmediately()
  if (disabled.value) {
    // 禁用的输入框按回车不提交表单，也不运行调用方的回调。
    if (event.key === 'Enter')
      event.preventDefault()
    return
  }
  emit('keydown', event)
  if (!event.defaultPrevented && event.key === 'Enter' && !isComposing.value && !event.isComposing && event.keyCode !== 229)
    emit('enter', event)
}
function clear(event: MouseEvent): void {
  if (disabled.value || props.isReadOnly)
    return
  action.commit('', event)
  emit('clear', event)
  // 在点按这一下里聚焦：iOS Safari 只有在处理触摸的那一刻聚焦才会弹出键盘，
  // preventScroll 让滚动过的页面留在原处。
  focus({ preventScroll: true })
}
const resolvedClearLabel = computed(() => props.clearLabel ?? messages.value.textInput.clear(props.label))
const { statusIcon, statusIconProps } = useInputStatusIcon({
  status: () => props.status,
  statusVariant: () => props.statusVariant,
})
const inputContainer = useInputContainer({
  containerRef: container,
  inputRef: input,
  disabled: () => disabled.value,
})
onMounted(() => {
  if (props.hasAutoFocus)
    focus({ preventScroll: true })
})
</script>

<template>
  <Field
    :label="label" :input-id="inputId" :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="disabled" :is-optional="isOptional" :is-required="isRequired"
    :label-icon="labelIcon" :label-tooltip="labelTooltip" :optional-label="optionalLabel" :required-label="requiredLabel"
    :status="status" :status-variant="statusVariant"
    :class="parts.containerClass.value" :style="parts.containerStyle.value"
  >
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <template #default="field">
      <div
        ref="container" class="astryx-text-input" :class="parts.controlClass()" :style="parts.controlStyle()"
        :data-size="size" :data-status="status?.type" :data-disabled="disabled || undefined" :data-readonly="isReadOnly || undefined"
        @click="inputContainer.onClick" @mouseup="inputContainer.onMouseUp"
        @pointerenter="disabledTooltip.onPointerEnter" @pointerleave="disabledTooltip.onPointerLeave"
      >
        <span v-if="$slots.icon || icon || iconName" class="astryx-text-input-icon" aria-hidden="true"><slot name="icon"><Icon v-if="iconName" :icon="iconName" size="sm" /><component :is="icon" v-else-if="icon" /></slot></span>
        <input
          v-bind="{ ...inputAttrs(), ...entryAttrs }" :id="inputId" ref="input" class="astryx-text-input-control"
          :type="type" :value="action.value.value" :placeholder="placeholder" :name="disabled ? undefined : (htmlName ?? inputAttrs().name)"
          :autocomplete="(autoComplete ?? inputAttrs().autocomplete) as InputHTMLAttributes['autocomplete']" :readonly="isReadOnly || disabled"
          :aria-disabled="disabled || undefined" :aria-busy="busy || undefined"
          :aria-required="ariaRequired" :aria-invalid="status?.type === 'error' ? true : inputAttrs()['aria-invalid']"
          :aria-labelledby="labelledBy(field.labelId)" :aria-describedby="describedBy(field.describedBy)" :data-autofocus="hasAutoFocus || undefined"
          @input="acceptInput" @compositionstart="isComposing = true" @compositionend="compositionEnd" @keydown="keydown"
          @focus="disabledTooltip.onTooltipPointerEnter" @blur="disabledTooltip.onBlur"
        >
        <span v-if="$slots.end" class="astryx-text-input-end"><slot name="end" /></span>
        <!-- 加载圈排在清除按钮里侧，字段变忙时按钮留在原处。 -->
        <ButtonSpinner v-if="busy" class="astryx-text-input-spinner" :label="loadingLabel" is-decorative />
        <InputClearButton v-if="hasClear && action.value.value && !disabled && !isReadOnly" :label="resolvedClearLabel" @click="clear" />
        <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
      </div>
      <VisuallyHidden v-if="hasMessagelessError" :id="fallbackId">
        {{ messages.field.errorFallback }}
      </VisuallyHidden>
    </template>
  </Field>
  <VisuallyHidden v-if="showsDisabledMessage" :id="disabledDescriptionId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage" :id="disabledTooltipId" :anchor="container" :open="disabledTooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter" @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
