<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ pick('谢谢。有什么我该知道的阻碍吗？', 'Thanks — any blockers I should know about?') }}
        <template #metadata>
          <ChatMessageMetadata timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ pick('相对时间也行。消息比较旧时，远近比精确钟点更有用。', 'Relative timestamps work too — helpful for older messages where the exact time matters less than recency.') }}
        <template #metadata>
          <ChatMessageMetadata :timestamp="pick('5 个月前', '5 months ago')" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
