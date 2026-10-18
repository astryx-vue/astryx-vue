<script setup lang="ts">
import type { RadioGroupEmits, RadioGroupProps, RadioGroupSlots, RadioValue } from './types.js'
import RadioGroup from './RadioGroup.vue'

defineOptions({ name: 'AstryxRadioList' })
withDefaults(defineProps<Omit<RadioGroupProps, 'modelValue'>>(), {
  size: 'md',
  orientation: 'vertical',
  statusVariant: 'detached',
})
const emit = defineEmits<RadioGroupEmits>()
defineSlots<RadioGroupSlots>()
const model = defineModel<RadioValue>({ required: true })
</script>

<template>
  <RadioGroup
    v-model="model"
    :label="label" :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :disabled-message="disabledMessage"
    :label-icon="labelIcon" :label-tooltip="labelTooltip" :optional-label="optionalLabel" :required-label="requiredLabel"
    :status="status" :status-variant="statusVariant" :name="name" :options="options"
    :size="size" :orientation="orientation"
    @change="(value, event) => emit('change', value, event)"
  >
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <slot />
  </RadioGroup>
</template>
