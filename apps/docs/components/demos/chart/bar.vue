<script setup lang="ts">
import { bar, Chart, ChartAxis, ChartGrid } from '@astryx-vue/charts'
import { monthly } from './data'

// 没写 group 或 stack 的柱子会各占一列；这里两个系列同属一个 group，并排显示。
const series = [
  bar('revenue', { group: 'money', label: '收入', radius: 4 }),
  bar('cost', { group: 'money', label: '成本', radius: 4 }),
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
