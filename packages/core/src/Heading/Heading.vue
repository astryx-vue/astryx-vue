<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { HeadingProps } from './types.js'
import { computed } from 'vue'

import '../../styles/heading.css'

const props = withDefaults(defineProps<HeadingProps>(), {
  color: 'primary',
  display: 'block',
  maxLines: 0,
})

const tag = computed(() => `h${props.level}` as const)

const classes = computed(() => [
  'astryx-heading',
  `astryx-heading--level-${props.level}`,
  props.type && `astryx-heading--type-${props.type}`,
  `astryx-heading--color-${props.color}`,
  props.weight && `astryx-heading--weight-${props.weight}`,
  props.display === 'inline' && 'astryx-heading--inline',
  props.maxLines === 1 && 'astryx-heading--truncate-single',
  props.maxLines > 1 && 'astryx-heading--truncate-multi',
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
    :is="tag"
    class="astryx-heading"
    :class="classes"
    :style="style"
  >
    <slot />
  </component>
</template>
