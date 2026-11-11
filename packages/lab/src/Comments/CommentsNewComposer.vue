<script setup lang="ts">
import type { ChatComposerTrigger } from '@astryx-vue/core'
import type { VNode } from 'vue'
import type {
  CommentAgentCommand,
  CommentAnchor,
  CommentComposerContext,
  CommentComposerRenderProps,
  CommentHighlightColor,
  CommentUploadedImage,
} from './types.js'
import CommentComposerBase from './CommentComposerBase.vue'

defineOptions({ name: 'AstryxCommentsNewComposer' })

defineProps<{
  context: CommentComposerContext
  anchor?: CommentAnchor
  hasAnchorDismiss: boolean
  focusKey?: string
  value: string
  placeholder: string
  isSubmitting: boolean
  error?: string
  hasRetry: boolean
  highlightColor: CommentHighlightColor
  triggers: readonly ChatComposerTrigger[]
  agentCommands: readonly CommentAgentCommand[]
  hasEmojiPicker: boolean
  onUploadImages?: (files: readonly File[]) => readonly CommentUploadedImage[] | Promise<readonly CommentUploadedImage[]>
  renderComposer?: (props: CommentComposerRenderProps) => VNode
  composerControls?: VNode
}>()

const emit = defineEmits<{
  change: [value: string]
  submit: [value: string]
  retry: []
  anchorDismiss: []
  actionPendingChange: [isPending: boolean]
}>()

defineSlots<{
  composer?: (props: CommentComposerRenderProps) => VNode[]
  composerControls?: () => VNode[]
}>()
</script>

<template>
  <CommentComposerBase
    :context="context"
    :anchor="anchor"
    :has-anchor-dismiss="hasAnchorDismiss"
    :focus-key="focusKey"
    :value="value"
    :placeholder="placeholder"
    :is-submitting="isSubmitting"
    :error="error"
    :has-retry="hasRetry"
    :highlight-color="highlightColor"
    :triggers="triggers"
    :agent-commands="agentCommands"
    :has-emoji-picker="hasEmojiPicker"
    :on-upload-images="onUploadImages"
    :render-composer="renderComposer"
    @change="emit('change', $event)"
    @submit="emit('submit', $event)"
    @retry="emit('retry')"
    @anchor-dismiss="emit('anchorDismiss')"
    @action-pending-change="emit('actionPendingChange', $event)"
  >
    <template v-if="$slots.composer" #composer="slotProps">
      <slot name="composer" v-bind="slotProps" />
    </template>
    <template v-if="composerControls != null || $slots.composerControls" #controls>
      <component :is="() => composerControls" v-if="composerControls != null" />
      <slot name="composerControls" />
    </template>
  </CommentComposerBase>
</template>
