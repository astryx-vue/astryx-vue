<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TextProps } from './types.js'
import { computed, useAttrs } from 'vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { truncatePlacement, useTruncation } from './useTruncation.js'

import '../../styles/text.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextProps>(), {
  type: 'body',
  color: 'primary',
  display: 'inline',
  as: 'span',
  justify: 'start',
  maxLines: 0,
  hasTruncateTooltip: true,
})

const weight = computed(() => props.weight === 'normal' ? 'regular' : props.weight)
const isBlock = computed(() => props.display === 'block' || props.maxLines > 0)
const wordBreak = computed(() => props.wordBreak ?? (props.maxLines === 1 ? 'break-all' : props.maxLines > 1 ? 'break-word' : undefined))
const placement = computed(() => props.maxLines > 0 ? truncatePlacement(props.hasTruncateTooltip) : null)
const truncation = useTruncation(computed(() => props.maxLines))
const attrs = useAttrs()

const classes = computed(() => [
  'astryx-text',
  `astryx-text--type-${props.type}`,
  props.size && `astryx-text--size-${props.size}`,
  `astryx-text--color-${props.color}`,
  weight.value && `astryx-text--weight-${weight.value}`,
  props.textWrap && `astryx-text--wrap-${props.textWrap}`,
  wordBreak.value && `astryx-text--word-${wordBreak.value}`,
  props.justify !== 'start' && `astryx-text--justify-${props.justify}`,
  props.hasStrikethrough && 'astryx-text--strike',
  props.hasTabularNumbers && 'astryx-text--tabular',
  isBlock.value && 'astryx-text--block',
  props.maxLines === 1 && 'astryx-text--truncate-single',
  props.maxLines > 1 && 'astryx-text--truncate-multi',
])

const style = computed<CSSProperties>(() => {
  if (props.maxLines > 1)
    return { WebkitLineClamp: props.maxLines }
  return {}
})
</script>

<template>
  <Tooltip
    v-if="placement"
    anchors-on-self
    :has-hover-indication="false"
    :content="truncation.fullText.value"
    :is-enabled="truncation.isTruncated.value"
    :placement="placement"
  >
    <component
      :is="as"
      :ref="truncation.bind"
      v-bind="attrs"
      class="astryx-text"
      :class="classes"
      :style="style"
    >
      <slot />
    </component>
  </Tooltip>
  <component
    :is="as"
    v-else
    v-bind="attrs"
    class="astryx-text"
    :class="classes"
    :style="style"
  >
    <slot />
  </component>
</template>
