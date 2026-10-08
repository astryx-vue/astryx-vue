<script setup lang="ts">
import type { AvatarGroupOverflowProps } from './types.js'
import { computed, inject } from 'vue'

import { resolveSize } from '../Avatar/utils.js'
import { AvatarGroupContext } from './context.js'

defineOptions({ name: 'AvatarGroupOverflow' })

defineProps<AvatarGroupOverflowProps>()

const avatarGroup = inject(AvatarGroupContext, undefined)
const size = computed(() => avatarGroup?.size ?? 'md')
const shape = computed(() => avatarGroup?.shape ?? 'circle')
const numericSize = computed(() => resolveSize(size.value))

const rootStyle = computed(() => ({
  width: `${numericSize.value}px`,
  height: `${numericSize.value}px`,
  marginInlineStart: `${-(avatarGroup?.overlap ?? 0)}px`,
}))
</script>

<template>
  <span
    class="astryx-avatar-group-overflow"
    :class="[`astryx-avatar-group-overflow--${shape}`]"
    :style="rootStyle"
    role="img"
    :aria-label="`${count} more avatars`"
  >
    +{{ count }}
  </span>
</template>
