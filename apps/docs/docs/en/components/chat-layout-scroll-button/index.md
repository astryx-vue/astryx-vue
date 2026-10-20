---
layout: component-docs
title: Chat Layout Scroll Button
outline: false
footer: false
---

<script setup lang="ts">
import { chatLayoutScrollButtonLabels } from '../../../../components/demos/chat-layout-scroll-button'
</script>

## Usage

Floating scroll-to-bottom button that appears when the user scrolls away from the latest messages. It fades in as a compact icon button and expands to show a label when new messages arrive. ChatLayout renders this by default: pass a custom element to the `scrollButton` slot to override, or `showScrollButton: false` to hide it entirely.

```ts
import { ChatLayoutScrollButton } from '@astryx-vue/core/Chat'
```

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="chatLayoutScrollButtonLabels"
  description="Scroll button with different labels for context-specific notifications like new messages, unread replies, or a generic scroll prompt."
  locale="en"
  title="ChatLayoutScrollButton — Labels"
/>
