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
      <ChatMessageBubble group="first" :name="agent">
        {{ 'I reviewed the three files you shared.' }}
      </ChatMessageBubble>
      <ChatMessageBubble group="middle">
        {{ 'The data model looks solid, but the API handler has a race condition on concurrent writes.' }}
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        {{ 'I can draft a fix if you want.' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="10:45 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble group="first">
        {{ 'Yes please!' }}
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        {{ 'Also add a test for the concurrent case.' }}
        <template #metadata>
          <ChatMessageMetadata status="delivered" timestamp="10:46 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
