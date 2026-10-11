<script setup lang="ts">
import type { ChatLayoutProps, ChatLayoutSlots } from './types.js'
import { computed, provide, useTemplateRef, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useChatNewMessages } from '../composables/useChatNewMessages.js'
import { useChatStreamScroll } from '../composables/useChatStreamScroll.js'
import { useAstryxMessages } from '../locale/index.js'
import ChatLayoutScrollButton from './ChatLayoutScrollButton.vue'
import { chatLayoutContextKey } from './context.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatLayout', inheritAttrs: false })

const props = withDefaults(defineProps<ChatLayoutProps>(), {
  density: 'balanced',
  showScrollButton: true,
})
defineSlots<ChatLayoutSlots>()

const messages = useAstryxMessages()
const announce = useAnnounce()
const root = useTemplateRef<HTMLDivElement>('root')
const scrollTarget = computed(() => props.scrollRef ?? root.value)
const isSelfScrolling = computed(() => props.scrollRef == null)

const scroll = useChatStreamScroll({ scrollRef: scrollTarget })
const newMessages = useChatNewMessages({
  isLocked: scroll.isLocked,
  onResize: scroll.scrollIfLocked,
})

const buttonVisible = computed(() => scroll.isScrolledUp.value || newMessages.hasNewMessages.value)
const buttonLabel = computed(() => newMessages.hasNewMessages.value ? messages.value.chat.newMessages : undefined)

function scrollToBottom(): void {
  newMessages.dismiss()
  scroll.scrollToBottom()
}

watch(() => newMessages.hasNewMessages.value, (hasNew) => {
  if (hasNew)
    announce(messages.value.chat.newMessages)
})

provide(chatLayoutContextKey, {
  scrollContainer: scrollTarget,
  contentRef: newMessages.contentRef,
})

defineExpose({ element: root, scrollToBottom })
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    class="astryx-chat-layout"
    :data-density="density"
    :data-scroll="isSelfScrolling ? 'self' : 'external'"
  >
    <div class="astryx-chat-layout__messages" :data-density="density">
      <div v-if="!$slots.default && $slots.empty" class="astryx-chat-layout__empty">
        <slot name="empty" />
      </div>
      <slot v-else />
    </div>

    <div class="astryx-chat-layout__dock" :data-density="density">
      <slot
        name="scrollButton"
        :is-visible="buttonVisible"
        :label="buttonLabel"
        :scroll-to-bottom="scrollToBottom"
      >
        <ChatLayoutScrollButton
          v-if="showScrollButton"
          :is-visible="buttonVisible"
          :label="buttonLabel"
          @click="scrollToBottom"
        />
      </slot>
      <div class="astryx-chat-layout__blur" :data-density="density" />
      <div class="astryx-chat-layout__composer" :data-density="density">
        <div class="astryx-chat-layout__composer-inner" :data-density="density">
          <slot name="composer" />
        </div>
      </div>
    </div>
  </div>
</template>
