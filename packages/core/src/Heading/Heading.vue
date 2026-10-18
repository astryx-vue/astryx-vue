<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { HeadingProps } from './types.js'
import { computed, useAttrs } from 'vue'
import { truncatePlacement, useTruncation } from '../Text/useTruncation.js'
import Tooltip from '../Tooltip/Tooltip.vue'

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

const tag = computed(() => `h${props.level}` as const)
const placement = computed(() => props.maxLines > 0 ? truncatePlacement(props.hasTruncateTooltip) : null)
const wordBreak = computed(() => props.wordBreak ?? (props.maxLines === 1 ? 'break-all' : props.maxLines > 1 ? 'break-word' : undefined))
const truncation = useTruncation(computed(() => props.maxLines))
const ariaLevel = computed(() => props.accessibilityLevel != null && props.accessibilityLevel !== props.level ? props.accessibilityLevel : undefined)
const attrs = useAttrs()

const classes = computed(() => [
  'astryx-heading',
  `astryx-heading--level-${props.level}`,
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
  <Tooltip
    v-if="placement"
    anchors-on-self
    :has-hover-indication="false"
    :content="truncation.fullText.value"
    :is-enabled="truncation.isTruncated.value"
    :placement="placement"
  >
    <component
      :is="tag"
      :ref="truncation.bind"
      v-bind="attrs"
      class="astryx-heading"
      :class="classes"
      :style="style"
      :aria-level="ariaLevel"
    >
      <slot />
    </component>
  </Tooltip>
  <component
    :is="tag"
    v-else
    v-bind="attrs"
    class="astryx-heading"
    :class="classes"
    :style="style"
    :aria-level="ariaLevel"
  >
    <slot />
  </component>
</template>
