<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'

const agent = 'Agent'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble group="first">
        {{ 'I have a couple of questions about the new API.' }}
      </ChatMessageBubble>
      <ChatMessageBubble group="middle">
        {{ 'First, how should we handle pagination?' }}
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        {{ 'And second, what\'s the rate limit?' }}
        <template #metadata>
          <ChatMessageMetadata status="delivered" timestamp="11:00 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <template #avatar>
        <Avatar :name="agent" size="md" />
      </template>
      <ChatMessageBubble group="first" :name="agent">
        {{ 'Great questions! For pagination, use cursor-based with a limit parameter. The response includes a nextCursor field.' }}
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        {{ 'Rate limit is 100 requests per minute per API key. You\'ll get a 429 response with a Retry-After header if you exceed it.' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="11:01 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
