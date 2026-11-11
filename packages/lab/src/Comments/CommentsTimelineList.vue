<script setup lang="ts">
import type { SpacingStep } from '@astryx-vue/core'
import type { VNode } from 'vue'
import type { CommentsTimelineEntry } from './commentsTimeline.js'
import type { CommentActivityEvent, CommentsLayout } from './types.js'
import { Button, useTranslator, VStack } from '@astryx-vue/core'
import ActivityEventRow from './ActivityEventRow.vue'
import CommentRow from './CommentRow.vue'
import { commentsDividersAt } from './commentsTimeline.js'
import ErrorBanner from './ErrorBanner.vue'

defineOptions({ name: 'AstryxCommentsTimelineList' })

defineProps<{
  entries: readonly CommentsTimelineEntry[]
  hasOlderComments: boolean
  olderError?: string
  olderFailureCount: number
  isLoadingOlder: boolean
  width?: string
  gap: SpacingStep
  timelineClass: string | (string | undefined)[]
  layout: CommentsLayout
  container: 'section' | 'card'
  renderEvent?: (event: CommentActivityEvent) => VNode
  canLoadOlder: boolean
}>()

const emit = defineEmits<{
  loadOlder: []
  loadOlderRef: [el: unknown]
  olderRetryRef: [el: unknown]
}>()

const { t } = useTranslator()
</script>

<template>
  <VStack :width="width" :gap="gap" :class="timelineClass">
    <VStack v-if="hasOlderComments" :gap="1" align="center" width="100%">
      <ErrorBanner
        v-if="olderError != null"
        :key="olderFailureCount"
        :action-ref="(el) => emit('olderRetryRef', el)"
        :content="{
          title: olderError,
          actionLabel: t('@astryx.comments.retry'),
          onAction: () => emit('loadOlder'),
        }"
        data-comments-older-error="banner"
      />
      <Button
        v-else
        :ref="(el) => emit('loadOlderRef', el)"
        :label="t('@astryx.comments.loadOlder')"
        variant="ghost"
        size="sm"
        :is-loading="isLoadingOlder"
        :is-disabled="!canLoadOlder"
        @click="emit('loadOlder')"
      />
    </VStack>
    <template v-for="(entry, index) in entries" :key="`${entry.kind}-${entry.value.id}`">
      <ActivityEventRow
        v-if="entry.kind === 'event'"
        :event="entry.value"
        :render-event="renderEvent"
      />
      <CommentRow
        v-else
        :comment="entry.value"
        :depth="0"
        :thread-id="entry.value.id"
        :dividers="commentsDividersAt(index, entries.length, hasOlderComments, layout, container)"
      />
    </template>
  </VStack>
</template>
