<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const agent = pick('助手', 'Agent')
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble group="first">
        {{ pick('关于新接口，我有几个问题。', 'I have a couple of questions about the new API.') }}
      </ChatMessageBubble>
      <ChatMessageBubble group="middle">
        {{ pick('第一，分页该怎么做？', 'First, how should we handle pagination?') }}
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        {{ pick('第二，限流是多少？', 'And second, what\'s the rate limit?') }}
        <template #metadata>
          <ChatMessageMetadata status="delivered" timestamp="11:00 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <template #avatar>
        <Avatar :name="agent" size="md" />
      </template>
      <ChatMessageBubble group="first" :name="agent">
        {{ pick('问得好。分页用游标，带上 limit。响应里会有 nextCursor。', 'Great questions! For pagination, use cursor-based with a limit parameter. The response includes a nextCursor field.') }}
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        {{ pick('每个 API key 每分钟 100 次。超出后返回 429，并带 Retry-After。', 'Rate limit is 100 requests per minute per API key. You\'ll get a 429 response with a Retry-After header if you exceed it.') }}
        <template #metadata>
          <ChatMessageMetadata timestamp="11:01 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
