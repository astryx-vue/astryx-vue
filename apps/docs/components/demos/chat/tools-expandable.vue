<script setup lang="ts">
import type { ChatToolCallItem } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageList, ChatToolCalls } from '@astryx-vue/core/Chat'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()

const calls = computed<ChatToolCallItem[]>(() => [
  {
    name: 'edit',
    status: 'complete',
    node: 'cli:remote-server',
    target: 'src/utils/formatDate.ts',
    additions: 6,
    deletions: 3,
    duration: '85ms',
    detail: pick('diff', 'diff'),
  },
  {
    name: 'bash',
    status: 'complete',
    node: 'cli:remote-server',
    target: 'yarn test',
    duration: '1.8s',
    detail: pick('ok', 'ok'),
  },
  {
    name: 'web_search',
    status: 'complete',
    target: 'Intl.DateTimeFormat locale options',
    duration: '1.2s',
    detail: pick('ok', 'ok'),
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
          <pre class="chat-preview__code">{{ call.name === 'edit' ? diff : pick('通过', 'passed') }}</pre>
        </template>
      </ChatToolCalls>
    </ChatMessage>
  </ChatMessageList>
</template>
