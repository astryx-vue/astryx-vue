<script setup lang="ts">
import { ThreeDAxis, ThreeDChart, ThreeDGrid, ThreeDSurface, useChartColors } from '@astryx-vue/charts'

const data = Array.from({ length: 11 }, (_, x) => Array.from({ length: 11 }, (_, z) => ({
  x,
  y: 5 + Math.sin(x * 0.7) * Math.cos(z * 0.6) * 2.5,
  z,
}))).flat()
const colorRange = useChartColors().sequential.blue(5)
</script>

<template>
  <ThreeDChart
    :data="data"
    x-key="x"
    y-key="y"
    z-key="z"
    :x-domain="[0, 10]"
    :y-domain="[0, 10]"
    :z-domain="[0, 10]"
    :width="720"
    :height="420"
    interactive
    label="Three-dimensional wave surface"
  >
    <ThreeDGrid :divisions="4" />
    <ThreeDSurface :color-range="colorRange" :opacity="0.86" />
    <ThreeDAxis />
  </ThreeDChart>
</template>
