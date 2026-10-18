---
layout: component-docs
title: Chat Layout
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatLayoutPanelView } from '../../../../components/demos/chat-layout'
</script>

## Usage

ChatLayout is the layout shell for full-page chat interfaces. It renders messages in normal page flow and docks the composer to the bottom with a frosted glass blur layer. Set the `density` prop to control spacing; it defaults to `balanced`. Use it to wrap ChatMessageList and ChatComposer for a complete chat experience with built-in auto-scroll and a scroll-to-bottom button.

```ts
import { ChatLayout } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass ChatMessageList as children and ChatComposer as the `composer` slot for a complete chat interface. |
| <Badge variant="success">Do</Badge> | Provide an `empty` slot so new conversations show a prompt instead of a blank screen. |
| <Badge variant="success">Do</Badge> | Use `scrollRef` when the chat is embedded in a page where a parent element handles scrolling. |
| <Badge variant="error">Don't</Badge> | Apply a fixed height on the layout; let it fill its container with `flex: 1`. |
| <Badge variant="error">Don't</Badge> | Render multiple ChatLayout instances in the same scroll container; each expects to own its scroll context. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="chatLayoutPanelView"
  description="Narrow sidebar chat in a constrained container that triggers compact density. Use for side panels, drawers, or embedded chat widgets where horizontal space is limited."
  locale="en"
  title="ChatLayout — Panel View"
/>
