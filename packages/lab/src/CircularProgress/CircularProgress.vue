<script setup lang="ts">
import type { CircularProgressProps } from './types.js'
import { computed, onBeforeUnmount, shallowRef, useAttrs, useId, watch } from 'vue'
import { easingOf, fillKeyframes, fillTurns, parseTime, syncRotationPhase } from './fillMotion.js'
import { defaultFormatValueLabel, SIZE_CONFIG } from './types.js'
import '../../styles/circular-progress.css'

defineOptions({ name: 'AstryxCircularProgress', inheritAttrs: false })

const props = withDefaults(defineProps<CircularProgressProps>(), {
  value: 0,
  max: 100,
  isLabelHidden: true,
  hasValueLabel: false,
  formatValueLabel: defaultFormatValueLabel,
  size: 'md',
  variant: 'accent',
  isIndeterminate: false,
  isDisabled: false,
})

/** 转动的图层画得比圆环盒子大一圈，抗锯齿的外沿在转动前就是完整的，由盒子来裁。 */
const FILL_BLEED = 2
/** 不确定状态的弧长占整圈的比例，和加载圈（Spinner）一样是 135°。 */
const ARC_FRACTION = 0.375

const attrs = useAttrs()
const labelId = `astryx-circular-progress-${useId()}`

const geometry = computed(() => {
  const { diameter, strokeWidth } = SIZE_CONFIG[props.size]
  const radius = (diameter - strokeWidth) / 2
  const bleedSize = diameter + 2 * FILL_BLEED
  return {
    diameter,
    strokeWidth,
    radius,
    circumference: 2 * Math.PI * radius,
    center: diameter / 2,
    bleedSize,
    bleedBox: `${-FILL_BLEED} ${-FILL_BLEED} ${bleedSize} ${bleedSize}`,
    // 12 点方向、圆环中线上的一个圆头（零长度的描边）。
    capPath: `M ${diameter / 2} ${strokeWidth / 2} h 0`,
  }
})

// 非有限的 value / max（比如上游用 0 做除数算出的 NaN）不能流进
// aria-valuenow、中心文字和圆弧几何，否则会变成字符串 "NaN"。
const safeValue = computed(() => (Number.isFinite(props.value) ? props.value : 0))
const safeMax = computed(() => (Number.isFinite(props.max) ? props.max : 0))
const clampedValue = computed(() => Math.min(Math.max(0, safeValue.value), safeMax.value))
const percentage = computed(() => (safeMax.value > 0 ? clampedValue.value / safeMax.value : 0))
const valueText = computed(() => props.formatValueLabel(clampedValue.value, safeMax.value))
const turns = computed(() => fillTurns(percentage.value))

const showLabel = computed(() => !props.isLabelHidden)
const showValueLabel = computed(() => props.hasValueLabel && !props.isIndeterminate)

// 禁用时圆弧用中性填充色，整圈再半透明；根元素保留原 variant 供主题选择器使用。
const fillVariant = computed(() => (props.isDisabled ? 'disabled' : props.variant))

const fillRef = shallowRef<HTMLElement | null>(null)
const rightRef = shallowRef<HTMLElement | null>(null)
const leftRef = shallowRef<HTMLElement | null>(null)
const capRef = shallowRef<HTMLElement | null>(null)
const startRef = shallowRef<SVGPathElement | null>(null)

// 圆弧当前画到哪里：静止时就是进度；变化被打断时是那次动画按它自己的曲线走到的位置。
// 不确定状态下不画进度（null），下一个进度直接画出来，不从旧值扫过去。
let drawn: number | null = props.isIndeterminate ? null : percentage.value
let releaseChange: (() => void) | undefined

function animateChange(from: number, to: number): void {
  const fill = fillRef.value
  const layers = [rightRef.value, leftRef.value, capRef.value, startRef.value]
  if (fill == null || layers.some(layer => typeof layer?.animate !== 'function'))
    return
  const style = getComputedStyle(fill)
  const duration = parseTime(style.transitionDuration)
  if (duration <= 0)
    return
  const ease = easingOf(style.transitionTimingFunction)
  const frames = fillKeyframes(from, to, duration, ease)
  const timing: KeyframeAnimationOptions = { duration, easing: 'linear', fill: 'backwards' }
  const [right, left, cap, start] = layers as [HTMLElement, HTMLElement, HTMLElement, SVGPathElement]
  const animations = [
    right.animate(frames.right, timing),
    left.animate(frames.left, timing),
    cap.animate(frames.cap, timing),
    start.animate(frames.start, timing),
  ]
  releaseChange = () => {
    const first = animations[0]!
    const progress = first.playState !== 'finished'
      ? Number(first.effect?.getComputedTiming().progress ?? 1)
      : 1
    drawn = from + (to - from) * ease(progress)
    for (const animation of animations)
      animation.cancel()
  }
}

// 进度变化时，用 Web Animations 在合成线程上转动各图层：从圆弧此刻画到的位置转到新进度，
// 时长和缓动读主题。渲染出来的始终是静止状态，首帧、没有脚本或跳过动画时都直接显示进度。
watch([percentage, () => props.isIndeterminate], ([next, indeterminate]) => {
  releaseChange?.()
  releaseChange = undefined
  const from = drawn
  if (indeterminate) {
    drawn = null
    return
  }
  drawn = next
  if (from === null || from === next)
    return
  animateChange(from, next)
}, { flush: 'post' })

