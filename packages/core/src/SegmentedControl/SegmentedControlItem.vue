<script setup lang="ts">
import type { SegmentedControlItemProps, SegmentedControlItemSlots, SegmentedControlSize } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { invokeNativeEventHandler } from '../Button/eventHandlers.js'
import { hasSlotContent } from '../composables/internal/slotContent.js'
import { useTouchHitArea } from '../composables/internal/useTouchHitArea.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { readLayerScoped } from '../layer/scopedProvide.js'
import { segmentedControlContextKey } from './context.js'

defineOptions({ name: 'AstryxSegmentedControlItem', inheritAttrs: false })

const props = withDefaults(defineProps<SegmentedControlItemProps>(), {
  isLabelHidden: false,
  isDisabled: false,
})

defineSlots<SegmentedControlItemSlots>()

const attrs = useAttrs()
const press = usePressFeedback({ hasOverlay: false })
const context = readLayerScoped(segmentedControlContextKey)
const root = useTemplateRef<HTMLButtonElement>('root')
const element = computed(() => root.value ?? null)

defineExpose({ element })

const size = computed<SegmentedControlSize>(() => context?.size.value ?? 'md')
const isSelected = computed(() => context != null && context.value.value === props.value)
const isDisabled = computed(() => props.isDisabled || (context?.isDisabled.value ?? false))

// A segment with only an icon has no label to truncate, so it keeps its
// content size while labelled segments may shrink.
const iconOnly = computed(() => props.isLabelHidden)

const tabIndex = computed(() => {
  if (context == null)
    return props.isDisabled ? -1 : 0

  // 选中的分段拿 Tab 落脚点，禁用与否都一样；点击仍然被 isDisabled 挡住。
  return isSelected.value ? 0 : -1
})

const describedBy = computed(() => [
  attrs['aria-describedby'],
  context?.disabledReasonId.value,
].filter(Boolean).join(' ') || undefined)

function handleClick(event: MouseEvent): void {
  // 禁用的分段（包括带原因的禁用组里还能聚焦的选中分段）不运行调用方的点击回调。
  if (isDisabled.value)
    return

  invokeNativeEventHandler(attrs.onClick, event)

  if (event.defaultPrevented)
    return

  context?.select(props.value)
}

const controlledAttrs = new Set([
  'aria-checked',
  'aria-describedby',
  'aria-disabled',
  'aria-label',
  'class',
  'data-value',
  'onClick',
  'role',
  'style',
  'tabindex',
  'type',
])

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)),
))

// 粗指针下每个可用的分段朝 44px 长出一圈看不见的热区，停在和邻居间距的一半，分段自己的盒子不变。
useTouchHitArea(element, () => !isDisabled.value)

const rootClass = computed(() => ['astryx-segmented-control-item', { 'astryx-touch-hit-area': !isDisabled.value }, attrs.class])
</script>

<template>
  <button
    ref="root"
    v-bind="{ ...forwardedAttrs, ...(isDisabled ? {} : press.pressableProps) }"
    :aria-checked="isSelected"
    :aria-describedby="describedBy"
    :aria-disabled="isDisabled || undefined"
    :aria-label="isLabelHidden ? label : undefined"
    :class="rootClass"
    :data-own-disabled="props.isDisabled || undefined"
    :data-icon-only="iconOnly || undefined"
    :data-selected="isSelected || undefined"
    :data-size="size"
    :data-value="value"
    :style="attrs.style"
    :tabindex="tabIndex"
    role="radio"
    type="button"
    @click="handleClick"
  >
    <span
      v-if="hasSlotContent($slots.icon)"
      class="astryx-segmented-control-item__icon"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
    <span
      v-if="!isLabelHidden"
      class="astryx-segmented-control-item__label"
    >
      {{ label }}
    </span>
  </button>
</template>
