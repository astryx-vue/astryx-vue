<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { FieldProps, FieldSlotProps, FieldSlots } from './types.js'
import { computed, useTemplateRef } from 'vue'
import FieldLabel from './FieldLabel.vue'
import FieldStatus from './FieldStatus.vue'
import '../../styles/field.css'

defineOptions({ name: 'AstryxField' })
const props = withDefaults(defineProps<FieldProps>(), { statusVariant: 'attached' })
defineSlots<FieldSlots>()
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
</script>

<template>
  <div ref="field" class="astryx-field" :style="style" :data-status-variant="statusVariant" :data-group-label="isGroupLabel || undefined">
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
