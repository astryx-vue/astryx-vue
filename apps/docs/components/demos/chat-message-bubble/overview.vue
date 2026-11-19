<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { Timestamp } from '@astryx-vue/core/Timestamp'
</script>

<template>
  <ChatMessageList style="max-width: 600px">
    <ChatMessage sender="user">
      <ChatMessageBubble group="first">
        I just pushed the latest changes to the feature branch.
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        Can you review when you get a chance?
        <template #metadata>
          <ChatMessageMetadata status="read">
            <template #timestamp>
              <Timestamp value="2026-04-10T09:15:00" format="time" />
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        The changes look great. Ship it!
        <template #metadata>
          <ChatMessageMetadata>
            <template #timestamp>
              <Timestamp value="2026-04-10T09:16:00" format="time" />
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
