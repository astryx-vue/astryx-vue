---
layout: component-docs
title: Chat Composer
outline: false
footer: false
---

<script setup lang="ts">
import { chatComposerAttachments, chatComposerFlat, chatComposerFooterActions, chatComposerFullFeatured, chatComposerSimple, chatComposerStreaming, chatComposerValidation } from '../../../../components/demos/chat-composer'
</script>

## Usage

ChatComposer is the message-entry shell for a chat surface. It coordinates a controlled or uncontrolled draft, provides a default token-capable input and send/stop action, and arranges optional drawer, header, footer, and status content. Custom inputs and send controls can join the same value, submission, disabled, stop, and focus contract through `useChatComposerContext()`.

```ts
import { ChatComposer } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="chatComposerAttachments"
  description="Chat composer with removable file tokens in a collapsible drawer. Use when users can attach files or context to their message."
  locale="en"
  title="ChatComposer — Attachments"
/>

<DemoExample
  :demo="chatComposerFlat"
  description="The composer is raised by default (elevation=&quot;low&quot;). Set elevation=&quot;none&quot; to flatten it; it then draws a border with the same rest / hover / focus treatment as a text input."
  locale="en"
  title="ChatComposer — Flat"
/>

<DemoExample
  :demo="chatComposerFooterActions"
  description="Chat composer with dropdown menus for a model selector and settings in the footer, and a mic button in the send actions slot."
  locale="en"
  title="ChatComposer — Footer Actions"
/>

<DemoExample
  :demo="chatComposerFullFeatured"
  description="Chat composer with all slots populated: collapsible attachment drawer, header actions, context progress bar, footer dropdown menus, and mic button. Shows the maximum composer configuration."
  locale="en"
  title="ChatComposer — Full Featured"
/>

<DemoExample
  :demo="chatComposerSimple"
  description="Minimal chat composer with a placeholder and submit handler. The simplest way to drop a message input into a page."
  locale="en"
  title="ChatComposer — Simple"
/>

<DemoExample
  :demo="chatComposerStreaming"
  description="Chat composer with streaming state and a stop button. Use when the assistant is generating a response and the user can cancel."
  locale="en"
  title="ChatComposer — Streaming"
/>

<DemoExample
  :demo="chatComposerValidation"
  description="Chat composer with error and warning status messages. Status can appear above or below the composer to surface validation or system feedback."
  locale="en"
  title="ChatComposer — Validation"
/>
