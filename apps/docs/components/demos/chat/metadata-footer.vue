<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { IconButton } from '@astryx-vue/core/IconButton'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ 'Summarize the Q1 revenue report.' }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="9:41 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ 'Q1 revenue reached $2.4B, up 18% year-over-year. Enterprise subscriptions drove 62% of the growth, while ad revenue held steady at $890M.' }}
        <template #metadata>
          <ChatMessageMetadata timestamp="9:42 AM">
            <template #footer>
              <span class="chat-preview__actions">
                <IconButton label="Copy" variant="ghost" size="sm">
                  <span class="i-carbon-copy" />
                </IconButton>
                <IconButton label="Retry" variant="ghost" size="sm">
                  <span class="i-carbon-renew" />
                </IconButton>
                <IconButton label="Thumbs up" variant="ghost" size="sm">
                  <span class="i-carbon-thumbs-up" />
                </IconButton>
                <IconButton label="Thumbs down" variant="ghost" size="sm">
                  <span class="i-carbon-thumbs-down" />
                </IconButton>
                <span>GPT-4o</span>
              </span>
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
