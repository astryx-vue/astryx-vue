<script setup lang="ts">
import type { AvatarStatusDotProps, AvatarStatusDotSlots, AvatarStatusDotVariantName } from './types.js'
import { computed, inject, onUnmounted, useSlots, watch } from 'vue'

import { AvatarSizeContext, AvatarStatusLabelContext } from './context.js'
import { resolveStatusDotMetrics, resolveStatusDotVariant } from './utils.js'
import '../../styles/avatar.css'

defineOptions({ name: 'AstryxAvatarStatusDot' })

const props = withDefaults(defineProps<AvatarStatusDotProps>(), {
  variant: 'success',
})

defineSlots<AvatarStatusDotSlots>()

const slots = useSlots()

/** 头像没给尺寸时按默认的 `md`（36px）算，单独放着用也是这个尺寸。 */
const avatarSize = inject(AvatarSizeContext, null)
const statusLabel = inject(AvatarStatusLabelContext, null)

/**
 * 把状态名字交给外层头像，由它拼进自己的无障碍名称（`Jane Doe, Online`）。
 * 头像根元素是 `role="img"`，子节点语义会被剪掉，只有拼进名字这一条路。
 */
if (statusLabel) {
  watch(() => props.label, (label) => {
    statusLabel.value = label
  }, { immediate: true })
  onUnmounted(() => {
    statusLabel.value = undefined
  })
}

const resolvedVariant = computed<AvatarStatusDotVariantName>(() => resolveStatusDotVariant(props.variant))

const metrics = computed(() => resolveStatusDotMetrics(avatarSize?.value ?? 36))

const hasIcon = computed(() => slots.icon != null)
/** 最小一档放不下图标，此时退回自带形状，状态仍然不只靠颜色区分。 */
const showIcon = computed(() => hasIcon.value && metrics.value.iconSize > 0)

const glyphShape = computed<'ring' | 'minus' | undefined>(() => {
  if (showIcon.value) {
    return undefined
  }
  switch (resolvedVariant.value) {
    case 'neutral':
      return 'ring'
    case 'error':
      return 'minus'
    default:
      return undefined
  }
})

/** 减号两端往里收一点，圆头的帽才能落在净空里而不是压在边上。 */
const MINUS_BAR_SPAN = 0.75

/** 自带形状在净空里怎么画：环形用圆心和半径，减号用两端和中间高度。 */
interface DotGlyph {
  shape: 'ring' | 'minus'
  field: number
  stroke: number
  center: number
  radius: number
  x1: number
  x2: number
  y: number
}

const glyph = computed<DotGlyph | undefined>(() => {
  const shape = glyphShape.value
  if (shape == null) {
    return undefined
  }
  const { field, stroke } = metrics.value
  const center = field / 2
  return {
    shape,
    field,
    stroke,
    center,
    // 半径量到描边中线，环的外沿正好落在净空边界上，不会压到边框。
    radius: (field - stroke) / 2,
    x1: field * (1 - MINUS_BAR_SPAN) / 2 + stroke / 2,
    x2: field * (1 + MINUS_BAR_SPAN) / 2 - stroke / 2,
    y: center,
  }
})

/**
 * 尺寸走内联的 `--astryx-avatar-status-dot-computed-*`，CSS 里再用公开的
 * `--astryx-avatar-status-dot-size` 盖在上面，这样主题还能改大小。
 */
const rootStyle = computed(() => ({
  '--astryx-avatar-status-dot-computed-size': `${metrics.value.size}px`,
  '--astryx-avatar-status-dot-computed-border-width': `${metrics.value.borderWidth}px`,
}))
</script>

<template>
  <span
    class="astryx-avatar-status-dot"
    :data-variant="resolvedVariant"
    :style="rootStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <span
      v-if="showIcon"
      class="astryx-avatar-status-dot__icon"
      aria-hidden="true"
      :style="{
        width: `${metrics.iconSize}px`,
        height: `${metrics.iconSize}px`,
        fontSize: `${metrics.iconSize}px`,
      }"
    >
      <slot name="icon" />
    </span>
    <svg
      v-else-if="glyph"
      class="astryx-avatar-status-dot__glyph"
      :data-shape="glyph.shape"
      aria-hidden="true"
      :viewBox="`0 0 ${glyph.field} ${glyph.field}`"
      :width="glyph.field"
      :height="glyph.field"
      fill="none"
    >
      <circle
        v-if="glyph.shape === 'ring'"
        :cx="glyph.center"
        :cy="glyph.center"
        :r="glyph.radius"
        fill="none"
        stroke="currentColor"
        :stroke-width="glyph.stroke"
      />
      <line
        v-else
        :x1="glyph.x1"
        :y1="glyph.y"
        :x2="glyph.x2"
        :y2="glyph.y"
        stroke="currentColor"
        :stroke-width="glyph.stroke"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>
