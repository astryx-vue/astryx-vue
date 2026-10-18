---
layout: component-docs
title: Chat Message
outline: false
footer: false
---

<script setup lang="ts">
import { chatMessageAvatar, chatMessageGhost, chatMessageMultiBubble } from '../../../../components/demos/chat-message'
</script>

## Usage

Sender context wrapper: handles avatar, name, metadata, and alignment based on sender role.

`sender` is required. It decides the alignment, and whether the avatar, name, and metadata slots are rendered at all: a `system` row is centered and ignores all three. Density comes from the surrounding `ChatMessageList` unless the row sets its own.

The name and metadata slots belong to the raw-content case. When the first child is a `ChatMessageBubble`, put the name on the bubble instead, so the name lines up with the bubble padding. The same goes for metadata on the last bubble.

```vue
<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        Can you review the token validation changes?
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        Looks good — ship it.
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="chatMessageAvatar" title="Avatar & Name" description="Messages with avatars and sender names. Place the name on the bubble when using bubbles, or on the message wrapper for raw content." locale="en" />

<DemoExample :demo="chatMessageGhost" title="Ghost" description="Ghost variant for messages without visible bubble boundaries. Keeps padding for alignment but renders a transparent background, useful for AI-style responses." locale="en" />

<DemoExample :demo="chatMessageMultiBubble" title="Multi-Bubble" description="Grouped bubbles using the group prop for corner radius reduction. Use first, middle, and last to visually connect related bubbles from the same sender." locale="en" />
