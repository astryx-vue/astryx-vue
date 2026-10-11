<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <ChatMessageList>
    <p class="chat-preview__caption">
      {{ pick('实心：按发送者上色（默认）', 'Filled — sender-colored background (default)') }}
    </p>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ pick('帮我概括一下最新的部署日志。', 'Can you summarize the latest deployment logs?') }}
      </ChatMessageBubble>
    </ChatMessage>
    <p class="chat-preview__caption">
      {{ pick('透明：没有底色，仍保留对齐用的内边距', 'Ghost — transparent background, keeps alignment padding') }}
    </p>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ pick('上次部署在下午 2:41 完成，三个区域都没有错误。', 'The last deploy completed at 2:41 PM with zero errors across all three regions.') }}
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
