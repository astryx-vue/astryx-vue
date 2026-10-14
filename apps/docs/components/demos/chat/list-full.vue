<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { CodeBlock } from '@astryx-vue/core/Code'

const agent = 'Agent'
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
      Today
    </ChatSystemMessage>
    <ChatMessage sender="user">
      <div class="chat-preview__files">
        <span class="chat-preview__file">useReducer.ts</span>
        <span class="chat-preview__file">formState.ts</span>
      </div>
      <ChatMessageBubble>
        Can you review these files?
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
        Sure! Here's the key pattern from <strong>useReducer.ts</strong>:
      </ChatMessageBubble>
      <ChatMessageBubble group="last" :width="bubbleWidth">
        The reducer is <strong>pure and easy to test</strong> — pass in state and action, assert on the output.
      </ChatMessageBubble>
      <ChatMessageBubble variant="ghost" :width="bubbleWidth">
        <CodeBlock :code="snippet" language="tsx" width="100%" />
        <template #metadata>
          <ChatMessageMetadata timestamp="2:30 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatSystemMessage>
      Agent shared a code snippet
    </ChatSystemMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        That's clean, thanks!
        <template #metadata>
          <ChatMessageMetadata status="delivered" timestamp="2:31 PM" />
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
