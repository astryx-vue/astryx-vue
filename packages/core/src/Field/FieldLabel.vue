<script setup lang="ts">
import type { FieldLabelProps, FieldLabelSlots } from './types.js'
import { computed, toRaw, useTemplateRef } from 'vue'
import { showsOptionalIndicator, showsRequiredIndicator, useFormLayout } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
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
/** 字符串当语义图标名交给 Icon，其余当组件渲染。 */
const iconName = computed(() => typeof props.labelIcon === 'string' ? props.labelIcon : undefined)
const icon = computed(() => props.labelIcon && typeof props.labelIcon !== 'string' ? toRaw(props.labelIcon) : undefined)
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
        <span v-if="$slots.labelIcon || icon || iconName" class="astryx-field-label-icon" aria-hidden="true">
          <slot name="labelIcon">
            <Icon v-if="iconName" :icon="iconName" size="sm" />
            <component :is="icon" v-else-if="icon" />
          </slot>
        </span>
        {{ label }}
        <span v-if="showOptional || showRequired" class="astryx-field-optionality"><span aria-hidden="true"> ∙ </span>{{ showOptional ? optionalLabel : requiredLabel }}</span>
      </component>
      <FieldInfoTip v-if="labelTooltip" :text="labelTooltip" />
    </div>
    <span v-if="description" :id="descriptionId" class="astryx-field-description" role="presentation" @click="focusFromDescription">{{ description }}</span>
  </div>
</template>
