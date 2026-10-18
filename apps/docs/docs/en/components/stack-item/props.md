---
layout: component-docs
title: Stack Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="StackItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'div'</code></td><td>Element or component rendered at the root.</td></tr>
<tr><td><code>crossAlignSelf</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>Overrides the parent stack's cross-axis alignment for this item: <code>start</code>, <code>center</code>, <code>end</code>, or <code>stretch</code>.</td></tr>
<tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables scrollable overflow. The wrapper already resets the flex minimum size, so <code>size="fill"</code> together with <code>isScrollable</code> is a complete scroll region.</td></tr>
<tr><td><code>size</code></td><td><code>'static' | 'fill'</code></td><td><code>'static'</code></td><td><code>static</code> keeps the natural size; <code>fill</code> expands to consume the space the other items leave over.</td></tr>
</tbody></table>
</div>

`StackCrossAlignment` accepts these values:

```ts
type StackCrossAlignment = 'start' | 'center' | 'end' | 'stretch'
```

## Slots

- `default`: the content of the item.

## Native attributes

The root element receives HTML attributes, `aria-*` attributes, `data-*` attributes, `class`, and `style`. `class` is merged with the component's own classes.
