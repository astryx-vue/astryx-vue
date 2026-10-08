<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { GridSpanProps, GridSpanSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'

import '../../styles/grid.css'

defineOptions({ name: 'AstryxGridSpan', inheritAttrs: false })

const props = defineProps<GridSpanProps>()

defineSlots<GridSpanSlots>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')

defineExpose({ element: root })

const spanStyle = computed<CSSProperties>(() => ({
  gridColumn: props.columns == null ? undefined : props.columns === 'full' ? '1 / -1' : `span ${props.columns}`,
  gridRow: props.rows == null ? undefined : `span ${props.rows}`,
}))

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-grid-span', attrs.class])

const rootStyle = computed<StyleValue>(() => [attrs.style as StyleValue, spanStyle.value])
</script>

<template>
  <div ref="root" v-bind="forwardedAttrs" :class="rootClass" :style="rootStyle">
    <slot />
  </div>
</template>
