<script setup lang="ts">
import { Button } from '@astryx-vue/core'
import { ChatVirtualizer } from '@astryx-vue/lab'
import { ref } from 'vue'

interface Message {
  id: number
  author: 'me' | 'them'
  text: string
}

const LINES = [
  'Did the build pass?',
  'Yes, all green.',
  'Great, shipping it after lunch.',
  'Can you check the long thread from yesterday? It had a few questions about the release notes that nobody answered yet.',
  'On it.',
]

function message(id: number): Message {
  return { id, author: id % 3 === 0 ? 'me' : 'them', text: `#${id} ${LINES[Math.abs(id) % LINES.length]}` }
}

let first = 0
let next = 2000
const messages = ref<Message[]>(Array.from({ length: next }, (_, i) => message(i)))

function send() {
  messages.value = [...messages.value, message(next++)]
}

function loadOlder() {
  const older = Array.from({ length: 50 }, (_, i) => message(first - 50 + i))
  first -= 50
  messages.value = [...older, ...messages.value]
}
</script>

<template>
  <div class="chat-virtualizer-demo">
    <ChatVirtualizer
      class="chat-virtualizer-demo__list"
      :data="messages"
      :get-row-key="item => item.id"
      :estimated-item-size="44"
    >
      <template #default="{ item }">
        <div class="chat-virtualizer-demo__row" :data-author="item.author">
          <span class="chat-virtualizer-demo__bubble">{{ item.text }}</span>
        </div>
      </template>
    </ChatVirtualizer>
    <div class="chat-virtualizer-demo__actions">
      <Button label="Load older" variant="secondary" @click="loadOlder" />
      <Button label="Send" @click="send" />
    </div>
  </div>
</template>

<style scoped>
.chat-virtualizer-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 360px;
}

.chat-virtualizer-demo__list {
  height: 320px;
  overflow-y: auto;
  border: 1px solid var(--astryx-color-border);
  border-radius: 12px;
}

.chat-virtualizer-demo__row {
  display: flex;
  padding: 4px 12px;
}

.chat-virtualizer-demo__row[data-author='me'] {
  justify-content: flex-end;
}

.chat-virtualizer-demo__bubble {
  max-width: 75%;
  padding: 6px 10px;
  border-radius: 12px;
  background: var(--astryx-color-background-gray);
  overflow-wrap: anywhere;
}

.chat-virtualizer-demo__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
