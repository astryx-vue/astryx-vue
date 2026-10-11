<script setup lang="ts">
import type { ChatTypingIndicatorProps } from './types.js'
import { computed, useTemplateRef, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatTypingIndicator', inheritAttrs: false })

const props = defineProps<ChatTypingIndicatorProps>()
const messages = useAstryxMessages()
const announce = useAnnounce()
const root = useTemplateRef<HTMLDivElement>('root')

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

watch(label, (next) => {
  if (next)
    announce(next)
}, { immediate: true })

defineExpose({ element: root })
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    class="astryx-chat-typing"
    role="status"
    :aria-label="label ?? undefined"
  >
    <span class="astryx-chat-typing__dots" aria-hidden="true">
      <span class="astryx-chat-typing__dot" />
      <span class="astryx-chat-typing__dot" data-index="2" />
      <span class="astryx-chat-typing__dot" data-index="3" />
    </span>
    <span v-if="label" class="astryx-chat-typing__label">{{ label }}</span>
  </div>
</template>
