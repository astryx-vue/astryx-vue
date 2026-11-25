<script setup lang="ts">
/* eslint-disable vue-a11y/no-static-element-interactions -- 焦点在内部按钮上，这一层只接冒泡上来的方向键。 */
import type { StyleValue } from 'vue'
import type { ButtonGroupProps, ButtonGroupSlots } from './types.js'
import { computed, provide, useAttrs } from 'vue'
import { buttonGroupContextKey } from '../Button/context.js'
import { invokeNativeEventHandler } from '../Button/eventHandlers.js'
import { useActionGroupTracking } from '../composables/internal/useActionGroupTracking.js'
import { useCoarsePointer } from '../composables/useCoarsePointer.js'
import { useListFocus } from '../composables/useListFocus.js'
import { provideSize, useSize } from '../SizeContext/SizeContext.js'
import '../../styles/button-group.css'

defineOptions({
  name: 'ButtonGroup',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  elevation: 'none',
  isDisabled: false,
  orientation: 'horizontal',
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
  // 成员禁用时仍可聚焦，整组禁用也保留一个 Tab 停靠点，键盘用户照样能到这组。
  hasDisabledTabStop: true,
})
const isDisabled = computed(() => props.isDisabled)
const size = useSize(() => props.size, 'md')
provideSize(size)

/**
 * 触屏为主的设备上，手指和笔可以按住一个按钮滑到别的按钮上，松手时执行手指下的那个；
 * 在组外松手什么都不执行。鼠标还是原生按钮的行为。
 */
const isCoarse = useCoarsePointer()
const tracksPress = computed(() => isCoarse.value && !props.isDisabled)
useActionGroupTracking(element, { isEnabled: tracksPress })

provide(buttonGroupContextKey, {
  isDisabled,
  orientation,
  size,
  tracksPress,
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
    :data-press-tracking="tracksPress || undefined"
    :data-size="size"
    role="group"
    :style="rootStyle"
    @focusin="handleFocus"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
