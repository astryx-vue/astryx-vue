<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'Thanks — any blockers I should know about?' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ 'Relative timestamps work too — helpful for older messages where the exact time matters less than recency.' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="5 months ago" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
