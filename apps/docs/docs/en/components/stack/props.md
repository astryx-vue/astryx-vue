---
layout: component-docs
title: Stack
outline: false
footer: false
---

## Stack Props

<div class="component-api-table" role="region" aria-label="Stack Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>direction</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'vertical'</code></td><td>Direction in which children are arranged.</td></tr>
      <tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>—</td><td>Space between adjacent children.</td></tr>
      <tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>Padding on every side of the container.</td></tr>
      <tr><td><code>paddingInline</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-axis padding. Overrides padding on this axis.</td></tr>
      <tr><td><code>paddingBlock</code></td><td><code>SpacingStep</code></td><td>—</td><td>Block-axis padding. Overrides padding on this axis.</td></tr>
      <tr><td><code>paddingBlockStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>Block-start (top) padding. Overrides <code>paddingBlock</code> and <code>padding</code> on that edge only.</td></tr>
      <tr><td><code>paddingBlockEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>Block-end (bottom) padding. Overrides <code>paddingBlock</code> and <code>padding</code> on that edge only.</td></tr>
      <tr><td><code>paddingInlineStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-start (left in LTR) padding. Overrides <code>paddingInline</code> and <code>padding</code> on that edge only.</td></tr>
      <tr><td><code>paddingInlineEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-end (right in LTR) padding. Overrides <code>paddingInline</code> and <code>padding</code> on that edge only.</td></tr>
      <tr><td><code>hAlign</code></td><td><code>StackAlignment</code></td><td>—</td><td>Controls horizontal main- or cross-axis alignment according to direction.</td></tr>
      <tr><td><code>vAlign</code></td><td><code>StackAlignment</code></td><td>—</td><td>Controls vertical main- or cross-axis alignment according to direction.</td></tr>
      <tr><td><code>justify</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>Alias for main-axis alignment.</td></tr>
      <tr><td><code>align</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>Alias for cross-axis alignment.</td></tr>
      <tr><td><code>wrap</code></td><td><code>'nowrap' | 'wrap' | 'wrap-reverse'</code></td><td><code>'nowrap'</code></td><td>Controls how children wrap.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Container width. Numbers are interpreted as pixels.</td></tr>
      <tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>Container height. Numbers are interpreted as pixels.</td></tr>
      <tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>—</td><td>Maximum container width.</td></tr>
      <tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>—</td><td>Minimum container height.</td></tr>
      <tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables automatic overflow scrolling.</td></tr>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'div'</code></td><td>Root element or Vue component.</td></tr>
    </tbody>
  </table>
</div>

`SpacingStep` accepts these values:

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## HStack Props

`HStack` uses a fixed horizontal direction.

- The component supports shared `Stack` props.
- The component does not expose `direction`.
- The table below defines alignment.

<div class="component-api-table" role="region" aria-label="HStack alignment Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>hAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>Horizontal main-axis alignment.</td></tr>
      <tr><td><code>vAlign</code></td><td><code>StackCrossAlignment</code></td><td><code>'stretch'</code></td><td>Vertical cross-axis alignment.</td></tr>
    </tbody>
  </table>
</div>

## VStack Props

`VStack` uses a fixed vertical direction.

- The component supports shared `Stack` props.
- The component does not expose `direction`.
- The table below defines alignment.

<div class="component-api-table" role="region" aria-label="VStack alignment Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>hAlign</code></td><td><code>StackCrossAlignment</code></td><td><code>'stretch'</code></td><td>Horizontal cross-axis alignment.</td></tr>
      <tr><td><code>vAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>Vertical main-axis alignment.</td></tr>
    </tbody>
  </table>
</div>

## StackItem Props

<div class="component-api-table" role="region" aria-label="StackItem Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>size</code></td><td><code>'static' | 'fill'</code></td><td><code>'static'</code></td><td>Keeps the intrinsic size or fills the remaining space.</td></tr>
      <tr><td><code>crossAlignSelf</code></td><td><code>'start' | 'center' | 'end' | 'stretch'</code></td><td>—</td><td>Overrides cross-axis alignment for this item.</td></tr>
      <tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables automatic overflow scrolling.</td></tr>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'div'</code></td><td>Root element or Vue component.</td></tr>
    </tbody>
  </table>
</div>

## Slots

Stack, HStack, VStack, and StackItem all receive content through the default slot.

## Native attributes

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.
