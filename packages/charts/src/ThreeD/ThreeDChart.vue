<script setup lang="ts">
import type { ThreeDChartProps, ThreeDContext } from './types.js'
import { useMediaQuery } from '@astryx-vue/core'
import { computed, onMounted, onScopeDispose, provide, ref, watch } from 'vue'
import { useChartMessages } from '../messages.js'
import { threeDContextKey } from './context.js'
import { clampElevation, createProjection3D, normalize3D, resolveDomain3D } from './projection.js'

import '../../styles/three-d.css'

defineOptions({ name: 'AstryxThreeDChart' })
const props = withDefaults(defineProps<ThreeDChartProps>(), {
  width: 0,
  height: 400,
  azimuth: 35,
  elevation: 25,
  interactive: false,
  autoRotate: 0,
  label: undefined,
  xDomain: undefined,
  yDomain: undefined,
  zDomain: undefined,
})

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback
}

const containerRef = ref<HTMLElement | null>(null)
const measuredWidth = ref<number | null>(null)
const camera = ref({
  azimuth: finiteOr(props.azimuth, 35),
  elevation: clampElevation(finiteOr(props.elevation, 25)),
})
const hovered = ref(false)
const focused = ref(false)
const dragging = ref(false)
const dragStart = ref<{ x: number, y: number, azimuth: number, elevation: number } | null>(null)
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
const t = useChartMessages()

onMounted(() => {
  const element = containerRef.value
  if (element && typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width != null)
        measuredWidth.value = width
    })
    observer.observe(element)
    onScopeDispose(() => observer.disconnect())
  }
  startRotation()
})

watch(() => props.azimuth, (value) => {
  camera.value.azimuth = finiteOr(value, 35)
})
watch(() => props.elevation, (value) => {
  camera.value.elevation = clampElevation(finiteOr(value, 25))
})

const containerWidth = computed(() => measuredWidth.value ?? Math.max(0, finiteOr(props.width, 0)))
const safeHeight = computed(() => Math.max(0, finiteOr(props.height, 400)))
const xDomain = computed(() => resolveDomain3D(props.data, props.xKey, props.xDomain))
const yDomain = computed(() => resolveDomain3D(props.data, props.yKey, props.yDomain))
const zDomain = computed(() => resolveDomain3D(props.data, props.zKey, props.zDomain))
const project = computed(() => createProjection3D(containerWidth.value, safeHeight.value, camera.value))
const accessibleLabel = computed(() => props.label ?? t('@astryx.threeDChart.label', {
  yKey: props.yKey,
  xKey: props.xKey,
  zKey: props.zKey,
}))
const rotationSpeed = computed(() => finiteOr(props.autoRotate, 0))
const focusable = computed(() => props.interactive || rotationSpeed.value !== 0)
const rotationActive = computed(() => rotationSpeed.value !== 0 && !prefersReducedMotion.value && !hovered.value && !focused.value)

const context: ThreeDContext = {
  get width() { return containerWidth.value },
  get height() { return safeHeight.value },
  get data() { return props.data },
  get xKey() { return props.xKey },
  get yKey() { return props.yKey },
  get zKey() { return props.zKey },
  get project() { return project.value },
  get xDomain() { return xDomain.value },
  get yDomain() { return yDomain.value },
  get zDomain() { return zDomain.value },
  normalize: normalize3D,
  get camera() { return camera.value },
}
provide(threeDContextKey, context)

function onPointerDown(event: PointerEvent): void {
  if (!props.interactive || (event.pointerType === 'mouse' && event.button !== 0))
    return
  const svg = event.currentTarget as SVGSVGElement
  svg.setPointerCapture?.(event.pointerId)
  dragStart.value = {
    x: event.clientX,
    y: event.clientY,
    azimuth: camera.value.azimuth,
    elevation: camera.value.elevation,
  }
  dragging.value = true
  event.preventDefault()
}

function onPointerMove(event: PointerEvent): void {
  const start = dragStart.value
  if (!start)
    return
  camera.value = {
    azimuth: start.azimuth + (event.clientX - start.x) * 0.5,
    elevation: clampElevation(start.elevation - (event.clientY - start.y) * 0.5),
  }
  event.preventDefault()
}

function onPointerUp(event: PointerEvent): void {
  const svg = event.currentTarget as SVGSVGElement
  if (svg.hasPointerCapture?.(event.pointerId))
    svg.releasePointerCapture(event.pointerId)
  dragStart.value = null
  dragging.value = false
}

function onKeyDown(event: KeyboardEvent): void {
  if (!props.interactive)
    return
  let azimuth = 0
  let elevation = 0
  if (event.key === 'ArrowLeft')
    azimuth = -10
  else if (event.key === 'ArrowRight')
    azimuth = 10
  else if (event.key === 'ArrowUp')
    elevation = 10
  else if (event.key === 'ArrowDown')
    elevation = -10
  else
    return
  event.preventDefault()
  camera.value = {
    azimuth: camera.value.azimuth + azimuth,
    elevation: clampElevation(camera.value.elevation + elevation),
  }
}

let animationFrame: number | undefined
let lastUpdate = 0

function stopRotation(): void {
  if (animationFrame != null && typeof cancelAnimationFrame !== 'undefined')
    cancelAnimationFrame(animationFrame)
  animationFrame = undefined
  lastUpdate = 0
}

function tick(now: number): void {
  animationFrame = undefined
  if (!rotationActive.value)
    return
  if (!dragStart.value && now - lastUpdate >= 50) {
    const elapsed = lastUpdate === 0 ? 50 : now - lastUpdate
    lastUpdate = now
    camera.value.azimuth += rotationSpeed.value * (elapsed / 16.67)
  }
  animationFrame = requestAnimationFrame(tick)
}

function startRotation(): void {
  stopRotation()
  if (rotationActive.value && typeof requestAnimationFrame !== 'undefined')
    animationFrame = requestAnimationFrame(tick)
}

watch(rotationActive, active => active ? startRotation() : stopRotation(), { flush: 'post' })
onScopeDispose(stopRotation)

const chartStyle = computed(() => containerWidth.value === 0 ? { height: `${safeHeight.value}px` } : undefined)
defineExpose({ element: containerRef })
</script>

<template>
  <div
    ref="containerRef"
    class="astryx-three-d-chart"
    :class="{ 'astryx-three-d-chart--interactive': props.interactive }"
    :style="chartStyle"
  >
    <!-- 相机方向键和指针事件必须落在实际 SVG 画布上。 -->
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -->
    <svg
      v-if="containerWidth > 0"
      role="img"
      :aria-label="accessibleLabel"
      :tabindex="focusable ? 0 : undefined"
      :width="containerWidth"
      :height="safeHeight"
      :class="{ 'astryx-three-d-chart__dragging': dragging }"
      @keydown="onKeyDown"
      @focus="focused = true"
      @blur="focused = false"
      @pointerenter="hovered = true"
      @pointerleave="hovered = false"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <slot />
    </svg>
  </div>
</template>
