<script setup lang="ts">
import type { ChatToolCallItem } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageList, ChatToolCalls } from '@astryx-vue/core/Chat'
import { computed } from 'vue'

const single = computed<ChatToolCallItem[]>(() => [
  { name: 'bash', status: 'complete', target: 'git status', duration: '1.2s' },
])

const group = computed<ChatToolCallItem[]>(() => [
  { name: 'read', status: 'complete', target: 'src/components/DataGrid.tsx', duration: '30ms' },
  { name: 'edit', status: 'complete', target: 'src/components/DataGrid.tsx', additions: 24, deletions: 8, duration: '85ms' },
  { name: 'edit', status: 'complete', target: 'src/components/DataGrid.test.tsx', additions: 45, duration: '60ms' },
])
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <ChatToolCalls :calls="single" />
      <ChatToolCalls :calls="group" default-is-expanded />
    </ChatMessage>
  </ChatMessageList>
</template>
