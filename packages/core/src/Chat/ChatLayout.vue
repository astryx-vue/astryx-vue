<script setup lang="ts">
import type { ChatLayoutProps, ChatLayoutSlots } from './types.js'
import { computed, provide, ref, useSlots, useTemplateRef, watch } from 'vue'
import { hasSlotContent } from '../composables/internal/slotContent.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useChatNewMessages } from '../composables/useChatNewMessages.js'
import { useChatStreamScroll } from '../composables/useChatStreamScroll.js'
import { useComponentMessages } from '../locale/context.js'
import { chatMessages } from '../locale/messages/chat.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { observeResize } from '../utils/sharedResizeObserver.js'
import ChatLayoutScrollButton from './ChatLayoutScrollButton.vue'
import { chatLayoutContextKey } from './context.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatLayout', inheritAttrs: false })

const props = withDefaults(defineProps<ChatLayoutProps>(), {
  density: 'balanced',
  showScrollButton: true,
})
defineSlots<ChatLayoutSlots>()
const slots = useSlots()

const messages = useComponentMessages({ chat: chatMessages })
const announce = useAnnounce()
const root = useTemplateRef<HTMLDivElement>('root')
const scrollTarget = computed(() => props.scrollRef ?? root.value)
const isSelfScrolling = computed(() => props.scrollRef == null)
const dock = useTemplateRef<HTMLDivElement>('dock')
// 外部滚动时输入区固定在视口里、脱离文档流，消息区的底部留白要再加上它的高度，
// 滚到底时最新一条消息才落在它上面，和自滚动模式一样。
const dockHeight = ref(0)
watch([dock, isSelfScrolling], ([el, isSelf], _, onCleanup) => {
  dockHeight.value = 0
  if (el == null || isSelf)
    return
  const stop = observeResize(el, (entry) => {
    const height = entry.borderBoxSize?.[0]?.blockSize ?? el.getBoundingClientRect().height
    dockHeight.value = Math.round(height)
  })
  onCleanup(stop)
}, { immediate: true, flush: 'post' })
const messagesStyle = computed(() => dockHeight.value > 0
  ? { paddingBlockEnd: `calc(var(--astryx-spacing-6, 24px) + ${dockHeight.value}px)` }
  : undefined)
useScrollbars(root, { enabled: isSelfScrolling })

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
    <div class="astryx-chat-layout__messages" :data-density="density" :style="messagesStyle">
      <div v-if="!hasSlotContent(slots.default) && $slots.empty" class="astryx-chat-layout__empty">
        <slot name="empty" />
      </div>
      <slot v-else />
    </div>

    <div ref="dock" class="astryx-chat-layout__dock" :data-density="density">
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
