<script setup lang="ts">
import { ChatComposer, ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
</script>

<template>
  <div class="chat-preview__panel">
    <ChatLayout>
      <ChatMessageList>
        <ChatSystemMessage variant="divider">
          Today
        </ChatSystemMessage>

        <ChatMessage sender="user">
          <ChatMessageBubble>
            Can you review the Button component and fix the focus ring?
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage sender="assistant">
          <div class="chat-preview__lines">
            <p>I'll check the Button component now.</p>
            <p>Found the issue — the border radius was hardcoded. Replaced with the theme token.</p>
          </div>
        </ChatMessage>

        <ChatMessage sender="user">
          <ChatMessageBubble>
            Nice, can you also check the Card component?
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage sender="assistant">
          <div class="chat-preview__lines">
            <p>Checking the component now.</p>
            <p>Found the issue — the border radius was hardcoded. Replaced with the theme token.</p>
          </div>
        </ChatMessage>
      </ChatMessageList>
      <template #composer>
        <ChatComposer placeholder="Ask something..." />
      </template>
    </ChatLayout>
  </div>
</template>
