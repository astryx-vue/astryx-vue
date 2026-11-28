<script setup lang="ts">
import type { VNode } from 'vue'
import type { HistoryState } from './HistoryDialog.vue'
import type { CommentVersion } from './types.js'
import type { AnyComment } from './utils.js'
import { AlertDialog, commentsMessages, useComponentMessages } from '@astryx-vue/core'
import HistoryDialog from './HistoryDialog.vue'

defineOptions({ name: 'AstryxCommentDialogs' })

defineProps<{
  deleteTarget: AnyComment | null
  deleteError?: string
  isDeletePending: boolean
  history: HistoryState | null
  renderVersionBody: (version: CommentVersion) => VNode
}>()

const emit = defineEmits<{
  confirmDelete: []
  closeDelete: []
  closeHistory: []
}>()

const messages = useComponentMessages({ comments: commentsMessages })

function onDeleteOpenChange(open: boolean): void {
  if (!open)
    emit('closeDelete')
}
</script>

<template>
  <AlertDialog
    v-if="deleteTarget != null"
    :is-open="true"
    :title="messages.comments.deleteTitle"
    :description="deleteError ?? messages.comments.deleteDescription(deleteTarget.author.name)"
    :action-label="messages.comments.delete"
    :is-action-loading="isDeletePending"
    @open-change="onDeleteOpenChange"
    @action="emit('confirmDelete')"
  />
  <HistoryDialog
    :history="history"
    :render-version-body="renderVersionBody"
    @close="emit('closeHistory')"
  />
</template>
