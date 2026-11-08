<script setup lang="ts">
import { ChatComposer, ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatTokenizedText } from '@astryx-vue/core/Chat'

const tokens = [
  { value: '/review', label: '/review', variant: 'blue' as const },
]
</script>

<template>
  <ChatLayout density="compact">
    <ChatMessageList density="compact">
      <ChatMessage sender="user">
        <ChatMessageBubble>
          <ChatTokenizedText text="/review this file" :tokens="tokens" />
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble variant="ghost">
          Here is the result.
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
    <template #composer>
      <ChatComposer density="compact" placeholder="Ask something..." />
    </template>
  </ChatLayout>
</template>
