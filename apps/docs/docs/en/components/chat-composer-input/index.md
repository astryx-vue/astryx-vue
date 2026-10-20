---
layout: component-docs
title: Chat Composer Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatComposerInputControlled, chatComposerInputDisabled, chatComposerInputMentions, chatComposerInputMultipleTriggers, chatComposerInputSlashCommands } from '../../../../components/demos/chat-composer-input'
</script>

## Usage

Pass ChatComposerInput to ChatComposer's `input` slot when the draft needs trigger menus, inline tokens, history recall, dictation insertion, or file intake.

```ts
import { ChatComposerInput } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use the exposed handle for programmatic text or token insertion; inserted text follows the same `change` pipeline as typing. |
| <Badge variant="success">Do</Badge> | Use `files` for files pasted or dropped onto the editor, and keep file validation and upload progress in the product layer. |
| <Badge variant="error">Don't</Badge> | Use custom token rendering for ordinary mentions or commands; prefer the structured badge form so tokens remain predictable and themeable. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="chatComposerInputControlled"
  description="Controlled chat input with live value display. Use controlled mode when you need to read or transform the input value outside the composer."
  locale="en"
  title="ChatComposerInput — Controlled"
/>

<DemoExample
  :demo="chatComposerInputDisabled"
  description="Composer in a disabled state. Use when the input should be visible but not interactive, such as during streaming or when a prerequisite is unmet."
  locale="en"
  title="ChatComposerInput — Disabled"
/>

<DemoExample
  :demo="chatComposerInputMentions"
  description="Chat input with an @ trigger that opens a typeahead menu for mentioning users. Selected names appear as inline tokens."
  locale="en"
  title="ChatComposerInput — Mentions"
/>

<DemoExample
  :demo="chatComposerInputMultipleTriggers"
  description="Chat input with both @ mentions and / commands. Each trigger type renders tokens in a distinct color so users can tell them apart at a glance."
  locale="en"
  title="ChatComposerInput — Multiple Triggers"
/>

<DemoExample
  :demo="chatComposerInputSlashCommands"
  description="Chat input with a / trigger for command selection. Use for AI assistants or bots that support structured commands."
  locale="en"
  title="ChatComposerInput — Slash Commands"
/>
