<script setup lang="ts">
import type { SankeyLabelProps, SankeyNodeLayout } from './types.js'
import { computed } from 'vue'
import { sankeyOnSurfaceColor } from './color.js'
import { useSankey } from './context.js'

defineOptions({ name: 'AstryxSankeyLabel' })
const props = withDefaults(defineProps<SankeyLabelProps>(), {
  showPercent: true,
  formatValue: undefined,
})
const sankey = useSankey()

function defaultFormat(value: number): string {
  if (value >= 10000)
    return `${Math.round(value / 1000)}k`
  if (value >= 1000)
    return `${(value / 1000).toFixed(1)}k`
  return value.toLocaleString()
}

const labels = computed(() => {
  const lastColumn = sankey.columns.length - 1
  return sankey.nodes.map((node: SankeyNodeLayout) => {
    const text = `${node.label} = ${(props.formatValue ?? defaultFormat)(node.value)}`
    const percentage = sankey.maxValue > 0 ? node.value / sankey.maxValue * 100 : 0
    const percent = percentage >= 10 ? `${Math.round(percentage)}%` : `${percentage.toFixed(1)}%`
    const centerX = node.x + sankey.nodeWidth / 2
    const centerY = node.y + node.height / 2
    const percentText = props.showPercent && node.column > 0 ? percent : null
    const percentY = Math.min(sankey.height - 2, node.y + node.height + 12)
    const rotated = node.height >= text.length * 6.5 + 8

    if (rotated) {
      return {
        id: node.id,
        node,
        text,
        rotated,
        transform: `translate(${centerX}, ${centerY}) rotate(-90)`,
        fill: sankeyOnSurfaceColor(node.color, sankey.nodeColor),
        centerX,
        percentText,
        percentY,
      }
    }

    const isLast = node.column === lastColumn
    const labelX = isLast ? node.x - 6 : node.x + sankey.nodeWidth + 6
    const pillWidth = text.length * 6 + 10
    return {
      id: node.id,
      node,
      text,
      rotated,
      labelX,
      labelY: centerY,
      anchor: isLast ? 'end' : 'start',
      pillX: isLast ? labelX - pillWidth + 4 : labelX - 4,
      pillY: centerY - 8,
      pillWidth,
      centerX,
      percentText,
      percentY,
    }
  })
})
</script>

<template>
  <g class="astryx-sankey-labels">
    <g v-for="label in labels" :key="label.id">
      <g v-if="label.rotated" :transform="label.transform">
        <text
          x="0"
          y="0"
          text-anchor="middle"
          dominant-baseline="central"
          class="astryx-sankey-label astryx-sankey-label--rotated"
          :style="{ fill: label.fill }"
        >
          {{ label.text }}
        </text>
      </g>
      <template v-else>
        <rect
          :x="label.pillX"
          :y="label.pillY"
          :width="label.pillWidth"
          height="16"
          rx="3"
          fill="var(--astryx-color-background-surface, #fff)"
          fill-opacity="0.9"
          class="astryx-sankey-label__surface"
        />
        <text
          :x="label.labelX"
          :y="label.labelY"
          :text-anchor="label.anchor"
          dominant-baseline="central"
          class="astryx-sankey-label astryx-sankey-label--beside"
        >
          {{ label.text }}
        </text>
      </template>
      <text
        v-if="label.percentText"
        :x="label.centerX"
        :y="label.percentY"
        text-anchor="middle"
        class="astryx-sankey-label__percent"
      >
        {{ label.percentText }}
      </text>
    </g>
  </g>
</template>
