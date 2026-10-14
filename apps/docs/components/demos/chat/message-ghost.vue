<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ 'Here is an analysis of your production metrics from last week. Traffic peaked at 12,400 requests per second on Wednesday, with a p99 latency of 45ms. Error rate stayed below 0.1% across all endpoints.' }}
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="9:45 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'That looks great. Can you compare it to the week before?' }}
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ 'Compared to the previous week, traffic is up 8% and latency improved by 3ms. The deployment on Tuesday seems to have helped.' }}
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="9:46 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
