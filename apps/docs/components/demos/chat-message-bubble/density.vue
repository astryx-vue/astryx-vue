<script setup lang="ts">
import type { ChatDensity } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
import { Divider } from '@astryx-vue/core/Divider'

const densities: { id: ChatDensity, label: string }[] = [
  { id: 'compact', label: 'Compact' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'spacious', label: 'Spacious' },
]
</script>

<template>
  <div class="chat-preview-densities">
    <template v-for="(density, index) in densities" :key="density.id">
      <Divider v-if="index > 0" />
      <div>
        <p class="chat-preview__caption">
          {{ density.label }}
        </p>
        <ChatMessageList :density="density.id">
          <ChatMessage sender="assistant">
            <ChatMessageBubble>
              {{ 'The build completed in 4.2 seconds.' }}
            </ChatMessageBubble>
          </ChatMessage>
          <ChatMessage sender="user">
            <ChatMessageBubble>
              {{ 'Ship it to staging.' }}
            </ChatMessageBubble>
          </ChatMessage>
        </ChatMessageList>
      </div>
    </template>
  </div>
</template>
