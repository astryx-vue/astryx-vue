<script setup lang="ts">
import type { ChatMessageMetadataProps, ChatMessageMetadataSlots, ChatMessageStatus } from './types.js'
import { computed, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import ChatIcon from './ChatIcon.vue'
import { useChatMessageContext } from './context.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatMessageMetadata', inheritAttrs: false })

const props = defineProps<ChatMessageMetadataProps>()
defineSlots<ChatMessageMetadataSlots>()
const slots = useSlots()
const messages = useAstryxMessages()
const locale = useAstryxLocale()
const context = useChatMessageContext()
const sender = computed(() => context?.sender.value ?? 'assistant')

const statusLabel = computed(() => {
  const chat = messages.value.chat
  const labels: Record<ChatMessageStatus, string> = {
    sending: chat.statusSending,
    sent: chat.statusSent,
    delivered: chat.statusDelivered,
    read: chat.statusRead,
    error: chat.statusFailed,
  }
  return props.status ? labels[props.status] : ''
})

const spokenStatus = computed(() => {
  if (locale.value === 'en')
    return statusLabel.value.toLowerCase()
  return statusLabel.value
})

const hasContent = computed(() => Boolean(props.timestamp) || Boolean(slots.timestamp) || Boolean(props.footer) || Boolean(slots.footer) || props.status != null)
const showTimestampDot = computed(() => (Boolean(props.timestamp) || Boolean(slots.timestamp)) && (Boolean(props.footer) || Boolean(slots.footer) || props.status != null))
const showFooterDot = computed(() => (Boolean(props.footer) || Boolean(slots.footer)) && props.status != null)
</script>

<template>
  <div
    v-if="hasContent"
    v-bind="$attrs"
    class="astryx-chat-metadata"
    :data-sender="sender"
  >
    <span v-if="timestamp || $slots.timestamp" class="astryx-chat-metadata__timestamp">
      <slot name="timestamp">{{ timestamp }}</slot>
    </span>
    <span v-if="showTimestampDot" class="astryx-chat-metadata__dot" aria-hidden="true">·</span>
    <span v-if="footer || $slots.footer" class="astryx-chat-metadata__footer">
      <slot name="footer">{{ footer }}</slot>
    </span>
    <span v-if="showFooterDot" class="astryx-chat-metadata__dot" aria-hidden="true">·</span>
    <span
      v-if="status"
      class="astryx-chat-metadata__status"
      :data-status="status"
      :title="statusLabel"
      :aria-label="messages.chat.messageStatus(spokenStatus)"
    >
      <ChatIcon v-if="status === 'sending'" name="clock" size="xsm" />
      <Icon v-else-if="status === 'sent'" icon="check" size="xsm" color="inherit" />
      <ChatIcon v-else-if="status === 'delivered' || status === 'read'" name="check-double" size="xsm" />
      <ChatIcon v-else name="error" size="xsm" />
      <span>{{ statusLabel }}</span>
    </span>
  </div>
</template>
