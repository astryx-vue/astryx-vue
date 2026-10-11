<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ pick('把三季度的报告调出来。', 'Can you pull up the Q3 report?') }}
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost" :name="pick('Navi', 'Navi')">
        {{ pick('这是上个季度的那份。', 'Sure, here is the artifact from last quarter.') }}
        <div class="chat-preview__card">
          <p class="chat-preview__card-title">
            {{ pick('三季度业绩报告', 'Q3 Performance Report') }}
          </p>
          <p class="chat-preview__card-meta">
            {{ pick('12 页 · 2 天前更新', '12 pages · updated 2 days ago') }}
          </p>
        </div>
        <template #metadata>
          <ChatMessageMetadata footer="Claude Opus 4.6" timestamp="9:45 AM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
