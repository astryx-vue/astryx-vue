<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { LayoutPanelProps, LayoutPanelSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { formatSize } from '../layout/size.js'
import { useLayoutArea, useLayoutSlots } from './context.js'
import { regionPaddingStyle } from './regionPadding.js'
import '../../styles/layout.css'

defineOptions({
  name: 'AstryxLayoutPanel',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<LayoutPanelProps>(), {
  hasDivider: false,
  isScrollable: true,
})

defineSlots<LayoutPanelSlots>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')
const area = useLayoutArea()
const slots = useLayoutSlots()

defineExpose({ element: root })

const width = computed(() => formatSize(props.resizable ? props.resizable._size : props.width))
const collapse = computed(() => !props.hasDivider && props.padding == null)
const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))
const rootClass = computed(() => ['astryx-layout-panel', attrs.class])
const rootStyle = computed<StyleValue>(() => [
  { width: width.value } satisfies CSSProperties,
  regionPaddingStyle('--_layout-panel', props.padding),
  attrs.style as StyleValue,
])
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :style="rootStyle"
    :role="role"
    :aria-label="label"
    :data-area="area"
    :data-divider="hasDivider || undefined"
    :data-collapse="collapse || undefined"
    :data-edge-header="!slots.hasHeader || undefined"
    :data-edge-footer="!slots.hasFooter || undefined"
    :data-scrollable="isScrollable || undefined"
    :data-explicit-padding="padding != null || undefined"
    :data-bleed="padding === 0 || undefined"
  >
    <slot />
  </div>
</template>
