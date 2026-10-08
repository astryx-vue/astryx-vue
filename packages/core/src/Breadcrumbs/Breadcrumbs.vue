<script setup lang="ts">
import type { BreadcrumbsProps } from './types.js'
import { computed, provide } from 'vue'

import { breadcrumbContextKey } from './context.js'
import '../../styles/breadcrumbs.css'

const props = withDefaults(defineProps<BreadcrumbsProps>(), {
  separator: '/',
  variant: 'default',
  label: 'Breadcrumb',
})

defineSlots<{
  default: () => unknown
}>()

provide(breadcrumbContextKey, {
  variant: computed(() => props.variant),
  separator: computed(() => props.separator),
})
</script>

<template>
  <nav class="astryx-breadcrumbs" :aria-label="label">
    <ol class="astryx-breadcrumbs__list">
      <slot />
    </ol>
  </nav>
</template>
