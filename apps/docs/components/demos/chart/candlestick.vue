<script setup lang="ts">
import { candlestick, Chart, ChartAxis, ChartGrid } from '@astryx-vue/charts'
import { prices } from './data'

const series = [candlestick({ open: 'open', high: 'high', low: 'low', close: 'close' })]
</script>

<template>
  <Chart :data="prices" x-key="day" :series="series" :height="260" y-baseline="data" title="一周价格走势">
    <template #grid>
      <ChartGrid />
    </template>
    <template #axes>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" />
    </template>
  </Chart>
</template>
