<script setup lang="ts">
import type { TopNavHeadingProps, TopNavHeadingSlots } from './types.js'
import { computed } from 'vue'
import { resolveNavRoot } from '../NavItem/link.js'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavHeading' })

const props = defineProps<TopNavHeadingProps>()
defineSlots<TopNavHeadingSlots>()

const root = computed(() => props.href ? resolveNavRoot(props.href, false, props.as) : 'div')
</script>

<template>
  <component
    :is="root"
    class="astryx-top-nav-heading"
    :href="href ? href : undefined"
    :to="href && as != null ? href : undefined"
  >
    <span v-if="$slots.icon" class="astryx-top-nav-heading__icon">
      <slot name="icon" />
    </span>
    <span class="astryx-top-nav-heading__title">{{ heading }}</span>
  </component>
</template>
