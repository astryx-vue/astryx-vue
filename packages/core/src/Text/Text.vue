<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TextProps } from './types.js'
import { computed } from 'vue'

import '../../styles/text.css'

const props = withDefaults(defineProps<TextProps>(), {
  type: 'body',
  color: 'primary',
  display: 'inline',
  as: 'span',
  maxLines: 0,
})

const classes = computed(() => [
  'astryx-text',
  `astryx-text--type-${props.type}`,
  props.size && `astryx-text--size-${props.size}`,
  `astryx-text--color-${props.color}`,
  props.weight && `astryx-text--weight-${props.weight}`,
  props.display === 'block' && 'astryx-text--block',
  props.maxLines === 1 && 'astryx-text--truncate-single',
  props.maxLines > 1 && 'astryx-text--truncate-multi',
])

const style = computed<CSSProperties>(() => {
  if (props.maxLines > 1) {
    return { WebkitLineClamp: props.maxLines }
  }
  return {}
})
</script>

<template>
  <component
    :is="as"
    class="astryx-text"
    :class="classes"
    :style="style"
  >
    <slot />
  </component>
</template>
