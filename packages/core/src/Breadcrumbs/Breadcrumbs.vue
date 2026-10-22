<script setup lang="ts">
import type { BreadcrumbsProps } from './types.js'
import { computed, provide } from 'vue'

import { useBreadcrumbTrail } from './breadcrumbTrail.js'
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

const trail = useBreadcrumbTrail()

provide(breadcrumbContextKey, {
  variant: computed(() => props.variant),
  separator: computed(() => props.separator),
  autoCurrentId: trail.autoCurrentId,
  registerItem: trail.registerItem,
  updateItem: trail.updateItem,
  unregisterItem: trail.unregisterItem,
})
</script>

<template>
  <nav class="astryx-breadcrumbs" :aria-label="label">
    <ol class="astryx-breadcrumbs__list">
      <slot />
    </ol>
  </nav>
</template>
