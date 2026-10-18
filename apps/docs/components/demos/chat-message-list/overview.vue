<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata, ChatSystemMessage } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatSystemMessage variant="divider">
      {{ 'March 15, 2026' }}
    </ChatSystemMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'How should I structure a monorepo?' }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble>
        {{ 'Use workspaces with a shared packages directory. Keep each package focused on a single concern.' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'Should I use Yarn or pnpm for that?' }}
        <template #metadata>
          <ChatMessageMetadata status="delivered" timestamp="2:31 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
