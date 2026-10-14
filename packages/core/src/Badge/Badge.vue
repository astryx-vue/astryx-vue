<script setup lang="ts">
import type { BadgeProps } from './types.js'
import { computed } from 'vue'
import '../../styles/badge.css'

defineOptions({
  name: 'Badge',
})

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'neutral',
})

defineSlots<{
  default?: () => unknown
  icon?: () => unknown
}>()

const labelTitle = computed(() => {
  const label = props.label
  if (typeof label === 'number')
    return String(label)
  if (typeof label === 'string' && label.length > 0)
    return label
  return undefined
})
</script>

<template>
  <span
    class="astryx-badge"
    :data-variant="variant"
    :title="labelTitle"
  >
    <slot name="icon" />
    <span class="astryx-badge__label">
      <slot>{{ label }}</slot>
    </span>
  </span>
</template>
