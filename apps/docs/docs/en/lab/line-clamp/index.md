---
title: LineClamp
---

# LineClamp

Clamps arbitrary content to a fixed number of lines with an ellipsis. `Text`'s `maxLines` clamps a Text element; LineClamp clamps whatever it wraps and adds no typography of its own, so it suits mixed inline content and nested elements without changing their font, color or wrapping.

<script setup lang="ts">
import { labLineClamp } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labLineClamp" description="A description with bold text and a link, clamped to two lines. Hover or Tab to it to see the full text." locale="en" title="Basic usage" /></ClientOnly>

## Import

```ts
import { LineClamp } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `maxLines` | `number` | Required | Maximum number of lines to show before clamping with an ellipsis. |
| `hasTruncateTooltip` | `boolean` | `true` | Shows the full text in a tooltip on hover, tap or keyboard focus when clamped. A clamped root is a tab stop (`tabindex="0"`); a `tabindex` you pass wins. The tooltip mounts on the first interaction. |
| `truncateTooltipPlacement` | `'above' \| 'below' \| 'start' \| 'end'` | `'above'` | Where the truncation tooltip opens. |
| `as` | `'div' \| 'span' \| 'p'` | `'div'` | Element to render. |

## Slots

| Name | Description |
| --- | --- |
| default | Content to clamp: mixed inline content or nested elements. |

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Use LineClamp to clamp a block of mixed or composed content, not a single Text. |
| <Badge variant="success">Recommended</Badge> | Use `Text`'s own `maxLines` to clamp a single Text; there is no need to wrap it in LineClamp. |
| <Badge variant="success">Recommended</Badge> | Turn the tooltip off with `:has-truncate-tooltip="false"` when the clamped content is already reachable elsewhere on the page, to avoid a redundant announcement. |

## Clipped focusable content

Line clamping clips paint, not layout, so a link on a clipped line would stay in the Tab order. LineClamp marks a focusable descendant `inert` when its box lies **wholly beyond the last visible line** and it sits **in the clamp's own flow**, and restores it once it shows again:

- A control any part of which is visible stays reachable. The element that holds focus is never made inert; LineClamp checks again once focus leaves.
- A fixed element, an absolute element whose containing block is the clamp or lies outside it, a popover or dialog, and anything inside a nested LineClamp are left alone.
- It only adds `inert` and never rewrites your own `tabindex` or `aria-hidden`; an element you made inert yourself keeps your setting.
- It checks again when its size, its content or its line wrapping changes, including a re-wrap after a font loads.
