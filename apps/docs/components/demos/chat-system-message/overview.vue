<script setup lang="ts">
import { ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatSystemMessage variant="divider">
      {{ 'March 15, 2026' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      {{ 'Alex joined the conversation' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      {{ 'Agent is thinking…' }}
    </ChatSystemMessage>
    <ChatSystemMessage variant="divider">
      {{ 'Today' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      {{ 'Conversation marked as resolved' }}
    </ChatSystemMessage>
  </ChatMessageList>
</template>
