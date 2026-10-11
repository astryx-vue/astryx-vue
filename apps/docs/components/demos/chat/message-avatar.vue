<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const agent = pick('助手', 'Agent')
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <template #avatar>
        <Avatar :name="agent" size="sm" />
      </template>
      <ChatMessageBubble :name="agent">
        {{ pick('我看过这个拉取请求了。改动很干净，测试也覆盖到了。', 'I reviewed the pull request. The changes look solid — clean code and good test coverage.') }}
        <template #metadata>
          <ChatMessageMetadata timestamp="10:15 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ pick('谢谢，我现在合并。', 'Thanks! Merging it now.') }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="10:16 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <template #avatar>
        <Avatar :name="agent" size="sm" />
      </template>
      <ChatMessageBubble :name="agent">
        {{ pick('合并之后我可以跑部署。你说一声就行。', 'I can run the deployment pipeline once it lands. Just let me know.') }}
        <template #metadata>
          <ChatMessageMetadata timestamp="10:17 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
