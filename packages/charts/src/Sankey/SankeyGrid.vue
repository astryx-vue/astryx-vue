<script setup lang="ts">
import type { SankeyGridProps } from './types.js'
import { clampUnit } from './color.js'
import { useSankey } from './context.js'

defineOptions({ name: 'AstryxSankeyGrid' })
const props = withDefaults(defineProps<SankeyGridProps>(), {
  dashArray: '4 4',
  color: undefined,
  opacity: 0.3,
  showHeaders: true,
})
const sankey = useSankey()

function headerAnchor(index: number): 'start' | 'middle' | 'end' {
  if (index === 0)
    return 'start'
  return index === sankey.columns.length - 1 ? 'end' : 'middle'
}

function headerX(column: { x: number }, index: number): number {
  if (index === 0)
    return column.x
  if (index === sankey.columns.length - 1)
    return column.x + sankey.nodeWidth
  return column.x + sankey.nodeWidth / 2
}
</script>

<template>
  <g class="astryx-sankey-grid">
    <g v-for="(column, index) in sankey.columns" :key="index">
      <line
        :x1="column.x + sankey.nodeWidth / 2"
        :x2="column.x + sankey.nodeWidth / 2"
        y1="0"
        :y2="sankey.height"
        :stroke="props.color || 'var(--astryx-color-border, #e5e5e5)'"
        :stroke-opacity="clampUnit(props.opacity, 0.3)"
        :stroke-dasharray="props.dashArray"
        stroke-width="1"
      />
      <text
        v-if="props.showHeaders && column.label"
        :x="headerX(column, index)"
        :y="sankey.height - 2"
        :text-anchor="headerAnchor(index)"
        class="astryx-sankey-grid__header"
      >
        {{ column.label }}
      </text>
    </g>
  </g>
</template>
