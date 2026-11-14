<script setup lang="ts">
import type { ChatComposerInputHandle, ChatComposerTrigger } from '@astryx-vue/core'
import type { VNode } from 'vue'
import type { CommentComposerBaseEmits, CommentComposerBaseProps, CommentComposerBaseSlots, ErrorBannerContent } from './types.js'
import { Card, ChatComposer, ChatComposerInput, ChatSendButton, HStack, Icon, IconButton, Popover, StackItem, Text, useTranslator, VStack } from '@astryx-vue/core'
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import { EmojiPicker } from '../EmojiPicker/index.js'
import ErrorBanner from './ErrorBanner.vue'
import { CommentIcon } from './icons.js'
import MetadataActionLink from './MetadataActionLink.vue'
import MetadataSeparator from './MetadataSeparator.vue'
import QuotedPassage from './QuotedPassage.vue'
import { useAgentCommandTrigger } from './useAgentCommandTrigger.js'
import { appendDraftBlock, appendDraftInline, imagesToMarkdown } from './utils.js'
import '../../styles/comment-composer.css'

defineOptions({ name: 'AstryxCommentComposerBase', inheritAttrs: false })

const props = withDefaults(defineProps<CommentComposerBaseProps>(), {
  isSubmitting: false,
  highlightColor: 'yellow',
  hasEmojiPicker: true,
})

const emit = defineEmits<CommentComposerBaseEmits>()

const slots = defineSlots<CommentComposerBaseSlots>()

const RenderVNode = defineComponent({
  name: 'AstryxCommentComposerRender',
  props: { vnode: { type: Object, required: true } },
  setup(renderProps: { vnode: VNode }) {
    return () => renderProps.vnode
  },
})

const COMPOSER_CONTROL_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'label',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="textbox"]',
].join(', ')
const COMPOSER_LAYER_SELECTOR = '[popover], [role="dialog"]'
const PICKER_WIDTH = 'calc(var(--astryx-spacing-8, 32px) * 11)'

const { t } = useTranslator()

const agentCommandTrigger = useAgentCommandTrigger(() => props.agentCommands ?? [])
const triggers = computed<ChatComposerTrigger[]>(() => {
  const host = [...(props.triggers ?? [])]
  return agentCommandTrigger.value == null ? host : [...host, agentCommandTrigger.value]
})

const latestValue = ref(props.value)
watch(() => props.value, (value) => {
  latestValue.value = value
}, { flush: 'post' })

const isMounted = ref(true)
const actionPending = ref(false)

onMounted(() => {
  isMounted.value = true
})
onBeforeUnmount(() => {
  isMounted.value = false
  if (actionPending.value) {
    actionPending.value = false
    emit('actionPendingChange', false)
  }
})

const isSubmittingLatest = ref(props.isSubmitting)
watch(() => props.isSubmitting, (value) => {
  isSubmittingLatest.value = value
}, { flush: 'post' })

const imageInput = useTemplateRef<HTMLInputElement>('imageInput')
const composerInput = useTemplateRef<ChatComposerInputHandle & { focus?: () => void }>('composerInput')
const root = useTemplateRef<HTMLElement>('root')
const focusedKey = ref<string | undefined>(undefined)

watch([() => props.focusKey, composerInput], () => {
  const key = props.focusKey
  const handle = composerInput.value
  if (key == null) {
    focusedKey.value = undefined
    return
  }
  if (handle != null && focusedKey.value !== key) {
    focusedKey.value = key
    handle.focus()
  }
})

const actionError = ref<ErrorBannerContent>()
const actionErrorSerial = ref(0)
const isActionPending = ref(false)
const isPickerOpen = ref(false)

function reportActionError(content: ErrorBannerContent): void {
  actionError.value = content
  actionErrorSerial.value += 1
}

function updateActionPending(nextPending: boolean): void {
  if (actionPending.value === nextPending)
    return
  actionPending.value = nextPending
  isActionPending.value = nextPending
  emit('actionPendingChange', nextPending)
}

