<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { IconButton } from '@astryx-vue/core/IconButton'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ pick('概括一下一季度的收入报告。', 'Summarize the Q1 revenue report.') }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="9:41 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        {{ pick('一季度收入 24 亿美元，同比增长 18%。企业订阅贡献了 62% 的增长，广告收入稳定在 8.9 亿美元。', 'Q1 revenue reached $2.4B, up 18% year-over-year. Enterprise subscriptions drove 62% of the growth, while ad revenue held steady at $890M.') }}
        <template #metadata>
          <ChatMessageMetadata timestamp="9:42 AM">
            <template #footer>
              <span class="chat-preview__actions">
                <IconButton :label="pick('复制', 'Copy')" variant="ghost" size="sm">
                  <span class="i-carbon-copy" />
                </IconButton>
                <IconButton :label="pick('重试', 'Retry')" variant="ghost" size="sm">
                  <span class="i-carbon-renew" />
                </IconButton>
                <IconButton :label="pick('有用', 'Thumbs up')" variant="ghost" size="sm">
                  <span class="i-carbon-thumbs-up" />
                </IconButton>
                <IconButton :label="pick('没用', 'Thumbs down')" variant="ghost" size="sm">
                  <span class="i-carbon-thumbs-down" />
                </IconButton>
                <span>GPT-4o</span>
              </span>
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
