<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'I just pushed the latest changes to the feature branch.' }}
      </ChatMessageBubble>
      <ChatMessageBubble>
        {{ 'Can you review when you get a chance?' }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="9:15 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ 'The changes look great. Ship it!' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="9:16 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
