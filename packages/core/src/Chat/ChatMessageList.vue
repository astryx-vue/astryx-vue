<script setup lang="ts">
import type { ChatMessageListProps, ChatMessageListSlots } from './types.js'
import { computed, provide, ref, useSlots, useTemplateRef, watch } from 'vue'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { hasSlotContent } from '../composables/internal/slotContent.js'
import { useComponentMessages } from '../locale/context.js'
import { chatMessages } from '../locale/messages/chat.js'
import { spinnerMessages } from '../locale/messages/spinner.js'
import Spinner from '../Spinner/Spinner.vue'
import { chatListContextKey, useChatLayoutContext } from './context.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatMessageList', inheritAttrs: false })

const props = withDefaults(defineProps<ChatMessageListProps>(), {
  align: 'bottom',
  density: 'balanced',
  isStreaming: false,
})
defineSlots<ChatMessageListSlots>()

const messages = useComponentMessages({ chat: chatMessages, spinner: spinnerMessages })
const slots = useSlots()
const layout = useChatLayoutContext()
const inner = useTemplateRef<HTMLDivElement>('inner')
const sentinel = useTemplateRef<HTMLDivElement>('sentinel')
const isLoadingTop = ref(false)
const accessibleName = computed(() => props.label ?? messages.value.chat.log)

// 顶部的转圈在 log 里面，自己不出声；加载由列表通过共用通道念一次。
useBusyAnnouncement(isLoadingTop, () => messages.value.spinner.loading, inner)

provide(chatListContextKey, {
  density: computed(() => props.density),
})

watch(inner, (el, _, onCleanup) => {
  if (!layout)
    return
  layout.contentRef(el)
  onCleanup(() => layout.contentRef(null))
})

watch(
  () => [props.scrollToTopAction, sentinel.value, layout?.scrollContainer.value] as const,
  ([action, sentinelEl], _, onCleanup) => {
    if (!action || !sentinelEl || typeof IntersectionObserver === 'undefined')
      return

    let pending = false
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || pending)
        return
      pending = true
      isLoadingTop.value = true
      void Promise.resolve(action()).finally(() => {
        pending = false
        isLoadingTop.value = false
      })
    }, {
      root: layout?.scrollContainer.value ?? null,
      threshold: 0,
    })
    observer.observe(sentinelEl)
    onCleanup(() => observer.disconnect())
  },
)
</script>

<template>
  <div
    v-bind="$attrs"
    class="astryx-chat-message-list"
    role="log"
    aria-live="polite"
    :aria-busy="isStreaming || undefined"
    :aria-label="accessibleName"
    tabindex="0"
    :data-density="density"
  >
    <div ref="inner" class="astryx-chat-message-list__inner" :data-density="density" :data-gap="gap">
      <div v-if="scrollToTopAction" ref="sentinel" class="astryx-chat-message-list__sentinel" aria-hidden="true" />
      <div v-if="isLoadingTop" class="astryx-chat-message-list__loading">
        <Spinner size="md" aria-hidden="true" />
      </div>
      <div v-if="align === 'bottom'" class="astryx-chat-message-list__spacer" aria-hidden="true" />
      <slot v-if="hasSlotContent(slots.default)" />
      <div v-else-if="$slots.emptyState || $slots.empty" class="astryx-chat-message-list__empty">
        <slot v-if="$slots.emptyState" name="emptyState" />
        <slot v-else name="empty" />
      </div>
    </div>
  </div>
</template>
