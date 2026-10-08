<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { AvatarProps } from './types.js'
import { computed, inject, ref } from 'vue'

import { AvatarGroupContext } from '../AvatarGroup/context.js'
import { resolveSize } from './utils.js'
import '../../styles/avatar.css'

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
})

const emit = defineEmits<{
  (e: 'error', event: Event): void
}>()

defineSlots<{
  default?: () => unknown
  status?: () => unknown
}>()

const INITIALS_FONT_SIZE_RATIO = 0.4
const DEFAULT_ICON_RATIO = 0.6

const erroredSrc = ref<string | undefined>(undefined)
const erroredFallbackSrc = ref<string | undefined>(undefined)

const avatarGroup = inject(AvatarGroupContext, undefined)
const resolvedSize = computed(() => avatarGroup?.size.value ?? props.size)
const resolvedShape = computed(() => avatarGroup?.shape.value ?? props.shape)

const numericSize = computed(() => resolveSize(resolvedSize.value))

const groupStyle = computed<CSSProperties>(() => {
  if (!avatarGroup) {
    return {}
  }
  return {
    marginInlineStart: `${-avatarGroup.overlap.value}px`,
    borderWidth: '2px',
  }
})

const rootStyle = computed<CSSProperties>(() => ({
  width: `${numericSize.value}px`,
  height: `${numericSize.value}px`,
}))

const showImage = computed(() => props.src && erroredSrc.value !== props.src)
const showFallbackImage = computed(
  () => !showImage.value && props.fallbackSrc && erroredFallbackSrc.value !== props.fallbackSrc,
)

const meaningfulName = computed(() => {
  return typeof props.name === 'string' && props.name.trim() !== '' ? props.name.trim() : undefined
})

const meaningfulAlt = computed(() => {
  return typeof props.alt === 'string' && props.alt.trim() !== '' ? props.alt.trim() : undefined
})

const initials = computed(() => {
  if (!meaningfulName.value) {
    return ''
  }
  const words = meaningfulName.value.split(/\s+/)
  const first = words.at(0)
  const last = words.length > 1 ? words.at(-1) : undefined
  const initial = (word: string | undefined) => {
    if (!word) {
      return ''
    }
    const match = word.match(/[\p{L}\p{N}]/u)
    return match ? match[0].toUpperCase() : ''
  }
  const result = `${initial(first)}${initial(last)}`
  return result
})

const showInitials = computed(() => !showImage.value && !showFallbackImage.value && initials.value !== '')
const showIcon = computed(() => !showImage.value && !showFallbackImage.value && initials.value === '')

const accessibleName = computed(() => {
  return meaningfulAlt.value || meaningfulName.value
})

const a11yProps = computed(() => {
  if (accessibleName.value) {
    return { 'role': 'img' as const, 'aria-label': accessibleName.value }
  }
  return { 'role': 'presentation' as const, 'aria-hidden': 'true' as const }
})

function handleImageError(event: Event) {
  if (props.src) {
    erroredSrc.value = props.src
  }
  emit('error', event)
}

function handleFallbackError() {
  if (props.fallbackSrc) {
    erroredFallbackSrc.value = props.fallbackSrc
  }
}
</script>

<template>
  <span
    class="astryx-avatar"
    :class="[`astryx-avatar--${resolvedShape}`, { 'astryx-avatar--group-item': avatarGroup }]"
    :style="[rootStyle, groupStyle]"
    v-bind="a11yProps"
  >
    <span class="astryx-avatar__content">
      <img
        v-if="showImage"
        class="astryx-avatar__image"
        :src="src"
        alt=""
        @error="handleImageError"
      >
      <img
        v-else-if="showFallbackImage"
        class="astryx-avatar__image"
        :src="fallbackSrc"
        alt=""
        @error="handleFallbackError"
      >
      <span
        v-else-if="showInitials"
        class="astryx-avatar__fallback astryx-avatar__fallback--initials"
        :style="{ fontSize: `${numericSize * INITIALS_FONT_SIZE_RATIO}px` }"
      >
        {{ initials }}
      </span>
      <span
        v-else-if="showIcon"
        class="astryx-avatar__fallback astryx-avatar__fallback--icon"
        :style="{ fontSize: `${numericSize * DEFAULT_ICON_RATIO}px` }"
      >
        <slot name="default">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </slot>
      </span>
    </span>
    <span
      v-if="$slots.status"
      class="astryx-avatar__status"
    >
      <slot name="status" />
    </span>
  </span>
</template>
