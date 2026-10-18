---
layout: component-docs
title: Chat System Message
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatSystemMessageIcon, chatSystemMessageStatusUpdates, chatSystemMessageVariants } from '../../../../components/demos/chat-system-message'
</script>

## Usage

Use ChatSystemMessage for concise, non-sender content inside a chat transcript. Choose the default variant for factual status notices and the divider variant for date or section breaks. Long default content wraps within the available width. The component exposes status semantics and the divider branch includes a labelled separator.

The row is `role="status"`, so a change here is announced without moving focus. Text goes in the default slot and is required. The `icon` slot renders before the text in the default variant; the divider variant renders a labelled `Divider` and ignores the icon.

```vue
<script setup lang="ts">
import { ChatSystemMessage } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatSystemMessage>Alex joined the conversation</ChatSystemMessage>
  <ChatSystemMessage variant="divider">
    March 15, 2026
  </ChatSystemMessage>
</template>
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep the visible message concise and self-contained so it remains understandable without an icon. |
| <Badge variant="success">Do</Badge> | Use the divider variant for temporal or section boundaries and the default variant for factual status notices. |
| <Badge variant="error">Don't</Badge> | Use ChatSystemMessage for sender-authored content; use ChatMessage and ChatMessageBubble instead. |
| <Badge variant="error">Don't</Badge> | Use caller-provided icon artwork as the only source of meaning; the visible message must carry the same information. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="chatSystemMessageIcon" title="Icon" description="System messages with a leading icon that reinforces the message type. Use icons to help users scan and identify message categories at a glance." locale="en" />

<DemoExample :demo="chatSystemMessageStatusUpdates" title="Status Updates" description="Realistic status messages in a conversation flow showing membership changes, timestamps, and resolution notices." locale="en" />

<DemoExample :demo="chatSystemMessageVariants" title="Variants" description="Default and divider variants side by side. Use default for inline status updates and divider for date separators or section breaks." locale="en" />
