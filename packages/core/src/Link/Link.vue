<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LinkProps } from './types.js'
import { computed, toRaw } from 'vue'

import { useAstryxMessages } from '../locale/index.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import '../../styles/link.css'

defineOptions({ name: 'AstryxLink', inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  isExternalLink: false,
  hasUnderline: false,
  color: 'accent',
  isDisabled: false,
  isStandalone: false,
  maxLines: 0,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

defineSlots<{
  default: () => unknown
}>()

const messages = useAstryxMessages()

const isButton = computed(() => props.href == null || props.href === '')
const isCustomLink = computed(() => !isButton.value && !props.isDisabled && props.as != null)
const root = computed(() => {
  if (isButton.value || props.isDisabled || props.as == null)
    return isButton.value ? 'button' : 'a'
  return toRaw(props.as)
})

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

const weightClass = computed(() => {
  if (props.weight == null)
    return undefined
  return props.weight === 'normal' ? 'regular' : props.weight
})

const classes = computed(() => [
  'astryx-link',
  `astryx-link--color-${props.color}`,
  props.hasUnderline && 'astryx-link--underlined',
  props.isDisabled && 'astryx-link--disabled',
  props.isExternalLink && 'astryx-link--external',
  props.isStandalone && 'astryx-link--standalone',
  props.size && `astryx-link--size-${props.size}`,
  weightClass.value && `astryx-link--weight-${weightClass.value}`,
])

const labelClass = computed(() => [
  'astryx-link__label',
  props.maxLines === 1 && 'astryx-link__label--single',
  props.maxLines > 1 && 'astryx-link__label--clamp',
])

const labelStyle = computed<CSSProperties | undefined>(() => {
  if (props.maxLines > 1)
    return { WebkitLineClamp: props.maxLines }
  return undefined
})

const tooltipText = computed(() => {
  const text = props.tooltip?.trim()
  return text || undefined
})

const newTabText = computed(() => props.newTabLabel || messages.value.nav.opensInNewTab)
const showNewTab = computed(() => props.isExternalLink && !isButton.value)

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
    <component
      :is="root"
      v-bind="$attrs"
      class="astryx-link"
      :class="classes"
      :href="!isButton && !isDisabled ? href : undefined"
      :to="isCustomLink ? href : undefined"
      :target="!isButton && !isDisabled ? computedTarget : undefined"
      :rel="!isButton && !isDisabled ? computedRel : undefined"
      :download="!isButton && !isDisabled ? download : undefined"
      :type="isButton ? 'button' : undefined"
      :disabled="isButton ? isDisabled : undefined"
      :role="isDisabled && !isButton ? 'link' : undefined"
      :aria-disabled="isDisabled || undefined"
      :aria-label="label || undefined"
      @click="handleClick"
    >
      <span :class="labelClass" :style="labelStyle">
        <slot />
      </span>
      <span v-if="showNewTab" class="astryx-link__external" aria-hidden="true">↗</span>
      <VisuallyHidden v-if="showNewTab">
        {{ newTabText }}
      </VisuallyHidden>
    </component>
  </Tooltip>
  <component
    :is="root"
    v-else
    v-bind="$attrs"
    class="astryx-link"
    :class="classes"
    :href="!isButton && !isDisabled ? href : undefined"
    :to="isCustomLink ? href : undefined"
    :target="!isButton && !isDisabled ? computedTarget : undefined"
    :rel="!isButton && !isDisabled ? computedRel : undefined"
    :download="!isButton && !isDisabled ? download : undefined"
    :type="isButton ? 'button' : undefined"
    :disabled="isButton ? isDisabled : undefined"
    :role="isDisabled && !isButton ? 'link' : undefined"
    :aria-disabled="isDisabled || undefined"
    :aria-label="label || undefined"
    @click="handleClick"
  >
    <span :class="labelClass" :style="labelStyle">
      <slot />
    </span>
    <span v-if="showNewTab" class="astryx-link__external" aria-hidden="true">↗</span>
    <VisuallyHidden v-if="showNewTab">
      {{ newTabText }}
    </VisuallyHidden>
  </component>
</template>
