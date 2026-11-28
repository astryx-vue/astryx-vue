<script setup lang="ts">
import type { CommentUser } from './types.js'
import { commentsMessages, Text, Tooltip, useComponentMessages } from '@astryx-vue/core'

defineOptions({ name: 'AstryxCommentResolvedLabel' })

defineProps<{ resolvedBy?: CommentUser }>()

const messages = useComponentMessages({ comments: commentsMessages })
</script>

<template>
  <Tooltip v-if="resolvedBy != null" :content="messages.comments.resolvedBy(resolvedBy.name)">
    <Text type="body" color="secondary" class="astryx-comment-nowrap" data-comment-resolved-label="true">
      {{ messages.comments.resolved }}
    </Text>
  </Tooltip>
  <Text
    v-else
    type="body"
    color="secondary"
    class="astryx-comment-nowrap"
    data-comment-resolved-label="true"
  >
    {{ messages.comments.resolved }}
  </Text>
</template>
