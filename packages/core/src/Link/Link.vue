<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LinkProps } from './types.js'
import { computed, toRaw } from 'vue'

import { useLinkComponent } from '../LinkProvider/context.js'
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
const linkComponent = useLinkComponent()

/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)

const isButton = computed(() => props.href == null || props.href === '')
const isCustomLink = computed(() => !isButton.value && !props.isDisabled && customLink.value != null)
const root = computed(() => {
  if (isButton.value || props.isDisabled || customLink.value == null)
    return isButton.value ? 'button' : 'a'
  return toRaw(customLink.value)
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
  props.maxLines > 0 && 'astryx-link--lines',
])

const labelClass = computed(() => [
  'astryx-link__label',
  props.maxLines === 1 && 'astryx-link__label--single',
  props.maxLines > 1 && 'astryx-link__label--clamp',
])

const labelStyle = computed<CSSProperties | undefined>(() => {
  if (props.maxLines > 1)
    return { '--astryx-link-max-lines': String(props.maxLines) }
  return undefined
})

const tooltipText = computed(() => {
  const text = props.tooltip?.trim()
  return text || undefined
})

const newTabText = computed(() => props.newTabLabel || messages.value.nav.opensInNewTab)
const showNewTab = computed(() => props.isExternalLink && !isButton.value)

/**
 * `download` 只有三种写法：没有、空属性（= 用服务器给的文件名）、指定文件名。
 * `false` 不能落到 DOM 上变成 `download="false"`，那样会被当成文件名。
 */
const downloadAttribute = computed<string | undefined>(() => {
  if (isButton.value || props.isDisabled)
    return undefined
  if (props.download === true)
    return ''
  if (props.download === false)
    return undefined
  return props.download
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
    <component
      :is="root"
      v-bind="$attrs"
      class="astryx-link"
      :class="classes"
      :href="!isButton && !isDisabled ? href : undefined"
      :to="isCustomLink ? href : undefined"
      :target="!isButton && !isDisabled ? computedTarget : undefined"
      :rel="!isButton && !isDisabled ? computedRel : undefined"
      :download="downloadAttribute"
      :referrerpolicy="!isButton ? referrerPolicy : undefined"
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
    :download="downloadAttribute"
    :referrerpolicy="!isButton ? referrerPolicy : undefined"
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
