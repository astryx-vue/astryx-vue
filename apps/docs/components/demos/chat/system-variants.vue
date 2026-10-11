<script setup lang="ts">
import { ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <div class="chat-preview-columns" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
    <div>
      <p class="chat-preview__caption">
        {{ pick('默认', 'Default') }}
      </p>
      <ChatMessageList class="chat-preview-pane">
        <ChatSystemMessage>
          {{ pick('阿青加入了会话', 'Alex joined the conversation') }}
        </ChatSystemMessage>
        <ChatSystemMessage>
          {{ pick('会话已标为已解决', 'Conversation marked as resolved') }}
        </ChatSystemMessage>
      </ChatMessageList>
    </div>
    <div>
      <p class="chat-preview__caption">
        {{ pick('分隔线', 'Divider') }}
      </p>
      <ChatMessageList class="chat-preview-pane">
        <ChatSystemMessage variant="divider">
          {{ pick('2026年3月15日', 'March 15, 2026') }}
        </ChatSystemMessage>
        <ChatSystemMessage variant="divider">
          {{ pick('今天', 'Today') }}
        </ChatSystemMessage>
      </ChatMessageList>
    </div>
  </div>
</template>
