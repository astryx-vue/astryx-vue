<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { SpacingStep } from '../Stack/types.js'
import type { CenterProps, CenterSizeValue } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'

import '../../styles/center.css'

defineOptions({
  name: 'AstryxCenter',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CenterProps>(), {
  axis: 'both',
  isInline: false,
})

defineSlots<{
  default?: () => unknown
}>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')

defineExpose({ element: root })

interface CenterStyle extends CSSProperties {
  '--astryx-center-padding-block-end'?: string
  '--astryx-center-padding-block-start'?: string
  '--astryx-center-padding-inline-end'?: string
  '--astryx-center-padding-inline-start'?: string
}

const spacingVariables: Record<SpacingStep, string> = {
  0: 'var(--astryx-spacing-0, 0px)',
  0.5: 'var(--astryx-spacing-0-5, 2px)',
  1: 'var(--astryx-spacing-1, 4px)',
  1.5: 'var(--astryx-spacing-1-5, 6px)',
  2: 'var(--astryx-spacing-2, 8px)',
  3: 'var(--astryx-spacing-3, 12px)',
  4: 'var(--astryx-spacing-4, 16px)',
  5: 'var(--astryx-spacing-5, 20px)',
  6: 'var(--astryx-spacing-6, 24px)',
  8: 'var(--astryx-spacing-8, 32px)',
  10: 'var(--astryx-spacing-10, 40px)',
}

function formatSize(value: CenterSizeValue | undefined): string | undefined {
  if (value == null)
    return undefined

  return typeof value === 'number' ? `${value}px` : value
}

function formatSpacing(value: SpacingStep | undefined): string | undefined {
  return value == null ? undefined : spacingVariables[value]
}

const paddingBlockStart = computed(() => props.paddingBlockStart ?? props.paddingBlock ?? props.padding)
const paddingBlockEnd = computed(() => props.paddingBlockEnd ?? props.paddingBlock ?? props.padding)
const paddingInlineStart = computed(() => props.paddingInlineStart ?? props.paddingInline ?? props.padding)
const paddingInlineEnd = computed(() => props.paddingInlineEnd ?? props.paddingInline ?? props.padding)

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => [
  'astryx-center',
  props.isInline && 'astryx-center--inline',
  attrs.class,
])

const rootStyle = computed<StyleValue>(() => {
  const centerStyle: CenterStyle = {
    height: formatSize(props.height),
    maxWidth: formatSize(props.maxWidth),
    minHeight: formatSize(props.minHeight),
    width: formatSize(props.width),
  }

  centerStyle['--astryx-center-padding-block-start'] = formatSpacing(paddingBlockStart.value)
  centerStyle['--astryx-center-padding-block-end'] = formatSpacing(paddingBlockEnd.value)
  centerStyle['--astryx-center-padding-inline-start'] = formatSpacing(paddingInlineStart.value)
  centerStyle['--astryx-center-padding-inline-end'] = formatSpacing(paddingInlineEnd.value)

  return [attrs.style as StyleValue, centerStyle]
})
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :data-axis="axis"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>
