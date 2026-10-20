---
layout: component-docs
title: Chat Message Metadata
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatMessageMetadataFooterActions, chatMessageMetadataStatus, chatMessageMetadataTimestamps } from '../../../../components/demos/chat-message-metadata'
</script>

## Usage

Place ChatMessageMetadata below a message or in the last ChatMessageBubble metadata slot to show a timestamp, footer content, and optional delivery status. Non-rendering scalar slots (booleans and empty strings) create no separator; numeric zero remains visible. Composite slot content remains caller-owned.

The row renders nothing at all when `timestamp`, `footer`, and `status` are all absent. The dots between the three parts only appear next to a part that is actually there, so a two-part row reads `2:30 PM · Read` and a three-part row reads `2:30 PM · GPT-4o · Read`.

```vue
<script setup lang="ts">
import { ChatMessageMetadata } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageMetadata status="read" timestamp="2:30 PM" />
</template>
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Put metadata in the last bubble metadata slot when the message uses bubbles, so it follows the bubble content. |
| <Badge variant="success">Do</Badge> | Pass timestamp and footer content independently; separators are omitted for non-rendering scalar slots. Composite slot content is used as supplied. |
| <Badge variant="error">Don't</Badge> | Do not supply footer actions without their own accessible names and interaction behavior; the metadata row does not own those controls. |
| <Badge variant="error">Don't</Badge> | Do not put the same metadata on both a bubble and its enclosing message. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="chatMessageMetadataFooterActions" title="Footer Actions" description="Assistant message with footer actions: copy, retry, thumbs up/down, and model label. Use for AI responses that need feedback or utility controls." locale="en" />

<DemoExample :demo="chatMessageMetadataStatus" title="Status" description="All 5 delivery statuses (sending, sent, delivered, read, and error), each with a timestamp. Use to show message delivery progress or surface failures." locale="en" />

<DemoExample :demo="chatMessageMetadataTimestamps" title="Timestamps" description="Timestamp-only metadata on user and assistant messages. Supports absolute time and relative formats via Timestamp." locale="en" />
