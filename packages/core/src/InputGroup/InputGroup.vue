<script setup lang="ts">
import type { InputGroupProps, InputGroupSlots } from './types.js'
import { computed, provide, useId } from 'vue'
import Field from '../Field/Field.vue'
import { provideSize, useSize } from '../SizeContext/SizeContext.js'
import { INPUT_GROUP_KEY, useInputGroupDisabled } from './context.js'
import '../../styles/input-group.css'

defineOptions({ name: 'AstryxInputGroup' })

const props = withDefaults(defineProps<InputGroupProps>(), {
  disabled: false,
  isLabelHidden: false,
  isOptional: false,
  isRequired: false,
})

defineSlots<InputGroupSlots>()
// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')
provideSize(size)
// 嵌套在已禁用的外层组里时，本组也禁用。
const disabled = useInputGroupDisabled(() => props.disabled)

const inputId = `astryx-input-group-${useId()}`
const labelId = computed(() => props.label ? `${inputId}-label` : undefined)
const descriptionId = computed(() => props.label && props.description ? `${inputId}-description` : undefined)
const statusId = computed(() => props.label && props.status?.message ? `${inputId}-status` : undefined)
const describedBy = computed(() => [descriptionId.value, statusId.value].filter(Boolean).join(' ') || undefined)

provide(INPUT_GROUP_KEY, {
  size,
  disabled,
  labelId,
  describedBy,
})

const groupClass = computed(() => [
  `size-${size.value}`,
  { 'is-disabled': disabled.value },
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
      :data-status="status?.type"
      role="group"
      :aria-disabled="disabled || undefined"
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
  <div v-else class="astryx-input-group" :class="groupClass" :data-status="status?.type" :aria-disabled="disabled || undefined">
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
