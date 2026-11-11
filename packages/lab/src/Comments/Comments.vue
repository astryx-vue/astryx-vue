<script setup lang="ts">
import type { CommentComposerContext, CommentsEmits, CommentsProps, CommentsSlots, CommentVersion } from './types.js'
import {
  Banner,
  Button,
  ChatLayout,
  ChatMessageList,
  EmptyState,
  useAnnounce,
  useTranslator,
  VStack,
} from '@astryx-vue/core'
import { computed, h, nextTick, provide, ref, useSlots, watch } from 'vue'
import CommentComposerLoadingSkeleton from './CommentComposerLoadingSkeleton.vue'
import CommentDialogs from './CommentDialogs.vue'
import CommentMarkdown from './CommentMarkdown.vue'
import { commentsContextKey } from './commentsContext.js'
import CommentsNewComposer from './CommentsNewComposer.vue'
import { commentsTimeline } from './commentsTimeline.js'
import CommentsTimelineList from './CommentsTimelineList.vue'
import CommentThreadLoadingSkeleton from './CommentThreadLoadingSkeleton.vue'
import { useCommentsController } from './useCommentsController.js'
import { toElement } from './utils.js'
import '../../styles/comments.css'

defineOptions({ name: 'AstryxComments', inheritAttrs: false })

const props = withDefaults(defineProps<CommentsProps>(), {
  mode: 'interactive',
  container: 'section',
  highlightColor: 'yellow',
  hasEmojiPicker: true,
  isSubmitting: false,
  composerPosition: 'bottom',
  density: 'balanced',
  layout: 'pane',
  isLoading: false,
  hasOlderComments: false,
  isLoadingOlder: false,
})
const emit = defineEmits<CommentsEmits>()
defineSlots<CommentsSlots>()
const slots = useSlots()
const { t } = useTranslator()
const announce = useAnnounce()
const rootRef = ref<HTMLElement | null>(null)
const draft = ref('')
const topComposerError = ref<string>()
const loadingOlder = ref(false)
const olderError = ref<string>()
const olderFailureCount = ref(0)
const loadingOlderLock = ref(false)
const loadOlderButtonRef = ref<HTMLElement | null>(null)
const olderRetryRef = ref<HTMLElement | null>(null)
const mountedAnchorQuote = ref(props.composerAnchor?.quote)

function setRootRef(el: unknown): void {
  rootRef.value = toElement(el)
}

const events = computed(() => props.events ?? [])
const timelineEntries = computed(() => commentsTimeline(props.comments, events.value))
const roots = computed(() => timelineEntries.value.flatMap(entry => entry.kind === 'comment' ? [entry.value] : []))
const panelLabel = computed(() => props.label ?? t('@astryx.comments.label'))
const listDensity = computed(() => props.density === 'compact' ? 'compact' : 'balanced')
const isEmbedded = computed(() => props.layout === 'embedded')
const bleedsToPanelEdge = computed(() => props.container === 'card' && !isEmbedded.value)
const isEmpty = computed(() => timelineEntries.value.length === 0 && !props.hasOlderComments)
const canCompose = computed(() =>
  props.mode !== 'read-only' && props.composerPosition !== 'none' && props.onSubmit != null,
)
const topComposerContext = computed<CommentComposerContext>(() =>
  props.composerAnchor != null
    ? { kind: 'comment', anchor: props.composerAnchor }
    : { kind: 'comment' },
)

watch(() => props.composerAnchor?.quote, (quote) => {
  if (mountedAnchorQuote.value != null && quote !== mountedAnchorQuote.value)
    mountedAnchorQuote.value = undefined
})

const anchorFocusKey = computed(() => {
  const quote = props.composerAnchor?.quote
  return props.composerAnchor != null && quote !== mountedAnchorQuote.value ? `anchor:${quote}` : undefined
})

watch(() => props.loadError, (description) => {
  if (description == null || description === '')
    return
  announce(`${t('@astryx.comments.loadFailed')} ${description}`, 'assertive')
}, { immediate: true })

