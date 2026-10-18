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
        {{ 'I reviewed the pull request. The changes look solid — clean code and good test coverage.' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="10:15 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'Thanks! Merging it now.' }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="10:16 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <template #avatar>
        <Avatar :name="agent" size="md" />
      </template>
      <ChatMessageBubble :name="agent">
        {{ 'I can run the deployment pipeline once it lands. Just let me know.' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="10:17 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
