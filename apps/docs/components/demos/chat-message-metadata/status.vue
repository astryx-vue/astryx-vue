<script setup lang="ts">
import type { ChatMessageStatus } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'

const rows: { status: ChatMessageStatus, text: string }[] = [
  { status: 'sending', text: 'Deploying the update now…' },
  { status: 'sent', text: 'Config pushed to staging.' },
  { status: 'delivered', text: 'Verified on the staging cluster.' },
  { status: 'read', text: 'Looks good — promoting to prod.' },
  { status: 'error', text: 'Rollback triggered, checking logs.' },
]
</script>

<template>
  <ChatMessageList>
    <ChatMessage v-for="row in rows" :key="row.status" sender="user">
      <ChatMessageBubble>
        {{ row.text }}
        <template #metadata>
          <ChatMessageMetadata :status="row.status" timestamp="10:15 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
