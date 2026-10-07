<script setup lang="ts">
import type { CSSProperties, InputHTMLAttributes } from 'vue'
import type { CheckboxInputEmits, CheckboxInputProps, CheckboxInputSlots, CheckboxValue } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import CheckboxIndicator from '../CheckboxIndicator/CheckboxIndicator.vue'
import FieldLabel from '../Field/FieldLabel.vue'
import FieldStatus from '../Field/FieldStatus.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { useCheckboxAction } from './useCheckboxAction.js'
import '../../styles/checkbox-input.css'
import '../../styles/button.css'

defineOptions({ name: 'AstryxCheckboxInput', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<CheckboxInputProps, 'modelValue'>>(), { size: 'md', loadingLabel: 'Loading' })
const emit = defineEmits<CheckboxInputEmits>()
defineSlots<CheckboxInputSlots>()
const model = defineModel<CheckboxValue>({ required: true })
const attrs = useAttrs()
const input = useTemplateRef<HTMLInputElement>('input')
const generatedId = `astryx-checkbox-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${inputId.value}-label`)
const descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined)
const statusId = computed(() => props.status?.message ? (props.status.messageId ?? `${inputId.value}-status`) : undefined)
const disabledId = `${generatedId}-disabled`
const loadingId = `${generatedId}-loading`
const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim())
const tooltip = useButtonTooltip(showsDisabledMessage)
const action = useCheckboxAction({ model, changeAction: () => props.changeAction, emitChange: (value, event) => emit('change', value, event), emitError: (error, value, event) => emit('actionError', error, value, event) })
const busy = computed(() => !!props.isLoading || action.isPending.value)
const blocked = computed(() => props.isDisabled || props.isReadOnly || busy.value)
const state = computed(() => action.value.value === 'indeterminate' ? 'indeterminate' : action.value.value ? 'checked' : 'unchecked')
const widthStyle = computed<CSSProperties>(() => ({ width: typeof props.width === 'number' ? `${props.width}px` : props.width }))
const element = computed(() => input.value ?? null)
function focus(options?: FocusOptions): void {
  input.value?.focus(options)
}
function blur(): void {
  input.value?.blur()
}
defineExpose({ element, focus, blur })

const controlledAttrs = new Set(['class', 'style', 'id', 'type', 'checked', 'indeterminate', 'disabled', 'readonly', 'autofocus', 'role', 'aria-checked', 'aria-labelledby', 'aria-describedby', 'aria-disabled', 'aria-readonly', 'aria-required', 'aria-busy'])
function inputAttrs(): InputHTMLAttributes {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key))) as InputHTMLAttributes
}
function describedBy(): string | undefined {
  return [attrs['aria-describedby'], descriptionId.value, statusId.value, showsDisabledMessage.value ? disabledId : undefined, busy.value ? loadingId : undefined].filter(Boolean).join(' ') || undefined
}
function syncNative(): void {
  if (input.value) {
    input.value.checked = action.value.value === true
    input.value.indeterminate = action.value.value === 'indeterminate'
  }
}
function click(event: MouseEvent): void {
  if (blocked.value) {
    event.preventDefault()
    // Only canceled clicks need repair here. Normal clicks must reach change
    // before synchronization; browsers can flush microtasks between events.
    void nextTick(syncNative)
  }
}
function change(event: Event): void {
  if (!blocked.value && input.value)
    action.commit(input.value.checked, event)
  void nextTick(syncNative)
}
function reset(event: Event): void {
  if (event.target === input.value?.form)
    void nextTick(syncNative)
}
function keydown(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    tooltip.hideImmediately()
}
let ownerDocument: Document | undefined
onMounted(() => {
  syncNative()
  ownerDocument = input.value?.ownerDocument
  ownerDocument?.addEventListener('reset', reset, true)
  if (props.hasAutoFocus)
    focus({ preventScroll: true })
})
onUpdated(syncNative)
onBeforeUnmount(() => ownerDocument?.removeEventListener('reset', reset, true))
</script>

<template>
  <div class="astryx-checkbox-input" :class="attrs.class" :style="[widthStyle, attrs.style as CSSProperties]" :data-size="size" :data-status="status?.type" :data-blocked="blocked || undefined">
    <div class="astryx-checkbox-row" @pointerenter="tooltip.onPointerEnter" @pointerleave="tooltip.onPointerLeave">
      <span class="astryx-checkbox-control">
        <input
          v-bind="inputAttrs()" :id="inputId" ref="input" class="astryx-checkbox-native" type="checkbox"
          :checked="action.value.value === true" :disabled="isDisabled && !showsDisabledMessage"
          :name="isDisabled ? undefined : (htmlName ?? inputAttrs().name)" :form="showsDisabledMessage ? '' : inputAttrs().form"
          :required="(isRequired && !isOptional) || inputAttrs().required" :readonly="isReadOnly || showsDisabledMessage"
          :aria-labelledby="[labelId, attrs['aria-labelledby']].filter(Boolean).join(' ')" :aria-describedby="describedBy()"
          :aria-disabled="showsDisabledMessage || undefined" :aria-readonly="isReadOnly || undefined" :aria-busy="busy || undefined"
          :aria-required="(isRequired && !isOptional) || undefined" :aria-invalid="status?.type === 'error' ? true : inputAttrs()['aria-invalid']"
          @click="click" @change="change" @keydown="keydown" @focus="tooltip.onFocus" @blur="tooltip.onBlur"
        >
        <CheckboxIndicator :state="state" :size="size" :is-disabled="isDisabled">
          <span v-if="busy" class="astryx-checkbox-spinner" />
        </CheckboxIndicator>
      </span>
      <FieldLabel
        :label="label" :input-id="inputId" :label-id="labelId" :description="description" :description-id="descriptionId"
        :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
        :label-icon="labelIcon" :label-tooltip="labelTooltip" :optional-label="optionalLabel" :required-label="requiredLabel"
      >
        <template v-if="$slots.labelIcon" #labelIcon>
          <slot name="labelIcon" />
        </template>
      </FieldLabel>
    </div>
    <FieldStatus :id="statusId" :type="status?.type ?? 'success'" :message="status?.message ?? ''" variant="detached" />
    <VisuallyHidden v-if="showsDisabledMessage" :id="disabledId">
      {{ disabledMessage }}
    </VisuallyHidden>
    <VisuallyHidden v-if="busy" :id="loadingId" role="status">
      {{ loadingLabel }}
    </VisuallyHidden>
  </div>
  <ButtonTooltip
    v-if="showsDisabledMessage" :id="`${generatedId}-tooltip`" :anchor="input" :open="tooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="tooltip.onTooltipPointerEnter" @pointer-leave="tooltip.onTooltipPointerLeave"
  />
</template>
