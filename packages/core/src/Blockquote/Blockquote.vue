<script setup lang="ts">
import type { BlockquoteProps } from './types.js'
import '../../styles/blockquote.css'

defineOptions({
  name: 'AstryxBlockquote',
})

defineProps<BlockquoteProps>()

defineSlots<{
  cite?: () => unknown
  default: () => unknown
}>()
</script>

<template>
  <blockquote class="astryx-blockquote">
    <slot />
    <footer v-if="$slots.cite || cite != null">
      <cite class="astryx-blockquote__cite">
        <slot name="cite">
          {{ cite }}
        </slot>
      </cite>
    </footer>
  </blockquote>
</template>
