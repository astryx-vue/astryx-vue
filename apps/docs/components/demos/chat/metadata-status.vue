<script setup lang="ts">
import type { ChatMessageStatus } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()

const rows: { status: ChatMessageStatus, text: string }[] = [
  { status: 'sending', text: pick('正在发布更新…', 'Deploying the update now…') },
  { status: 'sent', text: pick('配置已经推到预发。', 'Config pushed to staging.') },
  { status: 'delivered', text: pick('预发集群上核对过了。', 'Verified on the staging cluster.') },
  { status: 'read', text: pick('没问题，准备推到生产。', 'Looks good — promoting to prod.') },
  { status: 'error', text: pick('已经回滚，正在看日志。', 'Rollback triggered, checking logs.') },
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
