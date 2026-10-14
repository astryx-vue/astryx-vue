---
title: Patterns
---

# Patterns

Components follow the upstream grain, so a surface is a composition rather than one widget. The set shipped today is conversation: the transcript, bubbles, citations, and Markdown are separate components, and the app decides how they sit together.

Import the conversation pieces from `@astryx-vue/core/Chat`. `ChatLayout` is a column. Put the transcript in `ChatMessageList` and `ChatComposer` in the `composer` slot. The layout scrolls itself by default. While the reader is at the bottom, new content stays pinned there. Scrolling up releases the pin and shows a return-to-bottom button. `useChatStreamScroll` and `useChatNewMessages` do that work inside the layout.

```vue
<script setup lang="ts">
import { ChatComposer, ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'

function onSubmit(value: string) {
  console.log(value)
}
</script>

<template>
  <ChatLayout>
    <ChatMessageList>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          Can you check the release notes?
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble name="Assistant">
          They are in the docs.
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
    <template #composer>
      <ChatComposer @submit="onSubmit" />
    </template>
  </ChatLayout>
</template>
```

These components do not call a model, and they do not render Markdown. The body is a slot. Typeset a reply with `Markdown` from `@astryx-vue/core/Markdown`. Mark a source with `Citation` from `@astryx-vue/core/Citation`. Tool calls, reasoning, and the typing indicator are `ChatToolCalls`, `ChatReasoning`, and `ChatTypingIndicator`, exported from the `Chat` entry.

`sender` is `user`, `assistant`, or `system`. System rows use `ChatSystemMessage`. They are centered and do not render an avatar or a name.

For complete demos, density variants, and unread dividers, see [Chat](/en/components/chat). Citation and Markdown each have dedicated component documentation pages.
