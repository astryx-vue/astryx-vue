<script setup lang="ts">
import type { CommentThreadBindProps, CommentThreadEmits, CommentThreadSlots, CommentVersion } from './types.js'
import { VStack } from '@astryx-vue/core'
import { computed, getCurrentInstance, h, provide, ref, useAttrs } from 'vue'
import CommentDialogs from './CommentDialogs.vue'
import CommentMarkdown from './CommentMarkdown.vue'
import CommentRow from './CommentRow.vue'
import { commentsContextKey } from './commentsContext.js'
import { useCommentsController } from './useCommentsController.js'
import { unsavedDraftOf, useCommentThreadDismissal } from './useCommentThreadDismissal.js'
import { toElement } from './utils.js'
import '../../styles/comment-thread.css'

defineOptions({ name: 'AstryxCommentThread', inheritAttrs: false })

const props = withDefaults(defineProps<CommentThreadBindProps>(), {
  mode: 'interactive',
  container: 'section',
  highlightColor: 'yellow',
  hasEmojiPicker: true,
  isSubmitting: false,
  isSelected: undefined,
})
const emit = defineEmits<CommentThreadEmits>()
defineSlots<CommentThreadSlots>()
const attrs = useAttrs()

const rootRef = ref<HTMLElement | null>(null)

function setRootRef(el: unknown): void {
  rootRef.value = toElement(el)
}
const roots = computed(() => [props.comment])

function notifySelectedChange(isSelected: boolean): void {
  emit('selectedChange', isSelected)
}

function notifyDismiss(): void {
  emit('dismiss')
}

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
  get selectedThreadId() { return props.isSelected === undefined ? undefined : props.isSelected ? props.comment.id : null },
  onSelectedThreadChange: threadId => notifySelectedChange(threadId === props.comment.id),
  roots,
  rootRef,
})

provide(commentsContextKey, controller.value)

const draft = computed(() => unsavedDraftOf(controller.value))
const instance = getCurrentInstance()
const dismissHandler = computed(() =>
  instance?.vnode.props?.onDismiss == null ? undefined : notifyDismiss,
)
const dismissal = useCommentThreadDismissal({
  onDismiss: dismissHandler,
  rootRef,
  draft,
  announce: controller.announce,
})

function defaultVersionBody(version: CommentVersion) {
  return h(CommentMarkdown, {
    body: version.body,
    agentCommands: props.agentCommands ?? [],
    plugins: props.markdownPlugins,
    inlinePlugins: props.markdownInlinePlugins,
  })
}

function onRootPointerDownCapture(event: PointerEvent): void {
  dismissal.onRootPointerDownCapture(event)
}

defineExpose({ element: rootRef })
</script>

<template>
  <VStack
    :ref="setRootRef"
    :tabindex="-1"
    width="100%"
    class="astryx-comment-thread"
    v-bind="attrs"
    @pointerdown.capture="onRootPointerDownCapture"
  >
    <CommentRow
      :comment="comment"
      :depth="0"
      :thread-id="comment.id"
      :dividers="[]"
    />
    <CommentDialogs
      :delete-target="controller.deleteTarget.value"
      :delete-error="controller.deleteError.value"
      :is-delete-pending="controller.deleteTarget.value != null && controller.value.pendingActionIds.has(controller.deleteTarget.value.id)"
      :history="controller.history.value"
      :render-version-body="props.renderVersionBody ?? defaultVersionBody"
      @confirm-delete="controller.confirmDelete"
      @close-delete="controller.closeDelete"
      @close-history="controller.closeHistory"
    />
  </VStack>
</template>
