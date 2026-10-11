<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ pick('这是上周的生产指标。周三峰值是每秒 12400 次请求，p99 延迟 45 毫秒。各接口错误率都低于 0.1%。', 'Here is an analysis of your production metrics from last week. Traffic peaked at 12,400 requests per second on Wednesday, with a p99 latency of 45ms. Error rate stayed below 0.1% across all endpoints.') }}
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="9:45 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ pick('不错。和前一周比一下？', 'That looks great. Can you compare it to the week before?') }}
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ pick('和前一周比，流量高了 8%，延迟少了 3 毫秒。周二那次发布应该帮上忙了。', 'Compared to the previous week, traffic is up 8% and latency improved by 3ms. The deployment on Tuesday seems to have helped.') }}
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="9:46 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
