<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LinkProps } from './types.js'
import { computed, toRaw, useAttrs } from 'vue'

import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useAstryxMessages } from '../locale/index.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { isSafeUrl } from './safeUrl.js'
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

const attrs = useAttrs()
const messages = useAstryxMessages()
const linkComponent = useLinkComponent()
const press = usePressFeedback()
/** 禁用时不挂按压层，鼠标和手指都不会亮。 */
const rootBindings = computed(() => ({
  ...attrs,
  ...(props.isDisabled ? {} : press.pressableProps),
}))

/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)

const destination = computed(() => {
  const href = props.href
  return href != null && href !== '' ? href : undefined
})
/** 危险协议不交给浏览器，也不交给自定义路由。 */
const safeHref = computed(() => destination.value != null && isSafeUrl(destination.value) ? destination.value : undefined)
const isBlocked = computed(() => destination.value != null && safeHref.value == null)
const isButton = computed(() => destination.value == null)
const isCustomLink = computed(() => safeHref.value != null && !props.isDisabled && customLink.value != null)
const root = computed(() => {
  if (isButton.value)
    return 'button'
  if (props.isDisabled || isBlocked.value || customLink.value == null)
    return 'a'
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
      v-bind="rootBindings"
      class="astryx-link"
      :class="classes"
      :href="!isButton && !isDisabled ? safeHref : undefined"
      :to="isCustomLink ? safeHref : undefined"
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
    v-bind="rootBindings"
    class="astryx-link"
    :class="classes"
    :href="!isButton && !isDisabled ? safeHref : undefined"
    :to="isCustomLink ? safeHref : undefined"
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
