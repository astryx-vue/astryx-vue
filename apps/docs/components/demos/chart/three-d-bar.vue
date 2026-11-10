<script setup lang="ts">
import { ThreeDAxis, ThreeDBar, ThreeDChart, ThreeDGrid, useChartColors } from '@astryx-vue/charts'

const data = Array.from({ length: 12 }, (_, index) => ({
  x: index % 4 * 2,
  y: 4 + Math.sin(index * 0.8) * 2 + index % 3,
  z: Math.floor(index / 4) * 2,
}))
const color = useChartColors().categorical(2)[1]
</script>

<template>
  <ThreeDChart
    :data="data"
    x-key="x"
    y-key="y"
    z-key="z"
    :x-domain="[0, 6]"
    :y-domain="[0, 10]"
    :z-domain="[0, 4]"
    :width="720"
    :height="420"
    interactive
    label="Three-dimensional bar chart"
  >
    <ThreeDGrid />
    <ThreeDAxis />
    <ThreeDBar :color="color" :bar-width="0.12" :bar-depth="0.16" />
  </ThreeDChart>
</template>
