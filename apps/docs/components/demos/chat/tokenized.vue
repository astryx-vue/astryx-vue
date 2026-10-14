<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatTokenizedText } from '@astryx-vue/core/Chat'

const tokens = [
  { value: '@ada', label: '@Ada', variant: 'blue' as const },
]
</script>

<template>
  <div class="chat-preview-stack">
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <ChatTokenizedText text="Ask @ada to check the focus ring." :tokens="tokens" />
      </ChatMessageBubble>
    </ChatMessage>
  </div>
</template>
