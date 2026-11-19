<script setup lang="ts">
import type { ChatComposerToken } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatTokenizedText } from '@astryx-vue/core/Chat'

const tokens: ChatComposerToken[] = [
  { value: '@cindy', label: '@Cindy', variant: 'blue' },
  { value: '#bug', label: '#bug', variant: 'red' },
  { value: '#feat', label: '#feature', variant: 'green' },
]
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="system">
      <ChatMessageBubble>
        <ChatTokenizedText text="@cindy filed #bug and #feat for the sprint" :tokens="tokens" />
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
