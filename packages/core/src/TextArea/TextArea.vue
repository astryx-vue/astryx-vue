<script setup lang="ts">
import type { TextareaHTMLAttributes } from 'vue'
import type { TextAreaEmits, TextAreaProps, TextAreaSlots } from './types.js'
import { computed, onMounted, shallowRef, toRaw, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonSpinner from '../Button/ButtonSpinner.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { countCharacters } from '../composables/countCharacters.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useDevWarning } from '../composables/useDevWarning.js'
import { useInputContainer } from '../composables/useInputContainer.js'
import Field from '../Field/Field.vue'
import FieldInfoTip from '../Field/FieldInfoTip.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import InputClearButton from '../Field/InputClearButton.vue'
import { textEntryTraitAttributes } from '../Field/textEntryTraits.js'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import { useInputGroupContext } from '../InputGroup/context.js'
import { useMobileKeyboard } from '../keyboard/useMobileKeyboard.js'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { fieldMessages } from '../locale/messages/field.js'
import { textAreaMessages } from '../locale/messages/text-area.js'
import { textInputMessages } from '../locale/messages/text-input.js'
import { useSize } from '../SizeContext/SizeContext.js'
import { withholdCallerHandlers } from '../utils/disabledInteraction.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { useTextAreaAction } from './useTextAreaAction.js'
import '../../styles/text-area.css'

