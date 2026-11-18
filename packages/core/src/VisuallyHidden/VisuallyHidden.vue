<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { VisuallyHiddenProps } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'

import '../../styles/visually-hidden.css'

defineOptions({
  name: 'VisuallyHidden',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<VisuallyHiddenProps>(), {
  as: 'span',
})

defineSlots<{
  default: () => unknown
}>()

const attrs = useAttrs()

/** HTML 空元素没有子节点。服务端不会给它们输出插槽内容，客户端也不能挂插槽，否则 hydration 对不上。 */
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
const isVoidElement = computed(() => typeof props.as === 'string' && VOID_ELEMENTS.has(props.as.toLowerCase()))
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
    v-if="isVoidElement"
    ref="root"
    class="astryx-visually-hidden"
    v-bind="getForwardedAttrs()"
  />
  <component
    :is="as"
    v-else
    ref="root"
    class="astryx-visually-hidden"
    v-bind="getForwardedAttrs()"
  >
    <slot />
  </component>
</template>
