<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { LayoutPanelProps, LayoutPanelSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { moveFocusLeftBehind, noteFocusWithin, useFocusLeavingChange } from '../composables/internal/focusLeaving.js'
import { resizablePropsOf, resizeHandleBeside } from '../composables/internal/resizableChannel.js'
import { useScrollRegionProps } from '../composables/internal/useScrollRegionProps.js'
import { useComponentMessages } from '../locale/context.js'
import { layoutMessages } from '../locale/messages/layout.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { useLayoutArea, useLayoutSlots } from './context.js'
import { regionPaddingStyle } from './regionPadding.js'
import { formatSize } from './size.js'
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
const resizable = computed(() => props.resizable == null ? undefined : resizablePropsOf(props.resizable))
const effectiveWidth = computed(() => resizable.value ? resizable.value._size : props.width)
/** 宽度为 0 的面板不占位也不露出子元素：内边距归零，内容被裁掉，也不再滚动。 */
const isZeroWidth = computed(() => effectiveWidth.value === 0 || effectiveWidth.value === '0px')
const scrolls = computed(() => props.isScrollable && !isZeroWidth.value)
useScrollbars(root, { enabled: () => scrolls.value })
const messages = useComponentMessages({ layout: layoutMessages })
const region = useScrollRegionProps({
  defaultLabel: () => messages.value.layout.scrollRegion,
  isScrollable: () => scrolls.value,
  label: () => props.label,
  role: () => props.role,
  target: root,
})
const area = useLayoutArea()
const slots = useLayoutSlots()

defineExpose({ element: root })

const width = computed(() => formatSize(effectiveWidth.value))
const collapse = computed(() => !props.hasDivider && props.padding == null && !isZeroWidth.value)
const isRegionCollapsed = computed(() => resizable.value?._isCollapsed === true)

// 区域收起时，面板里的焦点移到旁边的 ResizeHandle，面板随后不可交互、对读屏隐藏。
useFocusLeavingChange(
  () => isRegionCollapsed.value,
  wasCollapsed => (wasCollapsed ? null : noteFocusWithin(root.value)),
  (note, collapsed) => {
    const panel = root.value
    if (collapsed && panel != null)
      moveFocusLeftBehind(note, resizeHandleBeside(panel, area.value === 'end' ? 'end' : 'start'), panel)
  },
)
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
    :role="region.role.value"
    :aria-label="region.ariaLabel.value"
    :data-area="area"
    :data-divider="hasDivider || undefined"
    :data-collapse="collapse || undefined"
    :data-edge-header="!slots.hasHeader || undefined"
    :data-edge-footer="!slots.hasFooter || undefined"
    :data-scrollable="scrolls || undefined"
    :data-zero-width="isZeroWidth || undefined"
    :inert="isRegionCollapsed || undefined"
    :aria-hidden="isRegionCollapsed ? 'true' : undefined"
    :data-explicit-padding="padding != null || undefined"
    :data-bleed="padding === 0 || undefined"
  >
    <slot />
  </div>
</template>