async function uploadImages(files: readonly File[]): Promise<void> {
  if (props.onUploadImages == null || files.length === 0)
    return
  actionError.value = undefined
  try {
    const uploaded = await props.onUploadImages(files)
    if (!isMounted.value)
      return
    const markdown = imagesToMarkdown(uploaded, t('@astryx.commentComposer.imageAlt'))
    if (markdown !== '')
      emit('change', appendDraftBlock(latestValue.value, markdown))
  }
  catch {
    if (isMounted.value) {
      reportActionError({
        title: t('@astryx.commentComposer.uploadFailed'),
        actionLabel: t('@astryx.comments.retry'),
        onAction: () => beginImageUpload(files),
      })
    }
  }
  finally {
    if (isMounted.value)
      updateActionPending(false)
  }
}

function beginImageUpload(files: readonly File[]): void {
  if (
    props.onUploadImages == null
    || files.length === 0
    || isSubmittingLatest.value
    || actionPending.value
  ) {
    return
  }
  const images = files.filter(file => file.type.startsWith('image/'))
  if (images.length !== files.length) {
    reportActionError({
      title: t('@astryx.commentComposer.imagesOnly'),
      actionLabel: t('@astryx.commentComposer.chooseImages'),
      onAction: () => {
        if (isSubmittingLatest.value || actionPending.value)
          return
        imageInput.value?.click()
      },
    })
    return
  }
  updateActionPending(true)
  void uploadImages(images)
}

const isBusy = computed(() => props.isSubmitting || isActionPending.value)

function submitInput(nextValue: string): void {
  if (isBusy.value || nextValue.trim() === '')
    return
  emit('submit', nextValue)
}

const showRetry = computed(() => props.hasRetry === true)
const showCancel = computed(() => props.hasCancel === true)
const showAnchorDismiss = computed(() => props.hasAnchorDismiss === true)

const errorBanner = computed<ErrorBannerContent | undefined>(() => {
  if (props.error != null) {
    return {
      title: props.error,
      actionLabel: showRetry.value ? t('@astryx.comments.retry') : undefined,
      onAction: showRetry.value ? () => emit('retry') : undefined,
    }
  }
  return actionError.value
})

defineExpose({ element: root })

function onDraftChange(next: string): void {
  latestValue.value = next
  emit('change', next)
}

function onInputKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter' || event.shiftKey)
    return
  if (event.isComposing || event.keyCode === 229)
    return
  event.preventDefault()
  submitInput(latestValue.value)
}

function onFileChange(event: Event): void {
  const input = event.currentTarget
  if (!(input instanceof HTMLInputElement))
    return
  const files = Array.from(input.files ?? [])
  input.value = ''
  if (isBusy.value)
    return
  beginImageUpload(files)
}

function onFiles(files: File[]): void {
  beginImageUpload(files)
}

function onPickEmoji(emoji: string): void {
  emit('change', appendDraftInline(latestValue.value, emoji))
  isPickerOpen.value = false
  composerInput.value?.focus()
}

function onPickerOpenChange(open: boolean): void {
  if (open && isBusy.value)
    return
  isPickerOpen.value = open
}

function onPost(): void {
  composerInput.value?.focus()
  submitInput(latestValue.value)
}

function onRootClick(event: MouseEvent): void {
  event.stopPropagation()
  const target = event.target
  if (!(target instanceof Element))
    return
  if (target.closest(COMPOSER_CONTROL_SELECTOR) == null && target.closest(COMPOSER_LAYER_SELECTOR) == null)
    composerInput.value?.focus()
}

function focusInputBeforeBannerAction(): void {
  composerInput.value?.focus()
}

const showDefaultComposer = computed(() => props.renderComposer == null && slots.composer == null)
const renderProps = reactive({
  get value() { return latestValue.value },
  onChange: onDraftChange,
  onSubmit: submitInput,
  get placeholder() { return props.placeholder },
  get isSubmitting() { return props.isSubmitting },
  get error() { return props.error },
  get contextLabel() { return props.contextLabel },
  get context() { return props.context },
  onCancel: () => emit('cancel'),
})
const renderedComposer = computed(() => {
  void renderProps.value
  void renderProps.error
  void renderProps.isSubmitting
  void renderProps.placeholder
  void renderProps.contextLabel
  void renderProps.context
  return props.renderComposer?.(renderProps) ?? null
})

const bannerKey = computed(() => props.error != null ? 'error' : `action-${actionErrorSerial.value}`)
const composerLabel = computed(() => props.label ?? props.placeholder)
const canUpload = computed(() => props.onUploadImages != null)
</script>

