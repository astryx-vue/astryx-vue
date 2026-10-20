<script setup lang="ts">
import type { ChatToolCallItem } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageList, ChatToolCalls } from '@astryx-vue/core/Chat'
import { computed } from 'vue'

const calls = computed<ChatToolCallItem[]>(() => [
  {
    name: 'edit',
    status: 'complete',
    node: 'cli:remote-server',
    target: 'src/utils/formatDate.ts',
    additions: 6,
    deletions: 3,
    duration: '85ms',
    resultDetail: 'diff',
  },
  {
    name: 'bash',
    status: 'complete',
    node: 'cli:remote-server',
    target: 'yarn test',
    duration: '1.8s',
    resultDetail: 'ok',
  },
  {
    name: 'web_search',
    status: 'complete',
    target: 'Intl.DateTimeFormat locale options',
    duration: '1.2s',
    resultDetail: 'ok',
  },
])

const diff = `function formatDate(value) {
-  return value.toLocaleDateString();
+  return new Intl.DateTimeFormat(locale).format(value);
}`
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <ChatToolCalls :calls="calls" default-is-expanded>
        <template #detail="{ call }">
          <pre class="chat-preview__code">{{ call.name === 'edit' ? diff : 'passed' }}</pre>
        </template>
      </ChatToolCalls>
    </ChatMessage>
  </ChatMessageList>
</template>
