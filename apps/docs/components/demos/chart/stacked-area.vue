<script setup lang="ts">
import { area, Chart, ChartAxis, ChartGrid } from '@astryx-vue/charts'
import { monthly } from './data'

// stack 名字相同的面积会一层叠一层往上长。
const series = [
  area('cost', { stack: 'total', label: '成本' }),
  area('profit', { stack: 'total', label: '利润' }),
]
</script>

<template>
  <Chart :data="monthly" x-key="month" :series="series" :height="260" title="成本加利润等于收入" legend tooltip>
    <template #grid>
      <ChartGrid />
    </template>
    <template #axes>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" />
    </template>
  </Chart>
</template>
