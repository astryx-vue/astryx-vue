<script setup lang="ts">
import type { ChatTypingIndicatorProps } from './types.js'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatTypingIndicator', inheritAttrs: false })

const props = defineProps<ChatTypingIndicatorProps>()
const messages = useAstryxMessages()
const root = useTemplateRef<HTMLDivElement>('root')
const announce = useAnnounce()
const LIVE_CONTAINER_SELECTOR = '[role="log"], [role="status"], [role="alert"], [aria-live="polite"], [aria-live="assertive"]'
let announcedLabel: string | null = null

const label = computed(() => {
  const names = props.names?.filter(name => name.trim() !== '') ?? []
  const chat = messages.value.chat
  if (names.length === 0)
    return null
  if (names.length === 1)
    return chat.typingOne(names[0]!)
  if (names.length === 2)
    return chat.typingTwo(names[0]!, names[1]!)
  return chat.typingMany(names[0]!, names.length - 1)
})

function announceCurrentLabel(): void {
  const current = label.value
  if (current == null) {
    announcedLabel = null
    return
  }
  if (announcedLabel === current)
    return
  announcedLabel = current
  // 外层 log 已经会播报新增内容，不再通过共享通道重复一次。
  const insideLiveContainer = root.value?.parentElement?.closest(LIVE_CONTAINER_SELECTOR) != null
  if (!insideLiveContainer)
    announce(current, 'polite')
}

onMounted(announceCurrentLabel)
watch(label, announceCurrentLabel, { flush: 'post' })

defineExpose({ element: root })
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    class="astryx-chat-typing"
  >
    <span class="astryx-chat-typing__dots" aria-hidden="true">
      <span class="astryx-chat-typing__dot" />
      <span class="astryx-chat-typing__dot" data-index="2" />
      <span class="astryx-chat-typing__dot" data-index="3" />
    </span>
    <span v-if="label" class="astryx-chat-typing__label">{{ label }}</span>
  </div>
</template>
