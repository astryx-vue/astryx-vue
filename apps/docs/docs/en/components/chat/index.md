---
layout: component-docs
title: Chat
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatBubbleCustom, chatBubbleDensity, chatBubbleGrouping, chatBubbleMetadata, chatBubbleVariants, chatLayoutPanel, chatListDensity, chatListFull, chatMessageAvatar, chatMessageGhost, chatMessageGroup, chatMetadataFooter, chatMetadataStatus, chatMetadataTime, chatScrollLabels, chatSystemIcon, chatSystemStatus, chatSystemVariants, chatToolsExpandable, chatToolsSimple, chatToolsStatuses } from '../../../../components/demos/chat'
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

The examples below follow the Chat section of the Astryx docs, in the same order: layout, scroll button, message, bubble, list, metadata, system message, and tool calls.

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
  :demo="chatLayoutPanel"
  description="Narrow sidebar chat in a constrained container that triggers compact density. Use for side panels, drawers, or embedded chat widgets where horizontal space is limited."
  locale="en"
  title="ChatLayout — Panel View"
/>

<DemoExample
  :demo="chatScrollLabels"
  description="Scroll button with different labels for context-specific notifications like new messages, unread replies, or a generic scroll prompt."
  locale="en"
  title="ChatLayoutScrollButton — Labels"
/>

<DemoExample
  :demo="chatMessageAvatar"
  description="Messages with avatars and sender names. Place the name on the bubble when using bubbles, or on the message wrapper for raw content."
  locale="en"
  title="ChatMessage — Avatar & Name"
/>

<DemoExample
  :demo="chatMessageGhost"
  description="Ghost variant for messages without visible bubble boundaries. Keeps padding for alignment but renders a transparent background, useful for AI-style responses."
  locale="en"
  title="ChatMessage — Ghost"
/>

<DemoExample
  :demo="chatMessageGroup"
  description="Grouped bubbles using the group prop for corner radius reduction. Use first, middle, and last to visually connect related bubbles from the same sender."
  locale="en"
  title="ChatMessage — Multi-Bubble"
/>

<DemoExample
  :demo="chatBubbleCustom"
  description="Custom in-message content aligned to the bubble text column. A ghost bubble spans the message column, and the timestamp rides the bubble metadata slot."
  locale="en"
  title="ChatMessageBubble — Custom Content"
/>

<DemoExample
  :demo="chatBubbleDensity"
  description="Compact, balanced, and spacious density modes side by side. Density controls bubble padding, corner radius, and spacing between grouped bubbles."
  locale="en"
  title="ChatMessageBubble — Density"
/>

<DemoExample
  :demo="chatBubbleGrouping"
  description="Multi-bubble messages using first, middle, and last group positions. Grouped bubbles tighten corner radius on the sender side."
  locale="en"
  title="ChatMessageBubble — Grouping"
/>

<DemoExample
  :demo="chatBubbleMetadata"
  description="Bubbles with name and metadata slots aligned to bubble padding. Put name on the first bubble and metadata on the last bubble in a message."
  locale="en"
  title="ChatMessageBubble — Metadata"
/>

<DemoExample
  :demo="chatBubbleVariants"
  description="Filled and ghost bubble variants for both user and assistant senders. Use filled for standard messages and ghost when content needs alignment without a visual boundary."
  locale="en"
  title="ChatMessageBubble — Variants"
/>

<DemoExample
  :demo="chatListDensity"
  description="Side-by-side comparison of compact, balanced, and spacious densities. Use compact in sidebars, balanced for most full-page chat, and spacious for long-form reading."
  locale="en"
  title="ChatMessageList — Density"
/>

<DemoExample
  :demo="chatListFull"
  description="A transcript with a date divider, file names, a code sample, ghost bubbles, and metadata."
  locale="en"
  title="ChatMessageList — Full Featured"
/>

<DemoExample
  :demo="chatMetadataFooter"
  description="Assistant message with footer actions: copy, retry, thumbs up/down, and model label."
  locale="en"
  title="ChatMessageMetadata — Footer Actions"
/>

<DemoExample
  :demo="chatMetadataStatus"
  description="All 5 delivery statuses (sending, sent, delivered, read, and error), each with a timestamp."
  locale="en"
  title="ChatMessageMetadata — Status"
/>

<DemoExample
  :demo="chatMetadataTime"
  description="Timestamp-only metadata on user and assistant messages. Supports an absolute time and a relative label."
  locale="en"
  title="ChatMessageMetadata — Timestamps"
/>

<DemoExample
  :demo="chatSystemIcon"
  description="System messages with a leading icon that reinforces the message type."
  locale="en"
  title="ChatSystemMessage — Icon"
/>

<DemoExample
  :demo="chatSystemStatus"
  description="Status messages in a conversation flow: membership changes, a topic change, dates, and a resolution notice."
  locale="en"
  title="ChatSystemMessage — Status Updates"
/>

<DemoExample
  :demo="chatSystemVariants"
  description="Default and divider variants side by side. Use default for inline status updates and divider for date separators."
  locale="en"
  title="ChatSystemMessage — Variants"
/>

<DemoExample
  :demo="chatToolsExpandable"
  description="Tool calls with expandable result details. Click a row to reveal its result."
  locale="en"
  title="ChatToolCalls — Expandable"
/>

<DemoExample
  :demo="chatToolsSimple"
  description="A single inline tool call above a collapsible multi-call group with diff stats."
  locale="en"
  title="ChatToolCalls — Simple"
/>

<DemoExample
  :demo="chatToolsStatuses"
  description="All four status states (pending, running, complete, and error) shown together in a single group."
  locale="en"
  title="ChatToolCalls — Statuses"
/>
