---
title: EmojiPicker
---

# EmojiPicker

A standalone emoji panel: a search field over every emoji by group, with frequent emoji first. Place it inline or inside a Popover. Choosing an emoji emits `select`. The picker keeps no selection of its own.

This is the Vue port of the lab `EmojiPicker` in Meta Astryx, not a rename of `ChatEmojiPicker`. `ChatEmojiPicker` stays a popover over a short, fixed reaction set. `EmojiPicker` loads the bundled CLDR groups (or the groups you pass), supports frequently used emoji, search-by-keyword, a preview footer, and one roving tab stop across every group. `CommentComposer` will reuse this panel later.

<script setup lang="ts">
import { labEmojiPicker, labEmojiPickerPopover } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labEmojiPicker" description="An inline picker in a Card. Filter by name or keyword; the chosen emoji appears below." locale="en" title="Inline picker" /></ClientOnly>

<ClientOnly><DemoExample :demo="labEmojiPickerPopover" description="Open the picker from a button in a Popover. The Popover's autofocus lands in the search field." locale="en" title="In a popover" /></ClientOnly>

This component ships in `@astryx-vue/lab` and is published only under the `canary` tag.

## Import

```ts
import { DEFAULT_FREQUENT_EMOJIS, EmojiPicker } from '@astryx-vue/lab'
```

Omit `categories` to load the bundled set the first time a picker mounts: every emoji through Emoji 15, with English CLDR names, taken from Meta Astryx v0.7.13 (generated from emojibase-data 17.0.0). Pass your own `categories` and `frequentEmojis` for a localized or custom set. An empty `frequentEmojis` array hides the Frequently used row.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `frequentEmojis` | `readonly EmojiOption[]` | `DEFAULT_FREQUENT_EMOJIS` | Emoji listed first, under Frequently used. An empty array leaves the row out. |
| `categories` | `readonly EmojiCategory[]` | bundled set | The emoji to offer, by group. Omit it to load the bundled set. |
| `height` | `number \| string` | `'calc(var(--astryx-spacing-8, 32px) * 10)'` | Height of the scrolling emoji list. |
| `hasAutoFocus` | `boolean` | `false` | Focuses the search field when the picker mounts, inline or in a Dialog. Inside a Popover, rely on the Popover's own autofocus instead. |
| `label` | `string` | message `@astryx.emojiPicker.label` | Accessible name of the emoji list. Also used as the footer text when no emoji is hovered or focused. |
| `searchLabel` | `string` | message `@astryx.emojiPicker.searchLabel` | Placeholder and hidden label of the search field. |

`EmojiOption` is `{ emoji: string; name: string; keywords?: readonly string[] }`. `EmojiCategory` is `{ name: string; emojis: readonly EmojiOption[] }`.

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `select` | `emoji: string, option: EmojiOption` | The chosen emoji and its option. |

## Keyboard and copy

Each group is a WAI-ARIA grid named by its heading, with rows of eight cells. One roving tab stop crosses every group: Tab from the search field lands on it, and the next Tab leaves the picker. Arrow keys follow the layout; Home and End move within a row; Ctrl+Home and Ctrl+End jump to the first and last emoji; Enter picks the focused emoji. Down from the search field moves into the first emoji, and Up from the first row comes back. Enter in the search field picks the first match. While an input method is composing, Enter and the arrows stay with it.

The filter, group headings, loading, load-failure, and empty-result sentences come from `@astryx.emojiPicker.*`. Bundled group names are translated; the bundled emoji names themselves stay in English CLDR unless you pass localized `categories`.
