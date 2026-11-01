<script setup lang="ts">
import { band, Chart, ChartAxis, ChartGrid, line, referenceLine } from '@astryx-vue/charts'
import { forecast } from './data'

// 区间带画在最前面，折线和参考线叠在它上面。
const series = [
  band({ upper: 'high', lower: 'low' }),
  line('actual', { label: '实际值', dots: true }),
  referenceLine({ y: 60, label: '目标 60', strokeDasharray: '4 4' }),
]
</script>

<template>
  <Chart :data="forecast" x-key="week" :series="series" :height="260" title="预测区间与目标线" tooltip>
    <template #grid>
      <ChartGrid />
    </template>
    <template #axes>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" />
    </template>
  </Chart>
</template>
