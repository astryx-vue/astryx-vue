<script setup lang="ts">
import type { CommentAnchor, CommentHighlightColor } from './types.js'
import { Badge, HStack, StackItem, useTranslator } from '@astryx-vue/core'
import { RESOLVED_TEXT_STYLE } from './commentLayout.js'
import QuotedPassage from './QuotedPassage.vue'

defineOptions({ name: 'AstryxCommentAnchorQuote' })

defineProps<{
  anchor: CommentAnchor
  highlightColor: CommentHighlightColor
  isResolved: boolean
}>()

const { t } = useTranslator()
</script>

<template>
  <HStack
    :gap="2"
    align="center"
    width="100%"
    class="astryx-comment-anchor-quote"
    :style="isResolved ? RESOLVED_TEXT_STYLE : undefined"
    :data-comment-anchor="anchor.status === 'orphaned' ? 'orphaned' : 'anchored'"
  >
    <StackItem :size="anchor.status === 'orphaned' ? undefined : 'fill'">
      <QuotedPassage
        :quote="anchor.quote"
        :highlight-color="anchor.status !== 'orphaned' && !isResolved ? highlightColor : undefined"
      />
    </StackItem>
    <StackItem v-if="anchor.status === 'orphaned'" size="static">
      <Badge variant="neutral" :label="t('@astryx.comments.outdated')" />
    </StackItem>
  </HStack>
</template>
