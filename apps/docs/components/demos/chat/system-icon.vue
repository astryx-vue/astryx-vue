<script setup lang="ts">
import { ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <ChatMessageList>
    <p class="chat-preview__caption">
      {{ pick('图标用来提示这是哪一类消息', 'Icons reinforce the message type') }}
    </p>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-carbon-user-follow" style="width: 14px; height: 14px" />
      </template>
      {{ pick('Jordan 加入了会话', 'Jordan was added to the conversation') }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-carbon-locked" style="width: 14px; height: 14px" />
      </template>
      {{ pick('消息已端到端加密', 'Messages are end-to-end encrypted') }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-carbon-renew" style="width: 14px; height: 14px" />
      </template>
      {{ pick('助手正在生成回复…', 'Agent is generating a response…') }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-carbon-checkmark" style="width: 14px; height: 14px" />
      </template>
      {{ pick('会话已由管理员核验', 'Conversation verified by admin') }}
    </ChatSystemMessage>
  </ChatMessageList>
</template>
