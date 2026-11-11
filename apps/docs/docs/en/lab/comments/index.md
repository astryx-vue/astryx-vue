---
title: Comments
---

# Comments

The comments on one item: comment threads with one level of replies, reactions, edit history, inline-comment quotes, and activity events, with a composer for new comments. The host owns the data and every mutation; the panel owns presentation, selection, and focus.

This is the Vue port of the lab `Comments` in Meta Astryx, aligned to v0.7.13. It reuses `CommentThread` / `CommentRow` for each thread, `CommentComposerBase` for new comments, replies, and edits, and the standalone `EmojiPicker` in those composers. `CommentPin` is not in this slice.

<script setup lang="ts">
import { labComments } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labComments" description="A comments panel with threads, activity events, earlier comments to load, a failed post, an agent's reply in progress, and a composer for new comments. Press a thread to open its replies. Mark as resolved mutes the text and adds Reopen." locale="en" title="Comments panel" /></ClientOnly>

This component ships in `@astryx-vue/lab` and is published only under the `canary` tag.

## Import

```ts
import { Comments, DEFAULT_COMMENT_REACTIONS } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `comments` | `readonly CommentThreadData[]` | — | Controlled threads. Shown in time order with `events`, oldest first unless the list itself runs newest first. |
| `events` | `readonly CommentActivityEvent[]` | `[]` | Activity on the item, interleaved with the threads by time. |
| `label` | `string` | localized "Comments" | Accessible name of the Comments region. |
| `composerPosition` | `'top' \| 'bottom' \| 'none'` | `'bottom'` | Where the composer for new comments renders. |
| `density` | `'compact' \| 'balanced'` | `'balanced'` | Spacing of the list and dock. |
| `layout` | `'pane' \| 'embedded'` | `'pane'` | `pane` fills its container and scrolls, with the composer docked. `embedded` takes its content's height inside a host Card or Popover: no scroll area or dock, and on a card parent no rule above the first thread or below the last. |
| `selectedThreadId` | `string \| null` | — | Controlled selection for highlight sync. Omit it to let the panel own selection. Host selection opens the body and replies without moving focus or opening the reply composer. |
| `currentUser` | `CommentUser` | — | The viewer, for own-comment actions and composer avatars. |
| `mode` | `'interactive' \| 'non-editable' \| 'read-only'` | `'interactive'` | Which actions show. |
| `container` | `'section' \| 'card'` | `'section'` | Threads as outlined Cards, or as divider-bounded Sections inside a card or popover. |
| `composerAnchor` | `CommentAnchor` | — | The passage a new comment will attach to. The composer quotes it. An anchor the panel mounts with does not steal focus; one that arrives later does. |
| `onComposerAnchorDismiss` | `() => void` | — | Adds Remove quoted text to the composer's quoted passage. |
| `isLoading` | `boolean` | `false` | Shows comment-shaped placeholders instead of the threads, and a composer-shaped placeholder when a composer would show. |
| `loadError` | `string` | — | Shows an error Banner with the localized title "Comments couldn't load". With `onRetryLoad`, a Retry action. Announced once, assertively, through the shared channel; the Banner itself has no live role. |
| `hasOlderComments` / `isLoadingOlder` / `onLoadOlder` | boolean / boolean / function | `false` / `false` / — | Load earlier comments above the threads. A failure replaces the button with Retry and moves focus with it. |
| `onSubmit` | `(content: string, parentCommentId?: string) => void \| Promise<void>` | — | Posts a new comment, or a reply when a parent is passed. A rejected Promise restores the draft. |
| `onSaveEdit` / `onDelete` / `onReact` | function | — | Edit, delete (after a confirm dialog), and toggle a reaction. |
| `onResolveThread` / `onReopenThread` | function | — | Mark as resolved, or Reopen. |
| `onRetryComment` | `(commentId: string) => void \| Promise<void>` | — | Retry a comment whose `status` is `error`. |
| `loadVersions` | `(commentId: string) => Promise<readonly CommentVersion[]>` | — | Loads edit history, newest first. |
| `onUploadImages` | `CommentImageUploader` | — | Uploads images in any composer. |
| `composerError` | `string` | — | Host-owned error for the new-comment composer. |
| `emptyState` | `VNode` | default empty state | Replaces the default no-comments state. Also available as the `emptyState` slot. |
| `renderEvent` | `(event: CommentActivityEvent) => VNode` | default event row | Replaces the default activity event row. Also available as the `event` slot. |
| `isSubmitting` | `boolean` | `false` | Host-controlled pending state for composers. |
| `composerPlaceholder` | `string` | localized "Write a comment…" | Placeholder of the new-comment composer. |
| `highlightColor` | `CommentHighlightColor` | `'yellow'` | Palette color of quoted passages. |
| `reactionOptions` | `readonly CommentReactionOption[]` | `DEFAULT_COMMENT_REACTIONS` | Reactions Add reaction offers. |
| `hasEmojiPicker` | `boolean` | `true` | Whether composers offer the emoji picker. |

Shared thread callbacks (`onComposerDraftChange`, `getReplyMention`, `agentCommands`, `composerTriggers`, and the `render*` props) have the same meaning as on `CommentThread`.

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `selected-thread-change` | `threadId: string \| null` | The viewer selected a thread, or deselected the current one. |

## Slots

| Name | Description |
| --- | --- |
| `emptyState` | Replaces the default no-comments state. |
| `event` | Replaces the default activity event row. |
| `composer` | Replaces the new-comment composer input, with the same render props as `renderComposer`. |
| `composerControls` | Product-owned controls after the attach and emoji buttons. Keep it to one short control. |

## Layout

Give a `pane` a definite height; the panel fills that container, the list scrolls, and a bottom composer docks beneath it. An `embedded` panel is as tall as its threads and composer, and is meant to sit inside a Card or Popover. On a card parent, the first and last threads drop their outer rules so the card never nests another card.
