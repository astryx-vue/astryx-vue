---
layout: component-docs
title: Chat
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatConversation } from '../../../../components/demos/chat'
</script>

## Usage

The chat display is a set of pieces that stack into a transcript: a scrolling layout, a message log, rows for each sender, bubbles, tool calls, a reasoning disclosure, a typing line, and an unread rule. Message bodies are slots. This suite does not render Markdown; pass plain text, or bring your own renderer.

`ChatLayout` is a column. The transcript grows, and the composer stays pinned to the bottom over a frosted scrim. By default the layout itself scrolls. Pass `scrollRef` when an ancestor should scroll instead, and the dock switches from sticky to fixed.

While the reader is at the bottom, new text keeps the view pinned there. Scrolling up lets go immediately and reveals the scroll-to-bottom button. If messages arrive while the view is unlocked, the button label changes to the localized “New messages” string, a live region announces it, and `ChatUnreadDivider` can mark the boundary. `ChatLayout` wires this through `useChatStreamScroll` and `useChatNewMessages`. Set `showScrollButton` to `false` to hide the built-in button, or replace it with the `scrollButton` slot.

```vue
<script setup lang="ts">
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatLayout>
    <ChatMessageList>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          Check the release notes for me.
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble name="Assistant">
          The notes are in the docs.
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
    <template #composer>
      <form><!-- your composer --></form>
    </template>
  </ChatLayout>
</template>
```

`ChatMessageList` is a `role="log"`. Pass `isStreaming` while an assistant reply is still growing, so a screen reader waits and announces the finished message once. `scrollToTopAction` runs when the top sentinel enters the scroll parent, and a spinner stays up until the promise settles.

`ChatMessage` is an article. `sender` is `user`, `assistant`, or `system`. A system row is centered and ignores the avatar, name, and metadata slots. Put the visible name on `ChatMessageBubble` when the body starts with a bubble, so the name lines up with the bubble padding.

`ChatToolCalls` takes the tool list an assistant turn already produced. One call is a single row. Several calls collapse behind a header; `label` replaces the localized count while the group is open. A call with `detail`, or the `detail` slot, can expand on its own. `v-model:is-expanded` controls the group.

`ChatReasoning` is the same kind of disclosure for a thinking trace. It starts collapsed. A plain-text default slot is reused as the one-line preview. `isStreaming` shimmers the label and hides both the preview and `duration`.

`ChatTypingIndicator` draws three dots. Pass `names` and it writes a sentence for one person, two people, or a named person plus a count. The root is `role="status"`, and that region is the only announcement. `ChatUnreadDivider` marks the first unread message, and new rows go below it.

The live example below runs all of these together: text appends one character at a time, tool calls and reasoning stay on the assistant turn, someone is typing, and the field at the bottom adds another exchange.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep the transcript in `ChatMessageList` and the field in the `composer` slot, so the frosted dock and the scroll button stay aligned. |
| <Badge variant="success">Do</Badge> | Set `isStreaming` for the whole time an assistant body is growing, and clear it when the message is complete. |
| <Badge variant="success">Do</Badge> | Use `ChatUnreadDivider` at the first message the reader has not seen. The scroll button’s “New messages” label is the announcement; the divider is the visible mark. |
| <Badge variant="success">Do</Badge> | Put plain text, citations, or your own renderer in the bubble slot. The bubble only supplies the surface. |
| <Badge variant="error">Don't</Badge> | Render a second scroll parent inside the layout. One element should own the transcript scroll, either the layout or the element passed as `scrollRef`. |
| <Badge variant="error">Don't</Badge> | Announce every streamed token yourself. The typing indicator speaks once through its own `role="status"`, and the new-message label speaks through the layout live region. |

## Examples

<DemoExample
  :demo="chatConversation"
  description="A transcript that appends text, lists tool calls, folds a reasoning trace, and shows who is typing. The unread rule sits before the first unread message, and anything you send appears below it."
  locale="en"
  title="Conversation"
/>
