<script setup lang="ts">
import type { AvatarGroupOverflowEmits, AvatarGroupOverflowProps, AvatarGroupOverflowSlots } from './types.js'
import { computed, getCurrentInstance, inject } from 'vue'

import { resolveSize } from '../Avatar/utils.js'
import { AvatarGroupContext } from './context.js'

defineOptions({ name: 'AstryxAvatarGroupOverflow' })

const props = defineProps<AvatarGroupOverflowProps>()
const emit = defineEmits<AvatarGroupOverflowEmits>()
defineSlots<AvatarGroupOverflowSlots>()

const instance = getCurrentInstance()

const avatarGroup = inject(AvatarGroupContext, undefined)
const size = computed(() => avatarGroup?.size.value ?? 'md')
const shape = computed(() => avatarGroup?.shape.value ?? 'circle')
const numericSize = computed(() => resolveSize(size.value))

/**
 * A click listener turns the indicator into a real button so it can take
 * focus; without one it stays a static figure.
 */
const isInteractive = computed(() => instance?.vnode.props?.onClick != null)

const rootStyle = computed(() => ({
  width: `${numericSize.value}px`,
  height: `${numericSize.value}px`,
  marginInlineStart: `${-(avatarGroup?.overlap.value ?? 0)}px`,
}))
</script>

<template>
  <component
    :is="isInteractive ? 'button' : 'span'"
    class="astryx-avatar-group-overflow"
    :class="[`astryx-avatar-group-overflow--${shape}`, { 'astryx-avatar-group-overflow--interactive': isInteractive }]"
    :style="rootStyle"
    :type="isInteractive ? 'button' : undefined"
    :aria-label="`${props.count} more avatars`"
    :role="isInteractive ? undefined : 'img'"
    @click="emit('click', $event)"
  >
    <slot>+{{ props.count }}</slot>
  </component>
</template>
