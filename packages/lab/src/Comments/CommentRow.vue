<script setup lang="ts">
import type { DropdownMenuOption } from '@astryx-vue/core'
import type { ResolveAction } from './CommentActions.vue'
import type { CommentComposerContext, CommentThreadData, CommentUser } from './types.js'
import type { ActivationSource, AnyComment, ThreadDivider } from './utils.js'
import {
  Badge,
  ChatMessageMetadata,
  ChatTypingIndicator,
  HStack,
  StackItem,
  Text,
  Timestamp,
  useContainerReveal,
  useTranslator,
  VStack,
} from '@astryx-vue/core'
import { computed, h, ref } from 'vue'
import AuthorName from './AuthorName.vue'
import ClampedBody from './ClampedBody.vue'
import CommentActions from './CommentActions.vue'
import CommentAnchorQuote from './CommentAnchorQuote.vue'
import CommentAvatarFrame from './CommentAvatarFrame.vue'
import CommentComposerBase from './CommentComposerBase.vue'
import { RESOLVED_TEXT_STYLE } from './commentLayout.js'
import CommentMarkdown from './CommentMarkdown.vue'
import CommentProgressStatus from './CommentProgressStatus.vue'
import { useCommentsContext } from './commentsContext.js'
import ErrorBanner from './ErrorBanner.vue'
import MetadataActionLink from './MetadataActionLink.vue'
import MetadataSeparator from './MetadataSeparator.vue'
import ReactionSummary from './ReactionSummary.vue'
import ResolvedLabel from './ResolvedLabel.vue'
import ThreadRail from './ThreadRail.vue'
import ThreadSurface from './ThreadSurface.vue'
import UnreadBadge from './UnreadBadge.vue'
import { activationSourceOf, commentAnchorId, replyComposerId, THREAD_DIVIDERS, toElement } from './utils.js'

defineOptions({ name: 'AstryxCommentRow' })

const props = withDefaults(defineProps<{
  comment: AnyComment
  depth: 0 | 1
  dividers?: readonly ThreadDivider[]
  isParentThreadActive?: boolean
  isParentThreadResolved?: boolean
  threadId: string
}>(), {
  dividers: () => THREAD_DIVIDERS,
  isParentThreadActive: false,
  isParentThreadResolved: false,
})

const { t } = useTranslator()
const scope = useCommentsContext()
const { containerProps, contentProps } = useContainerReveal()
const articleRef = ref<HTMLElement | null>(null)

function setArticleRef(el: unknown): void {
  articleRef.value = toElement(el)
}
const isMetadataMenuOpen = ref(false)

