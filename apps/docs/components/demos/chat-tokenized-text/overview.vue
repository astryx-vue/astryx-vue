<script setup lang="ts">
import type { ChatComposerToken } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatTokenizedText } from '@astryx-vue/core/Chat'

const tokens: ChatComposerToken[] = [
  { value: '@Cindy', label: '@Cindy', variant: 'blue' },
  { value: '#bug', label: '#bug', variant: 'red' },
  { value: '#feature', label: '#feature', variant: 'green' },
]
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="system">
      <ChatMessageBubble>
        <ChatTokenizedText text="@Cindy filed #bug and #feature for the sprint" :tokens="tokens" />
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
