---
layout: component-docs
title: Chat Message List
outline: false
footer: false
---

<script setup lang="ts">
import { chatMessageListDensity, chatMessageListFullFeatured } from '../../../../components/demos/chat-message-list'
</script>

## Usage

Presentational message container with density context and infinite scroll support. Provides role="log" with aria-live="polite" for accessibility. A flex spacer pushes messages to the bottom when the list isn't full.

Rows go in the default slot: usually `ChatMessage` and `ChatSystemMessage`. `density` flows down to the rows that do not set their own. `gap` overrides the row gap alone, without touching padding, which is what LLM event streams with uneven spacing need.

`scrollToTopAction` runs when a sentinel at the top of the list enters the scroll parent, and a spinner stays up until the promise settles. Pair it with an ancestor that scrolls; inside `ChatLayout` the layout owns that scroll.

`isStreaming` marks the log `aria-busy`, so a screen reader waits and announces the finished message once instead of re-reading partial text on every token.

```vue
<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList :is-streaming="true">
    <ChatMessage sender="user">
      <ChatMessageBubble>How should I structure a monorepo?</ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        Use workspaces with a shared packages directory.
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="chatMessageListDensity" title="Density" description="Side-by-side comparison of compact, balanced, and spacious densities. Use compact in sidebars or panels, balanced for most full-page chat, and spacious for long-form reading. Use gap when row spacing needs to differ from density." locale="en" />

<DemoExample :demo="chatMessageListFullFeatured" title="Full Featured" description="Conversation showcasing system messages, multi-bubble grouping, markdown, code blocks, and metadata. Combines date dividers, ghost bubbles, grouped messages, and rich content in a single example." locale="en" />
