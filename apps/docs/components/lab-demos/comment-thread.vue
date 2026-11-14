<script setup lang="ts">
import type { CommentThreadData, CommentUser } from '@astryx-vue/lab'
import { Card } from '@astryx-vue/core'
import { CommentThread } from '@astryx-vue/lab'
import { ref } from 'vue'

const VIEWER: CommentUser = { id: 'avery', name: 'Avery Kim' }

const thread = ref<CommentThreadData>({
  id: 'margin',
  author: { id: 'maya', name: 'Maya Chen' },
  body: 'Should this say three days? The dry run adds one.',
  createdAt: '2026-09-30T19:00:00Z',
  anchor: { quote: 'The final cohort completes rollout in two days.' },
  replies: [
    {
      id: 'margin-reply',
      author: VIEWER,
      body: 'Good catch, updating it.',
      createdAt: '2026-09-30T19:20:00Z',
    },
  ],
})

function postReply(body: string) {
  thread.value = {
    ...thread.value,
    replies: [
      ...(thread.value.replies ?? []),
      {
        id: `reply-${Date.now()}`,
        author: VIEWER,
        body,
        createdAt: new Date().toISOString(),
      },
    ],
  }
}
</script>

<template>
  <Card :padding="0" width="100%" :max-width="340">
    <CommentThread
      :comment="thread"
      :current-user="VIEWER"
      container="card"
      :on-submit="(body) => postReply(body)"
      :on-resolve-thread="() => { thread = { ...thread, isResolved: true } }"
      :on-reopen-thread="() => { thread = { ...thread, isResolved: false } }"
    />
  </Card>
</template>
