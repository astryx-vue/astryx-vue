---
layout: component-docs
title: Layout Content
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="LayoutContent props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Scrolls the region when its content is taller than the space it was given.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the landmark element.</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>Internal padding using the spacing scale. Overrides the padding the surrounding layout passes down. <code>0</code> makes the region full bleed.</td></tr>
<tr><td><code>role</code></td><td><code>string</code></td><td>—</td><td>ARIA landmark role.</td></tr>
</tbody></table>
</div>

`SpacingStep` accepts these values:

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## Slots

- `default`: the primary content.

## Template ref

`LayoutContent` exposes `element`.
Its type is `HTMLDivElement | null`.

## Native attributes

The root element receives HTML attributes, `aria-*` attributes, `data-*` attributes, `class`, and `style`. `class` is merged with the component's own classes.
