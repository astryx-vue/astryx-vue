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
        {{ pick('部署成功了。14 项检查都过了。', 'Your deployment finished successfully. All 14 checks passed.') }}
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="9:15 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ pick('好，把生产环境的地址发我。', 'Great, can you send me the production URL?') }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="9:16 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
