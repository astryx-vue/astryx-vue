<script setup lang="ts">
import { ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
</script>

<template>
  <div class="chat-preview-columns" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
    <div>
      <p class="chat-preview__caption">
        {{ 'Default' }}
      </p>
      <ChatMessageList class="chat-preview-pane">
        <ChatSystemMessage>
          {{ 'Alex joined the conversation' }}
        </ChatSystemMessage>
        <ChatSystemMessage>
          {{ 'Conversation marked as resolved' }}
        </ChatSystemMessage>
      </ChatMessageList>
    </div>
    <div>
      <p class="chat-preview__caption">
        {{ 'Divider' }}
      </p>
      <ChatMessageList class="chat-preview-pane">
        <ChatSystemMessage variant="divider">
          {{ 'March 15, 2026' }}
        </ChatSystemMessage>
        <ChatSystemMessage variant="divider">
          {{ 'Today' }}
        </ChatSystemMessage>
      </ChatMessageList>
    </div>
  </div>
</template>
