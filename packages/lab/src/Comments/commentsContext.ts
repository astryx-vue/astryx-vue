import type { ChatComposerTrigger, MarkdownInlinePlugin, MarkdownPlugin } from '@astryx-vue/core'
import type { InjectionKey } from 'vue'
import type {
  CommentAgentCommand,
  CommentComposerContext,
  CommentComposerRenderProps,
  CommentData,
  CommentHighlightColor,
  CommentImageUploader,
  CommentMode,
  CommentReactionOption,
  CommentThreadData,
  CommentUser,
  CommentVersion,
} from './types.js'
import type { AnyComment } from './utils.js'
import { inject } from 'vue'

export interface ReplyTarget {
  parentId: string
  comment: AnyComment
  focusRequestId?: number
  seed?: string
}

export interface EditTarget { comment: AnyComment, value: string }

export interface ActionFailure {
  message: string
  retry?: () => void
  isAnnounced?: boolean
}

export interface CommentsContextValue {
  currentUser?: CommentUser
  mode: CommentMode
  container: 'section' | 'card'
  composerPlaceholder: string | undefined
  reactionOptions: readonly CommentReactionOption[]
  highlightColor: CommentHighlightColor
  agentCommands: readonly CommentAgentCommand[]
  composerTriggers?: readonly ChatComposerTrigger[]
  markdownPlugins?: readonly MarkdownPlugin[]
  markdownInlinePlugins?: readonly MarkdownInlinePlugin[]
  hasEmojiPicker: boolean
  onUploadImages?: CommentImageUploader
  renderAnchor?: (comment: CommentThreadData, defaultAnchor: import('vue').VNode) => import('vue').VNode
  renderBody?: (comment: CommentData) => import('vue').VNode
  renderAdditionalActions?: (comment: CommentData) => import('vue').VNode
  renderComposer?: (props: CommentComposerRenderProps) => import('vue').VNode
  renderVersionBody?: (version: CommentVersion) => import('vue').VNode
  can: {
    submit: boolean
    saveEdit: boolean
    delete: boolean
    react: boolean
    retry: boolean
    loadVersions: boolean
    resolve: boolean
    reopen: boolean
  }
  selectedThreadId: string | null
  replyTarget: ReplyTarget | null
  replyDraft: string
  replyError?: string
  editTarget: EditTarget | null
  pendingActionIds: ReadonlySet<string>
  actionErrors: Readonly<Record<string, ActionFailure>>
  isSubmitting: boolean
  isComposerActionPending: boolean
  selectThread: (threadId: string | null) => void
  startReply: (parentId: string, target: AnyComment, options?: { focus?: boolean }) => void
  changeReplyDraft: (value: string) => void
  submitReply: (parentId: string, value: string) => void
  cancelReply: (restoreFocus?: boolean) => void
  startEdit: (comment: AnyComment) => void
  changeEdit: (comment: AnyComment, value: string) => void
  saveEdit: (comment: AnyComment, value: string) => void
  cancelEdit: (restoreFocus?: boolean) => void
  react: (comment: AnyComment, key: string, option?: CommentReactionOption) => void
  resolve: (comment: AnyComment) => void
  reopen: (comment: AnyComment) => void
  retry: (comment: AnyComment) => void
  requestDelete: (comment: AnyComment) => void
  openHistory: (comment: AnyComment) => void
  composerActionPendingChange: (isPending: boolean) => void
}

export const commentsContextKey: InjectionKey<CommentsContextValue> = Symbol('astryx-comments')

export function useCommentsContext(): CommentsContextValue {
  const context = inject(commentsContextKey, null)
  if (context == null) {
    throw new Error('Comment rows render inside a Comments panel or a CommentThread.')
  }
  return context
}

export function replyComposerContext(target: ReplyTarget): Extract<CommentComposerContext, { kind: 'reply' }> {
  return {
    kind: 'reply' as const,
    parentCommentId: target.parentId,
    repliedToCommentId: target.comment.id,
  }
}

export function editComposerContext(comment: AnyComment): Extract<CommentComposerContext, { kind: 'edit' }> {
  return { kind: 'edit' as const, commentId: comment.id }
}
