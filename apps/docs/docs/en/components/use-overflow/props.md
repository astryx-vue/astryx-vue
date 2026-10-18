---
layout: component-docs
title: useOverflow
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useOverflow Parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>itemCount</code></td>
        <td><code>MaybeRefOrGetter&lt;number&gt;</code></td>
        <td>—</td>
        <td>Total number of items to measure for overflow.</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>UseOverflowOptions</code></td>
        <td>—</td>
        <td>Configuration object for overflow behavior.</td>
      </tr>
      <tr>
        <td><code>options.gap</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>Gap between items in pixels. Used in width calculations.</td>
      </tr>
      <tr>
        <td><code>options.minVisibleItems</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>Minimum number of items to always show, even if they don't fit.</td>
      </tr>
      <tr>
        <td><code>options.maxVisibleItems</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Upper bound on visible items, even when everything fits. The floor wins when it is larger.</td>
      </tr>
      <tr>
        <td><code>options.maxRows</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Wrap up to this many rows before the rest collapse into the indicator. Omitted or <code>1</code> keeps a single row.</td>
      </tr>
      <tr>
        <td><code>options.collapseFrom</code></td>
        <td><code>'start' | 'end'</code></td>
        <td><code>'end'</code></td>
        <td>Which end to collapse items from.</td>
      </tr>
      <tr>
        <td><code>options.behavior</code></td>
        <td><code>'observeParent' | 'observeSelf'</code></td>
        <td><code>'observeSelf'</code></td>
        <td>Which element to observe for overflow calculations. <code>observeParent</code> uses the container's parent element width, allowing the visible container to remain content-sized.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useOverflow Returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Template ref to attach to the visible container element.</td>
      </tr>
      <tr>
        <td><code>measureRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Template ref to attach to the hidden measurement container that holds all items.</td>
      </tr>
      <tr>
        <td><code>visibleCount</code></td>
        <td><code>Ref&lt;number&gt;</code></td>
        <td>Number of items that fit in the visible container.</td>
      </tr>
      <tr>
        <td><code>hasOverflow</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether any items are overflowing (<code>visibleCount &lt; itemCount</code>).</td>
      </tr>
      <tr>
        <td><code>rows</code></td>
        <td><code>Ref&lt;number&gt;</code></td>
        <td>How many rows the visible items occupy. <code>1</code> in the single-row mode, <code>0</code> when nothing is visible.</td>
      </tr>
      <tr>
        <td><code>rowHeight</code></td>
        <td><code>Ref&lt;number&gt;</code></td>
        <td>Tallest measured item height, for giving a multi-row container its height.</td>
      </tr>
      <tr>
        <td><code>remeasure</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Measures again. Useful after a test changes widths, or after the collapse state changes.</td>
      </tr>
    </tbody>
  </table>
</div>

## Element overload

`useOverflow(element, isActive)` is the other signature. It measures one box instead of a row of items: it reports whether the element's content is taller than its own visible area, and returns a single `Ref<boolean>`. It is off as long as `isActive` is false.

<div class="component-api-table" role="region" aria-label="useOverflow element overload" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>element</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Template ref of the box to measure.</td>
      </tr>
      <tr>
        <td><code>isActive</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether to measure. While it is false the result stays <code>false</code>.</td>
      </tr>
      <tr>
        <td><code>return</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the content is taller than the box.</td>
      </tr>
    </tbody>
  </table>
</div>
