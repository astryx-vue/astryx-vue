<script setup lang="ts">
import type { CommentUser } from './types.js'
import { Text, Tooltip, useTranslator } from '@astryx-vue/core'

defineOptions({ name: 'AstryxCommentResolvedLabel' })

defineProps<{ resolvedBy?: CommentUser }>()

const { t } = useTranslator()
</script>

<template>
  <Tooltip v-if="resolvedBy != null" :content="t('@astryx.comments.resolvedBy', { name: resolvedBy.name })">
    <Text type="body" color="secondary" class="astryx-comment-nowrap" data-comment-resolved-label="true">
      {{ t('@astryx.comments.resolved') }}
    </Text>
  </Tooltip>
  <Text
    v-else
    type="body"
    color="secondary"
    class="astryx-comment-nowrap"
    data-comment-resolved-label="true"
  >
    {{ t('@astryx.comments.resolved') }}
  </Text>
</template>
