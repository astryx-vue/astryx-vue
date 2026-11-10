<script setup lang="ts">
import type { SankeyNodeProps } from './types.js'
import { sankeyOklch } from './color.js'
import { useSankey } from './context.js'

defineOptions({ name: 'AstryxSankeyNode' })
const props = withDefaults(defineProps<SankeyNodeProps>(), { glow: true })
const sankey = useSankey()
</script>

<template>
  <g class="astryx-sankey-nodes">
    <g v-for="node in sankey.nodes" :key="node.id" class="astryx-sankey-node">
      <rect
        v-if="props.glow"
        :x="node.x - 3"
        :y="node.y - 1"
        :width="node.width + 6"
        :height="node.height + 2"
        rx="4"
        :fill="sankey.nodeColor || sankeyOklch(node.color, 0.12)"
        :opacity="sankey.nodeColor ? 0.12 : 1"
        class="astryx-sankey-node__glow"
      />
      <rect
        :x="node.x"
        :y="node.y"
        :width="node.width"
        :height="node.height"
        rx="1.5"
        :fill="sankey.nodeColor || sankeyOklch(node.color, 0.9)"
        class="astryx-sankey-node__bar"
      />
    </g>
  </g>
</template>
