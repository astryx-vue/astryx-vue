---
title: ChatEmojiPicker
---

# ChatEmojiPicker

Opens a popover from a trigger button. A shortname field filters an 8-column emoji grid, and arrow keys move focus through that grid. Choosing an emoji emits `select`, closes the popover, and returns focus to the trigger.

<script setup lang="ts">
import { labChatEmojiPicker } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labChatEmojiPicker" description="Open the picker, filter by shortname, and the chosen emoji appears beside the button." locale="en" title="Basic usage" /></ClientOnly>

This component ships in `@astryx-vue/lab` and is published only under the `canary` tag.

## Import

```ts
import { ChatEmojiPicker, DEFAULT_CHAT_EMOJIS } from '@astryx-vue/lab'
```

`DEFAULT_CHAT_EMOJIS` is the built-in set of 16 common reactions. Pass `emojis` to replace it.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `emojis` | `readonly { emoji: string; name: string }[]` | `DEFAULT_CHAT_EMOJIS` | Options in the grid. `name` drives filtering and the button's accessible name. |
| `label` | `string` | `'Pick an emoji'` | Accessible name of the popover dialog. |
| `searchLabel` | `string` | message `@astryx.emojiPicker.searchLabel` | Placeholder and hidden label of the filter field. |

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `select` | `emoji: string` | The chosen emoji. The popover then closes and the filter clears. |

## Slots

The default slot is the trigger. It must contain a `<button>`. The popover attaches click handling and `aria-expanded` to that button.

The filter, the grid label, and the empty-result sentence come from `@astryx.emojiPicker.*`. Group, frequently-used, and load-failure keys are already on the message tree for a fuller picker later.
