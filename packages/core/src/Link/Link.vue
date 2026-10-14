<script setup lang="ts">
import type { LinkProps } from './types.js'
import { computed } from 'vue'

import Tooltip from '../Tooltip/Tooltip.vue'
import '../../styles/link.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  isExternalLink: false,
  hasUnderline: false,
  color: 'accent',
  isDisabled: false,
  isStandalone: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

defineSlots<{
  default: () => unknown
}>()

const computedTarget = computed(() => {
  return props.isExternalLink ? '_blank' : props.target
})

const computedRel = computed(() => {
  const parts = new Set((props.rel ?? '').split(' ').filter(Boolean))
  if (props.isExternalLink || computedTarget.value === '_blank') {
    parts.add('noopener')
    parts.add('noreferrer')
  }
  return parts.size > 0 ? Array.from(parts).join(' ') : undefined
})

const classes = computed(() => [
  'astryx-link',
  `astryx-link--color-${props.color}`,
  props.hasUnderline && 'astryx-link--underlined',
  props.isDisabled && 'astryx-link--disabled',
  props.isExternalLink && 'astryx-link--external',
  props.isStandalone && 'astryx-link--standalone',
])

const tooltipText = computed(() => {
  const text = props.tooltip?.trim()
  return text || undefined
})

function handleClick(event: MouseEvent) {
  if (props.isDisabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <Tooltip v-if="tooltipText" :content="tooltipText">
    <a
      v-if="href && !isDisabled"
      class="astryx-link"
      :class="classes"
      :href="href"
      :target="computedTarget"
      :rel="computedRel"
      :download="download"
      @click="handleClick"
    >
      <slot />
      <span v-if="isExternalLink" class="astryx-link__external" aria-hidden="true">↗</span>
    </a>
    <a
      v-else-if="href && isDisabled"
      class="astryx-link"
      :class="classes"
      role="link"
      aria-disabled="true"
      @click.prevent
    >
      <slot />
    </a>
    <button
      v-else
      type="button"
      class="astryx-link"
      :class="classes"
      :disabled="isDisabled"
      @click="handleClick"
    >
      <slot />
    </button>
  </Tooltip>
  <a
    v-else-if="href && !isDisabled"
    class="astryx-link"
    :class="classes"
    :href="href"
    :target="computedTarget"
    :rel="computedRel"
    :download="download"
    @click="handleClick"
  >
    <slot />
    <span v-if="isExternalLink" class="astryx-link__external" aria-hidden="true">↗</span>
  </a>
  <a
    v-else-if="href && isDisabled"
    class="astryx-link"
    :class="classes"
    role="link"
    aria-disabled="true"
    @click.prevent
  >
    <slot />
  </a>
  <button
    v-else
    type="button"
    class="astryx-link"
    :class="classes"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
