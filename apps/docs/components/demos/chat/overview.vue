<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        How should I handle state?
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        Keep the source of truth in one place.
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
