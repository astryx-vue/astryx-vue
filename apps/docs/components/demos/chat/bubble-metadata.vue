<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'

const agent = 'Agent'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <template #avatar>
        <Avatar :name="agent" size="md" />
      </template>
      <ChatMessageBubble :name="agent">
        {{ 'Your deployment finished successfully. All 14 checks passed.' }}
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="9:15 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'Great, can you send me the production URL?' }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="9:16 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
