---
layout: component-docs
title: Layout Panel
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="LayoutPanel props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>hasDivider</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Draws a rule on the edge that faces the content. Leave it off when an adjacent <code>ResizeHandle</code> already draws a line on that edge.</td></tr>
<tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Scrolls the panel when its content is taller than the panel.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the landmark element.</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>Internal padding using the spacing scale. Overrides the padding the surrounding layout passes down. <code>0</code> makes the panel full bleed.</td></tr>
<tr><td><code>resizable</code></td><td><code>LayoutResizable</code></td><td>—</td><td>The <code>props</code> object from <code>useResizable</code>. When it is given, the hook owns the width and <code>width</code> is ignored. Place a <code>ResizeHandle</code> next to the panel and give it the same object. The object carries the region's axis as <code>_direction</code> (<code>'horizontal' | 'vertical'</code>), which must match the handle's <code>direction</code>. Only <code>_size</code> is required, so a hand-built <code>{ _size: 250 }</code> still works.</td></tr>
<tr><td><code>role</code></td><td><code>string</code></td><td>—</td><td>ARIA landmark role, for example <code>navigation</code>.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Panel width. Numbers are pixels, strings are used as they are. Ignored when <code>resizable</code> is given.</td></tr>
</tbody></table>
</div>

`SpacingStep` accepts these values:

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## Slots

- `default`: the panel content.

## Template ref

`LayoutPanel` exposes `element`.
Its type is `HTMLDivElement | null`.

## Native attributes

The root element receives HTML attributes, `aria-*` attributes, `data-*` attributes, `class`, and `style`. `class` is merged with the component's own classes.
