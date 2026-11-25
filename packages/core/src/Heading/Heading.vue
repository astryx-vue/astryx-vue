<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { HeadingProps } from './types.js'
import { computed, useAttrs, watch } from 'vue'
import { devWarn } from '../composables/useDevWarning.js'
import TruncationTooltip from '../Text/TruncationTooltip.vue'
import { useTruncationTooltip } from '../Text/useTruncationTooltip.js'
import { describeLevel, resolveHeadingLevel } from './level.js'

import '../../styles/heading.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<HeadingProps>(), {
  color: 'primary',
  display: 'block',
  justify: 'start',
  maxLines: 0,
  hasTruncateTooltip: true,
  hasCapsize: false,
})

// 没写 level、或不是 1–6 时按 2 级渲染，并在开发时说明怎么改。
const level = computed(() => resolveHeadingLevel(props.level))
watch(() => props.level, (requested) => {
  if (requested !== level.value)
    devWarn('Heading', `level must be 1, 2, 3, 4, 5 or 6, but it is ${describeLevel(requested)}. The heading renders as level ${level.value}. Pass the outline level, for example <Heading :level="2">.`)
}, { immediate: true })
const tag = computed(() => `h${level.value}` as const)
const wordBreak = computed(() => props.wordBreak ?? (props.maxLines === 1 ? 'break-all' : props.maxLines > 1 ? 'break-word' : undefined))
const tooltip = useTruncationTooltip(() => props.maxLines, () => props.hasTruncateTooltip)
const { interest } = tooltip
// 模板里 aria-level 写在 v-bind="attrs" 前面，调用方自己写的 aria-level 优先。
const ariaLevel = computed(() => props.accessibilityLevel != null && props.accessibilityLevel !== level.value ? props.accessibilityLevel : undefined)
const attrs = useAttrs()

const classes = computed(() => [
  'astryx-heading',
  `astryx-heading--level-${level.value}`,
  props.type && `astryx-heading--type-${props.type}`,
  `astryx-heading--color-${props.color}`,
  props.weight && `astryx-heading--weight-${props.weight}`,
  props.display === 'inline' && props.maxLines === 0 && !props.hasCapsize && 'astryx-heading--inline',
  props.hasCapsize && 'astryx-heading--capsize',
  props.textWrap && `astryx-heading--wrap-${props.textWrap}`,
  wordBreak.value && `astryx-heading--word-${wordBreak.value}`,
  props.justify !== 'start' && `astryx-heading--justify-${props.justify}`,
  props.hasStrikethrough && 'astryx-heading--strike',
  props.maxLines === 1 && 'astryx-heading--truncate-single',
  props.maxLines > 1 && 'astryx-heading--truncate-multi',
])

const style = computed<CSSProperties>(() => {
  if (props.maxLines > 1)
    return { WebkitLineClamp: props.maxLines }
  return {}
})
</script>

<template>
  <component
    :is="tag"
    :ref="tooltip.bind"
    :aria-level="ariaLevel"
    v-bind="attrs"
    class="astryx-heading"
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
