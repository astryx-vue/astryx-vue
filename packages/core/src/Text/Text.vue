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

const weight = computed(() => props.weight === 'normal' ? 'regular' : props.weight)
// maxLines needs a block box so single-line ellipsis and line-clamp have a width.
const isBlock = computed(() => props.display === 'block' || props.maxLines > 0)

const classes = computed(() => [
  'astryx-text',
  `astryx-text--type-${props.type}`,
  props.size && `astryx-text--size-${props.size}`,
  `astryx-text--color-${props.color}`,
  weight.value && `astryx-text--weight-${weight.value}`,
  props.textWrap && `astryx-text--wrap-${props.textWrap}`,
  props.wordBreak && `astryx-text--word-${props.wordBreak}`,
  props.hasStrikethrough && 'astryx-text--strike',
  props.hasTabularNumbers && 'astryx-text--tabular',
  isBlock.value && 'astryx-text--block',
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
