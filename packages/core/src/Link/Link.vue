<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LinkProps } from './types.js'
import { computed, toRaw, useAttrs } from 'vue'

import { usePressFeedback } from '../composables/usePressFeedback.js'
import Icon from '../Icon/Icon.vue'
import { readLayerScoped } from '../layer/scopedProvide.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useAstryxMessages } from '../locale/index.js'
import { TextClampContext } from '../Text/textClampContext.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { isSafeUrl } from './safeUrl.js'
import '../../styles/link.css'

defineOptions({ name: 'AstryxLink', inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  isExternalLink: false,
  hasUnderline: false,
  color: 'accent',
  type: 'body',
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
const textClamp = readLayerScoped(TextClampContext)

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

/**
 * 在会截断行数的 Text 里，锚点形态改成普通行内元素，外面的截断才能从链接中间切开。
 * 按钮形态、自己设了 `maxLines` 的链接保留自己的盒子。
 */
const isInClampedText = computed(() => textClamp.value && !isButton.value && props.maxLines === 0)

const classes = computed(() => [
  'astryx-link',
  `astryx-link--color-${props.color}`,
  props.type !== 'inherit' && `astryx-link--type-${props.type}`,
  props.hasUnderline && 'astryx-link--underlined',
  props.isDisabled && 'astryx-link--disabled',
  props.isExternalLink && 'astryx-link--external',
  props.isStandalone && 'astryx-link--standalone',
  props.size && `astryx-link--size-${props.size}`,
  weightClass.value && `astryx-link--weight-${weightClass.value}`,
  props.maxLines > 0 && 'astryx-link--lines',
  isInClampedText.value && 'astryx-link--in-clamp',
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

/**
 * Link 自己决定的几项单独算，调用方传的同名属性不直接落到根元素上：
 * - `keydown`：禁用时要吞掉 Enter 和 Space，其他键才交给调用方。
 * - `role`、`aria-disabled`：禁用时 Link 说了算，读屏要听到「已禁用」。
 * - `tabindex`：禁用时默认 0，调用方给了就用调用方的，和启用时的焦点顺序一致。
 * - `aria-label`：调用方的优先，其次是 `label`。
 * - `data-color`：始终反映 `color`，主题规则看到的就是真实颜色。
 */
const OWN_ATTRIBUTES = new Set(['onKeydown', 'role', 'aria-disabled', 'tabindex', 'tabIndex', 'aria-label', 'data-color'])

/** `attrs` 不是响应式的，所以每次渲染现算，不放进 computed 缓存。 */
function rootAttributes(): Record<string, unknown> {
  const forwarded: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (!OWN_ATTRIBUTES.has(key))
      forwarded[key] = value
  }
  const callerTabIndex = attrs.tabindex ?? attrs.tabIndex
  const disabled = props.isDisabled
  const isAnchor = !isButton.value
  return {
    ...forwarded,
    ...(disabled ? {} : press.pressableProps),
    'href': isAnchor && !disabled ? safeHref.value : undefined,
    'to': isCustomLink.value ? safeHref.value : undefined,
    'target': isAnchor && !disabled ? computedTarget.value : undefined,
    'rel': isAnchor && !disabled ? computedRel.value : undefined,
    'download': downloadAttribute.value,
    'referrerpolicy': isAnchor ? props.referrerPolicy : undefined,
    'type': isButton.value ? 'button' : undefined,
    'role': disabled ? (isAnchor ? 'link' : undefined) : attrs.role,
    'tabindex': disabled && isAnchor ? (callerTabIndex ?? 0) : callerTabIndex,
    'aria-disabled': disabled ? true : attrs['aria-disabled'],
    'aria-label': attrs['aria-label'] ?? (props.label || undefined),
    'data-color': props.color,
  }
}

/**
 * 禁用时只挡住这一次点击：用 `aria-disabled` 保留 Tab 停留点，元素仍会派发
 * click，所以这里既阻止默认行为，也不让它冒泡到外层可点击容器。
 */
function handleClick(event: MouseEvent) {
  if (props.isDisabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}

/** 禁用时 Enter 和 Space 会合成一次点击；提前取消，其他键仍交给调用方。 */
function handleKeydown(event: KeyboardEvent) {
  if (props.isDisabled && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    return
  }
  const listener = attrs.onKeydown
  if (typeof listener === 'function')
    listener(event)
}
</script>

<template>
  <Tooltip v-if="tooltipText" :content="tooltipText">
    <component
      :is="root"
      v-bind="rootAttributes()"
      class="astryx-link"
      :class="classes"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <span :class="labelClass" :style="labelStyle">
        <slot />
      </span>
      <Icon v-if="showNewTab" class="astryx-link__external" icon="externalLink" size="xsm" color="inherit" aria-hidden="true" />
      <VisuallyHidden v-if="showNewTab">
        {{ newTabText }}
      </VisuallyHidden>
    </component>
  </Tooltip>
  <component
    :is="root"
    v-else
    v-bind="rootAttributes()"
    class="astryx-link"
    :class="classes"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span :class="labelClass" :style="labelStyle">
      <slot />
    </span>
    <Icon v-if="showNewTab" class="astryx-link__external" icon="externalLink" size="xsm" color="inherit" aria-hidden="true" />
    <VisuallyHidden v-if="showNewTab">
      {{ newTabText }}
    </VisuallyHidden>
  </component>
</template>
