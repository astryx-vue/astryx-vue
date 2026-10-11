<script setup lang="ts">
import type { ChatMessageListProps, ChatMessageListSlots } from './types.js'
import { computed, provide, ref, useTemplateRef, watch } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import { chatListContextKey, useChatLayoutContext } from './context.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatMessageList', inheritAttrs: false })

const props = withDefaults(defineProps<ChatMessageListProps>(), {
  density: 'balanced',
  isStreaming: false,
})
defineSlots<ChatMessageListSlots>()

const messages = useAstryxMessages()
const layout = useChatLayoutContext()
const inner = useTemplateRef<HTMLDivElement>('inner')
const sentinel = useTemplateRef<HTMLDivElement>('sentinel')
const isLoadingTop = ref(false)
const accessibleName = computed(() => props.label ?? messages.value.chat.log)

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
        <Spinner size="md" :aria-label="messages.chat.toolRunning" />
      </div>
      <div class="astryx-chat-message-list__spacer" aria-hidden="true" />
      <slot v-if="$slots.default" />
      <div v-else-if="$slots.empty" class="astryx-chat-message-list__empty">
        <slot name="empty" />
      </div>
    </div>
  </div>
</template>
