<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { SpacingStep, StackCrossAlignment, StackMainAlignment, StackProps, StackSizeValue } from './types.js'
import { computed, useAttrs } from 'vue'

import '../../styles/stack.css'

defineOptions({
  name: 'Stack',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<StackProps>(), {
  as: 'div',
  direction: 'vertical',
  isScrollable: false,
  wrap: 'nowrap',
})

defineSlots<{
  default: () => unknown
}>()

const attrs = useAttrs()

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

interface StackStyle extends CSSProperties {
  '--astryx-stack-gap'?: string
  '--astryx-stack-padding-block'?: string
  '--astryx-stack-padding-inline'?: string
}

function formatSize(value: StackSizeValue | undefined): string | undefined {
  if (value == null)
    return undefined

  return typeof value === 'number' ? `${value}px` : value
}

const resolvedHAlign = computed(() =>
  props.hAlign ?? (props.direction === 'horizontal' ? props.justify : props.align),
)

const resolvedVAlign = computed(() =>
  props.vAlign ?? (props.direction === 'horizontal' ? props.align : props.justify),
)

const mainAlign = computed<StackMainAlignment | undefined>(() =>
  props.direction === 'horizontal'
    ? resolvedHAlign.value as StackMainAlignment | undefined
    : resolvedVAlign.value as StackMainAlignment | undefined,
)

const crossAlign = computed<StackCrossAlignment | undefined>(() =>
  props.direction === 'horizontal'
    ? resolvedVAlign.value as StackCrossAlignment | undefined
    : resolvedHAlign.value as StackCrossAlignment | undefined,
)

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-stack', attrs.class])

const rootStyle = computed<StyleValue>(() => {
  const paddingInline = props.paddingInline ?? props.padding
  const paddingBlock = props.paddingBlock ?? props.padding
  const stackStyle: StackStyle = {
    height: formatSize(props.height),
    maxWidth: formatSize(props.maxWidth),
    minHeight: formatSize(props.minHeight),
    width: formatSize(props.width),
  }

  stackStyle['--astryx-stack-gap'] = props.gap == null ? undefined : spacingVariables[props.gap]
  stackStyle['--astryx-stack-padding-block'] = paddingBlock == null ? undefined : spacingVariables[paddingBlock]
  stackStyle['--astryx-stack-padding-inline'] = paddingInline == null ? undefined : spacingVariables[paddingInline]

  return [attrs.style as StyleValue, stackStyle]
})
</script>

<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :data-cross-align="crossAlign"
    :data-direction="direction"
    :data-main-align="mainAlign"
    :data-scrollable="isScrollable || undefined"
    :data-wrap="wrap"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
