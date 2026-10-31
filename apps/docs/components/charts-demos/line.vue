<script setup lang="ts">
import { Chart, ChartAxis, ChartGrid, line } from '@astryx-vue/charts'
import { monthly } from './data'

const series = [
  line('revenue', { label: '收入' }),
  line('cost', { label: '成本' }),
]
</script>

<template>
  <Chart :data="monthly" x-key="month" :series="series" :height="260" title="每月收入与成本" legend tooltip>
    <template #grid>
      <ChartGrid />
    </template>
    <template #axes>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" />
    </template>
  </Chart>
</template>
