<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()

const snippet = `const [state, dispatch] = useReducer(
  (state, action) => ({
    ...state,
    [action.field]: action.value,
  }),
  { name: '', email: '' }
);`
</script>

<template>
  <ChatMessageList>
    <ChatSystemMessage variant="divider">
      {{ pick('今天', 'Today') }}
    </ChatSystemMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <div class="chat-preview__files">
          <span class="chat-preview__file">useReducer.ts</span>
          <span class="chat-preview__file">formState.ts</span>
        </div>
        {{ pick('帮我看一下这几个文件。', 'Can you review these files?') }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost" :name="pick('助手', 'Agent')">
        {{ pick('可以。useReducer.ts 里关键是这一段：', 'Sure! Here\'s the key pattern from useReducer.ts:') }}
        <pre class="chat-preview__code">{{ snippet }}</pre>
        <p class="chat-preview__answer">
          {{ pick('这个 reducer 是纯函数，好测：传入 state 和 action，断言输出即可。', 'The reducer is pure and easy to test — pass in state and action, assert on the output.') }}
        </p>
        <template #metadata>
          <ChatMessageMetadata timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatSystemMessage>
      {{ pick('助手分享了一段代码', 'Agent shared a code snippet') }}
    </ChatSystemMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        {{ pick('写得很干净，谢谢。', 'That\'s clean, thanks!') }}
        <template #metadata>
          <ChatMessageMetadata status="delivered" timestamp="2:31 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
