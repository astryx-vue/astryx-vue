<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { VisuallyHiddenProps } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'

import '../../styles/visually-hidden.css'

defineOptions({
  name: 'VisuallyHidden',
  inheritAttrs: false,
})

withDefaults(defineProps<VisuallyHiddenProps>(), {
  as: 'span',
})

defineSlots<{
  default: () => unknown
}>()

const attrs = useAttrs()
const renderedRoot = useTemplateRef<ComponentPublicInstance | HTMLElement>('root')

const element = computed<HTMLElement | null>(() => {
  const root = renderedRoot.value

  if (typeof HTMLElement === 'undefined' || root == null)
    return null

  if (root instanceof HTMLElement)
    return root

  return root.$el instanceof HTMLElement ? root.$el : null
})

function getForwardedAttrs(): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  )
}

defineExpose({
  element,
})
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="astryx-visually-hidden"
    v-bind="getForwardedAttrs()"
  >
    <slot />
  </component>
</template>
