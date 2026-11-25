<script setup lang="ts">
import type { ChatToolCallStatus } from './types.js'
import { computed } from 'vue'
import { useComponentMessages } from '../locale/context.js'
import { chatMessages } from '../locale/messages/chat.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import ChatIcon from './ChatIcon.vue'
import '../../styles/chat.css'

const props = defineProps<{
  status: ChatToolCallStatus
  errorMessage?: string
}>()

const messages = useComponentMessages({ chat: chatMessages })
const label = computed(() => {
  const chat = messages.value.chat
  if (props.status === 'pending')
    return chat.toolPending
  if (props.status === 'running')
    return chat.toolRunning
  if (props.status === 'error')
    return props.errorMessage ? chat.toolError(props.errorMessage) : chat.statusFailed
  return chat.statusSent
})
</script>

<template>
  <span class="astryx-chat-status" :data-status="status" :title="status === 'error' ? errorMessage : undefined">
    <Spinner v-if="status === 'pending' || status === 'running'" size="sm" shade="inherit" :aria-label="label" />
    <ChatIcon v-else-if="status === 'complete'" name="circle-check" size="xsm" />
    <ChatIcon v-else name="circle-x" size="xsm" />
    <VisuallyHidden v-if="status !== 'pending' && status !== 'running'">
      {{ label }}
    </VisuallyHidden>
  </span>
</template>
