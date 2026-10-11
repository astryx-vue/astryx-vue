<script setup lang="ts">
import type { CitationProps } from './types.js'
import { computed, useTemplateRef } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/citation.css'

defineOptions({ name: 'AstryxCitation', inheritAttrs: false })

const props = withDefaults(defineProps<CitationProps>(), {
  variant: 'label',
})

const messages = useAstryxMessages()
const root = useTemplateRef<HTMLElement>('root')

const title = computed(() => props.source.title?.trim() || String(props.number))
const href = computed(() => props.source.url)
const accessibleName = computed(() => messages.value.citation.label(props.number, title.value))

const imageSrc = computed(() => {
  const icon = props.source.icon
  if (icon && isImageReference(icon))
    return icon
  if (!icon)
    return props.source.src
  return undefined
})

const iconClass = computed(() => {
  const icon = props.source.icon
  if (icon && !isImageReference(icon))
    return icon
  return undefined
})

const hasIcon = computed(() => props.variant === 'label' && (imageSrc.value != null || iconClass.value != null))

function isImageReference(value: string): boolean {
  return /^(?:https?:|data:|\/|\.\/|\.\.\/)/.test(value)
}

defineExpose({ element: root })
</script>

<template>
  <a
    v-if="href"
    ref="root"
    v-bind="$attrs"
    class="astryx-citation"
    :data-variant="variant"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    role="doc-noteref"
    :aria-label="accessibleName"
    :title="title"
  >
    <template v-if="variant === 'number'">{{ number }}</template>
    <template v-else>
      <span v-if="hasIcon" class="astryx-citation__icon" aria-hidden="true">
        <img v-if="imageSrc" class="astryx-citation__image" :src="imageSrc" alt="">
        <Icon v-else-if="iconClass" :icon="iconClass" size="sm" />
      </span>
      <span class="astryx-citation__text">{{ title }}</span>
    </template>
  </a>
  <span
    v-else
    ref="root"
    v-bind="$attrs"
    class="astryx-citation"
    :data-variant="variant"
    :aria-label="accessibleName"
    :title="title"
  >
    <template v-if="variant === 'number'">{{ number }}</template>
    <template v-else>
      <span v-if="hasIcon" class="astryx-citation__icon" aria-hidden="true">
        <img v-if="imageSrc" class="astryx-citation__image" :src="imageSrc" alt="">
        <Icon v-else-if="iconClass" :icon="iconClass" size="sm" />
      </span>
      <span class="astryx-citation__text">{{ title }}</span>
    </template>
  </span>
</template>
