<script setup lang="ts">
import type { AvatarGroupProps } from './types.js'
import { computed, provide } from 'vue'

import { resolveSize } from '../Avatar/utils.js'
import { AvatarGroupContext } from './context.js'
import '../../styles/avatar-group.css'

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  size: 'md',
  shape: 'circle',
  label: 'Avatar group',
})

const OVERLAP_RATIO = 0.25

const numericSize = computed(() => resolveSize(props.size))
const overlap = computed(() => Math.round(numericSize.value * OVERLAP_RATIO))

provide(AvatarGroupContext, {
  size: computed(() => props.size),
  shape: computed(() => props.shape),
  overlap,
})
</script>

<template>
  <div
    class="astryx-avatar-group"
    role="group"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
