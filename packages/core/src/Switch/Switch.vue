<script setup lang="ts">
import type { CSSProperties, InputHTMLAttributes } from 'vue'
import type { SwitchEmits, SwitchProps, SwitchSlots } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import Field from '../Field/Field.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { useSwitchAction } from './useSwitchAction.js'
import '../../styles/switch.css'

defineOptions({ name: 'AstryxSwitch', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<SwitchProps, 'modelValue'>>(), {
  size: 'md',
  statusVariant: 'detached',
  loadingLabel: 'Loading',
})
const emit = defineEmits<SwitchEmits>()
defineSlots<SwitchSlots>()
const model = defineModel<boolean>({ required: true })
const attrs = useAttrs()
const input = useTemplateRef<HTMLInputElement>('input')
const generatedId = `astryx-switch-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const disabledId = `${generatedId}-disabled`
const loadingId = `${generatedId}-loading`
const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim())
const tooltip = useButtonTooltip(showsDisabledMessage)
const action = useSwitchAction({
  model,
  changeAction: () => props.changeAction,
  emitChange: (value, event) => emit('change', value, event),
  emitError: (error, value, event) => emit('actionError', error, value, event),
})
const busy = computed(() => !!props.isLoading || action.isPending.value)
const blocked = computed(() => props.isDisabled || props.isReadOnly || busy.value)
const widthStyle = computed<CSSProperties>(() => ({ width: typeof props.width === 'number' ? `${props.width}px` : props.width }))
const element = computed(() => input.value ?? null)
function focus(options?: FocusOptions): void {
  input.value?.focus(options)
}
function blur(): void {
  input.value?.blur()
}
defineExpose({ element, focus, blur })

const controlledAttrs = new Set(['class', 'style', 'id', 'type', 'checked', 'disabled', 'readonly', 'autofocus', 'role', 'aria-checked', 'aria-labelledby', 'aria-describedby', 'aria-disabled', 'aria-readonly', 'aria-required', 'aria-busy'])
function inputAttrs(): InputHTMLAttributes {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key))) as InputHTMLAttributes
}
function describedBy(fieldIds?: string): string | undefined {
  return [attrs['aria-describedby'], fieldIds, showsDisabledMessage.value ? disabledId : undefined, busy.value ? loadingId : undefined].filter(Boolean).join(' ') || undefined
}
function syncNative(): void {
  if (input.value)
    input.value.checked = action.value.value
}
function click(event: MouseEvent): void {
  if (blocked.value) {
    event.preventDefault()
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
  <div class="astryx-switch" :class="attrs.class" :style="[widthStyle, attrs.style as CSSProperties]" :data-size="size" :data-status="status?.type" :data-blocked="blocked || undefined">
    <div class="astryx-switch-row" @pointerenter="tooltip.onPointerEnter" @pointerleave="tooltip.onPointerLeave">
      <span class="astryx-switch-control">
        <input
          v-bind="inputAttrs()" :id="inputId" ref="input" class="astryx-switch-native" type="checkbox" role="switch"
          :checked="action.value.value" :disabled="isDisabled && !showsDisabledMessage"
          :name="isDisabled ? undefined : (htmlName ?? inputAttrs().name)" :form="showsDisabledMessage ? '' : inputAttrs().form"
          :readonly="isReadOnly || showsDisabledMessage"
          :aria-checked="action.value.value"
          :aria-labelledby="[`${inputId}-label`, attrs['aria-labelledby']].filter(Boolean).join(' ')"
          :aria-describedby="describedBy()"
          :aria-disabled="showsDisabledMessage || undefined" :aria-readonly="isReadOnly || undefined" :aria-busy="busy || undefined"
          :aria-required="(isRequired && !isOptional) || undefined" :aria-invalid="status?.type === 'error' ? true : inputAttrs()['aria-invalid']"
          @click="click" @change="change" @keydown="keydown" @focus="tooltip.onFocus" @blur="tooltip.onBlur"
        >
        <span class="astryx-switch-track" aria-hidden="true">
          <span class="astryx-switch-thumb" />
          <span v-if="busy" class="astryx-switch-spinner" />
        </span>
      </span>
      <Field
        :label="label" :input-id="inputId" :label-id="`${inputId}-label`" :description="description"
        :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
        :label-icon="labelIcon" :label-tooltip="labelTooltip" :optional-label="optionalLabel" :required-label="requiredLabel"
      >
        <template v-if="$slots.labelIcon" #labelIcon>
          <slot name="labelIcon" />
        </template>
      </Field>
    </div>
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
