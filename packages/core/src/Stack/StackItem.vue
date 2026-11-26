<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { StackItemProps } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { useScrollRegionProps } from '../composables/internal/useScrollRegionProps.js'
import { useComponentMessages } from '../locale/context.js'
import { layoutMessages } from '../locale/messages/layout.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'

import '../../styles/stack.css'

defineOptions({
  name: 'StackItem',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<StackItemProps>(), {
  as: 'div',
  isScrollable: false,
  size: 'static',
})

defineSlots<{
  default: () => unknown
}>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLElement>('root')
useScrollbars(root, { enabled: () => props.isScrollable })
const messages = useComponentMessages({ layout: layoutMessages })
/** 只有可滚动的 div 或 span 会被观察和命名；别的元素保留自己的角色。 */
const nameable = computed(() => props.isScrollable && (props.as === 'div' || props.as === 'span'))
const region = useScrollRegionProps({
  defaultLabel: () => messages.value.layout.scrollRegion,
  isScrollable: () => nameable.value,
  label: () => attrs['aria-label'] as string | undefined,
  role: () => attrs.role as string | undefined,
  target: root,
})

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style' && key !== 'role' && key !== 'aria-label'),
))

const rootClass = computed(() => ['astryx-stack-item', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)
</script>

<template>
  <component
    :is="as"
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :role="region.role.value"
    :aria-label="region.ariaLabel.value"
    :data-cross-align-self="crossAlignSelf"
    :data-scrollable="isScrollable || undefined"
    :data-size="size"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
