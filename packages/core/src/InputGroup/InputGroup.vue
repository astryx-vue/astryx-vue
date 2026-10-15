<script setup lang="ts">
import type { InputGroupProps, InputGroupSlots } from './types.js'
import { computed, provide, useId } from 'vue'
import Field from '../Field/Field.vue'
import { INPUT_GROUP_KEY } from './context.js'
import '../../styles/input-group.css'

defineOptions({ name: 'AstryxInputGroup' })

const props = withDefaults(defineProps<InputGroupProps>(), {
  size: 'md',
  disabled: false,
  isLabelHidden: false,
  isOptional: false,
  isRequired: false,
})

defineSlots<InputGroupSlots>()

const inputId = `astryx-input-group-${useId()}`
const labelId = computed(() => props.label ? `${inputId}-label` : undefined)
const descriptionId = computed(() => props.label && props.description ? `${inputId}-description` : undefined)
const statusId = computed(() => props.label && props.status?.message ? `${inputId}-status` : undefined)
const describedBy = computed(() => [descriptionId.value, statusId.value].filter(Boolean).join(' ') || undefined)

provide(INPUT_GROUP_KEY, {
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
  labelId,
  describedBy,
})

const groupClass = computed(() => [
  `size-${props.size}`,
  {
    'is-disabled': props.disabled,
    [`status-${props.status?.type}`]: props.status != null,
  },
])
</script>

<template>
  <Field
    v-if="label"
    class="astryx-input-group-shell"
    :label="label"
    :input-id="inputId"
    :description="description"
    :is-label-hidden="isLabelHidden"
    :is-disabled="disabled"
    :is-optional="isOptional"
    :is-required="isRequired"
    :status="status"
    status-variant="detached"
    :label-tooltip="labelTooltip"
    is-group-label
  >
    <div
      class="astryx-input-group"
      :class="groupClass"
      role="group"
      :aria-labelledby="labelId"
      :aria-describedby="describedBy"
    >
      <div v-if="$slots.before" class="astryx-input-group-addon before">
        <slot name="before" />
      </div>
      <div class="astryx-input-group-field">
        <slot />
      </div>
      <div v-if="$slots.after" class="astryx-input-group-addon after">
        <slot name="after" />
      </div>
    </div>
  </Field>
  <div v-else class="astryx-input-group" :class="groupClass">
    <div v-if="$slots.before" class="astryx-input-group-addon before">
      <slot name="before" />
    </div>
    <div class="astryx-input-group-field">
      <slot />
    </div>
    <div v-if="$slots.after" class="astryx-input-group-addon after">
      <slot name="after" />
    </div>
  </div>
</template>
