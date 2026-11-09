<script setup lang="ts">
import { RadialChart, RadialSlice, RadialTooltip, useChartColors } from '@astryx-vue/charts'

const data = [
  { region: 'North America', revenue: 500 },
  { region: 'Europe', revenue: 300 },
  { region: 'Asia Pacific', revenue: 200 },
]
const colors = useChartColors().categorical(data.length)
</script>

<template>
  <RadialChart
    :data="data"
    value-key="revenue"
    label-key="region"
    :inner-radius="0.6"
    :height="360"
    interactive
    label="Revenue share by region"
  >
    <RadialSlice :colors="colors" :corner-radius="4" />
    <RadialTooltip />
  </RadialChart>
</template>
