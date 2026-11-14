<script setup lang="ts">
import { VStack } from '@astryx-vue/core'
import { RESOLVED_TEXT_STYLE } from './commentLayout.js'

defineOptions({ name: 'AstryxCommentClampedBody' })

defineProps<{
  isExpanded: boolean
  isMuted: boolean
}>()
</script>

<template>
  <VStack
    width="100%"
    class="astryx-comment-body-clamped"
    :data-comment-body-clamp="isExpanded ? 'expanded' : '3'"
    :style="isMuted ? RESOLVED_TEXT_STYLE : undefined"
  >
    <slot />
  </VStack>
</template>