const thread = computed(() => (props.depth === 0 ? props.comment as CommentThreadData : null))
const status = computed(() => props.comment.status ?? 'sent')
const isReady = computed(() => status.value === 'sent')
const isInProgress = computed(() => props.comment.progress != null)
const isOwn = computed(() => scope.currentUser?.id === props.comment.author.id)
const canMutate = computed(() => scope.mode !== 'read-only' && isReady.value && !isInProgress.value)
const canReply = computed(() => canMutate.value && scope.can.submit && (props.comment.canReply ?? true))
const canReact = computed(() => canMutate.value && scope.can.react && (props.comment.canReact ?? true))
const canEdit = computed(() =>
  canMutate.value && scope.can.saveEdit && scope.mode === 'interactive' && (props.comment.canEdit ?? isOwn.value),
)
const canDelete = computed(() =>
  status.value !== 'sending' && !isInProgress.value && scope.can.delete && scope.mode === 'interactive' && (props.comment.canDelete ?? isOwn.value),
)
const isBusy = computed(() => scope.pendingActionIds.has(props.comment.id))
const rowActionsBusy = computed(() => isBusy.value || scope.isSubmitting || scope.isComposerActionPending)
const isResolved = computed(() => thread.value?.isResolved === true)
const isMuted = computed(() => isResolved.value || props.isParentThreadResolved)
const resolveAction = computed<ResolveAction | undefined>(() => {
  const current = thread.value
  if (current == null || current.canResolve === false || !canMutate.value)
    return undefined
  if (isResolved.value)
    return scope.can.reopen ? { kind: 'reopen', onClick: () => scope.reopen(props.comment) } : undefined
  return scope.can.resolve ? { kind: 'resolve', onClick: () => scope.resolve(props.comment) } : undefined
})
const hasHistory = computed(() =>
  props.comment.isEdited === true && ((props.comment.previousVersions?.length ?? 0) > 0 || scope.can.loadVersions),
)
const actionFailure = computed(() => scope.actionErrors[props.comment.id])
const actionError = computed(() => actionFailure.value?.message)
const editorIsOpen = computed(() => scope.editTarget?.comment.id === props.comment.id)
const replies = computed(() => thread.value?.replies ?? [])
const typingUsers = computed(() => uniqueCommentUsers(thread.value?.typingUsers ?? []).filter(user => user.id !== scope.currentUser?.id))
const isThreadSelected = computed(() => props.depth === 0 && scope.selectedThreadId === props.comment.id)
const hasUnreadReplies = computed(() => replies.value.some(reply => reply.isUnread === true))
const isUnreadReplyReveal = computed(() => !isThreadSelected.value && hasUnreadReplies.value)
const areRepliesVisible = computed(() => isUnreadReplyReveal.value || isThreadSelected.value)
const visibleReplies = computed(() => (areRepliesVisible.value ? replies.value : []))
const anchorId = computed(() => commentAnchorId(props.comment.id))
const repliesRegionId = computed(() => `${anchorId.value}-replies`)
const authorNameId = computed(() => `${anchorId.value}-author`)
const showReplyDisclosure = computed(() => replies.value.length > 0 && scope.editTarget == null && !isUnreadReplyReveal.value)
const isReplyDisclosureBusy = computed(() => scope.isComposerActionPending || scope.isSubmitting)
const replyDisclosureLabel = computed(() =>
  areRepliesVisible.value
    ? t('@astryx.comments.hideReplies')
    : t('@astryx.comments.viewReplies', { count: replies.value.length }),
)
const isRootReplyComposerOpen = computed(() =>
  scope.replyTarget?.parentId === props.comment.id && scope.replyTarget.comment.id === props.comment.id,
)
const canOpenRootReplyFromCard = computed(() => canReply.value && !isRootReplyComposerOpen.value)
const canSelectThread = computed(() =>
  props.depth === 0 && scope.editTarget == null && !scope.isComposerActionPending && !scope.isSubmitting,
)
const isBodyExpanded = computed(() => (props.depth === 0 ? isThreadSelected.value : props.isParentThreadActive))
const menuItems = computed<DropdownMenuOption[]>(() => {
  const items: DropdownMenuOption[] = []
  if (canEdit.value) {
    items.push({ id: 'edit', label: t('@astryx.comments.edit'), onClick: () => scope.startEdit(props.comment) })
  }
  if (canDelete.value) {
    items.push({ id: 'delete', label: t('@astryx.comments.delete'), onClick: () => scope.requestDelete(props.comment) })
  }
  return items
})
const metadataStatus = computed(() => (status.value === 'sending' ? 'sending' as const : undefined))
const hasReactions = computed(() => (props.comment.reactions?.length ?? 0) > 0)
const showHeaderActions = computed(() =>
  !editorIsOpen.value && (isReady.value || menuItems.value.length > 0 || scope.renderAdditionalActions != null),
)
const hasControlRow = computed(() => metadataStatus.value != null || hasReactions.value)
const actionsReveal = computed(() => contentProps({
  isLayoutPreserved: true,
  forceVisibility: isMetadataMenuOpen.value ? 'shown' : undefined,
}))
const surfaceReveal = computed(() => containerProps({ hoverDelay: 0 }))

const renderedAnchor = computed(() => {
  const current = thread.value
  if (current?.anchor == null || scope.renderAnchor == null)
    return null
  const fallback = h(CommentAnchorQuote, {
    anchor: current.anchor,
    highlightColor: scope.highlightColor,
    isResolved: isResolved.value,
  })
  return scope.renderAnchor(current, fallback)
})

function uniqueCommentUsers(users: readonly CommentUser[]): CommentUser[] {
  const ids = new Set<string>()
  return users.filter((user) => {
    if (ids.has(user.id))
      return false
    ids.add(user.id)
    return true
  })
}

function uploaderFor(context: CommentComposerContext) {
  return scope.onUploadImages == null
    ? undefined
    : (files: readonly File[]) => scope.onUploadImages!(files, context)
}

function focusThreadReply(): void {
  if (!canReply.value)
    return
  scope.startReply(
    props.comment.id,
    scope.replyTarget?.parentId === props.comment.id ? scope.replyTarget.comment : props.comment,
    { focus: true },
  )
}

