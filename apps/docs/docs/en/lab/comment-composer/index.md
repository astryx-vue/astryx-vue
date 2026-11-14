---
title: CommentComposer
---

# CommentComposer

A comment composer: a growing input with typeahead triggers and image paste, above attach and emoji buttons and Post. It is controlled: the host owns the draft and clears it once the comment posts. Empty drafts never post.

This is the Vue port of the lab `CommentComposer` in Meta Astryx, aligned to v0.7.13 (including later focus behavior: disabled controls stay in the tab order, and a busy editor's Cancel link remains a tab stop). The emoji button reuses the standalone `EmojiPicker`. `CommentThread`, `Comments`, and `CommentPin` are not in this slice.

<script setup lang="ts">
import { labCommentComposer, labCommentComposerEdit } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCommentComposer" description="A controlled composer with a quoted passage. Post appends the draft to the list above and clears the input. Remove quoted text dismisses the quote." locale="en" title="New comment" /></ClientOnly>

<ClientOnly><DemoExample :demo="labCommentComposerEdit" description="CommentComposerBase in an edit context, with a Cancel link that stays in the tab order while the editor is busy." locale="en" title="Editing a comment" /></ClientOnly>

This component ships in `@astryx-vue/lab` and is published only under the `canary` tag.

## Import

```ts
import { CommentComposer, CommentComposerBase } from '@astryx-vue/lab'
```

`CommentComposer` is the standalone surface. Threads will reuse `CommentComposerBase` for replies and edits.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` / `modelValue` | `string` | `''` | The draft, controlled. Bind with `value` + `@change` or `v-model`. |
| `placeholder` | `string` | message `@astryx.commentComposer.placeholder` | Placeholder of the input. |
| `label` | `string` | the placeholder | Accessible name of the input. |
| `isSubmitting` | `boolean` | `false` | Holds attach and emoji while a post is in flight. The input stays enabled so focus is not dropped. Post stays focusable and refuses a second press. |
| `error` | `string` | — | Shows an error Banner above the composer. |
| `anchor` | `CommentAnchor` | — | The passage a new inline comment attaches to, quoted above the input. |
| `highlightColor` | `CommentHighlightColor` | `'yellow'` | Palette color of the quoted passage's rule. |
| `onUploadImages` | `(files: readonly File[]) => CommentUploadedImage[] \| Promise<...>` | — | Uploads attached, pasted, or dropped images and appends them as Markdown. Adds the attach button. A busy composer starts no upload. |
| `triggers` | `readonly ChatComposerTrigger[]` | `[]` | Typeahead triggers, such as an `@` people search. |
| `agentCommands` | `readonly CommentAgentCommand[]` | `[]` | Agents the comment can address: typing `/` lists them. |
| `hasEmojiPicker` | `boolean` | `true` | Whether the emoji picker button shows. |

`CommentAnchor` is `{ quote: string; status?: 'anchored' \| 'orphaned' }`. `CommentUploadedImage` is `{ url: string; alt: string }`. `CommentHighlightColor` is a palette name such as `'yellow'` or `'green'`.

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `change` / `update:modelValue` | `value: string` | The draft changed. |
| `submit` | `value: string` | Enter, or the Post button. Empty drafts never post. The host should clear the draft once the comment posts. |
| `retry` | — | Retry on the error Banner. |
| `anchor-dismiss` | — | Remove quoted text on the quoted passage. |

## Slots

| Name | Description |
| --- | --- |
| `controls` | Product-owned controls after the attach and emoji buttons. Keep it to one short control: the footer does not wrap. |
| `composer` | Replaces the default composer while keeping its state and context. |

## Keyboard and busy behavior

The input grows to five lines. Enter posts; Shift+Enter inserts a newline. While an input method is composing, Enter stays with it. Clicks on empty space in the composer focus the input, except clicks on its own controls or a layer it opened.

`isSubmitting` does not natively disable the input, the file picker, Cancel, or Post. Attach and emoji use `aria-disabled` and stay focusable. Cancel in an edit context stays in the tab order and does nothing until the post finishes. Pasted or dropped images, and a second Post, are refused while busy.
