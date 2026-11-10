<script setup lang="ts">
import type { SankeyLinkLayout, SankeyLinkProps } from './types.js'
import { computed } from 'vue'
import { clampUnit, sankeyOklch } from './color.js'
import { useSankey } from './context.js'

defineOptions({ name: 'AstryxSankeyLink' })
const props = withDefaults(defineProps<SankeyLinkProps>(), {
  color: 'gradient',
  opacity: 0.7,
  tension: 0.5,
})
const sankey = useSankey()

type ColorMode = { type: 'flat', value: string } | { type: 'source' | 'target' } | { type: 'gradient', bias: number }

const mode = computed<ColorMode>(() => {
  const color = props.color
  if (typeof color === 'object')
    return { type: 'gradient', bias: clampUnit(color.gradient, 0.5) }
  if (color === 'gradient')
    return { type: 'gradient', bias: 0.5 }
  if (color === 'source' || color === 'target')
    return { type: color as 'source' | 'target' }
  return { type: 'flat', value: color }
})

function path(link: SankeyLinkLayout): string {
  const sourceX = link.source.x + link.source.width
  const targetX = link.target.x
  const sourceY = link.sourceY
  const targetY = link.targetY
  const linkHeight = link.height
  const dx = (targetX - sourceX) * clampUnit(props.tension, 0.5)
  return [
    `M${sourceX},${sourceY}`,
    `C${sourceX + dx},${sourceY} ${targetX - dx},${targetY} ${targetX},${targetY}`,
    `L${targetX},${targetY + linkHeight}`,
    `C${targetX - dx},${targetY + linkHeight} ${sourceX + dx},${sourceY + linkHeight} ${sourceX},${sourceY + linkHeight}`,
    'Z',
  ].join(' ')
}

function fill(link: SankeyLinkLayout, index: number): string {
  if (mode.value.type === 'flat')
    return mode.value.value
  if (mode.value.type === 'source')
    return sankeyOklch(link.source.color, clampUnit(props.opacity, 0.7))
  if (mode.value.type === 'target')
    return sankeyOklch(link.target.color, clampUnit(props.opacity, 0.7))
  return `url(#${sankey.gradientIdPrefix}-${index})`
}

function gradientStops(link: SankeyLinkLayout, bias: number) {
  const opacity = clampUnit(props.opacity, 0.7)
  return [
    { offset: '0%', color: sankeyOklch(link.source.color, opacity) },
    { offset: `${Math.max(0, bias - 0.15) * 100}%`, color: sankeyOklch(link.source.color, opacity * 0.9) },
    { offset: `${Math.min(1, bias + 0.15) * 100}%`, color: sankeyOklch(link.target.color, opacity * 0.9) },
    { offset: '100%', color: sankeyOklch(link.target.color, opacity) },
  ]
}
</script>

<template>
  <g class="astryx-sankey-links">
    <defs v-if="mode.type === 'gradient'">
      <linearGradient
        v-for="(link, index) in sankey.links"
        :id="`${sankey.gradientIdPrefix}-${index}`"
        :key="index"
        :x1="link.source.x + link.source.width"
        :x2="link.target.x"
        y1="0"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop v-for="(stop, stopIndex) in gradientStops(link, mode.bias)" :key="stopIndex" :offset="stop.offset" :stop-color="stop.color" />
      </linearGradient>
    </defs>
    <path
      v-for="(link, index) in sankey.links"
      :key="index"
      :d="path(link)"
      :fill="fill(link, index)"
      :opacity="mode.type === 'flat' ? clampUnit(props.opacity, 0.7) : undefined"
      class="astryx-sankey-link"
    />
  </g>
</template>
