<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'Can you pull up the Q3 report?' }}
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost" width="100%" name="Navi">
        {{ 'Sure, here is the artifact from last quarter.' }}
        <div class="chat-preview__card">
          <p class="chat-preview__card-title">
            {{ 'Q3 Performance Report' }}
          </p>
          <p class="chat-preview__card-meta">
            {{ '12 pages · updated 2 days ago' }}
          </p>
        </div>
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="9:45 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
