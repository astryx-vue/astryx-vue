<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { LayoutContentProps, LayoutContentSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { useScrollRegionProps } from '../composables/internal/useScrollRegionProps.js'
import { useComponentMessages } from '../locale/context.js'
import { layoutMessages } from '../locale/messages/layout.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { useLayoutContainer, useLayoutSlots } from './context.js'
import { regionPaddingStyle } from './regionPadding.js'
import '../../styles/layout.css'

defineOptions({
  name: 'AstryxLayoutContent',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<LayoutContentProps>(), {
  isScrollable: true,
})

defineSlots<LayoutContentSlots>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')
useScrollbars(root, { enabled: () => props.isScrollable })
const messages = useComponentMessages({ layout: layoutMessages })
const region = useScrollRegionProps({
  defaultLabel: () => messages.value.layout.scrollRegion,
  isScrollable: () => props.isScrollable,
  label: () => props.label,
  role: () => props.role,
  target: root,
})
const slots = useLayoutSlots()
const container = useLayoutContainer()

defineExpose({ element: root })

const panels = computed(() => {
  if (slots.value.hasStart && slots.value.hasEnd)
    return 'both'
  if (slots.value.hasStart)
    return 'start'
  if (slots.value.hasEnd)
    return 'end'
  return 'none'
})

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))
const rootClass = computed(() => ['astryx-layout-content', attrs.class])
const rootStyle = computed<StyleValue>(() => [
  regionPaddingStyle('--_layout-content', props.padding),
  attrs.style as StyleValue,
])
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :style="rootStyle"
    :role="region.role.value"
    :aria-label="region.ariaLabel.value"
    :data-container="container ?? undefined"
    :data-panels="panels"
    :data-edge-start="!slots.hasStart || undefined"
    :data-edge-end="!slots.hasEnd || undefined"
    :data-edge-header="!slots.hasHeader || undefined"
    :data-edge-footer="!slots.hasFooter || undefined"
    :data-scrollable="isScrollable || undefined"
    :data-explicit-padding="padding != null || undefined"
    :data-bleed="padding === 0 || undefined"
  >
    <slot />
  </div>
</template>
