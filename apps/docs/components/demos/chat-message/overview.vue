<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'I just pushed the refactored auth module.' }}
      </ChatMessageBubble>
      <ChatMessageBubble>
        {{ 'Can you review the token validation changes?' }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ 'Looks good — the refresh token rotation is solid and the error handling covers all the edge cases. Ship it.' }}
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="2:31 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
