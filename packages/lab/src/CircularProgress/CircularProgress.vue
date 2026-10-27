<script setup lang="ts">
import type { CircularProgressProps } from './types.js'
import { computed, useAttrs, useId } from 'vue'
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

const attrs = useAttrs()
const labelId = `astryx-circular-progress-${useId()}`

const geometry = computed(() => {
  const { diameter, strokeWidth } = SIZE_CONFIG[props.size]
  const radius = (diameter - strokeWidth) / 2
  return { diameter, strokeWidth, radius, circumference: 2 * Math.PI * radius, center: diameter / 2 }
})

// 非有限的 value / max（比如上游用 0 做除数算出的 NaN）不能流进
// aria-valuenow、中心文字和圆弧几何，否则会变成字符串 "NaN"。
const safeValue = computed(() => (Number.isFinite(props.value) ? props.value : 0))
const safeMax = computed(() => (Number.isFinite(props.max) ? props.max : 0))
const clampedValue = computed(() => Math.min(Math.max(0, safeValue.value), safeMax.value))
const percentage = computed(() => (safeMax.value > 0 ? clampedValue.value / safeMax.value : 0))
const dashoffset = computed(() => geometry.value.circumference * (1 - percentage.value))
const valueText = computed(() => props.formatValueLabel(clampedValue.value, safeMax.value))

const showLabel = computed(() => !props.isLabelHidden)
const showValueLabel = computed(() => props.hasValueLabel && !props.isIndeterminate)
const hasCenterContent = computed(() => showValueLabel.value)

// 禁用时圆弧用禁用色，轨道退回中性轨道色；根元素保留原 variant 供主题选择器使用。
const fillVariant = computed(() => (props.isDisabled ? 'disabled' : props.variant))
const trackVariant = computed(() => (props.isDisabled ? 'neutral' : props.variant))
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

    <div class="astryx-circular-progress__ring">
      <svg
        class="astryx-circular-progress__svg" :class="{ 'astryx-circular-progress__svg--indeterminate': isIndeterminate }"
        role="progressbar" :aria-labelledby="labelId" :aria-valuenow="isIndeterminate ? undefined : clampedValue"
        :aria-valuemin="isIndeterminate ? undefined : 0" :aria-valuemax="isIndeterminate ? undefined : safeMax"
        :aria-valuetext="isIndeterminate ? undefined : valueText" :width="geometry.diameter" :height="geometry.diameter"
        :viewBox="`0 0 ${geometry.diameter} ${geometry.diameter}`"
      >
        <circle
          class="astryx-circular-progress__track" :data-variant="trackVariant" :cx="geometry.center"
          :cy="geometry.center" :r="geometry.radius" :stroke-width="geometry.strokeWidth"
        />
        <circle
          v-if="isIndeterminate" class="astryx-circular-progress__fill astryx-circular-progress__fill--indeterminate"
          :data-variant="fillVariant" :cx="geometry.center" :cy="geometry.center" :r="geometry.radius"
          :stroke-width="geometry.strokeWidth"
        />
        <circle
          v-else class="astryx-circular-progress__fill" :data-variant="fillVariant" :cx="geometry.center"
          :cy="geometry.center" :r="geometry.radius" :stroke-width="geometry.strokeWidth"
          :stroke-dasharray="geometry.circumference" :stroke-dashoffset="dashoffset"
        />
      </svg>

      <div v-if="$slots.default || hasCenterContent" class="astryx-circular-progress__center">
        <slot>
          <span
            v-if="hasCenterContent" class="astryx-circular-progress__value"
            :class="{ 'astryx-circular-progress__value--disabled': isDisabled }"
          >{{ valueText }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>
