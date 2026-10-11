<script setup lang="ts">
import type { ChatToolCallItem } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageList, ChatToolCalls } from '@astryx-vue/core/Chat'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()

const calls = computed<ChatToolCallItem[]>(() => [
  { name: 'bash', status: 'pending', target: 'yarn build' },
  { name: 'bash', status: 'running', target: 'yarn test' },
  { name: 'edit', status: 'complete', target: 'src/App.tsx', additions: 8, deletions: 2, duration: '120ms' },
  {
    name: 'bash',
    status: 'error',
    target: 'yarn lint',
    errorMessage: pick('有 3 个 lint 错误。', '3 lint errors found'),
  },
])
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <ChatToolCalls :calls="calls" default-is-expanded />
    </ChatMessage>
  </ChatMessageList>
</template>
