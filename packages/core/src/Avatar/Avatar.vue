<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { AvatarProps } from './types.js'
import { computed, inject, provide, ref, toRaw, useAttrs } from 'vue'

import { AvatarGroupContext } from '../AvatarGroup/context.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useAstryxMessages } from '../locale/context.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import { AvatarSizeContext, AvatarStatusLabelContext } from './context.js'
import { composeAccessibleName, resolveSize } from './utils.js'
import '../../styles/avatar.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
  tooltip: true,
})

const emit = defineEmits<{
  (e: 'error', event: Event): void
}>()

defineSlots<{
  default?: () => unknown
  status?: () => unknown
}>()

const linkComponent = useLinkComponent()

const attrs = useAttrs()

const INITIALS_FONT_SIZE_RATIO = 0.4
const DEFAULT_ICON_RATIO = 0.6

const erroredSrc = ref<string | undefined>(undefined)
const erroredFallbackSrc = ref<string | undefined>(undefined)

const avatarGroup = inject(AvatarGroupContext, undefined)
const resolvedSize = computed(() => avatarGroup?.size.value ?? props.size)
const resolvedShape = computed(() => avatarGroup?.shape.value ?? props.shape)

const numericSize = computed(() => resolveSize(resolvedSize.value))

/** 状态点这类子组件靠它把自己的尺寸跟着头像走。 */
provide(AvatarSizeContext, numericSize)

/** 状态插槽里的圆点把读屏名字写在这里，下面会拼进头像自己的名字。 */
const statusLabel = ref<string | undefined>(undefined)
provide(AvatarStatusLabelContext, statusLabel)

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

const messages = useAstryxMessages()
const accessibleName = computed(() => {
  const label = statusLabel.value
  const status = typeof label === 'string' && label.trim() !== '' ? label.trim() : undefined
  return composeAccessibleName(meaningfulAlt.value || meaningfulName.value, status, messages.value.nav.avatarNameWithStatus)
})

const isLink = computed(() => props.href != null && props.href !== '')
const isButton = computed(() => !isLink.value && attrs.onClick != null)
const isInteractive = computed(() => isLink.value || isButton.value)
/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)
const isCustomLink = computed(() => isLink.value && customLink.value != null)
const rootTag = computed(() => {
  if (isLink.value)
    return customLink.value == null ? 'a' : toRaw(customLink.value)
  return isButton.value ? 'button' : 'span'
})

const linkRel = computed(() => {
  const parts = new Set((props.rel ?? '').split(/\s+/).filter(Boolean))
  if (props.target === '_blank') {
    parts.add('noopener')
    parts.add('noreferrer')
  }
  return parts.size > 0 ? Array.from(parts).join(' ') : undefined
})

const tooltipText = computed(() => {
  if (props.tooltip === false)
    return undefined
  if (typeof props.tooltip === 'string') {
    const custom = props.tooltip.trim()
    return custom === '' ? undefined : custom
  }
  return meaningfulName.value
})

const a11yProps = computed(() => {
  if (isInteractive.value) {
    return accessibleName.value
      ? { 'aria-label': accessibleName.value }
      : {}
  }
  if (accessibleName.value) {
    return { 'role': 'img' as const, 'aria-label': accessibleName.value }
  }
  return { 'role': 'presentation' as const, 'aria-hidden': 'true' as const }
})

const rootBindings = computed(() => {
  const bindings: Record<string, unknown> = {
    ...a11yProps.value,
    ...attrs,
  }
  if (isLink.value) {
    bindings.href = props.href
    bindings.target = props.target
    bindings.rel = linkRel.value
    if (isCustomLink.value)
      bindings.to = props.href
  }
  if (isButton.value)
    bindings.type = attrs.type ?? 'button'
  if (!isInteractive.value && tooltipText.value != null && bindings.tabindex == null && bindings.tabIndex == null)
    bindings.tabindex = 0
  return bindings
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
  <Tooltip v-if="tooltipText" :content="tooltipText">
    <component
      :is="rootTag"
      class="astryx-avatar"
      :class="[`astryx-avatar--${resolvedShape}`, { 'astryx-avatar--group-item': avatarGroup, 'astryx-avatar--interactive': isInteractive }]"
      :style="[rootStyle, groupStyle]"
      v-bind="rootBindings"
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
    </component>
  </Tooltip>
  <component
    :is="rootTag"
    v-else
    class="astryx-avatar"
    :class="[`astryx-avatar--${resolvedShape}`, { 'astryx-avatar--group-item': avatarGroup, 'astryx-avatar--interactive': isInteractive }]"
    :style="[rootStyle, groupStyle]"
    v-bind="rootBindings"
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
  </component>
</template>
