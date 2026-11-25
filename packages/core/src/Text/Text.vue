<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TextProps } from './types.js'
import { computed, useAttrs } from 'vue'
import TruncationTooltip from './TruncationTooltip.vue'
import { useTruncationTooltip } from './useTruncationTooltip.js'

import '../../styles/text.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextProps>(), {
  type: 'body',
  color: undefined,
  display: 'inline',
  as: 'span',
  justify: 'start',
  maxLines: 0,
  hasTruncateTooltip: true,
  hasCapsize: false,
})

/** 没写 color 时按 type 取默认色：supporting 是 secondary，其余 primary，inherit 保持 inherit。 */
const color = computed(() => props.color ?? (props.type === 'supporting' ? 'secondary' : props.type === 'inherit' ? 'inherit' : 'primary'))
const weight = computed(() => props.weight === 'normal' ? 'regular' : props.weight)
const isBlock = computed(() => props.display === 'block' || props.maxLines > 0 || props.hasCapsize)
const wordBreak = computed(() => props.wordBreak ?? (props.maxLines === 1 ? 'break-all' : props.maxLines > 1 ? 'break-word' : undefined))
const tooltip = useTruncationTooltip(() => props.maxLines, () => props.hasTruncateTooltip)
const { interest } = tooltip
const attrs = useAttrs()

const classes = computed(() => [
  'astryx-text',
  `astryx-text--type-${props.type}`,
  props.size && `astryx-text--size-${props.size}`,
  `astryx-text--color-${color.value}`,
  weight.value && `astryx-text--weight-${weight.value}`,
  props.textWrap && `astryx-text--wrap-${props.textWrap}`,
  wordBreak.value && `astryx-text--word-${wordBreak.value}`,
  props.justify !== 'start' && `astryx-text--justify-${props.justify}`,
  props.hasCapsize && 'astryx-text--capsize',
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
  <component
    :is="as"
    :ref="tooltip.bind"
    v-bind="attrs"
    class="astryx-text"
    :class="classes"
    :style="style"
    @pointerenter="interest.onPointerenter"
    @pointerleave="interest.onPointerleave"
    @pointerdown="interest.onPointerdown"
    @focusin="interest.onFocusin"
    @focusout="interest.onFocusout"
  >
    <slot />
    <TruncationTooltip
      v-if="tooltip.isMounted.value"
      :anchor="tooltip.element.value"
      :content="tooltip.truncation.fullText.value"
      :placement="tooltip.placement.value!"
      :interest="interest.state"
    />
  </component>
</template>
