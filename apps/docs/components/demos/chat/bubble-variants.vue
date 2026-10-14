<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <p class="chat-preview__caption">
      {{ 'Filled — sender-colored background (default)' }}
    </p>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'Can you summarize the latest deployment logs?' }}
      </ChatMessageBubble>
    </ChatMessage>
    <p class="chat-preview__caption">
      {{ 'Ghost — transparent background, keeps alignment padding' }}
    </p>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ 'The last deploy completed at 2:41 PM with zero errors across all three regions.' }}
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
