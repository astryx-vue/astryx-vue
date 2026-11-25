<script setup lang="ts">
import type { BadgeProps } from './types.js'
import { computed, useSlots } from 'vue'
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

const slots = useSlots()

const labelTitle = computed(() => {
  const label = props.label
  if (typeof label === 'number')
    return String(label)
  if (typeof label === 'string' && label.length > 0)
    return label
  return undefined
})

/** 有文字的徽章才跟着文字长高；只有颜色的徽章没有文字要装，尺寸不变。 */
const hasLabel = computed(() => {
  if (slots.default != null)
    return true
  const label = props.label
  return label != null && label !== ''
})
</script>

<template>
  <span
    class="astryx-badge"
    :class="{ 'astryx-badge--has-label': hasLabel }"
    :data-variant="variant"
    :title="labelTitle"
  >
    <slot name="icon" />
    <span class="astryx-badge__label">
      <slot>{{ label }}</slot>
    </span>
  </span>
</template>