let releasePhase: (() => void) | undefined

function bindRotor(element: unknown): void {
  releasePhase?.()
  releasePhase = undefined
  if (element instanceof Element)
    releasePhase = syncRotationPhase(element)
}

onBeforeUnmount(() => {
  releaseChange?.()
  releasePhase?.()
})
</script>

<template>
  <div
    v-bind="attrs" class="astryx-circular-progress" :class="[$attrs.class, { 'astryx-circular-progress--labelled': showLabel }]"
    :data-size="size" :data-variant="variant"
  >
    <span
      :id="labelId" class="astryx-circular-progress__label"
      :class="{ 'astryx-circular-progress__visually-hidden': !showLabel, 'astryx-circular-progress__label--disabled': showLabel && isDisabled }"
    >{{ label }}</span>

    <div class="astryx-circular-progress__ring" :class="{ 'astryx-circular-progress__ring--disabled': isDisabled }">
      <svg
        :ref="isIndeterminate ? bindRotor : undefined"
        class="astryx-circular-progress__svg" :class="{ 'astryx-circular-progress__svg--indeterminate': isIndeterminate }"
        role="progressbar" :aria-labelledby="labelId" :aria-valuenow="isIndeterminate ? undefined : clampedValue"
        :aria-valuemin="isIndeterminate ? undefined : 0" :aria-valuemax="isIndeterminate ? undefined : safeMax"
        :aria-valuetext="isIndeterminate ? undefined : valueText" :width="geometry.diameter" :height="geometry.diameter"
        :viewBox="`0 0 ${geometry.diameter} ${geometry.diameter}`"
      >
        <circle
          class="astryx-circular-progress__track" :cx="geometry.center"
          :cy="geometry.center" :r="geometry.radius" :stroke-width="geometry.strokeWidth"
        />
        <circle
          v-if="isIndeterminate" class="astryx-circular-progress__fill astryx-circular-progress__fill--indeterminate"
          :data-variant="fillVariant" :cx="geometry.center" :cy="geometry.center" :r="geometry.radius"
          :stroke-width="geometry.strokeWidth"
          :stroke-dasharray="`${geometry.circumference * ARC_FRACTION} ${geometry.circumference * (1 - ARC_FRACTION)}`"
          :transform="`rotate(-90 ${geometry.center} ${geometry.center})`"
        />
      </svg>

      <!-- 确定进度的圆弧：两个半环加两个圆头，颜色设在外层，各部件继承 stroke。 -->
      <span
        v-if="!isIndeterminate" ref="fillRef" class="astryx-circular-progress__fill astryx-circular-progress__fill--layers"
        :data-variant="fillVariant" aria-hidden="true"
      >
        <span class="astryx-circular-progress__half" data-side="right">
          <span
            ref="rightRef" class="astryx-circular-progress__turn" data-side="right"
            :style="{ transform: `rotate(${turns.right}deg)`, opacity: turns.rightShown }"
          >
            <svg
              class="astryx-circular-progress__shape" :width="geometry.bleedSize" :height="geometry.bleedSize"
              :viewBox="geometry.bleedBox"
            >
              <circle
                :cx="geometry.center" :cy="geometry.center" :r="geometry.radius" :stroke-width="geometry.strokeWidth"
                :stroke-dasharray="`${geometry.circumference / 2} ${geometry.circumference}`"
                :transform="`rotate(90 ${geometry.center} ${geometry.center})`"
              />
            </svg>
          </span>
        </span>
        <span class="astryx-circular-progress__half" data-side="left">
          <span
            ref="leftRef" class="astryx-circular-progress__turn" data-side="left"
            :style="{ transform: `rotate(${turns.left}deg)`, opacity: turns.leftShown }"
          >
            <svg
              class="astryx-circular-progress__shape" :width="geometry.bleedSize" :height="geometry.bleedSize"
              :viewBox="geometry.bleedBox"
            >
              <circle
                :cx="geometry.center" :cy="geometry.center" :r="geometry.radius" :stroke-width="geometry.strokeWidth"
                :stroke-dasharray="`${geometry.circumference / 2} ${geometry.circumference}`"
                :transform="`rotate(90 ${geometry.center} ${geometry.center})`"
              />
            </svg>
          </span>
        </span>
        <svg
          class="astryx-circular-progress__cap astryx-circular-progress__cap-shape" :width="geometry.diameter"
          :height="geometry.diameter" :viewBox="`0 0 ${geometry.diameter} ${geometry.diameter}`"
        >
          <path ref="startRef" :d="geometry.capPath" :stroke-width="geometry.strokeWidth" :style="{ opacity: turns.caps }" />
        </svg>
        <span ref="capRef" class="astryx-circular-progress__cap" :style="{ transform: `rotate(${turns.cap}deg)`, opacity: turns.caps }">
          <svg
            class="astryx-circular-progress__cap-shape astryx-circular-progress__shape" :width="geometry.bleedSize"
            :height="geometry.bleedSize" :viewBox="geometry.bleedBox"
          >
            <path :d="geometry.capPath" :stroke-width="geometry.strokeWidth" />
          </svg>
        </span>
      </span>

      <div v-if="$slots.default || showValueLabel" class="astryx-circular-progress__center">
        <slot>
          <span
            class="astryx-circular-progress__value"
            :class="{ 'astryx-circular-progress__value--disabled': isDisabled }"
          >{{ valueText }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>
