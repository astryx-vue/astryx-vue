<script setup lang="ts">
import type { BlockquoteProps } from './types.js'
import { computed } from 'vue'
import '../../styles/blockquote.css'

defineOptions({
  name: 'AstryxBlockquote',
})

const props = defineProps<BlockquoteProps>()

const slots = defineSlots<{
  cite?: () => unknown
  default: () => unknown
}>()

/**
 * 空字符串和缺省都不渲染出处。
 * 引用本身是分段根，里面再套 footer 会被读屏当成整个页面的页脚。
 */
const showCite = computed(() => slots.cite != null || (props.cite != null && props.cite !== ''))
</script>

<template>
  <blockquote class="astryx-blockquote">
    <slot />
    <cite v-if="showCite" class="astryx-blockquote__cite">
      <slot name="cite">
        {{ cite }}
      </slot>
    </cite>
  </blockquote>
</template>
