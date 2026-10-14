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
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  />
</template>