defineOptions({ name: 'AstryxTextArea', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<TextAreaProps, 'modelValue'>>(), {
  statusVariant: 'attached',
  resize: 'vertical',
  rows: 3,
  loadingLabel: 'Loading',
  hasSpellCheck: true,
  hasAutoCorrect: undefined,
})

const emit = defineEmits<TextAreaEmits>()
defineSlots<TextAreaSlots>()
// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')
const ariaRequired = useAriaRequired(props)
const messages = useComponentMessages({ textArea: textAreaMessages, textInput: textInputMessages, field: fieldMessages })
const inputGroup = useInputGroupContext()
const announce = useAnnounce()
const COUNTER_WARNING_THRESHOLD = 0.8
type CounterZone = 'under' | 'near' | 'over'
const counterZone = shallowRef<CounterZone | null>(null)
const limit = computed(() => {
  const raw = props.maxLength ?? props.maxlength
  if (raw == null || raw === '')
    return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
})
const model = defineModel<string>({ required: true })
const attrs = useAttrs()
const input = useTemplateRef<HTMLTextAreaElement>('input')
// 手机上获得焦点时，输入框自己停到屏幕键盘上方。
useMobileKeyboard(input)
const container = useTemplateRef<HTMLDivElement>('container')
const generatedId = `astryx-text-area-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const isComposing = shallowRef(false)
const disabledDescriptionId = `${generatedId}-disabled`
const disabledTooltipId = `${generatedId}-tooltip`
const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim())
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const iconName = computed(() => typeof props.startIcon === 'string' && props.startIcon ? props.startIcon : undefined)
const icon = computed(() => props.startIcon && typeof props.startIcon !== 'string' ? toRaw(props.startIcon) : undefined)
// 只写 error、没写说明的状态：用一句隐藏文字顶上，读屏才知道值有错。在 InputGroup 里由组的状态负责。
const hasMessagelessError = computed(() => !inputGroup && props.status?.type === 'error' && !props.status.message)
const fallbackId = `${generatedId}-error`
useDevWarning('TextArea', 'an error status has no message, so only colour and an icon show the error. Give status.message the text that says what is wrong.', hasMessagelessError)
const action = useTextAreaAction({
  model,
  changeAction: () => props.changeAction,
  emitChange: (value, event) => emit('change', value, event),
  emitError: (error, value, event) => emit('actionError', error, value, event),
})
const busy = computed(() => props.isLoading || action.isPending.value)
// 加载圈只是装饰；忙碌由输入框自己念一次（在对话框里就写进那个对话框）。
useBusyAnnouncement(busy, () => props.loadingLabel, () => container.value)
const valueLength = computed(() => (limit.value == null ? 0 : countCharacters(action.value.value)))
const locale = useAstryxLocale()
// 同上游 @astryx.textArea.counter：「164/2,000」，没有空格，数字按语言分组
const counterText = computed(() => {
  const format = new Intl.NumberFormat(locale.value)
  return `${format.format(valueLength.value)}/${format.format(limit.value ?? 0)}`
})
const isOverLimit = computed(() => limit.value != null && valueLength.value > limit.value)

function announceCounter(length: number): void {
  const max = limit.value
  if (max == null)
    return
  const zone: CounterZone = length > max ? 'over' : length >= max * COUNTER_WARNING_THRESHOLD ? 'near' : 'under'
  if (zone === counterZone.value)
    return
  counterZone.value = zone
  if (zone === 'over')
    announce(messages.value.textArea.charactersOverLimit(length - max), 'assertive')
  else if (zone === 'near')
    announce(messages.value.textArea.charactersRemaining(max - length))
}
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
  component: 'TextArea',
  props,
  attrs,
  reservedAttrs: ['id', 'value', 'rows', 'cols', 'disabled', 'readonly', 'autofocus', 'minlength', 'maxlength', 'wrap', 'spellcheck', 'aria-labelledby', 'aria-describedby', 'aria-required', 'aria-busy', 'aria-disabled'],
})
// 禁用的文本框还留在 Tab 顺序里，浏览器照常派发事件；调用方的处理函数除了聚焦和失焦都不运行。
function inputAttrs(): TextareaHTMLAttributes {
  return withholdCallerHandlers(parts.forwardedAttrs(), !!props.isDisabled) as TextareaHTMLAttributes
}
// 软键盘属性；没传的不渲染，浏览器保持默认。
const entryAttrs = computed(() => textEntryTraitAttributes(props))
function describedBy(fieldIds?: string): string | undefined {
  return [attrs['aria-describedby'], fieldIds, hasMessagelessError.value ? fallbackId : undefined, showsDisabledMessage.value ? disabledDescriptionId : undefined].filter(Boolean).join(' ') || undefined
}
function labelledBy(labelId: string): string {
  return [labelId, attrs['aria-labelledby']].filter(Boolean).join(' ')
}
function acceptInput(event: Event): void {
  if (props.isDisabled || props.isReadOnly) {
    if (input.value)
      input.value.value = action.value.value
    return
  }
  if (isComposing.value || (event instanceof InputEvent && event.isComposing))
    return
  const value = input.value?.value ?? ''
  if (limit.value != null)
    announceCounter(countCharacters(value))
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
  if (props.isDisabled)
    return
  emit('keydown', event)
  if (!event.defaultPrevented && event.key === 'Enter' && !isComposing.value && !event.isComposing && event.keyCode !== 229)
    emit('enter', event)
}
function clear(event: MouseEvent): void {
  if (props.isDisabled || props.isReadOnly)
    return
  action.commit('', event)
  emit('clear', event)
  // 在点按这一下里聚焦：iOS Safari 只有在处理触摸的那一刻聚焦才会弹出键盘，
  // preventScroll 让滚动过的页面留在原处。
  focus({ preventScroll: true })
}
const resolvedClearLabel = computed(() => props.clearLabel ?? messages.value.textInput.clear(props.label))
const inputContainer = useInputContainer({
  containerRef: container,
  inputRef: input,
  disabled: () => props.isDisabled,
})
onMounted(() => {
  if (props.hasAutoFocus)
    focus({ preventScroll: true })
})
</script>

<template>
  <Field
    :label="label" :input-id="inputId" :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :label-icon="labelIcon" :label-tooltip="labelTooltip" :optional-label="optionalLabel" :required-label="requiredLabel"
    :status="status" :status-variant="statusVariant"
    :class="parts.containerClass.value" :style="parts.containerStyle.value"
  >
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <template #default="field">
      <div
        ref="container" class="astryx-text-area" :class="parts.controlClass()" :style="parts.controlStyle()"
        :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined" :data-readonly="isReadOnly || undefined"
        @click="inputContainer.onClick" @mouseup="inputContainer.onMouseUp"
        @pointerenter="disabledTooltip.onPointerEnter" @pointerleave="disabledTooltip.onPointerLeave"
      >
        <span v-if="$slots.icon || icon || iconName" class="astryx-text-area-icon" aria-hidden="true"><slot name="icon"><Icon v-if="iconName" :icon="iconName" size="sm" /><component :is="icon" v-else-if="icon" /></slot></span>
        <textarea
          v-bind="{ ...inputAttrs(), ...entryAttrs }" :id="inputId" ref="input" class="astryx-text-area-control"
          :value="action.value.value" :placeholder="placeholder" :name="isDisabled ? undefined : (htmlName ?? inputAttrs().name)"
          :style="{ '--astryx-text-area-resize': resize }"
          :rows="rows" :cols="cols" :minlength="minlength" :maxlength="htmlMaxLength" :wrap="wrap"
          :autocomplete="(autoComplete ?? inputAttrs().autocomplete) as TextareaHTMLAttributes['autocomplete']"
          :spellcheck="hasSpellCheck"
          :readonly="isReadOnly || isDisabled"
          :aria-disabled="isDisabled || undefined" :aria-busy="busy || undefined"
          :aria-required="ariaRequired" :aria-invalid="status?.type === 'error' || isOverLimit ? true : inputAttrs()['aria-invalid']"
          :aria-labelledby="labelledBy(field.labelId)" :aria-describedby="describedBy(field.describedBy)" :data-autofocus="hasAutoFocus || undefined"
          @input="acceptInput" @compositionstart="isComposing = true" @compositionend="compositionEnd" @keydown="keydown"
          @focus="disabledTooltip.onTooltipPointerEnter" @blur="disabledTooltip.onBlur"
        />
        <span
          v-if="limit != null"
          class="astryx-text-area-count"
          :data-over="isOverLimit || undefined"
        >
          <Icon v-if="isOverLimit" icon="warning" size="sm" aria-hidden="true" />{{ counterText }}
        </span>
        <span v-if="$slots.end" class="astryx-text-area-end"><slot name="end" /></span>
        <InputClearButton v-if="hasClear && action.value.value && !isDisabled && !isReadOnly" class="astryx-text-area-clear-button" :label="resolvedClearLabel" @click="clear" />
        <ButtonSpinner v-if="busy" class="astryx-text-area-spinner" :label="loadingLabel" is-decorative />
        <FieldInfoTip v-if="status?.message && statusVariant === 'tooltip'" :text="status.message" :type="status.type" />
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
