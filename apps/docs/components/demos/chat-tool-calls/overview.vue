<script setup lang="ts">
import type { ChatToolCallItem } from '@astryx-vue/core/Chat'
import { ChatToolCalls } from '@astryx-vue/core/Chat'
import { computed } from 'vue'

const calls = computed<ChatToolCallItem[]>(() => [
  { name: 'bash', status: 'complete', target: 'git diff --stat', duration: '340ms' },
  { name: 'read', status: 'complete', target: 'src/utils/formatDate.ts', duration: '45ms' },
  { name: 'edit', status: 'complete', target: 'src/utils/formatDate.ts', additions: 12, deletions: 3, duration: '120ms' },
])
</script>

<template>
  <ChatToolCalls :calls="calls" default-is-expanded />
</template>
