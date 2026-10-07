<script setup lang="ts">
import type { BadgeProps } from './types.js'
import '../../styles/badge.css'

defineOptions({
  name: 'Badge',
})

withDefaults(defineProps<BadgeProps>(), {
  variant: 'neutral',
})

defineSlots<{
  default: () => unknown
  icon?: () => unknown
}>()
</script>

<template>
  <span
    class="astryx-badge"
    :data-variant="variant"
  >
    <slot name="icon" />
    <slot />
  </span>
</template>
