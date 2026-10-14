<script setup lang="ts">
import { ChatComposer, ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

interface Row {
  id: number
  sender: 'user' | 'assistant'
  text: string
}

let nextId = 3
const rows = ref<Row[]>([
  { id: 1, sender: 'user', text: 'Can you review the Button component and fix the focus ring?' },
  { id: 2, sender: 'assistant', text: 'Found the issue — the border radius was hardcoded. Replaced with the theme token.' },
])

function onSubmit(value: string): void {
  rows.value = [...rows.value, { id: nextId, sender: 'user', text: value }]
  nextId += 1
}
</script>

<template>
  <ChatLayout class="chat-preview__panel">
    <ChatMessageList>
      <ChatSystemMessage variant="divider">
        Today
      </ChatSystemMessage>
      <ChatMessage v-for="row in rows" :key="row.id" :sender="row.sender">
        <ChatMessageBubble v-if="row.sender === 'user'">
          {{ row.text }}
        </ChatMessageBubble>
        <div v-else class="chat-preview__lines">
          <p>{{ row.text }}</p>
        </div>
      </ChatMessage>
    </ChatMessageList>
    <template #composer>
      <ChatComposer placeholder="Ask something..." @submit="onSubmit" />
    </template>
  </ChatLayout>
</template>
