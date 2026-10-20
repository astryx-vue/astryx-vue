<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { IconButton } from '@astryx-vue/core/IconButton'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <ChatMessageBubble>
        {{ 'Sorry, something went wrong on my end.' }}
        <template #metadata>
          <ChatMessageMetadata status="error" timestamp="2:30 PM">
            <template #footer>
              <IconButton label="Retry" variant="ghost" size="sm">
                <span class="i-carbon-renew" />
              </IconButton>
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'No worries — try again with just the last 24 hours of logs.' }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="2:31 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble>
        {{ 'The canary at 11:42 AM caused a memory spike. Rolled back at 11:58 AM.' }}
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="2:32 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
