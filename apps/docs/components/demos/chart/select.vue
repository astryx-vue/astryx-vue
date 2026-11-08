<script setup lang="ts">
import { Chart, ChartSelect, line } from '@astryx-vue/charts'
import { computed, ref } from 'vue'

const data = [
  { month: 'Jan', revenue: 12 },
  { month: 'Feb', revenue: 18 },
  { month: 'Mar', revenue: 15 },
  { month: 'Apr', revenue: 24 },
  { month: 'May', revenue: 21 },
]
const series = [line('revenue', { dots: true })]
const selected = ref<number[]>([1])
const result = computed(() => selected.value.length > 0
  ? `Selected: ${selected.value.map(index => data[index]?.month).filter(Boolean).join(', ')}`
  : 'Click a point to select it.')
</script>

<template>
  <div class="chart-select-demo">
    <Chart :data="data" x-key="month" :series="series" :height="240" title="Monthly revenue">
      <template #interactions>
        <ChartSelect :selected="selected" @selection-change="selected = $event" />
      </template>
    </Chart>
    <p>{{ result }} Use Shift or Meta to toggle multiple points.</p>
  </div>
</template>

<style scoped>
.chart-select-demo { width: 100%; }
.chart-select-demo p { margin: 8px 0 0; color: var(--astryx-color-text-secondary); font-size: 12px; }
</style>
