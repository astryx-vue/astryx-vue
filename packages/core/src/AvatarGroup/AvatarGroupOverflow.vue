<script setup lang="ts">
import type { AvatarGroupOverflowEmits, AvatarGroupOverflowProps, AvatarGroupOverflowSlots } from './types.js'
import { computed, getCurrentInstance, inject } from 'vue'

import { resolveSize } from '../Avatar/utils.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useAstryxMessages } from '../locale/index.js'
import { AvatarGroupContext } from './context.js'
import '../../styles/avatar-group.css'

defineOptions({ name: 'AstryxAvatarGroupOverflow' })

const props = defineProps<AvatarGroupOverflowProps>()
const emit = defineEmits<AvatarGroupOverflowEmits>()
defineSlots<AvatarGroupOverflowSlots>()

const instance = getCurrentInstance()
const messages = useAstryxMessages()
const press = usePressFeedback()

const avatarGroup = inject(AvatarGroupContext, undefined)
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

/** 读屏名走语言包（英文 `5 more`），跟着 `count` 变。 */
const accessibleName = computed(() => {
  const t = messages.value.nav.avatarOverflow
  return t(safeCount.value)
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
</script>

<template>
  <component
    :is="isInteractive ? 'button' : 'span'"
    v-bind="pressBindings"
    class="astryx-avatar-group-overflow"
    :class="[`astryx-avatar-group-overflow--${shape}`, { 'astryx-avatar-group-overflow--interactive': isInteractive }]"
    :style="rootStyle"
    :data-size="size"
    :data-shape="shape"
    :data-avatar-item="isInteractive ? '' : undefined"
    :type="isInteractive ? 'button' : undefined"
    :aria-label="accessibleName"
    :role="isInteractive ? undefined : 'img'"
    @click="emit('click', $event)"
  >
    <slot>{{ `+${safeCount}` }}</slot>
  </component>
</template>
