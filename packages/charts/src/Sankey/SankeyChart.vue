<script setup lang="ts">
import type { SankeyChartProps, SankeyContext } from './types.js'
import { VisuallyHidden } from '@astryx-vue/core'
import { computed, onMounted, onScopeDispose, provide, ref, useId } from 'vue'
import { useChartMessages } from '../messages.js'
import { sankeyContextKey } from './context.js'
import { computeSankeyLayout, resolveSankeyColumns } from './layout.js'

import '../../styles/sankey.css'

defineOptions({ name: 'AstryxSankeyChart' })
const props = withDefaults(defineProps<SankeyChartProps>(), {
  width: 0,
  height: 320,
  nodeWidth: 20,
  nodeGap: 14,
  nodeColor: undefined,
  minColumnWidth: 160,
  label: undefined,
  columns: undefined,
})

const containerRef = ref<HTMLElement | null>(null)
const measuredWidth = ref<number | null>(null)
const t = useChartMessages()
const accessibleLabel = computed(() => props.label ?? t('@astryx.sankeyChart.label'))
const gradientIdPrefix = `astryx-sankey-${useId()}`

onMounted(() => {
  const element = containerRef.value
  if (!element || typeof ResizeObserver === 'undefined')
    return
  const observer = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width
    if (width != null)
      measuredWidth.value = width
  })
  observer.observe(element)
  onScopeDispose(() => observer.disconnect())
})

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

const containerWidth = computed(() => measuredWidth.value ?? nonNegative(props.width))
const safeHeight = computed(() => nonNegative(props.height))
const columnCount = computed(() => resolveSankeyColumns(props.nodes, props.links, props.columns).length)
const chartWidth = computed(() => Math.max(containerWidth.value, columnCount.value * nonNegative(props.minColumnWidth)))
const needsScroll = computed(() => containerWidth.value > 0 && chartWidth.value > containerWidth.value)
const layout = computed(() => containerWidth.value === 0
  ? null
  : computeSankeyLayout(props.nodes, props.links, {
      width: chartWidth.value,
      height: safeHeight.value,
      nodeWidth: props.nodeWidth,
      nodeGap: props.nodeGap,
      columns: props.columns,
    }))

const context: SankeyContext = {
  get nodes() { return layout.value?.nodes ?? [] },
  get links() { return layout.value?.links ?? [] },
  get columns() { return layout.value?.columns ?? [] },
  get width() { return chartWidth.value },
  get height() { return safeHeight.value },
  get valueScale() { return layout.value?.valueScale ?? 0 },
  get maxValue() { return layout.value?.maxValue ?? 0 },
  get nodeWidth() { return nonNegative(props.nodeWidth) },
  get nodeColor() { return props.nodeColor },
  gradientIdPrefix,
}
provide(sankeyContextKey, context)

const nodeLabelById = computed(() => new Map(props.nodes.map(node => [node.id, node.label || node.id])))
const showDataTable = computed(() => props.links.length > 0 && props.links.length <= 100)
const chartStyle = computed(() => containerWidth.value === 0 ? { height: `${safeHeight.value}px` } : undefined)
defineExpose({ element: containerRef })
</script>

<template>
  <div ref="containerRef" class="astryx-sankey-chart" :style="chartStyle">
    <div
      v-if="containerWidth > 0"
      class="astryx-sankey-chart__viewport"
      :class="{ 'astryx-sankey-chart__viewport--scroll': needsScroll }"
      :role="needsScroll ? 'group' : undefined"
      :aria-label="needsScroll ? accessibleLabel : undefined"
      :tabindex="needsScroll ? 0 : undefined"
    >
      <svg role="img" :aria-label="accessibleLabel" :width="chartWidth" :height="safeHeight">
        <slot />
      </svg>
    </div>
    <VisuallyHidden v-if="showDataTable" as="div">
      <table>
        <caption>{{ t('@astryx.chart.dataTableCaption', { label: accessibleLabel }) }}</caption>
        <thead>
          <tr>
            <th scope="col">
              {{ t('@astryx.sankeyChart.from') }}
            </th>
            <th scope="col">
              {{ t('@astryx.sankeyChart.to') }}
            </th>
            <th scope="col">
              {{ t('@astryx.sankeyChart.value') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(link, index) in links" :key="`${link.source}-${link.target}-${index}`">
            <th scope="row">
              {{ nodeLabelById.get(link.source) ?? link.source }}
            </th>
            <td>{{ nodeLabelById.get(link.target) ?? link.target }}</td>
            <td>{{ link.value }}</td>
          </tr>
        </tbody>
      </table>
    </VisuallyHidden>
  </div>
</template>
