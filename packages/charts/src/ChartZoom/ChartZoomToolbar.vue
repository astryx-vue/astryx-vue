<script setup lang="ts">
import type { ChartZoomProps } from './types.js'
import { Icon, IconButton } from '@astryx-vue/core'

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
      <Icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5v14" />
        </svg>
      </Icon>
    </IconButton>
    <IconButton label="Zoom out" variant="ghost" size="sm" @click="emit('zoomOut')">
      <Icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M5 12h14" />
        </svg>
      </Icon>
    </IconButton>
    <IconButton label="Reset zoom" variant="ghost" size="sm" @click="emit('reset')">
      <Icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </Icon>
    </IconButton>
  </div>
</template>
