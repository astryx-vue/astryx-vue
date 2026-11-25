<script setup lang="ts">
import type { ChatUnreadDividerProps } from './types.js'
import { computed, useTemplateRef } from 'vue'
import { useComponentMessages } from '../locale/context.js'
import { chatMessages } from '../locale/messages/chat.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatUnreadDivider', inheritAttrs: false })

const props = defineProps<ChatUnreadDividerProps>()
const messages = useComponentMessages({ chat: chatMessages })
const root = useTemplateRef<HTMLDivElement>('root')
const text = computed(() => props.label ?? messages.value.chat.unreadLabel)
const accessibleName = computed(() => messages.value.chat.unreadBelow(text.value))

defineExpose({ element: root })
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    class="astryx-chat-unread"
    role="separator"
    :aria-label="accessibleName"
  >
    <span class="astryx-chat-unread__line" />
    <span class="astryx-chat-unread__label">{{ text }}</span>
  </div>
</template>
