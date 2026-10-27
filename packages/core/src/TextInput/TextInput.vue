<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import type { TextInputEmits, TextInputProps, TextInputSlots } from './types.js'
import { computed, nextTick, onMounted, shallowRef, toRaw, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonSpinner from '../Button/ButtonSpinner.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useInputContainer } from '../composables/useInputContainer.js'
import { useInputStatusIcon } from '../composables/useInputStatusIcon.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import InputClearButton from '../Field/InputClearButton.vue'
import { useAriaRequired } from '../FormLayout/context.js'
import { useAstryxMessages } from '../locale/index.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { useTextInputAction } from './useTextInputAction.js'
import '../../styles/text-input.css'

defineOptions({ name: 'AstryxTextInput', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<TextInputProps, 'modelValue'>>(), {
  type: 'text',
  size: 'md',
  statusVariant: 'attached',
  loadingLabel: 'Loading',
})
const emit = defineEmits<TextInputEmits>()
defineSlots<TextInputSlots>()
const ariaRequired = useAriaRequired(props)
const messages = useAstryxMessages()
const model = defineModel<string>({ required: true })
const attrs = useAttrs()
const input = useTemplateRef<HTMLInputElement>('input')
const container = useTemplateRef<HTMLDivElement>('container')
const generatedId = `astryx-text-input-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const isComposing = shallowRef(false)
const disabledDescriptionId = `${generatedId}-disabled`
const disabledTooltipId = `${generatedId}-tooltip`
const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim())
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const icon = computed(() => props.startIcon ? toRaw(props.startIcon) : undefined)
const action = useTextInputAction({
  model,
  changeAction: () => props.changeAction,
  emitChange: (value, event) => emit('change', value, event),
  emitError: (error, value, event) => emit('actionError', error, value, event),
})
const busy = computed(() => props.isLoading || action.isPending.value)
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
function inputAttrs(): InputHTMLAttributes {
  return parts.forwardedAttrs() as InputHTMLAttributes
}
function describedBy(fieldIds?: string): string | undefined {
  return [attrs['aria-describedby'], fieldIds, showsDisabledMessage.value ? disabledDescriptionId : undefined].filter(Boolean).join(' ') || undefined
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
  if (value !== action.value.value)
    action.commit(value, event)
}
function compositionEnd(event: CompositionEvent): void {
  isComposing.value = false
  acceptInput(event)
}
function keydown(event: KeyboardEvent): void {
  emit('keydown', event)
  if (event.key === 'Escape')
    disabledTooltip.hideImmediately()
  if (!props.isDisabled && !event.defaultPrevented && event.key === 'Enter' && !isComposing.value && !event.isComposing && event.keyCode !== 229)
    emit('enter', event)
}
async function clear(event: MouseEvent): Promise<void> {
  if (props.isDisabled || props.isReadOnly)
    return
  action.commit('', event)
  emit('clear', event)
  await nextTick()
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
        ref="container" class="astryx-text-input" :class="parts.controlClass()" :style="parts.controlStyle()"
        :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined" :data-readonly="isReadOnly || undefined"
        @click="inputContainer.onClick" @mouseup="inputContainer.onMouseUp"
        @pointerenter="disabledTooltip.onPointerEnter" @pointerleave="disabledTooltip.onPointerLeave"
      >
        <span v-if="$slots.icon || icon" class="astryx-text-input-icon" aria-hidden="true"><slot name="icon"><component :is="icon" v-if="icon" /></slot></span>
        <input
          v-bind="inputAttrs()" :id="inputId" ref="input" class="astryx-text-input-control"
          :type="type" :value="action.value.value" :placeholder="placeholder" :name="isDisabled ? undefined : (htmlName ?? inputAttrs().name)"
          :autocomplete="(autoComplete ?? inputAttrs().autocomplete) as InputHTMLAttributes['autocomplete']" :disabled="isDisabled && !showsDisabledMessage" :readonly="isReadOnly || showsDisabledMessage"
          :aria-disabled="showsDisabledMessage || undefined" :aria-busy="busy || undefined"
          :aria-required="ariaRequired" :aria-invalid="status?.type === 'error' ? true : inputAttrs()['aria-invalid']"
          :aria-labelledby="labelledBy(field.labelId)" :aria-describedby="describedBy(field.describedBy)" :data-autofocus="hasAutoFocus || undefined"
          @input="acceptInput" @compositionstart="isComposing = true" @compositionend="compositionEnd" @keydown="keydown"
          @focus="disabledTooltip.onTooltipPointerEnter" @blur="disabledTooltip.onBlur"
        >
        <span v-if="$slots.end" class="astryx-text-input-end"><slot name="end" /></span>
        <InputClearButton v-if="hasClear && action.value.value && !isDisabled && !isReadOnly" :label="resolvedClearLabel" @click="clear" />
        <ButtonSpinner v-if="busy" class="astryx-text-input-spinner" :label="loadingLabel" />
        <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
      </div>
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
