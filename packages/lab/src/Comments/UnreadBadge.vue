<script setup lang="ts">
import { Badge, HStack, useTranslator } from '@astryx-vue/core'
import { ref } from 'vue'

defineOptions({ name: 'AstryxCommentUnreadBadge' })

const { t } = useTranslator()
const hasFaded = ref(false)

function onAnimationEnd(event: AnimationEvent): void {
  if (event.target === event.currentTarget)
    hasFaded.value = true
}
</script>

<template>
  <HStack
    v-if="!hasFaded"
    align="center"
    class="astryx-comment-unread-badge"
    data-comment-unread-badge="true"
    @animationend="onAnimationEnd"
  >
    <Badge variant="info" :label="t('@astryx.comments.unread')" />
  </HStack>
</template>
