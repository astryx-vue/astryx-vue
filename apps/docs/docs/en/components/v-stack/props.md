---
layout: component-docs
title: V Stack
outline: false
footer: false
---

## Props

`VStack` takes every `Stack` prop except `direction`, which is fixed to `vertical`.

<div class="component-api-table" role="region" aria-label="VStack props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>align</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>Horizontal alignment alias, so the prop reads the same as on <code>Stack</code>. Same as <code>hAlign</code>.</td></tr>
<tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'div'</code></td><td>Element or component rendered at the root.</td></tr>
<tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>—</td><td>Space between adjacent items, using the spacing scale.</td></tr>
<tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>Height of the column. Numbers are pixels, strings are used as they are.</td></tr>
<tr><td><code>hAlign</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>Horizontal cross-axis alignment of the items: <code>start</code>, <code>center</code>, <code>end</code>, or <code>stretch</code>.</td></tr>
<tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables scrollable overflow.</td></tr>
<tr><td><code>justify</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>Main-axis alignment alias. Mirrors CSS <code>justify-content</code>.</td></tr>
<tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>—</td><td>Maximum width of the column.</td></tr>
<tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>—</td><td>Minimum height of the column.</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>Padding on both axes, using the spacing scale.</td></tr>
<tr><td><code>paddingBlock</code></td><td><code>SpacingStep</code></td><td>—</td><td>Block-axis padding. Overrides <code>padding</code> on this axis.</td></tr>
<tr><td><code>paddingBlockEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>Bottom padding. Overrides <code>paddingBlock</code> and <code>padding</code> on that edge only.</td></tr>
<tr><td><code>paddingBlockStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>Top padding. Overrides <code>paddingBlock</code> and <code>padding</code> on that edge only.</td></tr>
<tr><td><code>paddingInline</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-axis padding. Overrides <code>padding</code> on this axis.</td></tr>
<tr><td><code>paddingInlineEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-end padding (right in LTR). Overrides <code>paddingInline</code> and <code>padding</code> on that edge only.</td></tr>
<tr><td><code>paddingInlineStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-start padding (left in LTR). Overrides <code>paddingInline</code> and <code>padding</code> on that edge only.</td></tr>
<tr><td><code>vAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>Vertical main-axis alignment of the items: <code>start</code>, <code>center</code>, <code>end</code>, <code>between</code>, <code>around</code>, or <code>evenly</code>.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the column. Numbers are pixels, strings are used as they are.</td></tr>
<tr><td><code>wrap</code></td><td><code>StackWrap</code></td><td><code>'nowrap'</code></td><td>Whether the items wrap onto another column: <code>nowrap</code>, <code>wrap</code>, or <code>wrap-reverse</code>.</td></tr>
</tbody></table>
</div>

The helper types are shared with `Stack`:

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
type StackMainAlignment = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
type StackCrossAlignment = 'start' | 'center' | 'end' | 'stretch'
type StackWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
type StackSizeValue = number | string
type StackElement = Component | string
```

## Slots

- `default`: the items in the column.

## Native attributes

The root element receives HTML attributes, `aria-*` attributes, `data-*` attributes, `class`, and `style`. `class` is merged with the component's own classes and `style` is merged with the sizing and spacing it already writes.
