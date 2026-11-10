<script setup lang="ts">
import type { ThreeDGridProps } from './types.js'
import { computed } from 'vue'
import { use3D } from './context.js'

defineOptions({ name: 'AstryxThreeDGrid' })
const props = withDefaults(defineProps<ThreeDGridProps>(), { divisions: 5 })
const chart = use3D()

const lines = computed(() => {
  const divisions = Number.isFinite(props.divisions) ? Math.max(1, Math.floor(props.divisions)) : 5
  const result: { x1: number, y1: number, x2: number, y2: number, depth: number }[] = []
  for (let index = 0; index <= divisions; index++) {
    const value = index / divisions
    const a = chart.project(value, 0, 0)
    const b = chart.project(value, 0, 1)
    result.push({ x1: a.px, y1: a.py, x2: b.px, y2: b.py, depth: (a.depth + b.depth) / 2 })
    const c = chart.project(0, 0, value)
    const d = chart.project(1, 0, value)
    result.push({ x1: c.px, y1: c.py, x2: d.px, y2: d.py, depth: (c.depth + d.depth) / 2 })
  }
  return result.sort((a, b) => a.depth - b.depth)
})
</script>

<template>
  <g class="astryx-three-d-grid">
    <line
      v-for="(line, index) in lines"
      :key="index"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
    />
  </g>
</template>
