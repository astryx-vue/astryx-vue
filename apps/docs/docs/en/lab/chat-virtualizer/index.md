---
title: ChatVirtualizer
---

# ChatVirtualizer

A virtual list for long chat histories. Only the rows near the viewport are rendered; spacers stand in for the rest. While the reader sits at the bottom, new messages keep the view following the end. Once the reader scrolls up, new messages, older history loaded above, and rows above that grow all leave the row being read where it is.

<script setup lang="ts">
import { labChatVirtualizer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labChatVirtualizer" description="Two thousand messages, with only the few dozen in view rendered. Send while at the bottom and the view follows; scroll up and load older messages, and the row you are reading stays put." locale="en" title="Basic usage" /></ClientOnly>

This component is part of `@astryx-vue/lab` and ships only under the `canary` tag. Its API may still change.

## Import

```ts
import { ChatVirtualizer } from '@astryx-vue/lab'
```

## Two ways to use it

- **Own scroll container**: leave `scrollElement` unset. The component renders a scrolling `div`; give it a height and `overflow-y: auto`. That container is keyboard-focusable and is named "Messages" by default; change it with `label`.
- **Attach to an existing scroller**: pass that element as `scrollElement`. The component renders only the rows, and your element scrolls. The page scroller `document.documentElement` works too: positions are measured against the viewport, and a screen rotation keeps the row at the top of the view in place. Pass `null` while the element is not ready yet, and the component renders nothing.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `T[]` | Required | Messages from oldest to newest. Prepend older ones or append newer ones. |
| `getRowKey` | `(item: T, index: number) => string \| number` | Required | A stable identity per message, used to remember positions and sizes. |
| `estimatedItemSize` | `number` | `120` | The height assumed for rows that have not been measured yet. |
| `getItemType` | `(item: T, index: number) => string` | — | Groups rows by type so each type shares a measured average height, for better estimates. |
| `scrollElement` | `HTMLElement \| null` | — | The scroller in attach mode. Leave unset to use the component's own container. |
| `endThreshold` | `number` | `24` | How close to the bottom, in pixels, counts as at the bottom. New messages are followed only there. |
| `overscanTop` | `number` | `1600` | Extra pixels of rows rendered above the viewport. |
| `overscanBottom` | `number` | `600` | Extra pixels of rows rendered below the viewport. |
| `label` | `string` | Message key `@astryx.chatVirtualizer.label` | The accessible name of the own scroll container. |

Other attributes such as `class` and `style` land on the own scroll container, or on the content block in attach mode.

## Slots

| Name | Props | Description |
| --- | --- | --- |
| `default` | `{ item: T, index: number }` | Renders one row. |

## Instance methods

Call these on the component instance from a template `ref`.

| Name | Arguments | Description |
| --- | --- | --- |
| `scrollToDistanceFromBottomPx` | `px = 0` | Scrolls to `px` pixels above the bottom. `0` returns to the bottom and starts following again. |
| `anchorToKey` | `key, viewportOffset = 0` | Puts the top of row `key` `viewportOffset` pixels below the top of the view. Falls back to the bottom when the row is missing. |

## Behavior

- The row holding keyboard focus stays mounted even after it scrolls out of the rendered range, so focus is never lost.
- When scrolling up mounts a batch of history rows, the content block briefly carries `aria-busy="true"` so screen readers do not announce them as new. New messages at the bottom are not affected.
- While a finger scrolls on a touch screen, the component never moves the scroll position; it lines things up once the finger lifts.
- The component turns off the browser's own scroll anchoring on the scroller and restores it on unmount.