<template>
  <VStack
    ref="root"
    class="astryx-comment-composer"
    :gap="2"
    width="100%"
    :aria-busy="isBusy || undefined"
    v-bind="$attrs"
    @click="onRootClick"
  >
    <HStack v-if="context.kind === 'edit' && contextLabel != null" :gap="1" align="center" wrap="wrap">
      <Text type="supporting" color="secondary">
        {{ contextLabel }}
      </Text>
      <template v-if="showCancel">
        <MetadataSeparator type="supporting" />
        <MetadataActionLink
          :label="t('@astryx.commentComposer.cancel')"
          :is-disabled="isBusy"
          @click="emit('cancel')"
        />
      </template>
    </HStack>
    <slot v-if="slots.composer != null" name="composer" v-bind="renderProps" />
    <RenderVNode v-else-if="renderedComposer != null" :vnode="renderedComposer" />
    <VStack v-else-if="showDefaultComposer" :gap="1" width="100%" :aria-busy="isBusy || undefined">
      <ErrorBanner
        v-if="errorBanner != null"
        :key="bannerKey"
        :content="errorBanner"
        :on-before-action="focusInputBeforeBannerAction"
        data-composer-error="banner"
      />
      <ChatComposer
        :model-value="value"
        :placeholder="placeholder"
        density="compact"
        elevation="none"
        @change="onDraftChange"
      >
        <template #input>
          <VStack :gap="1" width="100%">
            <Card
              v-if="anchor != null"
              class="astryx-comment-composer__quote"
              variant="muted"
              elevation="none"
              :padding="2"
              width="100%"
              data-composer-anchor="quote"
            >
              <HStack :gap="1" align="start" width="100%">
                <StackItem size="fill">
                  <QuotedPassage :quote="anchor.quote" :highlight-color="highlightColor" />
                </StackItem>
                <IconButton
                  v-if="showAnchorDismiss"
                  :label="t('@astryx.commentComposer.removeQuote')"
                  :tooltip="t('@astryx.commentComposer.removeQuote')"
                  variant="ghost"
                  size="sm"
                  @click="emit('anchorDismiss')"
                >
                  <Icon icon="close" />
                </IconButton>
              </HStack>
            </Card>
            <ChatComposerInput
              ref="composerInput"
              :model-value="value"
              :placeholder="placeholder"
              :triggers="triggers"
              :has-history="false"
              :paste-as-token="false"
              :max-rows="5"
              :label="composerLabel"
              @change="onDraftChange"
              @files="onFiles"
              @keydown="onInputKeydown"
            />
          </VStack>
        </template>
        <template #footerActions>
          <HStack :gap="0.5" align="center">
            <template v-if="canUpload">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                multiple
                hidden
                :aria-label="t('@astryx.commentComposer.chooseImages')"
                @change="onFileChange"
              >
              <IconButton
                :label="t('@astryx.commentComposer.attachImages')"
                :tooltip="t('@astryx.commentComposer.attachImages')"
                variant="ghost"
                size="sm"
                :is-disabled="isBusy"
                @click="imageInput?.click()"
              >
                <CommentIcon name="attach" color="inherit" />
              </IconButton>
            </template>
            <Popover
              v-if="hasEmojiPicker"
              :is-open="isPickerOpen"
              placement="above"
              alignment="start"
              :label="t('@astryx.commentComposer.addEmoji')"
              :width="PICKER_WIDTH"
              :padding="0"
              @open-change="onPickerOpenChange"
            >
              <IconButton
                :label="t('@astryx.commentComposer.addEmoji')"
                :tooltip="t('@astryx.commentComposer.addEmoji')"
                variant="ghost"
                size="sm"
                :is-disabled="isBusy"
              >
                <CommentIcon name="emoji" color="inherit" />
              </IconButton>
              <template #content>
                <EmojiPicker v-if="isPickerOpen" @select="onPickEmoji" />
              </template>
            </Popover>
            <slot name="controls" />
          </HStack>
        </template>
        <template #sendButton>
          <ChatSendButton
            size="sm"
            :is-disabled="value.trim() === ''"
            @send="onPost"
          />
        </template>
      </ChatComposer>
    </VStack>
  </VStack>
</template>
