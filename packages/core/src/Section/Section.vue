<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { SectionProps, SectionSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { formatSize, spacingEdgeVars } from '../layout/size.js'
import '../../styles/section.css'

defineOptions({
  name: 'AstryxSection',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SectionProps>(), {
  variant: 'section',
})

defineSlots<SectionSlots>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')

defineExpose({ element: root })

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-section', attrs.class])

const rootStyle = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  {
    width: formatSize(props.width),
    height: formatSize(props.height),
    maxWidth: formatSize(props.maxWidth),
    minHeight: formatSize(props.minHeight),
  } satisfies CSSProperties,
])

const innerStyle = computed<CSSProperties>(() => spacingEdgeVars('--_section', props))

function hasDivider(edge: 'top' | 'bottom' | 'start' | 'end'): true | undefined {
  return props.dividers?.includes(edge) ? true : undefined
}
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :style="rootStyle"
  >
    <div
      class="astryx-section__inner"
      :data-variant="variant"
      :data-divider-top="hasDivider('top')"
      :data-divider-bottom="hasDivider('bottom')"
      :data-divider-start="hasDivider('start')"
      :data-divider-end="hasDivider('end')"
      :style="innerStyle"
    >
      <slot />
    </div>
  </div>
</template>
