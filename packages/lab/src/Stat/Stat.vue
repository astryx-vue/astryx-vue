<script setup lang="ts">
import type { StatDeltaSentiment, StatProps } from './types.js'
import { computed, useAttrs } from 'vue'
import { DELTA_GLYPH_PATHS, DIRECTION_SENTIMENT, DIRECTION_TEXT } from './types.js'
import '../../styles/stat.css'

defineOptions({ name: 'AstryxStat', inheritAttrs: false })

const props = withDefaults(defineProps<StatProps>(), {
  value: undefined,
  delta: undefined,
  description: undefined,
  size: 'md',
})

const attrs = useAttrs()

// 颜色跟着方向走（上升=成功、下降=错误、持平=次要文字），delta.sentiment 可以覆盖，
// 用于「降了是好事」这类反向指标。
const sentiment = computed<StatDeltaSentiment | null>(() => {
  if (props.delta == null)
    return null
  return props.delta.sentiment ?? DIRECTION_SENTIMENT[props.delta.direction]
})
</script>

<template>
  <div v-bind="attrs" class="astryx-stat" :class="attrs.class" :data-size="size">
    <span class="astryx-stat__label">{{ label }}</span>
    <span class="astryx-stat__value-row">
      <span class="astryx-stat__value"><slot>{{ value }}</slot></span>
      <span v-if="delta != null && sentiment != null" class="astryx-stat__delta" :data-sentiment="sentiment">
        <svg
          class="astryx-stat__delta-glyph" aria-hidden="true" viewBox="0 0 12 12" width="12" height="12"
          fill="none" stroke="currentColor" :stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
        >
          <path :d="DELTA_GLYPH_PATHS[delta.direction]" />
        </svg>
        {{ delta.value }}
        <span class="astryx-stat__sr-only">({{ DIRECTION_TEXT[delta.direction] }})</span>
      </span>
    </span>
    <span v-if="description != null" class="astryx-stat__description">{{ description }}</span>
    <div v-if="$slots.media" class="astryx-stat__media">
      <slot name="media" />
    </div>
  </div>
</template>
