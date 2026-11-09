<script setup lang="ts">
import { Chart, ChartAxis, ChartGrid, line, m4Reduce } from '@astryx-vue/charts'

const rawData = Array.from({ length: 12_000 }, (_, x) => ({
  x,
  y: 48 + Math.sin(x / 1_800) * 18 + Math.cos(x / 950) * 7,
}))
const reducedData = m4Reduce(rawData, 480)
const panels = [
  {
    id: 'raw',
    label: 'Original',
    data: rawData,
    series: [line('y', { curve: 'linear', label: 'Original' })],
  },
  {
    id: 'm4',
    label: 'M4 reduced · 480 px',
    data: reducedData,
    series: [line('y', { curve: 'linear', label: 'M4 reduced' })],
  },
]
</script>

<template>
  <div class="chart-m4-demo">
    <figure v-for="panel in panels" :key="panel.id">
      <figcaption>
        <strong>{{ panel.label }}</strong>
        <span>{{ panel.data.length.toLocaleString('en-US') }} points</span>
      </figcaption>
      <Chart
        :data="panel.data"
        x-key="x"
        :series="panel.series"
        :x-domain="[0, 11_999]"
        :y-domain="[-50, 110]"
        :height="180"
      >
        <template #grid>
          <ChartGrid />
        </template>
        <template #axes>
          <ChartAxis position="bottom" :tick-count="4" />
          <ChartAxis position="left" :tick-count="4" />
        </template>
      </Chart>
    </figure>
    <p>Both charts keep the same peaks and valleys. M4 only reduces the number of points.</p>
  </div>
</template>

<style scoped>
.chart-m4-demo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; width: 100%; }
.chart-m4-demo figure { min-width: 0; margin: 0; }
.chart-m4-demo figcaption { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 8px; font-size: 12px; }
.chart-m4-demo figcaption span, .chart-m4-demo p { color: var(--astryx-color-text-secondary); }
.chart-m4-demo p { grid-column: 1 / -1; margin: 0; font-size: 12px; }
@media (max-width: 680px) {
  .chart-m4-demo { grid-template-columns: minmax(0, 1fr); }
}
</style>
