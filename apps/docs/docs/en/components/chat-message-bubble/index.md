---
layout: component-docs
title: Chat Message Bubble
outline: false
footer: false
---

<script setup lang="ts">
import { chatMessageBubbleCustomContent, chatMessageBubbleDensity, chatMessageBubbleGrouping, chatMessageBubbleMetadata, chatMessageBubbleVariants } from '../../../../components/demos/chat-message-bubble'
</script>

## Usage

Styled content container for the chat "bubble." Reads sender from parent ChatMessage context to auto-style the background. Use filled for standard messages and ghost when content needs alignment without a visible boundary. Supports name/metadata slots aligned with bubble padding, and multi-bubble grouping via the group prop for consecutive messages from the same sender.

The sender is not a prop: the bubble reads it from the surrounding `ChatMessage`, so it colors and aligns itself. Outside a `ChatMessage` it falls back to the assistant side. A bubble whose only child is a code block, or an element with class `astryx-chat-card`, drops its own padding and background so the card lines up with the bubble edges.

```vue
<script setup lang="ts">
import { ChatMessage, ChatMessageBubble } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessage sender="user">
    <ChatMessageBubble>
      Can you review the token validation changes?
    </ChatMessageBubble>
  </ChatMessage>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="chatMessageBubbleCustomContent" title="Custom Content" description="Custom in-message content aligned to the bubble text column. An artifact card is wrapped in a ghost bubble with width=&quot;100%&quot;, so its left edge matches the bubble text and it spans the full message column instead of the default bubble width cap; the timestamp rides the bubble metadata slot." locale="en" />

<DemoExample :demo="chatMessageBubbleDensity" title="Density" description="Compact, balanced, and spacious density modes side by side. Density controls bubble padding, corner radius, and spacing between grouped bubbles." locale="en" />

<DemoExample :demo="chatMessageBubbleGrouping" title="Grouping" description="Multi-bubble messages using first, middle, and last group positions. Grouped bubbles tighten corner radius on the sender side for a continuous visual flow." locale="en" />

<DemoExample :demo="chatMessageBubbleMetadata" title="Metadata" description="Bubbles with name and metadata slots aligned to bubble padding. Put name on the first bubble and metadata on the last bubble in a message." locale="en" />

<DemoExample :demo="chatMessageBubbleVariants" title="Variants" description="Filled and ghost bubble variants for both user and assistant senders. Use filled for standard messages and ghost when content needs alignment without a visual boundary." locale="en" />
