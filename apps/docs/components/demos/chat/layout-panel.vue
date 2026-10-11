<script setup lang="ts">
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { IconButton } from '@astryx-vue/core/IconButton'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const draft = ref('')
</script>

<template>
  <ChatLayout class="chat-preview__panel">
    <ChatMessageList>
      <ChatSystemMessage variant="divider">
        {{ pick('今天', 'Today') }}
      </ChatSystemMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          {{ pick('帮我看一下 Button 组件，把焦点环修一下。', 'Can you review the Button component and fix the focus ring?') }}
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <div class="chat-preview__lines">
          <p>{{ pick('我现在去看 Button 组件。', 'I\'ll check the Button component now.') }}</p>
          <p>{{ pick('找到了：圆角写死了，已经换成主题 token。', 'Found the issue — the border radius was hardcoded. Replaced with the theme token.') }}</p>
        </div>
      </ChatMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          {{ pick('再看一下 Card 组件吧。', 'Nice, can you also check the Card component?') }}
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <div class="chat-preview__lines">
          <p>{{ pick('正在看这个组件。', 'Checking the component now.') }}</p>
          <p>{{ pick('找到了：圆角写死了，已经换成主题 token。', 'Found the issue — the border radius was hardcoded. Replaced with the theme token.') }}</p>
        </div>
      </ChatMessage>
    </ChatMessageList>
    <template #composer>
      <form class="chat-preview__composer-card" @submit.prevent="draft = ''">
        <textarea
          v-model="draft"
          class="chat-preview__composer-input"
          rows="1"
          :aria-label="pick('消息', 'Message')"
          :placeholder="pick('问点什么…', 'Ask something...')"
        />
        <IconButton class="chat-preview__send" type="submit" variant="primary" size="md" :label="pick('发送', 'Send')">
          <span class="i-carbon-arrow-up" />
        </IconButton>
      </form>
    </template>
  </ChatLayout>
</template>
