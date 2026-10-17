<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { LayoutFooterProps, LayoutFooterSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { useLayoutDividers } from './context.js'
import { regionPaddingStyle } from './regionPadding.js'
import { formatSize } from './size.js'
import '../../styles/layout.css'

defineOptions({
  name: 'AstryxLayoutFooter',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<LayoutFooterProps>(), {
  hasDivider: undefined,
})
defineSlots<LayoutFooterSlots>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')
const dividers = useLayoutDividers()

defineExpose({ element: root })

const hasDivider = computed(() => props.hasDivider ?? dividers.value ?? false)
const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))
const rootClass = computed(() => ['astryx-layout-footer', attrs.class])
const rootStyle = computed<StyleValue>(() => [
  { height: formatSize(props.height) } satisfies CSSProperties,
  attrs.style as StyleValue,
])
const innerStyle = computed(() => regionPaddingStyle('--_layout-footer', props.padding))
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :style="rootStyle"
    :role="role"
    :aria-label="label"
    :data-divider="hasDivider || undefined"
  >
    <div
      class="astryx-layout-footer__inner"
      :data-bleed="padding === 0 || undefined"
      :style="innerStyle"
    >
      <slot />
    </div>
  </div>
</template>
