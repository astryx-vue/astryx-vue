<script setup lang="ts">
import { Chart, ChartZoom, line } from '@astryx-vue/charts'
import { ref } from 'vue'

const data = Array.from({ length: 16 }, (_, x) => ({ x, y: 12 + Math.sin(x / 2) * 6 + x * 0.4 }))
const series = [line('y')]
const xDomain = ref<[number, number]>([0, 15])
const yDomain = ref<[number, number]>([0, 24])
</script>

<template>
  <div class="chart-zoom-demo">
    <Chart
      :data="data"
      x-key="x"
      :series="series"
      :x-domain="xDomain"
      :y-domain="yDomain"
      :height="260"
      title="Zoomable values"
    >
      <template #interactions>
        <ChartZoom
          @x-domain-change="xDomain = $event"
          @y-domain-change="yDomain = $event"
        />
      </template>
    </Chart>
    <p>x {{ xDomain.map(value => value.toFixed(1)).join('–') }} · y {{ yDomain.map(value => value.toFixed(1)).join('–') }}</p>
    <p>Use the wheel or pinch to zoom. Drag to pan. Use the toolbar to reset.</p>
  </div>
</template>

<style scoped>
.chart-zoom-demo { width: 100%; }
.chart-zoom-demo p { margin: 8px 0 0; color: var(--astryx-color-text-secondary); font-size: 12px; }
.chart-zoom-demo p + p { margin-top: 4px; }
</style>
