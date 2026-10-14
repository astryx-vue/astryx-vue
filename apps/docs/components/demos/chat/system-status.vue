<script setup lang="ts">
import { ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatSystemMessage variant="divider">
      {{ 'March 14, 2026' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-heroicons-user-plus" style="width: 20px; height: 20px" />
      </template>
      {{ 'Sarah Chen joined the conversation' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      {{ 'Topic changed to "Q2 Launch Planning"' }}
    </ChatSystemMessage>
    <ChatSystemMessage variant="divider">
      {{ 'March 15, 2026' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-heroicons-user-minus" style="width: 20px; height: 20px" />
      </template>
      {{ 'Alex Rivera left the conversation' }}
    </ChatSystemMessage>
    <ChatSystemMessage variant="divider">
      {{ 'Today' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-heroicons-check-circle" style="width: 20px; height: 20px" />
      </template>
      {{ 'Conversation marked as resolved' }}
    </ChatSystemMessage>
  </ChatMessageList>
</template>
