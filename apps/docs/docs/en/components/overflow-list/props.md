---
layout: component-docs
title: Overflow List
outline: false
footer: false
---

## OverflowList Props

<div class="component-api-table" role="region" aria-label="OverflowList Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>items</code></td><td><code>OverflowListItem[]</code></td><td>-</td><td>Items to lay out. The ones that do not fit go into More.</td></tr>
      <tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td><code>2</code></td><td>Gap on the spacing scale.</td></tr>
      <tr><td><code>minVisibleItems</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum number of items to keep visible.</td></tr>
      <tr><td><code>maxVisibleItems</code></td><td><code>number</code></td><td>-</td><td>Maximum number of items to keep visible.</td></tr>
      <tr><td><code>maxRows</code></td><td><code>number</code></td><td>-</td><td>Wrap up to this many rows before overflowing.</td></tr>
      <tr><td><code>collapseFrom</code></td><td><code>'start' | 'end'</code></td><td><code>'end'</code></td><td>Which end collapses first.</td></tr>
      <tr><td><code>behavior</code></td><td><code>'observeSelf' | 'observeParent'</code></td><td><code>'observeSelf'</code></td><td>Measure the list or its parent.</td></tr>
      <tr><td><code>visibleCount</code></td><td><code>number</code></td><td>-</td><td>Forces the visible count and skips measurement.</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root for visible items and menu items.</td></tr>
    </tbody>
  </table>
</div>

## OverflowList events

<div class="component-api-table" role="region" aria-label="OverflowList events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>select</code></td><td>Fired when an item is chosen, with the item and the click event.</td></tr>
      <tr><td><code>overflowChange</code></td><td>Fired when the collapsed set changes. The payload is <code>{ item, index }[]</code>, where <code>index</code> is the item's original place in <code>items</code>. A list that fits from the start never fires. When everything fits again, it fires once with an empty array.</td></tr>
    </tbody>
  </table>
</div>

## OverflowList slots

<div class="component-api-table" role="region" aria-label="OverflowList slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>item</code></td><td>Custom item. Props are <code>{ item, index }</code>.</td></tr>
      <tr><td><code>overflow</code></td><td>Custom overflow. Props are <code>{ items }</code>. Defaults to the More menu.</td></tr>
    </tbody>
  </table>
</div>
