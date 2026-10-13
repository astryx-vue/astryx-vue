<script setup lang="ts">
import type { FieldLabelProps, FieldLabelSlots } from './types.js'
import { computed, toRaw, useTemplateRef } from 'vue'
import { showsOptionalIndicator, showsRequiredIndicator, useFormLayout } from '../FormLayout/context.js'
import FieldInfoTip from './FieldInfoTip.vue'
import '../../styles/field.css'

defineOptions({ name: 'AstryxFieldLabel' })
const props = withDefaults(defineProps<FieldLabelProps>(), {
  optionalLabel: 'Optional',
  requiredLabel: 'Required',
})
defineSlots<FieldLabelSlots>()
const element = useTemplateRef<HTMLElement>('label')
defineExpose({ element })
const labelId = computed(() => props.labelId ?? `${props.inputId}-label`)
const descriptionId = computed(() => props.descriptionId ?? `${props.inputId}-description`)
const icon = computed(() => props.labelIcon ? toRaw(props.labelIcon) : undefined)
const formLayout = useFormLayout()
const optionality = computed(() => formLayout.value?.defaultOptionality)
const showOptional = computed(() => showsOptionalIndicator(props.isOptional, props.isRequired, optionality.value))
const showRequired = computed(() => showsRequiredIndicator(props.isRequired, props.isOptional, optionality.value))

function focusFromDescription(event: MouseEvent): void {
  if (props.isGroupLabel || props.isDisabled)
    return
  const target = event.target
  if (target instanceof Element && target.closest('a,button,input,select,textarea,[role="button"]'))
    return
  if (element.value?.ownerDocument.getSelection()?.toString())
    return
  const control = element.value?.ownerDocument.getElementById(props.inputId)
  if (control instanceof HTMLInputElement && ['checkbox', 'radio'].includes(control.type))
    control.click()
  else
    control?.focus({ preventScroll: true })
}
</script>

<template>
  <div class="astryx-field-label-group" :data-hidden="isLabelHidden || undefined" :data-disabled="isDisabled || undefined">
    <div class="astryx-field-label-row">
      <component :is="isGroupLabel ? 'span' : 'label'" :id="labelId" ref="label" class="astryx-field-label" :for="isGroupLabel ? undefined : inputId">
        <span v-if="$slots.labelIcon || icon" class="astryx-field-label-icon" aria-hidden="true">
          <slot name="labelIcon"><component :is="icon" v-if="icon" /></slot>
        </span>
        {{ label }}
      </component>
      <span v-if="showOptional || showRequired" class="astryx-field-optionality" aria-hidden="true">{{ showOptional ? optionalLabel : requiredLabel }}</span>
      <FieldInfoTip v-if="labelTooltip" :text="labelTooltip" />
    </div>
    <span v-if="description" :id="descriptionId" class="astryx-field-description" role="presentation" @click="focusFromDescription">{{ description }}</span>
  </div>
</template>
