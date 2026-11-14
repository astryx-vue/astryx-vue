---
title: CommentThread
---

# CommentThread

One comment thread on its own: its first comment, one level of replies, reactions, edit history, and a reply composer. Use it for a margin comment beside a document, a popover under a highlight, or any surface that shows a single thread.

This is the Vue port of the lab `CommentThread` in Meta Astryx, aligned to v0.7.13. It reuses `CommentComposerBase` for replies and edits, and the standalone `EmojiPicker` in those composers. `Comments` and `CommentPin` are not in this slice.

<script setup lang="ts">
import { labCommentThread } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCommentThread" description="A margin comment inside a card: the thread supplies its own insets and draws no outer rules. Press the surface to open the replies and the reply composer. Mark as resolved mutes the text and adds Reopen." locale="en" title="Margin comment" /></ClientOnly>

This component ships in `@astryx-vue/lab` and is published only under the `canary` tag.

## Import

```ts
import { CommentThread, DEFAULT_COMMENT_REACTIONS } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `comment` | `CommentThreadData` | — | The thread: its first comment, carrying replies, an optional quoted passage, and `typingUsers`. |
| `isSelected` | `boolean` | — | Controlled open state. Omit it to let the thread own selection. Host selection reveals the body and replies without moving focus or opening the composer. |
| `currentUser` | `CommentUser` | — | The viewer, for own-comment actions and the reply avatar. |
| `mode` | `'interactive' \| 'non-editable' \| 'read-only'` | `'interactive'` | Which actions show. |
| `container` | `'section' \| 'card'` | `'section'` | An outlined Card on a page, or a Section without outer rules inside a card or popover. |
| `onSubmit` | `(content: string, parentCommentId?: string) => void \| Promise<void>` | — | Posts a reply. The parent is always the first comment. A rejected Promise restores the draft with Retry. |
| `onSaveEdit` / `onDelete` / `onReact` | function | — | Edit, delete (after a confirm dialog), and toggle a reaction. |
| `onResolveThread` / `onReopenThread` | function | — | Mark as resolved, or Reopen. |
| `onRetryComment` | `(commentId: string) => void \| Promise<void>` | — | Retry a comment whose `status` is `error`. |
| `loadVersions` | `(commentId: string) => Promise<readonly CommentVersion[]>` | — | Loads edit history, newest first. |
| `onUploadImages` | `CommentImageUploader` | — | Uploads images in the reply or edit composer. |
| `onComposerDraftChange` | `(value: string, context: CommentComposerContext) => void` | — | Reports internally owned reply and edit drafts. |
| `isSubmitting` | `boolean` | `false` | Host-controlled pending state for the reply composer. |
| `composerPlaceholder` | `string` | localized "Reply to \<name\>…" | Placeholder of the reply composer. |
| `highlightColor` | `CommentHighlightColor` | `'yellow'` | Palette color of the quoted passage's rule. |
| `reactionOptions` | `readonly CommentReactionOption[]` | `DEFAULT_COMMENT_REACTIONS` | Reactions Add reaction offers. |
| `agentCommands` / `composerTriggers` | arrays | — | Slash commands and typeahead triggers for composers. |
| `hasEmojiPicker` | `boolean` | `true` | Whether composers offer the emoji picker. |
| `onDismiss` | `() => void` | — | The thread owns light dismissal for an anchored host. Prefer `@dismiss`. Pair with `hasLightDismiss={false}` and `hasEscapeDismiss={false}` on the host Popover. |

`CommentThreadData` extends `CommentData` with `replies`, `anchor`, `isResolved`, `resolvedBy`, `typingUsers`, `isHighlighted`, and `canResolve`.

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `selected-change` | `isSelected: boolean` | The viewer opened or closed the thread. |
| `dismiss` | — | An outside press or unclaimed Escape requested dismissal. The first request over an unsaved draft shakes the thread, refocuses the draft, and announces instead. |

## Slots

| Name | Description |
| --- | --- |
| `anchor` / `body` / `versionBody` / `additionalActions` / `composer` | Same roles as the `render*` callbacks: replace the quote, body, history version, header actions, or composer input. The `render*` props remain available for hosts that already pass functions. |

## Keyboard and dismissal

A press on the surface opens the thread and, for a pointer, the reply composer. A keyboard activation keeps focus on the hidden thread toggle so the same key can close it. With `onDismiss`, Escape dismisses only when no layer inside the thread is open. An unsaved reply or edit turns the first dismissal into a shake, a focus move, and a polite announcement; the next consecutive request dismisses. Under `prefers-reduced-motion: reduce` the thread does not shake; focus and the announcement remain.
