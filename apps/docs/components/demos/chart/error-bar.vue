<script setup lang="ts">
import { bar, Chart, ChartAxis, ChartGrid, errorBar } from '@astryx-vue/charts'
import { experiments } from './data'

// errorBar 读的是上下界的绝对值，所以不对称的区间也能画。
const series = [
  bar('mean', { label: '均值', radius: 4 }),
  errorBar({ high: 'upper95', low: 'lower95' }),
]
</script>

<template>
  <Chart :data="experiments" x-key="group" :series="series" :height="260" title="各组均值与 95% 区间" tooltip>
    <template #grid>
      <ChartGrid />
    </template>
    <template #axes>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" />
    </template>
  </Chart>
</template>
