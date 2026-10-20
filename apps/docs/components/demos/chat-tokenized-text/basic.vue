<script setup lang="ts">
import type { ChatComposerToken } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatTokenizedText } from '@astryx-vue/core/Chat'

const tokens: ChatComposerToken[] = [
  { value: '@Cindy', label: '@Cindy' },
  { value: '@Alex', label: '@Alex' },
]
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <ChatTokenizedText text="Assign @Cindy and @Alex as reviewers." :tokens="tokens" />
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
