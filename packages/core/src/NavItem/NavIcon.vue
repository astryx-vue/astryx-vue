<script setup lang="ts">
import type { NavIconProps, NavIconSlots } from './types.js'
import { computed } from 'vue'
import '../../styles/nav-item.css'

defineOptions({ name: 'AstryxNavIcon' })

const props = withDefaults(defineProps<NavIconProps>(), {
  size: 'md',
})

defineSlots<NavIconSlots>()

const labelled = computed(() => props.label != null && props.label !== '')
</script>

<template>
  <span
    class="astryx-nav-icon"
    :class="`astryx-nav-icon--${size}`"
    :role="labelled ? 'img' : undefined"
    :aria-label="labelled ? label : undefined"
    :aria-hidden="labelled ? undefined : 'true'"
  >
    <span v-if="iconClass" class="astryx-nav-icon__glyph" :class="iconClass" />
    <slot v-else />
  </span>
</template>
