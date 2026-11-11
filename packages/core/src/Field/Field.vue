<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { FieldProps, FieldSlotProps, FieldSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { useFormLayout } from '../FormLayout/context.js'
import FieldLabel from './FieldLabel.vue'
import FieldStatus from './FieldStatus.vue'
import '../../styles/field.css'

defineOptions({ name: 'AstryxField', inheritAttrs: false })
const props = withDefaults(defineProps<FieldProps>(), { statusVariant: 'attached' })
defineSlots<FieldSlots>()
const attrs = useAttrs()
const element = useTemplateRef<HTMLDivElement>('field')
defineExpose({ element })
const slotProps = computed<FieldSlotProps>(() => {
  const descriptionId = props.description ? (props.descriptionId ?? `${props.inputId}-description`) : undefined
  const statusId = props.status?.message ? (props.status.messageId ?? `${props.inputId}-status`) : undefined
  return {
    inputId: props.inputId,
    labelId: props.labelId ?? `${props.inputId}-label`,
    descriptionId,
    statusId,
    describedBy: [descriptionId, statusId].filter(Boolean).join(' ') || undefined,
  }
})
const style = computed<CSSProperties>(() => ({ '--astryx-field-width': typeof props.width === 'number' ? `${props.width}px` : props.width }))
const rootStyle = computed<StyleValue>(() => [attrs.style as StyleValue, style.value])
const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')))
const formLayout = useFormLayout()
const horizontalLabels = computed(() => formLayout.value?.direction === 'horizontal-labels')
</script>

<template>
  <div ref="field" v-bind="forwardedAttrs" class="astryx-field" :class="attrs.class" :style="rootStyle" :data-status-variant="statusVariant" :data-group-label="isGroupLabel || undefined" :data-layout="horizontalLabels ? 'horizontal-labels' : undefined">
    <FieldLabel
      :label="label" :input-id="inputId" :label-id="slotProps.labelId"
      :description="description" :description-id="slotProps.descriptionId"
      :is-group-label="isGroupLabel" :is-label-hidden="isLabelHidden" :is-disabled="isDisabled"
      :is-optional="isOptional" :is-required="isRequired" :label-icon="labelIcon" :label-tooltip="labelTooltip"
      :optional-label="optionalLabel" :required-label="requiredLabel"
    >
      <template v-if="$slots.labelIcon" #labelIcon>
        <slot name="labelIcon" />
      </template>
    </FieldLabel>
    <div class="astryx-field-control">
      <slot v-bind="slotProps" />
      <FieldStatus
        :id="slotProps.statusId" :type="status?.type ?? 'success'" :message="status?.message ?? ''"
        :variant="statusVariant === 'tooltip' ? 'attached' : statusVariant" :is-visually-hidden="statusVariant === 'tooltip'"
      />
    </div>
  </div>
</template>
