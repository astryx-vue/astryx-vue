<script setup lang="ts">
import type { TooltipSeriesValue } from '@astryx-vue/charts'
import { Chart, ChartAxis, ChartGrid, ChartSwatch, currency, line } from '@astryx-vue/charts'
import { monthly } from './data'

const money = currency('¥')

const series = [
  line('revenue', { label: '收入' }),
  line('profit', { label: '利润' }),
]

// 插槽给出的 rows 是 unknown[]，实际每一项就是 TooltipSeriesValue。
function asRows(rows: unknown[]): TooltipSeriesValue[] {
  return rows as TooltipSeriesValue[]
}
</script>

<template>
  <Chart :data="monthly" x-key="month" :series="series" :height="260" title="收入与利润" tooltip>
    <template #grid>
      <ChartGrid />
    </template>
    <template #axes>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" :tick-format="money" />
    </template>
    <template #tooltip="{ xValue, rows }">
      <div style="display: grid; gap: 4px; padding: 8px 12px; font-size: 13px">
        <strong>{{ xValue }}</strong>
        <div v-for="row in asRows(rows)" :key="row.key">
          <ChartSwatch :color="row.color" variant="line" />
          {{ row.label }}：{{ money(row.value) }}
        </div>
      </div>
    </template>
  </Chart>
</template>
