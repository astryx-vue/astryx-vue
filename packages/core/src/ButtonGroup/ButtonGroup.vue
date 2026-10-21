<script setup lang="ts">
/* eslint-disable vue-a11y/no-static-element-interactions -- 焦点在内部按钮上，这一层只接冒泡上来的方向键。 */
import type { StyleValue } from 'vue'
import type { ButtonGroupProps, ButtonGroupSlots } from './types.js'
import { computed, provide, useAttrs } from 'vue'
import { buttonGroupContextKey } from '../Button/context.js'
import { invokeNativeEventHandler } from '../Button/eventHandlers.js'
import { useListFocus } from '../composables/useListFocus.js'
import '../../styles/button-group.css'

defineOptions({
  name: 'ButtonGroup',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  elevation: 'none',
  isDisabled: false,
  orientation: 'horizontal',
  size: 'md',
})

defineSlots<ButtonGroupSlots>()

const attrs = useAttrs()
const orientation = computed(() => props.orientation)
const { listRef: element, handleKeyDown, handleFocus } = useListFocus({
  // `[tabindex]` 会在漫游改写后继续匹配成员。弹出层比组更近，方向键留给那一层。
  itemSelector: 'button, a[href], [tabindex]',
  boundarySelector: '[role="group"], [popover]',
  orientation: () => props.orientation,
  hasRovingTabIndex: true,
})
const isDisabled = computed(() => props.isDisabled)
const size = computed(() => props.size)

provide(buttonGroupContextKey, {
  isDisabled,
  orientation,
  size,
})

const rootClass = computed(() => ['astryx-button-group', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)

const controlledAttrs = new Set([
  'aria-disabled',
  'aria-label',
  'class',
  'onKeyDown',
  'onKeydown',
  'style',
])

function getForwardedAttrs(): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)),
  )
}

function onKeydown(event: KeyboardEvent): void {
  invokeNativeEventHandler(attrs.onKeydown ?? attrs.onKeyDown, event)
  if (event.defaultPrevented)
    return
  handleKeyDown(event)
}

defineExpose({
  element,
})
</script>

<template>
  <div
    ref="element"
    v-bind="getForwardedAttrs()"
    :aria-disabled="isDisabled || undefined"
    :aria-label="label"
    :class="rootClass"
    :data-elevation="elevation"
    :data-orientation="orientation"
    :data-size="size"
    role="group"
    :style="rootStyle"
    @focusin="handleFocus"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
