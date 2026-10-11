<script setup lang="ts">
import type { IconSize } from '../Icon/types.js'
import Icon from '../Icon/Icon.vue'

withDefaults(defineProps<{
  name: 'clock' | 'check-double' | 'circle-check' | 'circle-x' | 'close' | 'error' | 'wrench' | 'thinking'
  size?: IconSize
}>(), {
  size: 'sm',
})
</script>

<template>
  <Icon :size="size" color="inherit">
    <span class="astryx-icon__glyph" :class="`astryx-chat-icon--${name}`" />
  </Icon>
</template>
