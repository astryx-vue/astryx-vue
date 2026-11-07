<script setup lang="ts">
import { Chart, ChartBrush, line } from '@astryx-vue/charts'
import { ref } from 'vue'

const data = Array.from({ length: 12 }, (_, x) => ({ x, y: 10 + (x % 5) * 4 }))
const series = [line('y', { dots: true })]
const result = ref('Drag across the chart to select a range.')

function onBrush(range: { x: [number, number] }, selected: unknown[]): void {
  result.value = `${selected.length} points · x ${range.x[0].toFixed(1)}–${range.x[1].toFixed(1)}`
}
</script>

<template>
  <div class="chart-brush-demo">
    <Chart :data="data" x-key="x" :series="series" :height="240" title="Selectable values">
      <template #interactions>
        <ChartBrush @brush="onBrush" @clear="result = 'Drag across the chart to select a range.'" />
      </template>
    </Chart>
    <p>{{ result }}</p>
  </div>
</template>

<style scoped>
.chart-brush-demo { width: 100%; }
.chart-brush-demo p { margin: 8px 0 0; color: var(--astryx-color-text-secondary); font-size: 12px; }
</style>
