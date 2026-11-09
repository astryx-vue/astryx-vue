<script setup lang="ts">
import type { RadialTooltipDatum, RadialTooltipProps, RadialTooltipSlots } from './types.js'
import { useLayer } from '@astryx-vue/core'
import { computed, nextTick, onScopeDispose, ref } from 'vue'
import { computeCardPosition } from '../ChartTooltip/position.js'
import { useChartMessages } from '../messages.js'
import { radialArcPath } from './arc.js'
import { useRadial } from './context.js'

defineOptions({ name: 'AstryxRadialTooltip' })
const props = withDefaults(defineProps<RadialTooltipProps>(), {
  highlight: true,
  highlightOffset: 6,
})
defineSlots<RadialTooltipSlots>()

const radial = useRadial()
const t = useChartMessages()
const hovered = ref<RadialTooltipDatum | null>(null)
const coordinates = ref({ x: 0, y: 0 })
const active = ref(false)
const layer = useLayer({
  mode: 'fixed',
  x: () => coordinates.value.x,
  y: () => coordinates.value.y,
})
const isVisible = computed(() => hovered.value !== null && layer.isOpen.value)
const tooltipStyle = computed(() => layer.contentStyle.value)

function hitTestPie(localX: number, localY: number): RadialTooltipDatum | null {
  const { slices, cx, cy, radius, innerRadius } = radial
  if (!slices || slices.length === 0)
    return null
  const dx = localX - cx
  const dy = localY - cy
  const distance = Math.sqrt(dx * dx + dy * dy)
  if (distance > radius || distance < innerRadius)
    return null
  let angle = Math.atan2(dy, dx)
  if (angle < -Math.PI / 2)
    angle += 2 * Math.PI
  const index = slices.findIndex(slice => slice.value > 0 && angle >= slice.startAngle && angle <= slice.endAngle)
  if (index < 0)
    return null
  const slice = slices[index]
  return { label: slice.key, value: slice.value, percentage: slice.percentage, index }
}

function hitTestSpider(localX: number, localY: number): RadialTooltipDatum | null {
  const { axes, angleByAxis, data, cx, cy, radius } = radial
  if (!axes || axes.length === 0 || !angleByAxis)
    return null
  const dx = localX - cx
  const dy = localY - cy
  if (Math.sqrt(dx * dx + dy * dy) > radius + 20)
    return null
  const angle = Math.atan2(dy, dx)
  let nearestAxis = axes[0]
  let minimumDistance = Number.POSITIVE_INFINITY
  for (const [key, axisAngle] of angleByAxis) {
    let difference = Math.abs(angle - axisAngle)
    if (difference > Math.PI)
      difference = 2 * Math.PI - difference
    if (difference < minimumDistance) {
      minimumDistance = difference
      nearestAxis = key
    }
  }
  if (minimumDistance > Math.PI / axes.length)
    return null

  let bestIndex = 0
  let bestValue = 0
  data.forEach((row, index) => {
    const value = row[nearestAxis]
    if (typeof value === 'number' && Number.isFinite(value) && value > bestValue) {
      bestValue = value
      bestIndex = index
    }
  })
  return { label: nearestAxis, value: bestValue, index: bestIndex }
}

async function clampToViewport(event: PointerEvent): Promise<void> {
  await nextTick()
  const card = layer.contentRef.value
  if (!card || typeof window === 'undefined')
    return
  coordinates.value = computeCardPosition({
    anchorLeft: event.clientX + 4,
    anchorTop: event.clientY - 8,
    width: card.offsetWidth,
    height: card.offsetHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  }, 'right')
}

function updateTooltip(event: PointerEvent): void {
  const capture = event.currentTarget as SVGCircleElement | null
  const svg = capture?.ownerSVGElement
  if (!capture || !svg)
    return
  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY
  const matrix = capture.getScreenCTM()?.inverse()
  if (!matrix)
    return
  const local = point.matrixTransform(matrix)
  const hit = radial.mode === 'pie'
    ? hitTestPie(local.x, local.y)
    : hitTestSpider(local.x, local.y)
  if (!hit) {
    hideTooltip()
    return
  }
  hovered.value = hit
  coordinates.value = { x: event.clientX + 12, y: event.clientY - 8 }
  layer.show()
  void clampToViewport(event)
}

function handlePointerDown(event: PointerEvent): void {
  if (event.pointerType === 'mouse')
    return
  active.value = true
  if (radial.interactive) {
    event.preventDefault()
    const capture = event.currentTarget as SVGCircleElement | null
    capture?.setPointerCapture?.(event.pointerId)
  }
  updateTooltip(event)
}

function handlePointerMove(event: PointerEvent): void {
  if (event.pointerType !== 'mouse' && !active.value)
    return
  if (event.pointerType !== 'mouse' && radial.interactive)
    event.preventDefault()
  updateTooltip(event)
}

function hideTooltip(): void {
  hovered.value = null
  layer.hide()
}

function handlePointerUp(event: PointerEvent): void {
  if (!active.value)
    return
  active.value = false
  const capture = event.currentTarget as SVGCircleElement | null
  if (capture?.hasPointerCapture?.(event.pointerId))
    capture.releasePointerCapture(event.pointerId)
  hideTooltip()
}

function handlePointerLeave(): void {
  if (!active.value)
    hideTooltip()
}

function setContentRef(element: unknown): void {
  layer.contentRef.value = (element as HTMLElement | null) ?? null
}

const highlightedSlice = computed(() => {
  if (!props.highlight || radial.mode !== 'pie' || hovered.value == null)
    return null
  const slice = radial.slices?.[hovered.value.index]
  if (!slice)
    return null
  const middle = (slice.startAngle + slice.endAngle) / 2
  const tx = Math.cos(middle) * props.highlightOffset
  const ty = Math.sin(middle) * props.highlightOffset
  return {
    path: radialArcPath(radial.innerRadius, radial.radius, slice.startAngle, slice.endAngle),
    transform: `translate(${radial.cx + tx} ${radial.cy + ty})`,
  }
})

onScopeDispose(hideTooltip)
</script>

<template>
  <g class="astryx-radial-interaction">
    <circle
      v-if="radial.radius > 0"
      :cx="radial.cx"
      :cy="radial.cy"
      :r="radial.radius + 10"
      fill="transparent"
      :style="{ touchAction: radial.interactive ? 'none' : 'pan-y' }"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
      @pointerleave="handlePointerLeave"
    />
    <path
      v-if="highlightedSlice"
      :d="highlightedSlice.path"
      :transform="highlightedSlice.transform"
      class="astryx-radial-slice__highlight"
      pointer-events="none"
    />
  </g>
  <Teleport to="body">
    <div
      v-if="isVisible"
      :ref="setContentRef"
      class="astryx-radial-tooltip astryx-layer"
      :style="tooltipStyle"
      role="tooltip"
    >
      <slot v-if="hovered" v-bind="hovered">
        <div class="astryx-radial-tooltip__content">
          <strong>{{ hovered.label }}</strong>
          <div>
            <span>{{ t('@astryx.radialChart.value') }}:</span>
            {{ hovered.value.toLocaleString() }}
          </div>
          <div v-if="hovered.percentage != null">
            <span>{{ t('@astryx.radialChart.share') }}:</span>
            {{ Math.round(hovered.percentage * 100) }}%
          </div>
        </div>
      </slot>
    </div>
  </Teleport>
</template>