function activateThread(source: ActivationSource): void {
  scope.selectThread(props.comment.id)
  if (source === 'pointer')
    focusThreadReply()
  else if (canOpenRootReplyFromCard.value)
    scope.startReply(props.comment.id, props.comment)
}

function changeThreadSelection(isSelected: boolean, source: ActivationSource = 'pointer'): void {
  if (isSelected) {
    activateThread(source)
    return
  }
  if (isThreadSelected.value)
    scope.selectThread(null)
  if (scope.replyTarget?.parentId === props.comment.id)
    scope.cancelReply()
}

function onDisclosureClick(event: MouseEvent): void {
  event.preventDefault()
  if (!isReplyDisclosureBusy.value)
    changeThreadSelection(!areRepliesVisible.value, activationSourceOf(event))
}
</script>

<template>
  <component
    :is="depth === 0 ? ThreadSurface : 'div'"
    v-bind="depth === 0
      ? {
        surface: scope.container === 'card' ? 'section' : 'card',
        dividers: scope.container === 'card' ? dividers : [],
        label: t('@astryx.comments.threadLabel', { name: comment.author.name }),
        isSelectable: canSelectThread,
        isSelected: isThreadSelected,
        isFilled: isThreadSelected || thread?.isHighlighted === true,
        threadId: comment.id,
        revealClass: surfaceReveal.class,
        revealStyle: surfaceReveal.style,
      }
      : { class: 'astryx-comment-reply' }"
    @change="changeThreadSelection"
  >
    <VStack :gap="8" width="100%">
      <VStack :gap="2" width="100%" :class="replies.length > 0 ? 'astryx-comment-thread-rows' : undefined">
        <ThreadRail v-if="visibleReplies.length === 0 && replies.length > 0" collapsed />
        <VStack
          :id="anchorId"
          :ref="setArticleRef"
          as="article"
          :tabindex="-1"
          :aria-labelledby="authorNameId"
          width="100%"
          :class="visibleReplies.length > 0 ? 'astryx-thread-rail-row' : undefined"
          :data-comment-id="comment.id"
          :data-comment-depth="String(depth)"
          :data-author-kind="comment.author.kind ?? 'person'"
          :data-comment-resolved="isResolved ? 'true' : undefined"
        >
          <ThreadRail v-if="visibleReplies.length > 0" from="avatar" :to="showReplyDisclosure ? 'row' : 'avatar'" />
          <HStack :gap="2" align="start" width="100%">
            <CommentAvatarFrame :user="comment.author" />
            <StackItem size="fill">
              <VStack :gap="1" width="100%">
                <HStack :gap="1" align="center" width="100%" class="astryx-comment-header">
                  <HStack
                    :gap="1"
                    align="center"
                    class="astryx-comment-metadata"
                    :class="{ 'astryx-comment-metadata--beside-actions': showHeaderActions }"
                    :style="isMuted ? RESOLVED_TEXT_STYLE : undefined"
                  >
                    <AuthorName :id="authorNameId" :author="comment.author" />
                    <HStack v-if="comment.author.kind === 'agent'" align="center" class="astryx-comment-agent-badge">
                      <Badge variant="neutral" :label="t('@astryx.comments.agentBadge')" />
                    </HStack>
                    <MetadataSeparator />
                    <Timestamp :value="comment.createdAt" format="relative_short" type="body" color="secondary" is-live />
                    <template v-if="comment.isEdited === true">
                      <MetadataSeparator />
                      <MetadataActionLink
                        v-if="hasHistory"
                        :label="t('@astryx.comments.edited')"
                        :accessible-label="t('@astryx.comments.viewHistory')"
                        action-role="history"
                        text-type="body"
                        @click="scope.openHistory(comment)"
                      />
                      <Text v-else type="body" color="secondary" class="astryx-comment-nowrap">
                        {{ t('@astryx.comments.edited') }}
                      </Text>
                    </template>
                    <template v-if="isResolved">
                      <MetadataSeparator />
                      <ResolvedLabel :resolved-by="thread?.resolvedBy" />
                    </template>
                  </HStack>
                  <HStack
                    v-if="showHeaderActions"
                    align="center"
                    class="astryx-comment-actions-reveal"
                    :class="actionsReveal.class"
                    style="transition: none"
                    data-comment-actions-reveal="hover-focus"
                  >
                    <CommentActions
                      :comment="comment"
                      :can-react="canReact"
                      :can-reply="canReply"
                      :can-copy-link="isReady && !isInProgress"
                      :resolve-action="resolveAction"
                      :is-busy="rowActionsBusy"
                      :menu-items="menuItems"
                      :menu-label="t('@astryx.comments.actionsLabel', { name: comment.author.name })"
                      :options="scope.reactionOptions"
                      @react="(target, key, option) => scope.react(target, key, option)"
                      @reply="scope.startReply(threadId, comment, { focus: true })"
                      @open-change="isMetadataMenuOpen = $event"
                    >
                      <template v-if="scope.renderAdditionalActions != null" #additionalActions>
                        <component :is="() => scope.renderAdditionalActions?.(comment)" />
                      </template>
                    </CommentActions>
                  </HStack>
                  <StackItem v-else size="fill" />
                  <UnreadBadge v-if="comment.isUnread === true" />
                </HStack>
                <component :is="() => renderedAnchor" v-if="renderedAnchor != null" />
                <CommentAnchorQuote
                  v-else-if="thread != null && thread.anchor != null"
                  :anchor="thread.anchor"
                  :highlight-color="scope.highlightColor"
                  :is-resolved="isResolved"
                />
                <CommentComposerBase
                  v-if="editorIsOpen && scope.editTarget != null"
                  :context="{ kind: 'edit', commentId: comment.id }"
                  :value="scope.editTarget.value"
                  :placeholder="t('@astryx.comments.editPlaceholder')"
                  :context-label="t('@astryx.comments.editingContext')"
                  :focus-key="`edit-${comment.id}`"
                  :is-submitting="isBusy"
                  :error="actionError"
                  :has-cancel="true"
                  :has-retry="actionFailure?.retry != null"
                  :highlight-color="scope.highlightColor"
                  :triggers="scope.composerTriggers ?? []"
                  :agent-commands="scope.agentCommands"
                  :has-emoji-picker="scope.hasEmojiPicker"
                  :on-upload-images="uploaderFor({ kind: 'edit', commentId: comment.id })"
                  :render-composer="scope.renderComposer"
                  @change="scope.changeEdit(comment, $event)"
                  @submit="scope.saveEdit(comment, $event)"
                  @cancel="scope.cancelEdit(true)"
                  @retry="actionFailure?.retry?.()"
                  @action-pending-change="scope.composerActionPendingChange"
                />
                <ClampedBody v-else :is-expanded="isBodyExpanded" :is-muted="isMuted">
                  <CommentProgressStatus v-if="comment.progress != null" :progress="comment.progress" />
                  <component :is="() => scope.renderBody?.(comment)" v-else-if="scope.renderBody != null" />
                  <CommentMarkdown
                    v-else
                    :body="comment.body"
                    :agent-commands="scope.agentCommands"
                    :plugins="scope.markdownPlugins"
                    :inline-plugins="scope.markdownInlinePlugins"
                  />
                </ClampedBody>
                <ErrorBanner
                  v-if="status === 'error'"
                  :content="{
                    title: comment.errorMessage ?? t('@astryx.comments.sendFailed'),
                    description: actionError,
                    actionLabel: scope.can.retry ? t('@astryx.comments.retry') : undefined,
                    onAction: scope.can.retry ? () => scope.retry(comment) : undefined,
                    isActionDisabled: rowActionsBusy,
                    isRetrying: isBusy,
                    isAnnounced: actionFailure?.isAnnounced,
                  }"
                  :on-before-action="() => articleRef?.focus()"
                  data-comment-delivery-error="banner"
                />
                <VStack v-else-if="hasControlRow || (actionFailure != null && !editorIsOpen)" :gap="1" align="start" width="100%">
                  <HStack v-if="hasControlRow" :gap="1" align="center" :class="isReady ? 'astryx-comment-control-row-bleed' : undefined">
                    <ChatMessageMetadata v-if="metadataStatus != null" :status="metadataStatus" />
                    <ReactionSummary
                      v-if="hasReactions"
                      :comment="comment"
                      :can-react="canReact"
                      :is-busy="rowActionsBusy"
                      @react="scope.react"
                    />
                  </HStack>
                  <ErrorBanner
                    v-if="actionFailure != null && !editorIsOpen"
                    :content="{
                      title: actionFailure.message,
                      actionLabel: actionFailure.retry != null ? t('@astryx.comments.retry') : undefined,
                      onAction: actionFailure.retry,
                      isAnnounced: actionFailure.isAnnounced,
                    }"
                    :on-before-action="() => articleRef?.focus()"
                    data-comment-action-error="banner"
                  />
                </VStack>
              </VStack>
            </StackItem>
          </HStack>
        </VStack>

        <VStack
          v-if="depth === 0 && replies.length > 0"
          :id="repliesRegionId"
          :gap="2"
          width="100%"
          :data-unread-replies-revealed="isUnreadReplyReveal ? 'true' : undefined"
        >
          <HStack
            v-if="showReplyDisclosure"
            :gap="2"
            align="center"
            width="100%"
            :class="visibleReplies.length > 0 ? 'astryx-thread-rail-row' : undefined"
          >
            <ThreadRail v-if="visibleReplies.length > 0" from="row" to="avatar" />
            <CommentAvatarFrame spacer />
            <button
              type="button"
              class="astryx-comment-reply-disclosure astryx-comment-nowrap"
              :aria-expanded="areRepliesVisible"
              :aria-controls="repliesRegionId"
              :disabled="isReplyDisclosureBusy || undefined"
              data-reply-disclosure="true"
              @click="onDisclosureClick"
            >
              {{ replyDisclosureLabel }}
            </button>
          </HStack>
          <VStack
            v-for="(reply, index) in visibleReplies"
            :key="reply.id"
            :gap="2"
            width="100%"
            :class="index === visibleReplies.length - 1 ? undefined : 'astryx-thread-rail-row'"
          >
            <ThreadRail v-if="index < visibleReplies.length - 1" from="avatar" to="avatar" />
            <AstryxCommentRow
              :comment="reply"
              :depth="1"
              :thread-id="comment.id"
              :is-parent-thread-active="isThreadSelected"
              :is-parent-thread-resolved="isResolved"
            />
          </VStack>
        </VStack>
        <HStack v-if="depth === 0 && isThreadSelected && typingUsers.length > 0" width="100%" data-thread-typing-indicator="true">
          <ChatTypingIndicator
            :names="typingUsers.map(user => user.name)"
            class="astryx-comment-typing-indicator"
            :style="{ '--astryx-chat-typing-indicator-dots-column-width': 'calc(var(--astryx-spacing-6, 24px) + var(--astryx-spacing-1, 4px))' }"
          />
        </HStack>
      </VStack>

      <HStack
        v-if="depth === 0 && isThreadSelected && scope.replyTarget?.parentId === comment.id"
        :id="replyComposerId(comment.id)"
        :gap="2"
        align="start"
        width="100%"
        data-reply-composer="true"
      >
        <CommentAvatarFrame v-if="scope.currentUser != null" :user="scope.currentUser" />
        <CommentAvatarFrame v-else spacer />
        <StackItem size="fill">
          <CommentComposerBase
            :context="{
              kind: 'reply',
              parentCommentId: comment.id,
              repliedToCommentId: scope.replyTarget.comment.id,
            }"
            :value="scope.replyDraft"
            :placeholder="scope.composerPlaceholder ?? t('@astryx.comments.replyPlaceholder', { name: scope.replyTarget.comment.author.name })"
            :context-label="t('@astryx.comments.replyingContext', { name: scope.replyTarget.comment.author.name })"
            :focus-key="scope.replyTarget.focusRequestId == null ? undefined : `reply-${scope.replyTarget.comment.id}-${scope.replyTarget.focusRequestId}`"
            :is-submitting="scope.isSubmitting"
            :error="scope.replyError"
            :has-retry="scope.replyError != null"
            :highlight-color="scope.highlightColor"
            :triggers="scope.composerTriggers ?? []"
            :agent-commands="scope.agentCommands"
            :has-emoji-picker="scope.hasEmojiPicker"
            :on-upload-images="uploaderFor({
              kind: 'reply',
              parentCommentId: comment.id,
              repliedToCommentId: scope.replyTarget.comment.id,
            })"
            :render-composer="scope.renderComposer"
            @change="scope.changeReplyDraft"
            @submit="scope.submitReply(comment.id, $event)"
            @retry="scope.submitReply(comment.id, scope.replyDraft)"
            @action-pending-change="scope.composerActionPendingChange"
          />
        </StackItem>
      </HStack>
    </VStack>
  </component>
</template>
