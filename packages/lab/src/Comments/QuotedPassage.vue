<script setup lang="ts">
import type { CommentHighlightColor } from './types.js'
import { Blockquote, Text } from '@astryx-vue/core'

defineOptions({ name: 'AstryxCommentQuotedPassage' })

defineProps<{
  quote: string
  highlightColor?: CommentHighlightColor
}>()
</script>

<template>
  <Blockquote
    class="astryx-quoted-passage"
    :data-quote-rule="highlightColor != null ? 'highlight' : 'neutral'"
    :data-highlight-color="highlightColor"
  >
    <Text type="body" color="inherit" :max-lines="2" class="astryx-quoted-passage__text">
      {{ quote }}
    </Text>
  </Blockquote>
</template>
