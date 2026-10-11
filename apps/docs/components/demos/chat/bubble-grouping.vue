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
      <ChatMessageBubble group="first" :name="agent">
        {{ pick('你发的三个文件我看过了。', 'I reviewed the three files you shared.') }}
      </ChatMessageBubble>
      <ChatMessageBubble group="middle">
        {{ pick('数据模型没问题，但接口在并发写入时有竞态。', 'The data model looks solid, but the API handler has a race condition on concurrent writes.') }}
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        {{ pick('需要的话我可以起草一个修复。', 'I can draft a fix if you want.') }}
        <template #metadata>
          <ChatMessageMetadata timestamp="10:45 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble group="first">
        {{ pick('好，请改。', 'Yes please!') }}
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        {{ pick('再补一个并发场景的测试。', 'Also add a test for the concurrent case.') }}
        <template #metadata>
          <ChatMessageMetadata status="delivered" timestamp="10:46 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
