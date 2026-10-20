<script setup lang="ts">
import type { ScrollbarsHandle, ScrollbarsOptions, ScrollbarsProviderProps, ScrollbarsProviderSlots } from './types.js'
import { OverlayScrollbars } from 'overlayscrollbars'
import { computed, provide } from 'vue'
import { scrollbarsKey } from './context.js'
import { mergeOptions } from './options.js'
import '../../styles/scrollbars.css'

defineOptions({ name: 'AstryxScrollbarsProvider', inheritAttrs: false })

const props = withDefaults(defineProps<ScrollbarsProviderProps>(), {
  enabled: true,
  autoHide: 'scroll',
  autoHideDelay: 800,
  options: undefined,
})
defineSlots<ScrollbarsProviderSlots>()

/** 什么都不做的句柄：元素已被别处接管时使用，避免一方销毁连带另一方。 */
const noopHandle: ScrollbarsHandle = { update: () => {}, destroy: () => {} }

const options = computed<ScrollbarsOptions>(() => mergeOptions<ScrollbarsOptions>(
  {
    scrollbars: {
      theme: 'os-theme-astryx',
      autoHide: props.autoHide,
      autoHideDelay: props.autoHideDelay,
    },
  },
  props.options,
))

function mount(element: HTMLElement, initial: ScrollbarsOptions): ScrollbarsHandle {
  if (OverlayScrollbars(element))
    return noopHandle
  const instance = OverlayScrollbars({ target: element, elements: { viewport: element } }, initial)
  return {
    update: next => instance.options(next, true),
    destroy: () => instance.destroy(),
  }
}

provide(scrollbarsKey, {
  enabled: computed(() => props.enabled),
  options,
  mount,
})
</script>

<template>
  <slot />
</template>