const controller = useCommentsController({
  get currentUser() { return props.currentUser },
  get mode() { return props.mode },
  get container() { return props.container },
  get composerPlaceholder() { return props.composerPlaceholder },
  get highlightColor() { return props.highlightColor },
  get reactionOptions() { return props.reactionOptions },
  get agentCommands() { return props.agentCommands },
  get composerTriggers() { return props.composerTriggers },
  get markdownPlugins() { return props.markdownPlugins },
  get markdownInlinePlugins() { return props.markdownInlinePlugins },
  get getReplyMention() { return props.getReplyMention },
  get hasEmojiPicker() { return props.hasEmojiPicker },
  get isSubmitting() { return props.isSubmitting },
  get onComposerDraftChange() { return props.onComposerDraftChange },
  get onSubmit() { return props.onSubmit },
  get onSaveEdit() { return props.onSaveEdit },
  get onDelete() { return props.onDelete },
  get onReact() { return props.onReact },
  get onRetryComment() { return props.onRetryComment },
  get onResolveThread() { return props.onResolveThread },
  get onReopenThread() { return props.onReopenThread },
  get loadVersions() { return props.loadVersions },
  get onUploadImages() { return props.onUploadImages },
  get renderAnchor() { return props.renderAnchor },
  get renderBody() { return props.renderBody },
  get renderVersionBody() { return props.renderVersionBody },
  get renderAdditionalActions() { return props.renderAdditionalActions },
  get renderComposer() { return props.renderComposer },
  get selectedThreadId() { return props.selectedThreadId },
  onSelectedThreadChange: threadId => emit('selectedThreadChange', threadId),
  roots,
  rootRef,
})

provide(commentsContextKey, controller.value)

async function submitComment(content: string): Promise<void> {
  const submitted = content.trim()
  const context = topComposerContext.value
  topComposerError.value = undefined
  const result = await controller.submit(content)
  if (result === 'posted') {
    if (draft.value.trim() === submitted) {
      draft.value = ''
      props.onComposerDraftChange?.('', context)
    }
  }
  else if (result === 'failed') {
    draft.value = submitted
    props.onComposerDraftChange?.(submitted, context)
    topComposerError.value = t('@astryx.comments.postFailed')
  }
}

function onDraftChange(value: string): void {
  draft.value = value
  topComposerError.value = undefined
  props.onComposerDraftChange?.(value, topComposerContext.value)
}

async function loadOlder(): Promise<void> {
  if (props.onLoadOlder == null || loadingOlderLock.value)
    return
  const active = document.activeElement
  const hadFocus = active != null && (active === loadOlderButtonRef.value || active === olderRetryRef.value)
  loadingOlderLock.value = true
  loadingOlder.value = true
  let focusTarget: 'load' | 'retry' = 'load'
  try {
    await props.onLoadOlder()
    olderError.value = undefined
    loadingOlder.value = false
  }
  catch {
    focusTarget = 'retry'
    olderError.value = t('@astryx.comments.olderFailed')
    olderFailureCount.value += 1
    loadingOlder.value = false
  }
  finally {
    loadingOlderLock.value = false
  }
  if (hadFocus) {
    await nextTick()
    const control = focusTarget === 'retry' ? olderRetryRef.value : loadOlderButtonRef.value
    ;(control ?? rootRef.value)?.focus()
  }
}

function uploadForComposer(files: readonly File[]) {
  return props.onUploadImages!(files, topComposerContext.value)
}

function defaultVersionBody(version: CommentVersion) {
  return h(CommentMarkdown, {
    body: version.body,
    agentCommands: props.agentCommands ?? [],
    plugins: props.markdownPlugins,
    inlinePlugins: props.markdownInlinePlugins,
  })
}

const composerPlaceholderText = computed(() =>
  props.composerPlaceholder ?? t('@astryx.commentComposer.placeholder'),
)
const composerErrorText = computed(() => topComposerError.value ?? props.composerError)
const actionCount = computed(() => (props.onUploadImages == null ? 0 : 1) + (props.hasEmojiPicker ? 1 : 0))
const showComposer = computed(() => canCompose.value && !props.isLoading)
const showLoadingComposer = computed(() =>
  props.isLoading && props.mode !== 'read-only' && props.composerPosition !== 'none',
)
const listLabel = computed(() => t('@astryx.comments.commentsLabel', { label: panelLabel.value }))
const timelineClass = computed(() => [
  'astryx-comments-timeline',
  bleedsToPanelEdge.value
    ? (props.density === 'compact' ? 'astryx-comments-timeline--bleed-compact' : 'astryx-comments-timeline--bleed-balanced')
    : undefined,
])
const timelineGap = computed(() => props.container === 'card' ? 0 : props.density === 'compact' ? 2 : 4)
const timelineWidth = computed(() => bleedsToPanelEdge.value ? undefined : '100%')
const eventRenderer = computed(() => {
  if (slots.event != null)
    return (event: (typeof events.value)[number]) => slots.event!({ event })[0]!
  return props.renderEvent
})
const isDeletePending = computed(() => {
  const target = controller.deleteTarget.value
  return target != null && controller.value.pendingActionIds.has(target.id)
})

