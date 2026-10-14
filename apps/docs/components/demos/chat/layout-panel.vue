<script setup lang="ts">
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { IconButton } from '@astryx-vue/core/IconButton'
import { ref } from 'vue'

const draft = ref('')
</script>

<template>
  <ChatLayout class="chat-preview__panel">
    <ChatMessageList>
      <ChatSystemMessage variant="divider">
        {{ 'Today' }}
      </ChatSystemMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          {{ 'Can you review the Button component and fix the focus ring?' }}
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <div class="chat-preview__lines">
          <p>{{ 'I\'ll check the Button component now.' }}</p>
          <p>{{ 'Found the issue — the border radius was hardcoded. Replaced with the theme token.' }}</p>
        </div>
      </ChatMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          {{ 'Nice, can you also check the Card component?' }}
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <div class="chat-preview__lines">
          <p>{{ 'Checking the component now.' }}</p>
          <p>{{ 'Found the issue — the border radius was hardcoded. Replaced with the theme token.' }}</p>
        </div>
      </ChatMessage>
    </ChatMessageList>
    <template #composer>
      <form class="chat-preview__composer-card" @submit.prevent="draft = ''">
        <textarea
          v-model="draft"
          class="chat-preview__composer-input"
          rows="1"
          aria-label="Message"
          placeholder="Ask something..."
        />
        <IconButton class="chat-preview__send" type="submit" variant="primary" size="md" label="Send">
          <span class="i-carbon-arrow-up" />
        </IconButton>
      </form>
    </template>
  </ChatLayout>
</template>
