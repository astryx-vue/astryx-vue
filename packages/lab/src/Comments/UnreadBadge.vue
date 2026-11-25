<script setup lang="ts">
import { Badge, commentsMessages, HStack, useComponentMessages } from '@astryx-vue/core'
import { ref } from 'vue'

defineOptions({ name: 'AstryxCommentUnreadBadge' })

const messages = useComponentMessages({ comments: commentsMessages })
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
    <Badge variant="info" :label="messages.comments.unread" />
  </HStack>
</template>
