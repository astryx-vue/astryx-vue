---
title: ChatReactionBar
---

# ChatReactionBar

A row of emoji reactions under a message. Each pill shows the emoji and a count. The current user's own reactions use the accent treatment and `aria-pressed="true"`. Listening for `add` renders a trailing button that opens a `ChatEmojiPicker`.

<script setup lang="ts">
import { labChatReactionBar } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labChatReactionBar" description="Click an existing reaction to toggle it. The plus button adds one from the picker." locale="en" title="Basic usage" /></ClientOnly>

This component ships in `@astryx-vue/lab` and is published only under the `canary` tag.

## Import

```ts
import { ChatReactionBar } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `reactions` | `ChatReaction[]` | required | Display order. `isSelected` marks the current user's reaction. `label` is both the tooltip and the accessible name. |
| `emojis` | `readonly ChatEmojiOption[]` | `DEFAULT_CHAT_EMOJIS` | Options in the add-reaction picker. |
| `addLabel` | `string` | message `@astryx.comments.addReaction` | Accessible name of the add button and the picker dialog. |
| `label` | `string` | `'Reactions'` | Accessible name of the group. |

Without `label`, the pill name is a count sentence such as `1 reaction with 🔥` or `2 reactions with 👀`.

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `toggle` | `emoji: string` | The user activated an existing reaction. |
| `add` | `emoji: string` | The user picked an emoji from the picker. The add button is omitted when nothing listens for this event. |

A disabled pill or add button, including `aria-disabled="true"`, drops the hover border and uses the default cursor. The component has no separate busy state.
