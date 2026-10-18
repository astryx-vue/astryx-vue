---
layout: component-docs
title: Chat Tokenized Text
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatTokenizedTextBasic, chatTokenizedTextColors } from '../../../../components/demos/chat-tokenized-text'
</script>

## Usage

Use ChatTokenizedText inside a chat message when stored plain text contains serialized token values that should be projected as inline badges or caller-rendered token content. Unmatched text is preserved exactly and empty token values are ignored so rendering always finishes.

The text goes in the `text` prop, not the default slot. Every token `value` is matched literally and costs one pass over the string, so the same token objects a composer trigger returns can be reused here. A structured token renders a `Badge`; a token with its own `render` function renders that markup instead and stays caller-owned.

```vue
<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatTokenizedText } from '@astryx-vue/core/Chat'

const tokens = [
  { value: '@Cindy', label: '@Cindy', variant: 'blue' as const },
]
</script>

<template>
  <ChatMessage sender="user">
    <ChatMessageBubble>
      <ChatTokenizedText text="Assign @Cindy as a reviewer." :tokens="tokens" />
    </ChatMessageBubble>
  </ChatMessage>
</template>
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Reuse the same token definitions for composer insertion and message rendering so serialized values and visible labels stay aligned. |
| <Badge variant="success">Do</Badge> | Use non-empty, stable serialized values so every definition identifies real message text. |
| <Badge variant="error">Don't</Badge> | Use token labels as a substitute for the surrounding message text; the complete message must remain understandable in reading order. |
| <Badge variant="error">Don't</Badge> | Put component-owned interaction or accessibility behavior inside a custom token renderer; custom token content remains caller owned. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="chatTokenizedTextBasic" title="Basic" description="A message with @mention tokens. Each matching pattern is replaced with its display name badge." locale="en" />

<DemoExample :demo="chatTokenizedTextColors" title="Colors" description="Tokens with different color variants to distinguish mentions, bugs, and features. Use variant colors to create a visual taxonomy: blue for people, red for bugs, green for features." locale="en" />
