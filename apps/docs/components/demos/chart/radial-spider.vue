<script setup lang="ts">
import { RadialArea, RadialAxis, RadialChart, RadialGrid, RadialTooltip, useChartColors } from '@astryx-vue/charts'

const axes = ['speed', 'handling', 'comfort', 'reliability', 'efficiency']
const data = [
  { model: 'Model A', speed: 8, handling: 6, comfort: 9, reliability: 7, efficiency: 8 },
  { model: 'Model B', speed: 6, handling: 9, comfort: 6, reliability: 8, efficiency: 7 },
]
const colors = useChartColors().categorical(2)
const series = [
  { key: 'Model A', color: colors[0] },
  { key: 'Model B', color: colors[1] },
]
</script>

<template>
  <div class="radial-spider-demo">
    <RadialChart :data="data" :axes="axes" :height="360" label="Model comparison radar chart" interactive>
      <RadialGrid :rings="5" />
      <RadialArea data-key="Model A" :color="colors[0]" dots />
      <RadialArea data-key="Model B" :color="colors[1]" dots />
      <RadialAxis />
      <RadialTooltip />
    </RadialChart>
    <div class="radial-spider-demo__legend" aria-label="Series">
      <span v-for="item in series" :key="item.key">
        <i :style="{ backgroundColor: item.color }" aria-hidden="true" />
        {{ item.key }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.radial-spider-demo { width: 100%; }
.radial-spider-demo__legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; font-size: 12px; }
.radial-spider-demo__legend span { display: inline-flex; align-items: center; gap: 6px; }
.radial-spider-demo__legend i { width: 10px; height: 10px; border-radius: 2px; }
</style>
