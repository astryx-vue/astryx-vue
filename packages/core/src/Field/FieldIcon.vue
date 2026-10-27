<script setup lang="ts">
import type { IconColor, IconSize } from '../Icon/types.js'
import type { FieldStatusType } from './types.js'
import Icon from '../Icon/Icon.vue'

withDefaults(defineProps<{
  type: FieldStatusType | 'info' | 'clear'
  size?: IconSize
  color?: IconColor
}>(), { size: 'sm', color: 'inherit' })
</script>

<template>
  <!--
    Status glyphs go through Icon, so a theme's icon table draws them and,
    without one, core's filled artwork does. Clear is not a status; it keeps
    its own stroke drawing.
  -->
  <svg v-if="type === 'clear'" class="astryx-field-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="m4 4 8 8M12 4l-8 8" />
  </svg>
  <Icon v-else class="astryx-field-icon" :icon="type" :size="size" :color="color" />
</template>
