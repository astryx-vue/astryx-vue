<script setup lang="ts">
import type { SpinnerProps } from './types.js'
import { computed, useAttrs, useId, useSlots } from 'vue'
import '../../styles/spinner.css'

defineOptions({ name: 'AstryxSpinner', inheritAttrs: false })
const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  shade: 'default',
})
const attrs = useAttrs()
const slots = useSlots()
const labelId = `astryx-spinner-label-${useId()}`

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label))
const ariaLabel = computed(() => attrs['aria-label'] as string | undefined)
const namedByVisibleLabel = computed(() => Boolean(props.label) && !ariaLabel.value)
const ringLabelledBy = computed(() => (namedByVisibleLabel.value ? labelId : undefined))
const ringAriaLabel = computed(() => {
  if (namedByVisibleLabel.value)
    return undefined
  return ariaLabel.value ?? props.label ?? 'Loading'
})
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'aria-label')))
</script>

<template>
  <div v-if="hasLabel" v-bind="rootAttrs" class="astryx-spinner-group">
    <span
      class="astryx-spinner"
      role="status"
      :data-size="size"
      :data-shade="shade"
      :aria-label="ringAriaLabel"
      :aria-labelledby="ringLabelledBy"
    >
      <svg class="astryx-spinner__ring" aria-hidden="true" focusable="false">
        <circle class="astryx-spinner__track" cx="50%" cy="50%" />
        <circle class="astryx-spinner__arc" cx="50%" cy="50%" />
      </svg>
    </span>
    <span :id="labelId" class="astryx-spinner-label">
      <slot name="label">{{ label }}</slot>
    </span>
  </div>
  <span
    v-else
    v-bind="rootAttrs"
    class="astryx-spinner"
    role="status"
    :data-size="size"
    :data-shade="shade"
    :aria-label="ringAriaLabel"
  >
    <svg class="astryx-spinner__ring" aria-hidden="true" focusable="false">
      <circle class="astryx-spinner__track" cx="50%" cy="50%" />
      <circle class="astryx-spinner__arc" cx="50%" cy="50%" />
    </svg>
  </span>
</template>
