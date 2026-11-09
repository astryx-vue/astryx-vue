<script setup lang="ts">
import type { RadialChartProps, RadialContext, RadialSliceDatum } from './types.js'
import { useLocale, VisuallyHidden } from '@astryx-vue/core'
import { computed, onMounted, onScopeDispose, provide, ref } from 'vue'
import { formatList } from '../formatters.js'
import { useChartMessages } from '../messages.js'
import { radialContextKey } from './context.js'

import '../../styles/radial.css'

defineOptions({ name: 'AstryxRadialChart' })

const props = withDefaults(defineProps<RadialChartProps>(), {
  width: 0,
  height: 400,
  axes: undefined,
  valueKey: undefined,
  labelKey: undefined,
  innerRadius: 0,
  padAngle: 0.02,
  interactive: false,
  label: undefined,
})

const containerRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)
const measuredWidth = ref<number | null>(null)

onMounted(() => {
  const element = containerRef.value
  if (!element || typeof ResizeObserver === 'undefined')
    return
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry)
      measuredWidth.value = entry.contentRect.width
  })
  observer.observe(element)
  onScopeDispose(() => observer.disconnect())
})

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

const containerWidth = computed(() => measuredWidth.value ?? nonNegative(props.width))
const safeHeight = computed(() => nonNegative(props.height))
const outerRadius = computed(() => Math.max(0, Math.min(containerWidth.value, safeHeight.value) / 2 - 40))
const innerRadiusPx = computed(() => outerRadius.value * Math.min(1, nonNegative(props.innerRadius)))
const mode = computed(() => props.axes ? 'spider' : 'pie')

const spider = computed(() => {
  const axes = props.axes
  if (!axes || axes.length === 0)
    return {}

  const angleByAxis = new Map<string, number>()
  const step = 2 * Math.PI / axes.length
  axes.forEach((key, index) => {
    angleByAxis.set(key, -Math.PI / 2 + step * index)
  })

  const axisDomains = new Map<string, [number, number]>()
  for (const key of axes) {
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    for (const row of props.data) {
      const value = row[key]
      if (typeof value !== 'number' || !Number.isFinite(value))
        continue
      min = Math.min(min, value)
      max = Math.max(max, value)
    }
    if (min === Number.POSITIVE_INFINITY) {
      axisDomains.set(key, [0, 0])
      continue
    }
    if (min > 0)
      min = 0
    axisDomains.set(key, [min, max])
  }

  return {
    axes,
    angleByAxis,
    axisDomains,
    radiusScale: (ratio: number) => innerRadiusPx.value + ratio * (outerRadius.value - innerRadiusPx.value),
  }
})

const pieSlices = computed<RadialSliceDatum[]>(() => {
  if (mode.value !== 'pie' || !props.valueKey)
    return []

  const values = props.data.map((row) => {
    const value = row[props.valueKey!]
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0
  })
  const total = values.reduce((sum, value) => sum + value, 0)
  if (total <= 0)
    return []

  const padAngle = nonNegative(props.padAngle)
  const available = Math.max(0, 2 * Math.PI - padAngle * props.data.length)
  let currentAngle = -Math.PI / 2
  return props.data.map((row, index) => {
    const value = values[index]
    const percentage = value / total
    const sweep = percentage * available
    const slice = {
      key: props.labelKey ? String(row[props.labelKey]) : String(value),
      value,
      startAngle: currentAngle,
      endAngle: currentAngle + sweep,
      percentage,
    }
    currentAngle += sweep + padAngle
    return slice
  })
})

const context: RadialContext = {
  get cx() { return containerWidth.value / 2 },
  get cy() { return safeHeight.value / 2 },
  get radius() { return outerRadius.value },
  get innerRadius() { return innerRadiusPx.value },
  get data() { return props.data },
  get mode() { return mode.value },
  get interactive() { return props.interactive },
  get axes() { return spider.value.axes },
  get angleByAxis() { return spider.value.angleByAxis },
  get axisDomains() { return spider.value.axisDomains },
  get radiusScale() { return spider.value.radiusScale },
  get slices() { return pieSlices.value },
  svgRef,
}
provide(radialContextKey, context)

const t = useChartMessages()
const { locale } = useLocale()
const accessibleLabel = computed(() => {
  if (props.label)
    return props.label
  if (mode.value === 'spider')
    return t('@astryx.radialChart.radarLabel', { axes: formatList(props.axes ?? [], locale.value) })
  return t('@astryx.radialChart.pieLabel', { valueKey: props.valueKey ?? 'values' })
})

const showPieTable = computed(() => mode.value === 'pie' && pieSlices.value.length > 0 && pieSlices.value.length <= 100)
const showSpiderTable = computed(() => mode.value === 'spider'
  && props.axes != null && props.axes.length > 0 && props.data.length > 0
  && props.data.length * props.axes.length <= 100)

function tableCell(value: unknown): string {
  return value == null ? '' : String(value)
}

function spiderRowHeader(row: Record<string, unknown>, index: number): string {
  const name = Object.values(row).find(value => typeof value === 'string')
  return typeof name === 'string' ? name : `${t('@astryx.radialChart.series')} ${index + 1}`
}

const chartStyle = computed(() => containerWidth.value === 0 ? { height: `${safeHeight.value}px` } : undefined)
defineExpose({ element: containerRef })
</script>

<template>
  <div ref="containerRef" class="astryx-radial-chart" :style="chartStyle">
    <template v-if="containerWidth !== 0">
      <svg
        ref="svgRef"
        role="img"
        :aria-label="accessibleLabel"
        :width="containerWidth"
        :height="safeHeight"
        :style="{ touchAction: interactive ? 'none' : undefined }"
      >
        <slot />
      </svg>
      <VisuallyHidden v-if="showPieTable" as="div">
        <table>
          <caption>{{ t('@astryx.chart.dataTableCaption', { label: accessibleLabel }) }}</caption>
          <thead>
            <tr>
              <th scope="col">
                {{ labelKey ?? 'Label' }}
              </th>
              <th scope="col">
                {{ valueKey }}
              </th>
              <th scope="col">
                {{ t('@astryx.radialChart.percentage') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(slice, index) in pieSlices" :key="index">
              <th scope="row">
                {{ slice.key }}
              </th>
              <td>{{ slice.value }}</td>
              <td>{{ (slice.percentage * 100).toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
      </VisuallyHidden>
      <VisuallyHidden v-if="showSpiderTable" as="div">
        <table>
          <caption>{{ t('@astryx.chart.dataTableCaption', { label: accessibleLabel }) }}</caption>
          <thead>
            <tr>
              <th scope="col">
                {{ t('@astryx.radialChart.series') }}
              </th>
              <th v-for="key in axes" :key="key" scope="col">
                {{ key }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data" :key="index">
              <th scope="row">
                {{ spiderRowHeader(row, index) }}
              </th>
              <td v-for="key in axes" :key="key">
                {{ tableCell(row[key]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </VisuallyHidden>
    </template>
  </div>
</template>
