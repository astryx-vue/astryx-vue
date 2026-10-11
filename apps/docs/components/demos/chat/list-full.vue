<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { CodeBlock } from '@astryx-vue/core/Code'
import { useDemoText } from '../../demo-infra/useDemoText'

const { isEnglish, pick } = useDemoText()
const agent = pick('助手', 'Agent')
const bubbleWidth = 'min(100%, 21.25rem)'

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
      <div class="chat-preview__files">
        <span class="chat-preview__file">useReducer.ts</span>
        <span class="chat-preview__file">formState.ts</span>
      </div>
      <ChatMessageBubble>
        {{ pick('帮我看一下这几个文件。', 'Can you review these files?') }}
        <template #metadata>
          <ChatMessageMetadata status="read" timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <template #avatar>
        <Avatar :name="agent" size="md" />
      </template>
      <ChatMessageBubble group="first" :width="bubbleWidth">
        <template v-if="isEnglish">
          Sure! Here's the key pattern from <strong>useReducer.ts</strong>:
        </template>
        <template v-else>
          可以。<strong>useReducer.ts</strong> 里的关键写法是这样：
        </template>
      </ChatMessageBubble>
      <ChatMessageBubble group="last" :width="bubbleWidth">
        <template v-if="isEnglish">
          The reducer is <strong>pure and easy to test</strong> — pass in state and action, assert on the output.
        </template>
        <template v-else>
          这个 reducer 是<strong>纯函数，也好测</strong>——传入 state 和 action，断言输出即可。
        </template>
      </ChatMessageBubble>
      <ChatMessageBubble variant="ghost" :width="bubbleWidth">
        <CodeBlock :code="snippet" language="tsx" width="100%" />
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
