<script setup lang="ts">
import type { AvatarGroupOverflowEmits, AvatarGroupOverflowProps, AvatarGroupOverflowSlots } from './types.js'
import { computed, getCurrentInstance, mergeProps, useAttrs } from 'vue'

import { resolveSize } from '../Avatar/utils.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { readLayerScoped } from '../layer/scopedProvide.js'
import { useComponentMessages } from '../locale/context.js'
import { navMessages } from '../locale/messages/nav.js'
import { AvatarGroupContext } from './context.js'
import '../../styles/avatar-group.css'

defineOptions({ name: 'AstryxAvatarGroupOverflow', inheritAttrs: false })

const props = defineProps<AvatarGroupOverflowProps>()
const emit = defineEmits<AvatarGroupOverflowEmits>()
defineSlots<AvatarGroupOverflowSlots>()

const instance = getCurrentInstance()
const attrs = useAttrs()
const messages = useComponentMessages({ nav: navMessages })
const press = usePressFeedback()

const avatarGroup = readLayerScoped(AvatarGroupContext)
const OVERFLOW_BORDER = 2
const size = computed(() => avatarGroup?.size.value ?? 'md')
const shape = computed(() => avatarGroup?.shape.value ?? 'circle')
const numericSize = computed(() => resolveSize(size.value))

/**
 * A click listener turns the indicator into a real button so it can take
 * focus; without one it stays a static figure.
 */
const isInteractive = computed(() => instance?.vnode.props?.onClick != null)

/**
 * `count` 是「总人数 - 看到的人数」，列表比切片短时会是负数。夹到 0 以上，
 * 免得画出 `+-3`。
 */
const safeCount = computed(() => Math.max(0, props.count))

/**
 * 调用方给了非空的 `aria-label` 就用它；否则读屏名走语言包（英文 `5 more`），
 * 跟着 `count` 变。调用方的 `aria-labelledby` 原样透传，浏览器会让它优先。
 */
const accessibleName = computed(() => {
  const callerLabel = attrs['aria-label']
  if (typeof callerLabel === 'string' && callerLabel !== '')
    return callerLabel
  return messages.value.nav.avatarOverflow(safeCount.value)
})

/** 除了名字，调用方的其他属性原样落到根元素上。 */
const forwardedAttrs = computed(() => {
  const { 'aria-label': _callerLabel, ...rest } = attrs
  return rest
})

/** 字号随头像长：小头像沿用正文字号，大头像按比例放大。 */
const OVERFLOW_FONT_RATIO = 0.35

/**
 * 短文字时是个圆，文字变长就长成胶囊：宽度只给下限（和头像一样大），
 * 高度固定，靠内边距让文字不贴边。
 */
const rootStyle = computed(() => ({
  'minWidth': `${numericSize.value + OVERFLOW_BORDER * 2}px`,
  'height': `${numericSize.value + OVERFLOW_BORDER * 2}px`,
  '--astryx-avatar-group-overflow-computed-font-size': `max(var(--astryx-text-supporting-size, 0.75rem), ${Math.round(numericSize.value * OVERFLOW_FONT_RATIO * 100) / 100}px)`,
}))
const pressBindings = computed(() => isInteractive.value ? press.pressableProps : {})

/** 静态指示器的 `img` 语义可以被调用方换掉，比如标成 `note`。 */
const staticRole = computed(() => (attrs.role as string | undefined) ?? 'img')
</script>

<template>
  <component
    :is="isInteractive ? 'button' : 'span'"
    v-bind="mergeProps(forwardedAttrs, pressBindings)"
    class="astryx-avatar-group-overflow"
    :class="[`astryx-avatar-group-overflow--${shape}`, { 'astryx-avatar-group-overflow--interactive': isInteractive }]"
    :style="rootStyle"
    :data-size="size"
    :data-shape="shape"
    :data-avatar-item="isInteractive ? '' : undefined"
    :type="isInteractive ? 'button' : undefined"
    :aria-label="accessibleName"
    :role="isInteractive ? undefined : staticRole"
    @click="emit('click', $event)"
  >
    <slot>{{ `+${safeCount}` }}</slot>
  </component>
</template>
