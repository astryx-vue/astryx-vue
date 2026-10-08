<script setup lang="ts">
import type { StatusDotProps } from './types.js'

import '../../styles/status-dot.css'

withDefaults(defineProps<StatusDotProps>(), {
  variant: 'neutral',
  isPulsing: false,
})
</script>

<template>
  <span
    class="astryx-status-dot"
    :class="{ 'astryx-status-dot--pulsing': isPulsing }"
    :data-variant="variant"
    role="img"
    :aria-label="label"
  />
</template>
