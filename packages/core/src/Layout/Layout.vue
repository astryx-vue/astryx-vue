<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { LayoutProps, LayoutSlots } from './types.js'
import { computed, provide, useAttrs, useSlots, useTemplateRef } from 'vue'
import { formatSize, spacingVariable, supportsInternalContentWidth } from '../layout/size.js'
import Area from './Area.vue'
import { layoutDividerKey, layoutSlotsKey, useLayoutDividers } from './context.js'
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

const slotsState = computed(() => ({
  hasHeader: slots.header != null,
  hasFooter: slots.footer != null,
  hasStart: slots.start != null,
  hasEnd: slots.end != null,
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
  const style: CSSProperties = {}
  if (props.padding != null) {
    const step = spacingVariable(props.padding)
    style['--layout-padding-own-outer-x' as keyof CSSProperties] = step as string
    style['--layout-padding-own-outer-y' as keyof CSSProperties] = step as string
  }
  if (width != null) {
    style['--layout-content-width' as keyof CSSProperties] = width as string
    if (supportsInternalContentWidth(props.contentWidth))
      style['--layout-alignment-width' as keyof CSSProperties] = width as string
  }
  return style
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
      <Area v-if="slots.header" area="header">
        <slot name="header" />
      </Area>
      <div class="astryx-layout__middle">
        <Area v-if="slots.start" area="start">
          <slot name="start" />
        </Area>
        <div class="astryx-layout__content-slot">
          <Area area="content">
            <slot />
          </Area>
        </div>
        <Area v-if="slots.end" area="end">
          <slot name="end" />
        </Area>
      </div>
      <Area v-if="slots.footer" area="footer">
        <slot name="footer" />
      </Area>
    </div>
  </div>
</template>
