<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { ScrollableAreaProps, ScrollableAreaSlots } from './types.js'
import { computed, useAttrs } from 'vue'
import { useScrollableArea } from '../composables/useScrollableArea.js'
import { formatSize, resolvePadding, spacingVariable } from '../layout/size.js'
import '../../styles/scrollable-area.css'

defineOptions({
  name: 'AstryxScrollableArea',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ScrollableAreaProps>(), {
  axis: 'block',
  role: 'group',
  overscroll: 'allow',
  stickyContainment: 'whenScrollable',
  padding: 0,
  isFullBleed: false,
})

defineSlots<ScrollableAreaSlots>()

const attrs = useAttrs()
const scroll = useScrollableArea(props)

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-scrollable-area', attrs.class])

const rootStyle = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  {
    width: formatSize(props.width),
    height: formatSize(props.height),
    maxWidth: formatSize(props.maxWidth),
    minHeight: formatSize(props.minHeight),
  } satisfies CSSProperties,
  scroll.viewportStyle.value,
])

const contentStyle = computed<CSSProperties>(() => {
  const padding = resolvePadding(props, props.padding ?? 0)
  if (padding == null)
    return {}
  return {
    '--_pad-inline-start': spacingVariable(padding.inlineStart),
    '--_pad-inline-end': spacingVariable(padding.inlineEnd),
    '--_pad-block-start': spacingVariable(padding.blockStart),
    '--_pad-block-end': spacingVariable(padding.blockEnd),
  }
})
</script>

<template>
  <div
    :ref="scroll.viewport"
    v-bind="{ ...forwardedAttrs, ...scroll.viewportAttrs.value }"
    :class="rootClass"
    :style="rootStyle"
    :data-axis="axis"
    :data-full-bleed="isFullBleed || undefined"
  >
    <div :ref="scroll.content" class="astryx-scrollable-area__content" data-scroll-content :style="contentStyle">
      <slot />
    </div>
  </div>
</template>
