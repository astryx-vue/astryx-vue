import type { AnnounceFn } from '@astryx-vue/core'
import type { Ref } from 'vue'
import type {
  ActionFailure,
  CommentsContextValue,
  EditTarget,
  ReplyTarget,
} from './commentsContext.js'
import type { HistoryState } from './HistoryDialog.vue'
import type { CommentThreadData, CommentThreadSharedProps } from './types.js'
import type { AnyComment } from './utils.js'
import { useAnnounce, useTranslator } from '@astryx-vue/core'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { bindLatestRef } from './bindLatestRef.js'
import { commentMoreMenuTrigger, visibleCommentAction } from './commentActionLookup.js'
import { editComposerContext, replyComposerContext } from './commentsContext.js'
import { DEFAULT_COMMENT_REACTIONS } from './types.js'
import { commentAnchorId, replyComposerId, shouldRestoreFocusFrom } from './utils.js'

export interface CommentsControllerOptions extends CommentThreadSharedProps {
  selectedThreadId?: string | null
  onSelectedThreadChange?: (threadId: string | null) => void
  roots: Ref<readonly CommentThreadData[]>
  rootRef: Ref<HTMLElement | null>
}

type FocusTarget = 'reply' | 'actions' | 'history' | 'article' | 'thread'
type MaybePromise = void | Promise<void>
type SubmitResult = 'posted' | 'failed' | 'skipped'

function focusCommentTarget(
  commentId: string | null,
  target: FocusTarget,
  rootRef: Ref<HTMLElement | null>,
): void {
  if (target === 'thread' || commentId == null) {
    rootRef.value?.focus()
    return
  }
  const article = document.getElementById(commentAnchorId(commentId))
  const next = target === 'reply'
    ? (visibleCommentAction(article, 'reply') ?? commentMoreMenuTrigger(article))
    : target === 'actions'
      ? commentMoreMenuTrigger(article)
      : target === 'history'
        ? article?.querySelector<HTMLElement>('[data-metadata-action="history"]')
        : article
  ;(next ?? article ?? rootRef.value)?.focus()
}

function commitAndFocus(
  update: () => void,
  commentId: string | null,
  target: FocusTarget,
  rootRef: Ref<HTMLElement | null>,
): void {
  update()
  void nextTick(() => focusCommentTarget(commentId, target, rootRef))
}

export interface CommentsControllerReturn {
  value: CommentsContextValue
  deleteTarget: Ref<AnyComment | null>
  deleteError: Ref<string | undefined>
  history: Ref<HistoryState | null>
  confirmDelete: () => void
  closeDelete: () => void
  closeHistory: () => void
  announce: AnnounceFn
}

