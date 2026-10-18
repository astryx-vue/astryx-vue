---
layout: component-docs
title: useContainerReveal
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useContainerRevealRows } from '../../../../components/demos/use-container-reveal'
</script>

## Usage

A headless hover/focus reveal primitive. Gives a container a scoped trigger that reveals (or conceals) content inside it when the container is hovered or receives keyboard focus: the classic "row actions appear on hover" pattern. The reveal is CSS-only: no hover state lives in Vue and hovering never triggers a re-render. The caller authors no CSS for the reveal itself; the hook hands out the container and content classes, and a nested container shadows its ancestor, so nested containers never leak hover/focus into one another. Accessible by construction: revealed content is visually hidden at rest with position and opacity (never `display: none`), so it stays mounted, keeps its place in the tab order, and is announced to assistive technology; it reveals on `:focus-within` so keyboard users see it when tabbing in, stays visible on touch (never gated behind hover on coarse pointers), and honors `prefers-reduced-motion`.

`containerProps()` returns `class` and `style` for the container; `contentProps()` returns the `class` for each revealed child. Bind them with `:class` and `:style`.

```ts
import { useContainerReveal } from '@astryx-vue/core'
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Destructure `containerProps` and `contentProps`; bind `containerProps()` on the container (alongside your own classes) and `contentProps()` on the content to reveal. |
| <Badge variant="success">Do</Badge> | Use for secondary affordances: reveal-on-hover row actions (edit/copy/remove on list or table rows) and overlay controls on a card or media tile (e.g. `Thumbnail`'s remove button). |
| <Badge variant="success">Do</Badge> | Gate the reveal with `isEnabled` when a consumer prop decides whether content is revealed on hover or always shown; it can change at any time. |
| <Badge variant="success">Do</Badge> | Pass `isLayoutPreserved` for absolutely-positioned or overlay content to reserve its box and avoid layout shift when it appears. |
| <Badge variant="success">Do</Badge> | Set a `hoverDelay` (100-250ms) on rows in a long list, so a cursor travelling across the list does not light up every row it passes; keyboard and touch still reveal immediately. |
| <Badge variant="success">Do</Badge> | Reach for `forceState` when something other than the pointer owns the interaction (a drag, a scroll or motion gate, an open row menu), and `forceVisibility` when just one element should ignore the container. |
| <Badge variant="error">Don't</Badge> | Reach past the API into the hook's private custom properties (`--_reveal-opacity` and friends) to suppress a reveal; use `forceState` / `forceVisibility`, which survive a rename. |
| <Badge variant="error">Don't</Badge> | Use it to hide content that must always be discoverable; keep essential actions visible instead of gating them behind hover. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useContainerRevealRows"
  description="File rows keep their edit and delete actions hidden at rest and reveal them on hover or keyboard focus via useContainerReveal; the actions stay mounted and in the tab order."
  locale="en"
  title="useContainerReveal — Reveal-on-hover Row Actions"
/>
