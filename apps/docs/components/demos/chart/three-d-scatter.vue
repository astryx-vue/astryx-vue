<script setup lang="ts">
import { ThreeDAxis, ThreeDChart, ThreeDGrid, ThreeDScatter, useChartColors } from '@astryx-vue/charts'

const centers = [
  { x: 2, y: 3, z: 2 },
  { x: 6, y: 7, z: 5 },
  { x: 3, y: 5, z: 8 },
]
const data = centers.flatMap((center, group) => Array.from({ length: 12 }, (_, index) => ({
  x: center.x + Math.sin(index * 1.7 + group) * 1.1,
  y: center.y + Math.cos(index * 1.3 + group) * 0.9,
  z: center.z + Math.sin(index * 1.1 + group) * 1.2,
})))
const color = useChartColors().categorical(1)[0]
</script>

<template>
  <ThreeDChart
    :data="data"
    x-key="x"
    y-key="y"
    z-key="z"
    :width="720"
    :height="420"
    interactive
    label="Three-dimensional clusters"
  >
    <ThreeDGrid />
    <ThreeDAxis />
    <ThreeDScatter :color="color" :radius="4.5" />
  </ThreeDChart>
</template>
