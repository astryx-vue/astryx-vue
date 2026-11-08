<script setup lang="ts">
import type { ChartZoomProps } from './types.js'
import { IconButton } from '@astryx-vue/core'

defineOptions({ name: 'AstryxChartZoomToolbar' })
defineProps<{ zoom: ChartZoomProps }>()
const emit = defineEmits<{
  zoomIn: []
  zoomOut: []
  reset: []
}>()
</script>

<template>
  <div v-if="zoom.toolbar" class="astryx-chart-zoom__toolbar" :data-position="zoom.toolbar">
    <IconButton label="Zoom in" variant="ghost" size="sm" @click="emit('zoomIn')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M8 3v10M3 8h10" />
      </svg>
    </IconButton>
    <IconButton label="Zoom out" variant="ghost" size="sm" @click="emit('zoomOut')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M3 8h10" />
      </svg>
    </IconButton>
    <IconButton label="Reset zoom" variant="ghost" size="sm" @click="emit('reset')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 8a6 6 0 1 1 1.5 4M2 12V8h4" />
      </svg>
    </IconButton>
  </div>
</template>
