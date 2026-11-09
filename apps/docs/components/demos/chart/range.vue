<script setup lang="ts">
import { Chart, ChartAxis, ChartGrid, line, useChartRange } from '@astryx-vue/charts'
import { Button } from '@astryx-vue/core'
import { onBeforeUnmount, ref } from 'vue'

const data = ref<Record<string, number>[]>([])
const series = [line('y', { curve: 'linear', label: 'Value' })]
const { xDomain, yDomain, push, reset } = useChartRange({ xWindow: 100, yPadding: 0.15 })
const running = ref(false)
let nextX = 0
let timer: ReturnType<typeof setInterval> | undefined

function append(): void {
  const x = nextX
  const y = 12 + Math.sin(x / 3) * 6 + Math.cos(x / 8) * 3
  push(x, y)
  data.value = [...data.value, { x, y }].filter(point => point.x >= xDomain.value[0])
  nextX += 1
}

function stop(): void {
  if (timer !== undefined)
    clearInterval(timer)
  timer = undefined
  running.value = false
}

function toggle(): void {
  if (timer !== undefined) {
    stop()
    return
  }
  running.value = true
  timer = setInterval(append, 450)
}

function seed(): void {
  for (let index = 0; index < 110; index++)
    append()
}

function resetStream(): void {
  reset()
  data.value = []
  nextX = 0
  seed()
}

seed()

onBeforeUnmount(stop)
</script>

<template>
  <div class="chart-range-demo">
    <Chart
      :data="data"
      x-key="x"
      :series="series"
      :x-domain="xDomain"
      :y-domain="yDomain"
      :height="240"
      title="Streaming values"
    >
      <template #grid>
        <ChartGrid />
      </template>
      <template #axes>
        <ChartAxis position="bottom" />
        <ChartAxis position="left" :tick-count="4" />
      </template>
    </Chart>
    <div class="chart-range-demo__controls">
      <Button :label="running ? 'Pause' : 'Start stream'" variant="primary" @click="toggle" />
      <Button label="Reset" @click="resetStream" />
      <span>x {{ xDomain.map(value => value.toFixed(0)).join('–') }} · y {{ yDomain.map(value => value.toFixed(1)).join('–') }} · {{ data.length }} points</span>
    </div>
    <p>Start adds one point every 450 ms. The x window slides and y tracks the observed range.</p>
  </div>
</template>

<style scoped>
.chart-range-demo { width: 100%; }
.chart-range-demo__controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 12px; }
.chart-range-demo__controls span { margin-inline-start: auto; color: var(--astryx-color-text-secondary); font-size: 12px; }
.chart-range-demo p { margin: 8px 0 0; color: var(--astryx-color-text-secondary); font-size: 12px; }
@media (max-width: 560px) {
  .chart-range-demo__controls span { flex-basis: 100%; margin-inline-start: 0; }
}
</style>
