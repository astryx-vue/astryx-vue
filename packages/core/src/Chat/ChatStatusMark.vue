<script setup lang="ts">
import type { ChatToolCallStatus } from './types.js'
import { computed } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import ChatIcon from './ChatIcon.vue'
import '../../styles/chat.css'

const props = defineProps<{
  status: ChatToolCallStatus
  errorMessage?: string
}>()

const messages = useAstryxMessages()
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
    <Spinner v-if="status === 'pending' || status === 'running'" size="sm" shade="subtle" :aria-label="label" />
    <template v-else>
      <span class="astryx-chat-status__disc" />
      <Icon v-if="status === 'complete'" class="astryx-chat-status__icon" icon="check" size="xsm" color="inherit" />
      <ChatIcon v-else class="astryx-chat-status__icon" name="close" size="xsm" />
    </template>
    <VisuallyHidden v-if="status === 'error' && errorMessage">
      {{ label }}
    </VisuallyHidden>
  </span>
</template>
