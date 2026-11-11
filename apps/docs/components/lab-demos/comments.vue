<script setup lang="ts">
import type { CommentActivityEvent, CommentData, CommentThreadData, CommentUser } from '@astryx-vue/lab'
import { Comments } from '@astryx-vue/lab'
import { ref } from 'vue'

const VIEWER: CommentUser = { id: 'avery', name: 'Avery Kim' }
const MAYA: CommentUser = { id: 'maya', name: 'Maya Chen' }
const NOAH: CommentUser = { id: 'noah', name: 'Noah Williams' }
const ASSISTANT: CommentUser = { id: 'release-assistant', name: 'Release Assistant', kind: 'agent' }

const EVENTS: readonly CommentActivityEvent[] = [
  {
    id: 'checklist',
    label: 'Rollout checklist attached',
    description: 'Added the launch checklist to the discussion.',
    createdAt: '2026-09-30T18:46:00Z',
    actor: MAYA,
  },
  {
    id: 'status',
    label: 'Status changed to Ready for review',
    createdAt: '2026-09-30T19:02:00Z',
  },
]

const comments = ref<CommentThreadData[]>([
  {
    id: 'plan',
    author: MAYA,
    body: 'The revised rollout plan is ready. **Avery**, could you check the final cohort?',
    createdAt: '2026-09-30T18:30:00Z',
    isEdited: true,
    isUnread: true,
    typingUsers: [NOAH],
    previousVersions: [
      {
        id: 'plan-v1',
        body: 'The revised rollout plan is ready for review.',
        editedAt: '2026-09-30T18:10:00Z',
        author: MAYA,
      },
    ],
    reactions: [
      {
        key: 'like',
        label: '👍',
        description: 'Like',
        count: 2,
        reactedByViewer: true,
        actors: [VIEWER, NOAH],
      },
    ],
    replies: [
      {
        id: 'plan-reply-1',
        author: NOAH,
        body: 'I checked the cohort and the guardrail query. Both look good.',
        createdAt: '2026-09-30T18:42:00Z',
      },
      {
        id: 'plan-reply-2',
        author: ASSISTANT,
        body: '',
        createdAt: '2026-09-30T18:45:00Z',
        progress: { label: 'Checking the rollout dependencies…' },
      },
    ],
  },
  {
    id: 'inline',
    author: NOAH,
    body: 'Should this say three days? The dry run adds one.',
    createdAt: '2026-09-30T18:52:00Z',
    anchor: { quote: 'The final cohort completes rollout in two days.' },
    replies: [
      {
        id: 'inline-reply-1',
        author: MAYA,
        body: 'Yes — I updated the rollout window to three days.',
        createdAt: '2026-09-30T19:04:00Z',
        isUnread: true,
      },
    ],
  },
  {
    id: 'orphaned',
    author: MAYA,
    body: 'Typo: "Teh".',
    createdAt: '2026-09-30T18:55:00Z',
    anchor: { quote: 'Teh guardrail query runs hourly.', status: 'orphaned' },
    isResolved: true,
    resolvedBy: VIEWER,
  },
  {
    id: 'failed',
    author: VIEWER,
    body: 'Posting this update failed, but the text is kept.',
    createdAt: '2026-09-30T19:10:00Z',
    status: 'error',
    errorMessage: 'Couldn\'t post this comment.',
  },
])

const selectedThreadId = ref<string | null>('plan')
const hasOlderComments = ref(true)
let nextId = 1

function updateComment(
  list: CommentThreadData[],
  id: string,
  update: (comment: CommentData) => CommentData,
): CommentThreadData[] {
  return list.map((comment) => {
    if (comment.id === id)
      return { ...comment, ...update(comment) }
    return {
      ...comment,
      replies: comment.replies?.map(reply => reply.id === id ? update(reply) : reply),
    }
  })
}

function post(body: string, parentCommentId?: string) {
  const comment = { id: `demo-${nextId++}`, author: VIEWER, body, createdAt: new Date().toISOString() }
  comments.value = parentCommentId == null
    ? [...comments.value, comment]
    : comments.value.map(root =>
        root.id === parentCommentId ? { ...root, replies: [...(root.replies ?? []), comment] } : root,
      )
}

function saveEdit(commentId: string, body: string) {
  comments.value = updateComment(comments.value, commentId, comment => ({
    ...comment,
    body,
    isEdited: true,
    previousVersions: [
      { id: `${comment.id}-${Date.now()}`, body: comment.body, editedAt: new Date().toISOString(), author: comment.author },
      ...(comment.previousVersions ?? []),
    ],
  }))
}

function remove(commentId: string) {
  comments.value = comments.value
    .filter(comment => comment.id !== commentId)
    .map(comment => ({ ...comment, replies: comment.replies?.filter(reply => reply.id !== commentId) }))
}

function react(commentId: string, reactionKey: string) {
  comments.value = updateComment(comments.value, commentId, (comment) => {
    const current = comment.reactions ?? []
    const existing = current.find(reaction => reaction.key === reactionKey)
    if (existing == null) {
      return {
        ...comment,
        reactions: [...current, { key: reactionKey, label: '👍', count: 1, reactedByViewer: true, actors: [VIEWER] }],
      }
    }
    const reacted = !existing.reactedByViewer
    return {
      ...comment,
      reactions: current.map(reaction => reaction.key === reactionKey
        ? {
            ...reaction,
            reactedByViewer: reacted,
            count: reacted ? reaction.count + 1 : Math.max(0, reaction.count - 1),
            actors: reacted ? [...(reaction.actors ?? []), VIEWER] : (reaction.actors ?? []).filter(actor => actor.id !== VIEWER.id),
          }
        : reaction),
    }
  })
}

async function loadOlder() {
  await new Promise(resolve => setTimeout(resolve, 400))
  comments.value = [
    {
      id: 'earlier',
      author: NOAH,
      body: 'Sharing the first draft of the rollout notes.',
      createdAt: '2026-09-30T17:50:00Z',
    },
    ...comments.value,
  ]
  hasOlderComments.value = false
}

function uploadImages(files: readonly File[]): { url: string, alt: string }[] {
  return files.map(file => ({ url: URL.createObjectURL(file), alt: file.name }))
}
</script>

<template>
  <div class="lab-comments-demo">
    <Comments
      :comments="comments"
      :events="EVENTS"
      :current-user="VIEWER"
      :selected-thread-id="selectedThreadId"
      :has-older-comments="hasOlderComments"
      :on-submit="post"
      :on-save-edit="saveEdit"
      :on-delete="remove"
      :on-react="react"
      :on-resolve-thread="(id) => { comments = updateComment(comments, id, comment => ({ ...comment, isResolved: true, resolvedBy: VIEWER })) }"
      :on-reopen-thread="(id) => { comments = updateComment(comments, id, comment => ({ ...comment, isResolved: false, resolvedBy: undefined })) }"
      :on-retry-comment="(id) => { comments = updateComment(comments, id, comment => ({ ...comment, status: undefined, errorMessage: undefined })) }"
      :on-load-older="loadOlder"
      :on-upload-images="uploadImages"
      @selected-thread-change="selectedThreadId = $event"
    />
  </div>
</template>

<style scoped>
.lab-comments-demo {
  width: 100%;
  max-width: 920px;
  height: 640px;
  min-height: 640px;
  border: 1px solid var(--astryx-color-border-secondary, var(--vp-c-divider));
  border-radius: var(--astryx-radius-container, 12px);
  overflow: hidden;
  background: var(--astryx-color-background-primary, var(--vp-c-bg));
}
</style>