defineExpose({ element: rootRef })
</script>

<template>
  <VStack
    :ref="setRootRef"
    as="section"
    :tabindex="-1"
    :aria-label="panelLabel"
    :aria-busy="isLoading || undefined"
    :gap="3"
    width="100%"
    :height="isEmbedded ? undefined : '100%'"
    class="astryx-comments"
    :data-layout="layout"
    :data-density="density"
    :data-container="container"
  >
    <Banner
      v-if="loadError != null"
      status="error"
      :title="t('@astryx.comments.loadFailed')"
      :description="loadError"
      container="section"
    >
      <template v-if="onRetryLoad != null" #end>
        <Button :label="t('@astryx.comments.retry')" variant="ghost" size="sm" @click="onRetryLoad" />
      </template>
    </Banner>

    <template v-if="composerPosition === 'top'">
      <CommentComposerLoadingSkeleton v-if="showLoadingComposer" :action-count="actionCount" />
      <CommentsNewComposer
        v-else-if="showComposer"
        :context="topComposerContext"
        :anchor="composerAnchor"
        :has-anchor-dismiss="onComposerAnchorDismiss != null"
        :focus-key="anchorFocusKey"
        :value="draft"
        :placeholder="composerPlaceholderText"
        :is-submitting="controller.value.isSubmitting"
        :error="composerErrorText"
        :has-retry="topComposerError != null"
        :highlight-color="highlightColor"
        :triggers="composerTriggers ?? []"
        :agent-commands="controller.value.agentCommands"
        :has-emoji-picker="hasEmojiPicker"
        :on-upload-images="onUploadImages == null ? undefined : uploadForComposer"
        :render-composer="renderComposer"
        :composer-controls="composerControls"
        @change="onDraftChange"
        @submit="void submitComment($event)"
        @retry="void submitComment(draft)"
        @anchor-dismiss="onComposerAnchorDismiss?.()"
        @action-pending-change="controller.value.composerActionPendingChange"
      >
        <template v-if="$slots.composer" #composer="slotProps">
          <slot name="composer" v-bind="slotProps" />
        </template>
        <template v-if="$slots.composerControls" #composerControls>
          <slot name="composerControls" />
        </template>
      </CommentsNewComposer>
    </template>

    <template v-if="isEmbedded">
      <VStack v-if="isLoading" :width="timelineWidth" :class="timelineClass">
        <CommentThreadLoadingSkeleton :container="container" />
      </VStack>
      <template v-else-if="isEmpty">
        <slot v-if="loadError == null && $slots.emptyState" name="emptyState" />
        <component :is="() => emptyState" v-else-if="loadError == null && emptyState != null" />
        <EmptyState
          v-else-if="loadError == null"
          :title="t('@astryx.comments.emptyTitle')"
          :description="canCompose ? t('@astryx.comments.emptyDescription') : t('@astryx.comments.emptyReadOnlyDescription')"
          :is-compact="true"
        />
      </template>
      <CommentsTimelineList
        v-else
        :entries="timelineEntries"
        :has-older-comments="hasOlderComments"
        :older-error="olderError"
        :older-failure-count="olderFailureCount"
        :is-loading-older="isLoadingOlder || loadingOlder"
        :width="timelineWidth"
        :gap="timelineGap"
        :timeline-class="timelineClass"
        :layout="layout"
        :container="container"
        :render-event="eventRenderer"
        :can-load-older="onLoadOlder != null"
        @load-older="void loadOlder()"
        @load-older-ref="loadOlderButtonRef = toElement($event)"
        @older-retry-ref="olderRetryRef = toElement($event)"
      />
      <template v-if="composerPosition === 'bottom'">
        <CommentComposerLoadingSkeleton v-if="showLoadingComposer" :action-count="actionCount" />
        <CommentsNewComposer
          v-else-if="showComposer"
          :context="topComposerContext"
          :anchor="composerAnchor"
          :has-anchor-dismiss="onComposerAnchorDismiss != null"
          :focus-key="anchorFocusKey"
          :value="draft"
          :placeholder="composerPlaceholderText"
          :is-submitting="controller.value.isSubmitting"
          :error="composerErrorText"
          :has-retry="topComposerError != null"
          :highlight-color="highlightColor"
          :triggers="composerTriggers ?? []"
          :agent-commands="controller.value.agentCommands"
          :has-emoji-picker="hasEmojiPicker"
          :on-upload-images="onUploadImages == null ? undefined : uploadForComposer"
          :render-composer="renderComposer"
          :composer-controls="composerControls"
          @change="onDraftChange"
          @submit="void submitComment($event)"
          @retry="void submitComment(draft)"
          @anchor-dismiss="onComposerAnchorDismiss?.()"
          @action-pending-change="controller.value.composerActionPendingChange"
        >
          <template v-if="$slots.composer" #composer="slotProps">
            <slot name="composer" v-bind="slotProps" />
          </template>
          <template v-if="$slots.composerControls" #composerControls>
            <slot name="composerControls" />
          </template>
        </CommentsNewComposer>
      </template>
    </template>

    <ChatLayout v-else :density="listDensity" :show-scroll-button="false">
      <template v-if="composerPosition === 'bottom' && (showComposer || showLoadingComposer)" #composer>
        <VStack width="100%" class="astryx-comments-composer-dock">
          <CommentComposerLoadingSkeleton v-if="showLoadingComposer" :action-count="actionCount" />
          <CommentsNewComposer
            v-else
            :context="topComposerContext"
            :anchor="composerAnchor"
            :has-anchor-dismiss="onComposerAnchorDismiss != null"
            :focus-key="anchorFocusKey"
            :value="draft"
            :placeholder="composerPlaceholderText"
            :is-submitting="controller.value.isSubmitting"
            :error="composerErrorText"
            :has-retry="topComposerError != null"
            :highlight-color="highlightColor"
            :triggers="composerTriggers ?? []"
            :agent-commands="controller.value.agentCommands"
            :has-emoji-picker="hasEmojiPicker"
            :on-upload-images="onUploadImages == null ? undefined : uploadForComposer"
            :render-composer="renderComposer"
            :composer-controls="composerControls"
            @change="onDraftChange"
            @submit="void submitComment($event)"
            @retry="void submitComment(draft)"
            @anchor-dismiss="onComposerAnchorDismiss?.()"
            @action-pending-change="controller.value.composerActionPendingChange"
          >
            <template v-if="$slots.composer" #composer="slotProps">
              <slot name="composer" v-bind="slotProps" />
            </template>
            <template v-if="$slots.composerControls" #composerControls>
              <slot name="composerControls" />
            </template>
          </CommentsNewComposer>
        </VStack>
      </template>
      <div v-if="!isLoading && isEmpty && loadError == null" class="astryx-chat-layout__empty">
        <slot v-if="$slots.emptyState" name="emptyState" />
        <component :is="() => emptyState" v-else-if="emptyState != null" />
        <EmptyState
          v-else
          :title="t('@astryx.comments.emptyTitle')"
          :description="canCompose ? t('@astryx.comments.emptyDescription') : t('@astryx.comments.emptyReadOnlyDescription')"
          :is-compact="true"
        />
      </div>
      <ChatMessageList
        v-if="isLoading"
        align="top"
        :density="listDensity"
        :gap="0"
        :is-streaming="true"
        :label="listLabel"
      >
        <VStack :width="timelineWidth" :class="timelineClass">
          <CommentThreadLoadingSkeleton :container="container" />
        </VStack>
      </ChatMessageList>
      <ChatMessageList
        v-else-if="!isEmpty"
        align="top"
        :density="listDensity"
        :gap="0"
        :label="listLabel"
      >
        <CommentsTimelineList
          :entries="timelineEntries"
          :has-older-comments="hasOlderComments"
          :older-error="olderError"
          :older-failure-count="olderFailureCount"
          :is-loading-older="isLoadingOlder || loadingOlder"
          :width="timelineWidth"
          :gap="timelineGap"
          :timeline-class="timelineClass"
          :layout="layout"
          :container="container"
          :render-event="eventRenderer"
          :can-load-older="onLoadOlder != null"
          @load-older="void loadOlder()"
          @load-older-ref="loadOlderButtonRef = toElement($event)"
          @older-retry-ref="olderRetryRef = toElement($event)"
        />
      </ChatMessageList>
    </ChatLayout>

    <CommentDialogs
      :delete-target="controller.deleteTarget.value"
      :delete-error="controller.deleteError.value"
      :is-delete-pending="isDeletePending"
      :history="controller.history.value"
      :render-version-body="renderVersionBody ?? defaultVersionBody"
      @confirm-delete="controller.confirmDelete"
      @close-delete="controller.closeDelete"
      @close-history="controller.closeHistory"
    />
  </VStack>
</template>
