<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SkeletonProps, SkeletonSizeValue } from './types.js'
import { computed } from 'vue'

import '../../styles/skeleton.css'

defineOptions({
  name: 'Skeleton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SkeletonProps>(), {
  height: '100%',
  index: 0,
  radius: 3,
  width: '100%',
})

interface SkeletonStyle extends CSSProperties {
  animationDelay: string
  height: string
  width: string
}

function formatSize(value: SkeletonSizeValue): string {
  return typeof value === 'number' ? `${value}px` : value
}

const rootStyle = computed<SkeletonStyle>(() => ({
  animationDelay: `${1000 + props.index * 100}ms`,
  height: formatSize(props.height),
  width: formatSize(props.width),
}))
</script>

<template>
  <div
    aria-hidden="true"
    class="astryx-skeleton"
    :data-radius="radius"
    :style="rootStyle"
    v-bind="$attrs"
  />
</template>
