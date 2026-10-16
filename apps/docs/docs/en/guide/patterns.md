---
title: Patterns
---

<script setup lang="ts">
import { chatPatternConversation, chatPatternLanding } from '../../../components/demos/chat'
</script>

# Patterns

A conversation is a composition. The transcript, bubbles, reasoning, tool calls, citations, and the composer are separate components, and the page decides how they sit together. Nothing here calls a model. The body is a slot. Long replies are Markdown, and a source becomes a citation.

Before any transcript exists, the page is a greeting and one composer. The mode can move among writing, coding, research, and creative work. Sensitive and deep modes insert a chip instead. @ opens people, and / opens commands. Files sit in the drawer, and a long paste becomes a chip too. The microphone appears only when the browser can recognize speech. Choosing a category writes that suggestion into the composer.

Once a thread exists, the transcript is a column and the composer stays at the bottom. While the assistant is still writing, send becomes stop and the log is marked as streaming. Reasoning opens first, a tool call moves from running to complete, and the answer carries a citation. A generated document opens from a card. The full playground page keeps that document in a resizable side panel, and below 768px it becomes a full-screen dialog.

Both examples below can be used. The full pages are in the playground: [AI Chat Landing](/en/playground/?template=ai-chat-landing) and [AI Chat Conversation](/en/playground/?template=ai-chat). Density, unread rules, and metadata are documented on [Chat](/en/components/chat).

<DemoExample
  :demo="chatPatternLanding"
  description="Greeting, modes, mentions, commands, attachments, and category suggestions share one composer. Choosing a suggestion writes that prompt and switches the mode."
  locale="en"
  title="Landing"
/>

<DemoExample
  :demo="chatPatternConversation"
  description="One transcript carries reasoning, tool calls, a citation, and a document card. Sending grows the reply in that order, and stop is available while it is still running. The card opens a full-screen dialog."
  locale="en"
  title="Conversation"
/>
