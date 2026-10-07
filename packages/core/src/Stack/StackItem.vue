<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { StackItemProps } from './types.js'
import { computed, useAttrs } from 'vue'

import '../../styles/stack.css'

defineOptions({
  name: 'StackItem',
  inheritAttrs: false,
})

withDefaults(defineProps<StackItemProps>(), {
  as: 'div',
  isScrollable: false,
  size: 'static',
})

defineSlots<{
  default: () => unknown
}>()

const attrs = useAttrs()

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-stack-item', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)
</script>

<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :data-cross-align-self="crossAlignSelf"
    :data-scrollable="isScrollable || undefined"
    :data-size="size"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
