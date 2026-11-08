<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ChartZoomEmits, ChartZoomProps } from './types.js'
import type { NumericDomain } from './zoomMath.js'
import { h, onBeforeUnmount, onMounted, ref } from 'vue'
import { useChart } from '../context.js'
import { localChartPoint } from '../interactions/pointer.js'
import { isBandScale } from '../utils.js'
import ChartZoomToolbar from './ChartZoomToolbar.vue'
import { zoomAxis } from './zoomMath.js'

import '../../styles/chart-zoom.css'

defineOptions({ name: 'AstryxChartZoom' })
const props = withDefaults(defineProps<ChartZoomProps>(), {
  zoomSpeed: 0.1,
  xOnly: false,
  yOnly: false,
  toolbar: 'top-right',
})
const emit = defineEmits<ChartZoomEmits>()
const chart = useChart()

interface GestureDomains {
  x: NumericDomain | null
  y: NumericDomain
}

const initialDomains = ref<GestureDomains | null>(null)
const drag = ref<{ startX: number, startY: number, domains: GestureDomains } | null>(null)
const pinch = ref<{ distance: number, domains: GestureDomains } | null>(null)
const pointers = new Map<number, { x: number, y: number }>()
let unregisterOverlay: (() => void) | undefined

function currentXDomain(): NumericDomain | null {
  const scale = chart.xScale
  return isBandScale(scale) ? null : scale.domain() as NumericDomain
}

function currentYDomain(): NumericDomain {
  return chart.yScale.domain() as NumericDomain
}

function currentDomains(): GestureDomains {
  return { x: currentXDomain(), y: currentYDomain() }
}

onMounted(() => {
  initialDomains.value = currentDomains()
  unregisterOverlay = chart.registerOverlay(() => h(ChartZoomToolbar, {
    zoom: props,
    onZoomIn: () => zoomBy(1 / (1 + props.zoomSpeed)),
    onZoomOut: () => zoomBy(1 + props.zoomSpeed),
    onReset: resetZoom,
  }))
})
onBeforeUnmount(() => unregisterOverlay?.())

function zoomBy(factor: number, pivotX?: number, pivotY?: number): void {
  if (!props.yOnly) {
    const domain = currentXDomain()
    if (domain) {
      const pivot = pivotX ?? (domain[0] + domain[1]) / 2
      emit('xDomainChange', zoomAxis(domain, factor, pivot))
    }
  }
  if (!props.xOnly) {
    const domain = currentYDomain()
    const pivot = pivotY ?? (domain[0] + domain[1]) / 2
    emit('yDomainChange', zoomAxis(domain, factor, pivot))
  }
}

function onWheel(event: WheelEvent): void {
  event.preventDefault()
  const local = localChartPoint(event)
  if (!local)
    return

  const delta = Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 50)
  const factor = 1 + (delta / 50) * props.zoomSpeed
  const xScale = chart.xScale
  const pivotX = isBandScale(xScale) ? undefined : xScale.invert(local.x)
  zoomBy(factor, pivotX, chart.yScale.invert(local.y))
}

function onPointerDown(event: PointerEvent): void {
  const target = event.currentTarget as SVGRectElement
  target.setPointerCapture?.(event.pointerId)
  event.preventDefault()
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (pointers.size === 2) {
    const [first, second] = [...pointers.values()]
    pinch.value = {
      distance: Math.hypot(second.x - first.x, second.y - first.y),
      domains: currentDomains(),
    }
    drag.value = null
  }
  else if (pointers.size === 1) {
    drag.value = { startX: event.clientX, startY: event.clientY, domains: currentDomains() }
  }
}

function onPointerMove(event: PointerEvent): void {
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (pointers.size === 2 && pinch.value) {
    const [first, second] = [...pointers.values()]
    const distance = Math.hypot(second.x - first.x, second.y - first.y)
    const ratio = pinch.value.distance / distance
    if (!Number.isFinite(ratio) || ratio <= 0)
      return
    const { x, y } = pinch.value.domains
    if (!props.yOnly && x) {
      const middle = (x[0] + x[1]) / 2
      const half = (x[1] - x[0]) * ratio / 2
      emit('xDomainChange', [middle - half, middle + half])
    }
    if (!props.xOnly) {
      const middle = (y[0] + y[1]) / 2
      const half = (y[1] - y[0]) * ratio / 2
      emit('yDomainChange', [middle - half, middle + half])
    }
    return
  }

  if (!drag.value)
    return
  const dx = event.clientX - drag.value.startX
  const dy = event.clientY - drag.value.startY
  const { x, y } = drag.value.domains
  if (!props.yOnly && x && chart.width > 0) {
    const shift = -(dx / chart.width) * (x[1] - x[0])
    emit('xDomainChange', [x[0] + shift, x[1] + shift])
  }
  if (!props.xOnly && chart.height > 0) {
    const shift = (dy / chart.height) * (y[1] - y[0])
    emit('yDomainChange', [y[0] + shift, y[1] + shift])
  }
}

function onPointerUp(event: PointerEvent): void {
  pointers.delete(event.pointerId)
  if (pointers.size < 2)
    pinch.value = null
  if (pointers.size === 0)
    drag.value = null
}

function resetZoom(): void {
  if (!initialDomains.value)
    return
  const { x, y } = initialDomains.value
  if (x)
    emit('xDomainChange', [...x])
  emit('yDomainChange', [...y])
}

const captureStyle: CSSProperties = { cursor: 'grab', touchAction: 'none', userSelect: 'none' }
</script>

<template>
  <g class="astryx-chart-zoom">
    <rect
      x="0"
      y="0"
      :width="chart.width"
      :height="chart.height"
      fill="transparent"
      :style="captureStyle"
      @wheel="onWheel"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    />
  </g>
</template>
