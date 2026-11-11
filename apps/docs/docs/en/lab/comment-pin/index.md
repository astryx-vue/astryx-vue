---
title: CommentPin
---

# CommentPin

An avatar-first button that opens one anchored annotation thread, or a caller-defined group of threads. A single marker shows its lead participant. A grouped marker shows up to three participant circles — two plus an ellipsis when more than three people participate — and the exact thread total. Whenever any represented thread is unread, an accent status dot appears after the total, or after the participant on a single pin.

This is the Vue port of the lab `CommentPin` in Meta Astryx, aligned to v0.7.13. The host owns grouping, representative selection, coordinates, collision handling, and the comments surface opened by the pin. The pin owns only its button surface and controlled visual states. It reuses the existing lab comment stack where a host wants to open `Comments` or `CommentThread`; it does not replace `ChatEmojiPicker`.

<script setup lang="ts">
import { labCommentPin, labCommentPinSizes } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCommentPin" description="Two pins on a placement canvas that matches the official Over content and in margin story. The grouped pin starts selected over the image. Activating the selected pin clears it; the other pin dims while one is selected." locale="en" title="Over content and in the margin" /></ClientOnly>

This component ships in `@astryx-vue/lab` and is published only under the `canary` tag.

## Import

```ts
import { CommentPin } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Required accessible action name and hover/focus tooltip. Include grouped, unread, or resolved context when it changes the action's meaning, for example “Open 4 grouped annotations from Ada and Lin, 2 unread”. |
| `participants` | `readonly [CommentPinParticipant, ...CommentPinParticipant[]]` | — | Non-empty ordered participants, lead first. A single pin renders the first. A grouped pin renders distinct IDs as an `AvatarGroup` of at most three circles: every participant when three or fewer are distinct, otherwise the first two plus an ellipsis overflow circle. Pass every distinct participant so the overflow appears only when more than three people participate. Each record has `id`, `name`, and optional `avatarSrc`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Pin height on the element-size scale: `sm` 28px, `md` 32px, `lg` 36px, with 22px, 24px, and 28px participant circles. |
| `threadCount` | `number` | `1` | Total number of threads represented by this marker. Values above one use the grouped presentation and show the exact total. Invalid values fall back to 1. |
| `unreadCount` | `number` | `0` | Number of represented threads with unread activity, capped to `threadCount`. When above zero, an accent status dot appears at the end of the pin. It is not a second number. Invalid values are ignored. |
| `isSelected` | `boolean` | `false` | Whether this pin is the currently selected annotation target. |
| `isDimmed` | `boolean` | `false` | Whether another pin is selected in the host. Dims this pin without disabling it, so it remains available to switch selection. |
| `isResolved` | `boolean` | `false` | Whether every thread represented by this pin is resolved. A resolved pin renders nothing unless it is selected, so resolved discussion leaves the content while a thread the reader opened keeps its anchor. |
| `isDisabled` | `boolean` | `false` | Whether activation is unavailable. Disabled pins stay focusable with `aria-disabled="true"` rather than the native `disabled` attribute, so focus is not lost if the pin becomes disabled while focused. |

`CommentPinParticipant` is `{ id: string, name: string, avatarSrc?: string }`.

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `click` | `event: MouseEvent` | The pin was activated. Not emitted when the pin is disabled; the click also does not reach a clickable ancestor. |

## Placement

Absolute placement maps the host anchor to the pin's logical bottom-start corner: the speech-bubble silhouette keeps a fixed 2px `border-end-start-radius`, and the other three corners are half the pin height. Position the pin, then `translateY(-100%)` so the pointed corner sits on the anchor. The pin does not compute coordinates or resolve collisions.

<ClientOnly><DemoExample :demo="labCommentPinSizes" description="The three element sizes for a single pin, a group, overflow, unread markers, and a selected group." locale="en" title="Sizes" /></ClientOnly>

## Accessibility

The button is the only accessible control. Avatars, the overflow ellipsis, the thread total, and the unread dot sit in `aria-hidden` rails. `aria-pressed` reflects selection. The tooltip uses `label` and is suppressed when the pin is disabled or the label is empty.
