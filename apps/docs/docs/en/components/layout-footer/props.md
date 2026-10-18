---
layout: component-docs
title: Layout Footer
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="LayoutFooter props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>hasDivider</code></td><td><code>boolean</code></td><td>—</td><td>Draws a rule along the top edge. When it is not set, <code>defaultHasDividers</code> on the parent <code>Layout</code> decides, and <code>false</code> is the last fallback.</td></tr>
<tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>Footer height. Numbers are pixels, strings are used as they are.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the landmark element.</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>Internal padding using the spacing scale. <code>0</code> lets the content manage its own inset.</td></tr>
<tr><td><code>role</code></td><td><code>string</code></td><td>—</td><td>ARIA landmark role.</td></tr>
</tbody></table>
</div>

`SpacingStep` accepts these values:

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## Slots

- `default`: the footer content.

## Template ref

`LayoutFooter` exposes `element`.
Its type is `HTMLDivElement | null`.

## Native attributes

The root element receives HTML attributes, `aria-*` attributes, `data-*` attributes, `class`, and `style`. `class` is merged with the component's own classes.
