<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ProgressBarProps } from './types.js'
import { computed, useAttrs, useId } from 'vue'
import '../../styles/progress-bar.css'
import '../../styles/visually-hidden.css'

defineOptions({ name: 'AstryxProgressBar', inheritAttrs: false })
const props = withDefaults(defineProps<ProgressBarProps>(), {
  value: 0,
  min: 0,
  max: 100,
  size: 'md',
  variant: 'neutral',
  isLabelHidden: false,
})
const attrs = useAttrs()
const generatedId = `astryx-progress-bar-${useId()}`
const rootId = computed(() => (attrs.id as string | undefined) ?? generatedId)
const labelId = computed(() => `${rootId.value}-label`)
const descriptionId = computed(() => props.description ? `${rootId.value}-description` : undefined)
const min = computed(() => Number(props.min))
const max = computed(() => Number(props.max))
const value = computed(() => Number(props.value))
const clamped = computed(() => Math.max(min.value, Math.min(max.value, value.value)))
const percentage = computed(() => {
  if (max.value === min.value)
    return 0
  return ((clamped.value - min.value) / (max.value - min.value)) * 100
})
const fillWidth = computed<CSSProperties>(() => ({ width: `${percentage.value}%` }))
const widthStyle = computed<CSSProperties>(() => ({ width: typeof props.width === 'number' ? `${props.width}px` : props.width }))
const showsValue = computed(() => Boolean(props.showValue || props.hasValueLabel))
const displayValue = computed(() => {
  if (props.valueText != null)
    return props.valueText
  if (props.formatValueLabel)
    return props.formatValueLabel(clamped.value, max.value)
  return `${Math.round(percentage.value)}%`
})
const labelledBy = computed(() => [labelId.value, attrs['aria-labelledby']].filter(Boolean).join(' ') || undefined)
const describedBy = computed(() => [descriptionId.value, attrs['aria-describedby']].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div
    class="astryx-progress-bar" :class="attrs.class" :style="[widthStyle, attrs.style as CSSProperties]" :data-size="size"
    :data-variant="variant" :data-indeterminate="isIndeterminate || undefined"
  >
    <div v-if="label && (!isLabelHidden || showsValue)" class="astryx-progress-bar-header">
      <span
        v-if="label"
        :id="labelId"
        class="astryx-progress-bar-label"
        :class="{ 'astryx-visually-hidden': isLabelHidden }"
      >{{ label }}</span>
      <span v-if="showsValue && !isIndeterminate" class="astryx-progress-bar-value" aria-hidden="true">{{ displayValue }}</span>
    </div>
    <span v-else-if="label" :id="labelId" class="astryx-visually-hidden">{{ label }}</span>
    <div
      class="astryx-progress-bar-track" role="progressbar" :aria-labelledby="labelledBy" :aria-describedby="describedBy"
      :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="isIndeterminate ? undefined : clamped" :aria-valuetext="isIndeterminate ? undefined : displayValue"
    >
      <div class="astryx-progress-bar-fill" :style="isIndeterminate ? undefined : fillWidth" />
    </div>
    <span v-if="description" :id="descriptionId" class="astryx-progress-bar-description">{{ description }}</span>
  </div>
</template>
