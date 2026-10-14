<script setup lang="ts">
import { ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <p class="chat-preview__caption">
      {{ 'Icons reinforce the message type' }}
    </p>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-carbon-user-follow" style="width: 14px; height: 14px" />
      </template>
      {{ 'Jordan was added to the conversation' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-carbon-locked" style="width: 14px; height: 14px" />
      </template>
      {{ 'Messages are end-to-end encrypted' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-carbon-renew" style="width: 14px; height: 14px" />
      </template>
      {{ 'Agent is generating a response…' }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-carbon-checkmark" style="width: 14px; height: 14px" />
      </template>
      {{ 'Conversation verified by admin' }}
    </ChatSystemMessage>
  </ChatMessageList>
</template>
