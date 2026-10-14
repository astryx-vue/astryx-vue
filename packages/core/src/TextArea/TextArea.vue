<script setup lang="ts">
import type { TextareaHTMLAttributes } from 'vue'
import type { TextAreaEmits, TextAreaProps, TextAreaSlots } from './types.js'
import { computed, nextTick, onMounted, shallowRef, toRaw, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonSpinner from '../Button/ButtonSpinner.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import FieldInfoTip from '../Field/FieldInfoTip.vue'
import { useAriaRequired } from '../FormLayout/context.js'
import IconButton from '../IconButton/IconButton.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { useTextAreaAction } from './useTextAreaAction.js'
import '../../styles/text-area.css'

defineOptions({ name: 'AstryxTextArea', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<TextAreaProps, 'modelValue'>>(), {
  size: 'md',
  statusVariant: 'detached',
  resize: 'vertical',
  loadingLabel: 'Loading',
})
const emit = defineEmits<TextAreaEmits>()
defineSlots<TextAreaSlots>()
const ariaRequired = useAriaRequired(props)
const model = defineModel<string>({ required: true })
const attrs = useAttrs()
const input = useTemplateRef<HTMLTextAreaElement>('input')
const container = useTemplateRef<HTMLDivElement>('container')
const generatedId = `astryx-text-area-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const isComposing = shallowRef(false)
const disabledDescriptionId = `${generatedId}-disabled`
const disabledTooltipId = `${generatedId}-tooltip`
const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim())
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const icon = computed(() => props.startIcon ? toRaw(props.startIcon) : undefined)
const action = useTextAreaAction({
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

const controlledAttrs = new Set(['class', 'style', 'id', 'value', 'rows', 'cols', 'disabled', 'readonly', 'autofocus', 'minlength', 'maxlength', 'wrap', 'aria-labelledby', 'aria-describedby', 'aria-required', 'aria-busy', 'aria-disabled'])
function inputAttrs(): TextareaHTMLAttributes {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key))) as TextareaHTMLAttributes
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
function focusFromContainer(event: MouseEvent): void {
  if (props.isDisabled)
    return
  const target = event.target
  if (target instanceof Element && target.closest('input,textarea,button,a,select,[role="button"]'))
    return
  if (input.value?.ownerDocument.getSelection()?.toString())
    return
  focus({ preventScroll: true })
}
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
  >
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <template #default="field">
      <div
        ref="container" class="astryx-text-area" :class="attrs.class" :style="attrs.style"
        :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined" :data-readonly="isReadOnly || undefined"
        @pointerup="focusFromContainer" @pointerenter="disabledTooltip.onPointerEnter" @pointerleave="disabledTooltip.onPointerLeave"
      >
        <span v-if="$slots.icon || icon" class="astryx-text-area-icon" aria-hidden="true"><slot name="icon"><component :is="icon" v-if="icon" /></slot></span>
        <textarea
          v-bind="inputAttrs()" :id="inputId" ref="input" class="astryx-text-area-control"
          :value="action.value.value" :placeholder="placeholder" :name="isDisabled ? undefined : (htmlName ?? inputAttrs().name)"
          :style="{ '--astryx-text-area-resize': resize }"
          :rows="rows" :cols="cols" :minlength="minlength" :maxlength="maxlength" :wrap="wrap"
          :disabled="isDisabled && !showsDisabledMessage" :readonly="isReadOnly || showsDisabledMessage"
          :aria-disabled="showsDisabledMessage || undefined" :aria-busy="busy || undefined"
          :aria-required="ariaRequired" :aria-invalid="status?.type === 'error' ? true : inputAttrs()['aria-invalid']"
          :aria-labelledby="labelledBy(field.labelId)" :aria-describedby="describedBy(field.describedBy)" :data-autofocus="hasAutoFocus || undefined"
          @input="acceptInput" @compositionstart="isComposing = true" @compositionend="compositionEnd" @keydown="keydown"
          @focus="disabledTooltip.onTooltipPointerEnter" @blur="disabledTooltip.onBlur"
        />
        <span
          v-if="maxlength != null"
          class="astryx-text-area-count"
          :data-over="action.value.value.length > Number(maxlength) || undefined"
        >{{ action.value.value.length }} / {{ maxlength }}</span>
        <span v-if="$slots.end" class="astryx-text-area-end"><slot name="end" /></span>
        <IconButton v-if="hasClear && action.value.value && !isDisabled && !isReadOnly" class="astryx-text-area-clear-button" variant="ghost" size="sm" :label="clearLabel ?? `Clear ${label}`" @click="clear">
          <FieldIcon type="clear" />
        </IconButton>
        <ButtonSpinner v-if="busy" class="astryx-text-area-spinner" :label="loadingLabel" />
        <FieldInfoTip v-if="status?.message && statusVariant === 'tooltip'" :text="status.message" :type="status.type" />
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
