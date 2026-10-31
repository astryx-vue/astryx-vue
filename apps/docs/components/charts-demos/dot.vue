<script setup lang="ts">
import { Chart, ChartAxis, ChartGrid, dot } from '@astryx-vue/charts'
import { samples } from './data'

const series = [
  dot('score', { label: '得分', radius: 5 }),
  dot('other', { label: '对照组', radius: 5 }),
]
</script>

<template>
  <!-- 数值 x 轴默认紧贴数据，最左和最右的点会被切掉一半；用 x-domain 留出边距。 -->
  <Chart :data="samples" x-key="size" :x-domain="[0, 70]" :series="series" :height="260" title="样本量与得分" legend tooltip>
    <template #grid>
      <ChartGrid vertical />
    </template>
    <template #axes>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" />
    </template>
  </Chart>
</template>