export function useCommentsController(options: CommentsControllerOptions): CommentsControllerReturn {
  const {
    roots,
    rootRef,
  } = options
  const announce = useAnnounce()
  const { t } = useTranslator()

  const uncontrolledSelectedThreadId = ref<string | null>(null)
  const isSelectionControlled = computed(() => options.selectedThreadId !== undefined)
  const selectedThreadId = computed(() =>
    isSelectionControlled.value ? (options.selectedThreadId ?? null) : uncontrolledSelectedThreadId.value,
  )
  const viewerSelectionRef = ref<string | null>(selectedThreadId.value)
  const replyTarget = ref<ReplyTarget | null>(null)
  const replyDraft = ref('')
  const replyError = ref<string>()
  const editTarget = ref<EditTarget | null>(null)
  const pendingActionIds = ref<ReadonlySet<string>>(new Set())
  const localSubmitPending = ref(false)
  const pendingComposerActionCount = ref(0)
  const actionErrors = ref<Record<string, ActionFailure>>({})
  const deleteTarget = ref<AnyComment | null>(null)
  const deleteError = ref<string>()
  const history = ref<HistoryState | null>(null)
  const replyFocusRequestRef = ref(0)

  const onComposerDraftChangeRef = ref(options.onComposerDraftChange)
  const onSubmitRef = ref(options.onSubmit)
  const onSaveEditRef = ref(options.onSaveEdit)
  const onDeleteRef = ref(options.onDelete)
  const onReactRef = ref(options.onReact)
  const onRetryCommentRef = ref(options.onRetryComment)
  const onResolveThreadRef = ref(options.onResolveThread)
  const onReopenThreadRef = ref(options.onReopenThread)
  const loadVersionsRef = ref(options.loadVersions)
  const onSelectedThreadChangeRef = ref(options.onSelectedThreadChange)
  const getReplyMentionRef = ref(options.getReplyMention)

  bindLatestRef(() => options.onComposerDraftChange, onComposerDraftChangeRef)
  bindLatestRef(() => options.onSubmit, onSubmitRef)
  bindLatestRef(() => options.onSaveEdit, onSaveEditRef)
  bindLatestRef(() => options.onDelete, onDeleteRef)
  bindLatestRef(() => options.onReact, onReactRef)
  bindLatestRef(() => options.onRetryComment, onRetryCommentRef)
  bindLatestRef(() => options.onResolveThread, onResolveThreadRef)
  bindLatestRef(() => options.onReopenThread, onReopenThreadRef)
  bindLatestRef(() => options.loadVersions, loadVersionsRef)
  bindLatestRef(() => options.onSelectedThreadChange, onSelectedThreadChangeRef)
  bindLatestRef(() => options.getReplyMention, getReplyMentionRef)

  const reportDraftChange = (value: string, context: Parameters<NonNullable<typeof options.onComposerDraftChange>>[1]): void => {
    onComposerDraftChangeRef.value?.(value, context)
  }

  const clearReplyDraft = (target: ReplyTarget | null = replyTarget.value): void => {
    if (target != null)
      reportDraftChange('', replyComposerContext(target))
    replyTarget.value = null
    replyDraft.value = ''
    replyError.value = undefined
  }

  const clearEditDraft = (target: EditTarget | null = editTarget.value): void => {
    if (target != null)
      reportDraftChange('', editComposerContext(target.comment))
    editTarget.value = null
  }

  const setSelectedThreadId = (threadId: string | null): void => {
    const previous = selectedThreadId.value
    viewerSelectionRef.value = threadId
    if (!isSelectionControlled.value)
      uncontrolledSelectedThreadId.value = threadId
    if (threadId !== previous)
      onSelectedThreadChangeRef.value?.(threadId)
  }

  watch(selectedThreadId, (id) => {
    if (viewerSelectionRef.value === id)
      return
    viewerSelectionRef.value = id
    if (id != null)
      document.getElementById(commentAnchorId(id))?.scrollIntoView?.({ block: 'nearest' })
  })

  const composerActionPendingChange = (isPending: boolean): void => {
    pendingComposerActionCount.value = Math.max(0, pendingComposerActionCount.value + (isPending ? 1 : -1))
  }

  const clearActionError = (commentId: string): void => {
    if (!(commentId in actionErrors.value))
      return
    const next = { ...actionErrors.value }
    delete next[commentId]
    actionErrors.value = next
  }

  const runCommentAction = async (
    commentId: string,
    action: () => MaybePromise,
    failureMessage: string,
    retry?: () => void,
    isAnnounced?: boolean,
  ): Promise<boolean> => {
    pendingActionIds.value = new Set(pendingActionIds.value).add(commentId)
    clearActionError(commentId)
    try {
      await action()
      return true
    }
    catch {
      actionErrors.value = {
        ...actionErrors.value,
        [commentId]: {
          message: failureMessage,
          retry: retry ?? (() => { void runCommentAction(commentId, action, failureMessage) }),
          isAnnounced,
        },
      }
      return false
    }
    finally {
      const next = new Set(pendingActionIds.value)
      next.delete(commentId)
      pendingActionIds.value = next
    }
  }

  const submit = async (content: string, parentId?: string): Promise<SubmitResult> => {
    if (onSubmitRef.value == null || content.trim() === '')
      return 'skipped'
    const submitted = content.trim()
    const submittedReplyTarget = parentId != null ? replyTarget.value : null
    localSubmitPending.value = true
    if (parentId != null)
      replyError.value = undefined
    try {
      await onSubmitRef.value(submitted, parentId)
      if (parentId != null) {
        const restoreFocus = shouldRestoreFocusFrom(document.getElementById(replyComposerId(parentId)))
        if (restoreFocus)
          commitAndFocus(() => clearReplyDraft(submittedReplyTarget), parentId, 'reply', rootRef)
        else
          clearReplyDraft(submittedReplyTarget)
      }
      return 'posted'
    }
    catch {
      if (parentId != null) {
        replyDraft.value = submitted
        if (submittedReplyTarget != null)
          reportDraftChange(submitted, replyComposerContext(submittedReplyTarget))
        replyError.value = t('@astryx.comments.replyFailed')
      }
      return 'failed'
    }
    finally {
      localSubmitPending.value = false
    }
  }

  const saveEdit = async (comment: AnyComment, content: string): Promise<void> => {
    if (onSaveEditRef.value == null || content.trim() === '')
      return
    const saved = content.trim()
    const succeeded = await runCommentAction(
      comment.id,
      () => onSaveEditRef.value!(comment.id, saved),
      t('@astryx.comments.editFailed'),
      () => { void saveEdit(comment, saved) },
    )
    if (succeeded) {
      const restoreFocus = shouldRestoreFocusFrom(document.getElementById(commentAnchorId(comment.id)))
      if (restoreFocus)
        commitAndFocus(() => clearEditDraft({ comment, value: saved }), comment.id, 'actions', rootRef)
      else
        clearEditDraft({ comment, value: saved })
    }
    else {
      editTarget.value = { comment, value: saved }
      reportDraftChange(saved, editComposerContext(comment))
    }
  }

  const focusTargetAfterDelete = (target: AnyComment): string | null => {
    const index = roots.value.findIndex(root => root.id === target.id)
    if (index === -1)
      return roots.value.find(root => root.replies?.some(reply => reply.id === target.id))?.id ?? null
    return roots.value[index + 1]?.id ?? roots.value[index - 1]?.id ?? null
  }

  const confirmDelete = async (): Promise<void> => {
    if (deleteTarget.value == null || onDeleteRef.value == null)
      return
    const target = deleteTarget.value
    const neighborId = focusTargetAfterDelete(target)
    deleteError.value = undefined
    const succeeded = await runCommentAction(
      target.id,
      () => onDeleteRef.value!(target.id),
      t('@astryx.comments.deleteFailed'),
      () => {
        deleteTarget.value = target
      },
      true,
    )
    if (succeeded) {
      commitAndFocus(
        () => {
          deleteTarget.value = null
        },
        neighborId,
        neighborId == null ? 'thread' : 'article',
        rootRef,
      )
    }
    else {
      const message = t('@astryx.comments.deleteFailedRetry')
      deleteError.value = message
      announce(message, 'assertive')
    }
  }

  const openHistory = async (comment: AnyComment): Promise<void> => {
    history.value = {
      comment,
      versions: comment.previousVersions ?? [],
      isLoading: loadVersionsRef.value != null,
    }
    if (loadVersionsRef.value == null)
      return
    try {
      const versions = await loadVersionsRef.value(comment.id)
      if (history.value?.comment.id === comment.id)
        history.value = { ...history.value, versions, isLoading: false }
    }
    catch {
      if (history.value?.comment.id === comment.id) {
        history.value = {
          ...history.value,
          isLoading: false,
          error: t('@astryx.comments.historyLoadFailed'),
        }
      }
    }
  }

  const selectThread = (threadId: string | null): void => {
    setSelectedThreadId(threadId)
    if (replyTarget.value != null && replyTarget.value.parentId !== threadId)
      clearReplyDraft()
  }

  const value = reactive({
    get currentUser() { return options.currentUser },
    get mode() { return options.mode ?? 'interactive' },
    get container() { return options.container ?? 'section' },
    get composerPlaceholder() { return options.composerPlaceholder },
    get reactionOptions() { return options.reactionOptions ?? DEFAULT_COMMENT_REACTIONS },
    get highlightColor() { return options.highlightColor ?? 'yellow' },
    get agentCommands() { return options.agentCommands ?? [] },
    get composerTriggers() { return options.composerTriggers },
    get markdownPlugins() { return options.markdownPlugins },
    get markdownInlinePlugins() { return options.markdownInlinePlugins },
    get hasEmojiPicker() { return options.hasEmojiPicker ?? true },
    get onUploadImages() { return options.onUploadImages },
    get renderAnchor() { return options.renderAnchor },
    get renderBody() { return options.renderBody },
    get renderAdditionalActions() { return options.renderAdditionalActions },
    get renderComposer() { return options.renderComposer },
    get renderVersionBody() { return options.renderVersionBody },
    get can() {
      return {
        submit: onSubmitRef.value != null,
        saveEdit: onSaveEditRef.value != null,
        delete: onDeleteRef.value != null,
        react: onReactRef.value != null,
        retry: onRetryCommentRef.value != null,
        loadVersions: loadVersionsRef.value != null,
        resolve: onResolveThreadRef.value != null,
        reopen: onReopenThreadRef.value != null,
      }
    },
    get selectedThreadId() { return selectedThreadId.value },
    get replyTarget() { return replyTarget.value },
    get replyDraft() { return replyDraft.value },
    get replyError() { return replyError.value },
    get editTarget() { return editTarget.value },
    get pendingActionIds() { return pendingActionIds.value },
    get actionErrors() { return actionErrors.value },
    get isSubmitting() { return (options.isSubmitting ?? false) || localSubmitPending.value },
    get isComposerActionPending() { return pendingComposerActionCount.value > 0 },
    selectThread,
    startReply: (parentId: string, target: AnyComment, startOptions?: { focus?: boolean }) => {
      setSelectedThreadId(parentId)
      if (editTarget.value != null)
        clearEditDraft()
      const current = replyTarget.value
      const isNewTarget = current?.parentId !== parentId || current.comment.id !== target.id
      const seededMention = parentId === target.id || target.author.kind === 'agent'
        ? ''
        : (getReplyMentionRef.value?.(target.author) ?? '')
      const nextTarget: ReplyTarget = {
        parentId,
        comment: target,
        focusRequestId: startOptions?.focus === true ? ++replyFocusRequestRef.value : undefined,
        seed: isNewTarget ? seededMention : current?.seed,
      }
      if (isNewTarget) {
        if (current != null)
          clearReplyDraft()
        replyDraft.value = seededMention
        if (seededMention !== '')
          reportDraftChange(seededMention, replyComposerContext(nextTarget))
      }
      replyError.value = undefined
      replyTarget.value = nextTarget
    },
    changeReplyDraft: (value: string) => {
      replyDraft.value = value
      replyError.value = undefined
      if (replyTarget.value != null)
        reportDraftChange(value, replyComposerContext(replyTarget.value))
    },
    submitReply: (parentId: string, value: string) => { void submit(value, parentId) },
    cancelReply: (restoreFocus?: boolean) => {
      const parentId = replyTarget.value?.parentId
      if (restoreFocus === true && parentId != null)
        commitAndFocus(clearReplyDraft, parentId, 'reply', rootRef)
      else
        clearReplyDraft()
    },
    startEdit: (comment: AnyComment) => {
      if (replyTarget.value != null)
        clearReplyDraft()
      if (editTarget.value != null && editTarget.value.comment.id !== comment.id)
        clearEditDraft()
      clearActionError(comment.id)
      const wasSame = editTarget.value?.comment.id === comment.id
      editTarget.value = { comment, value: comment.body }
      if (!wasSame)
        reportDraftChange(comment.body, editComposerContext(comment))
    },
    changeEdit: (comment: AnyComment, value: string) => {
      editTarget.value = { comment, value }
      clearActionError(comment.id)
      reportDraftChange(value, editComposerContext(comment))
    },
    saveEdit: (comment: AnyComment, value: string) => { void saveEdit(comment, value) },
    cancelEdit: (restoreFocus?: boolean) => {
      const editedId = editTarget.value?.comment.id
      if (restoreFocus === true && editedId != null)
        commitAndFocus(clearEditDraft, editedId, 'actions', rootRef)
      else
        clearEditDraft()
    },
    react: (comment: AnyComment, key: string, option?: import('./types.js').CommentReactionOption) => {
      if (onReactRef.value == null)
        return
      void runCommentAction(
        comment.id,
        () => onReactRef.value!(comment.id, key, option),
        t('@astryx.comments.reactionFailed'),
      )
    },
    resolve: (comment: AnyComment) => {
      if (onResolveThreadRef.value == null)
        return
      void runCommentAction(
        comment.id,
        () => onResolveThreadRef.value!(comment.id),
        t('@astryx.comments.resolveFailed'),
      )
    },
    reopen: (comment: AnyComment) => {
      if (onReopenThreadRef.value == null)
        return
      void runCommentAction(
        comment.id,
        () => onReopenThreadRef.value!(comment.id),
        t('@astryx.comments.reopenFailed'),
      )
    },
    retry: (comment: AnyComment) => {
      if (onRetryCommentRef.value == null)
        return
      void runCommentAction(
        comment.id,
        () => onRetryCommentRef.value!(comment.id),
        t('@astryx.comments.retryFailed'),
      )
    },
    requestDelete: (comment: AnyComment) => { deleteTarget.value = comment },
    openHistory: (comment: AnyComment) => { void openHistory(comment) },
    composerActionPendingChange,
  }) as CommentsContextValue

  const closeDelete = (): void => {
    const commentId = deleteTarget.value?.id
    if (commentId == null || pendingActionIds.value.has(commentId))
      return
    commitAndFocus(() => {
      deleteTarget.value = null
      deleteError.value = undefined
    }, commentId, 'actions', rootRef)
  }

  const closeHistory = (): void => {
    const commentId = history.value?.comment.id
    if (commentId != null)
      commitAndFocus(() => { history.value = null }, commentId, 'history', rootRef)
    else
      history.value = null
  }

  return {
    value,
    deleteTarget,
    deleteError,
    history,
    confirmDelete: () => { void confirmDelete() },
    closeDelete,
    closeHistory,
    announce,
  }
}
