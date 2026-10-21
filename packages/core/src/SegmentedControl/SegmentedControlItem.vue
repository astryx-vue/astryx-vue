<script setup lang="ts">
import type { SegmentedControlItemProps, SegmentedControlItemSlots, SegmentedControlSize } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { invokeNativeEventHandler } from '../Button/eventHandlers.js'
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
const keepsSelectedFocusable = computed(() => isSelected.value && (context?.hasDisabledMessage.value ?? false) && !props.isDisabled)

// A segment with only an icon has no label to truncate, so it keeps its
// content size while labelled segments may shrink.
const iconOnly = computed(() => props.isLabelHidden)

const tabIndex = computed(() => {
  if (context == null)
    return props.isDisabled ? -1 : 0

  return (isSelected.value && !isDisabled.value) || keepsSelectedFocusable.value ? 0 : -1
})

function handleClick(event: MouseEvent): void {
  invokeNativeEventHandler(attrs.onClick, event)

  if (event.defaultPrevented || isDisabled.value)
    return

  context?.select(props.value)
}

const controlledAttrs = new Set([
  'aria-checked',
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

const rootClass = computed(() => ['astryx-segmented-control-item', attrs.class])
</script>

<template>
  <button
    ref="root"
    v-bind="{ ...forwardedAttrs, ...(isDisabled ? {} : press.pressableProps) }"
    :aria-checked="isSelected"
    :aria-disabled="isDisabled || undefined"
    :aria-label="isLabelHidden ? label : undefined"
    :class="rootClass"
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
      v-if="$slots.icon"
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
