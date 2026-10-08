<script setup lang="ts">
import type { AvatarStatusDotProps } from './types.js'

withDefaults(defineProps<AvatarStatusDotProps>(), {
  variant: 'neutral',
})
</script>

<template>
  <span
    class="astryx-avatar-status-dot"
    :data-variant="variant"
    aria-hidden="true"
  />
</template>
