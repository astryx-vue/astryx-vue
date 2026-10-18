---
layout: component-docs
title: Chat Tool Calls
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatToolCallsExpandable, chatToolCallsSimple, chatToolCallsStatuses } from '../../../../components/demos/chat-tool-calls'
</script>

## Usage

ChatToolCalls displays tool or function call invocations from an LLM response. Pass an array of calls and the component handles the rest: a single call renders inline, while multiple calls collapse into a summary with the latest call visible at the surface. Use it anywhere an AI agent shows what actions it took.

An empty array renders nothing. Several calls collapse into one header row that shows the latest call; the header toggles between that summary and the full list. `v-model:is-expanded` controls the group, and `default-is-expanded` sets the state used while the model is unbound. `label` replaces the localized call count once the group is open. A call with `detail`, or the `detail` slot, expands on its own.

```vue
<script setup lang="ts">
import { ChatMessage, ChatToolCalls } from '@astryx-vue/core/Chat'

const calls = [
  { name: 'bash', status: 'complete' as const, target: 'git status', duration: '1.2s' },
]
</script>

<template>
  <ChatMessage sender="assistant">
    <ChatToolCalls :calls="calls" />
  </ChatMessage>
</template>
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Include a target string on every call so the user can see what the tool acted on: a file path, a shell command, or a search query. |
| <Badge variant="success">Do</Badge> | Show a duration on completed calls so users can judge which tools are slow and understand why a response took time. |
| <Badge variant="success">Do</Badge> | Provide a group label when the automatic count does not explain what the calls represent. |
| <Badge variant="success">Do</Badge> | Provide `detail` with a code block for calls that produce output (diffs for edits, terminal output for shell commands) so users can inspect results inline. |
| <Badge variant="success">Do</Badge> | Set a unique `key` on each call item when streaming so Vue can animate additions without re-mounting completed rows. |
| <Badge variant="error">Don't</Badge> | Don't omit the status field. Without it the call defaults to complete, which is misleading for calls that are still running or have failed. |
| <Badge variant="error">Don't</Badge> | Don't display tool calls outside a chat message context; they are designed to sit inside an assistant message, not as standalone UI. |
| <Badge variant="error">Don't</Badge> | Don't use custom wrappers around individual calls; the component handles single vs. grouped layout automatically based on the array length. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="chatToolCallsExpandable" title="Expandable" description="Tool calls with expandable result details showing diffs and command output in code blocks. Click a row to reveal its result." locale="en" />

<DemoExample :demo="chatToolCallsSimple" title="Simple" description="A single inline tool call above a collapsible multi-call group with diff stats. Shows both layouts side by side." locale="en" />

<DemoExample :demo="chatToolCallsStatuses" title="Statuses" description="All four status states (pending, running, complete, and error) shown together in a single group." locale="en" />
