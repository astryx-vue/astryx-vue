<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { LayoutProps, LayoutSlots } from './types.js'
import { computed, provide, useAttrs, useSlots, useTemplateRef } from 'vue'
import { hasSlotContent } from '../composables/internal/slotContent.js'
import { layoutDividerKey, layoutSlotsKey, useLayoutDividers } from './context.js'
import LayoutRegion from './LayoutRegion.vue'
import { formatSize, spacingVariable, supportsInternalContentWidth } from './size.js'
import '../../styles/layout.css'

defineOptions({
  name: 'AstryxLayout',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<LayoutProps>(), {
  height: 'fill',
})

defineSlots<LayoutSlots>()

const attrs = useAttrs()
const slots = useSlots()
const root = useTemplateRef<HTMLDivElement>('root')
const parentDividers = useLayoutDividers()

defineExpose({ element: root })

/** 区域「有没有」看渲染出来有没有内容：被 v-if 去掉、只剩注释或空白的区域和没写一样排版。 */
const slotsState = computed(() => ({
  hasHeader: hasSlotContent(slots.header),
  hasFooter: hasSlotContent(slots.footer),
  hasStart: hasSlotContent(slots.start),
  hasEnd: hasSlotContent(slots.end),
}))

provide(layoutSlotsKey, slotsState)
provide(layoutDividerKey, computed(() => props.defaultHasDividers ?? parentDividers.value))

const panelCount = computed(() => {
  if (slotsState.value.hasStart && slotsState.value.hasEnd)
    return 'both'
  if (slotsState.value.hasStart)
    return 'start'
  if (slotsState.value.hasEnd)
    return 'end'
  return 'none'
})

const widthMode = computed(() => {
  if (props.contentWidth == null)
    return undefined
  const internal = supportsInternalContentWidth(props.contentWidth) && panelCount.value !== 'both'
  return internal ? 'internal' : 'constrained'
})

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-layout', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)

const innerStyle = computed<CSSProperties>(() => {
  const width = formatSize(props.contentWidth)
  const style: Record<string, string> = {}
  if (props.padding != null) {
    const step = spacingVariable(props.padding)
    if (step != null) {
      style['--layout-padding-own-outer-x'] = step
      style['--layout-padding-own-outer-y'] = step
    }
  }
  if (width != null) {
    style['--layout-content-width'] = width
    if (supportsInternalContentWidth(props.contentWidth))
      style['--layout-alignment-width'] = width
  }
  return style as CSSProperties
})
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :data-height="height"
    :style="rootStyle"
  >
    <div
      class="astryx-layout__inner"
      :data-full-bleed="padding === 0 || undefined"
      :data-panels="panelCount"
      :data-width-mode="widthMode"
      :style="innerStyle"
    >
      <LayoutRegion v-if="slotsState.hasHeader" area="header">
        <slot name="header" />
      </LayoutRegion>
      <div class="astryx-layout__middle">
        <LayoutRegion v-if="slotsState.hasStart" area="start">
          <slot name="start" />
        </LayoutRegion>
        <div class="astryx-layout__content-slot">
          <LayoutRegion area="content">
            <slot />
          </LayoutRegion>
        </div>
        <LayoutRegion v-if="slotsState.hasEnd" area="end">
          <slot name="end" />
        </LayoutRegion>
      </div>
      <LayoutRegion v-if="slotsState.hasFooter" area="footer">
        <slot name="footer" />
      </LayoutRegion>
    </div>
  </div>
</template>
