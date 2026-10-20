---
layout: component-docs
title: Scrollable Area
outline: false
footer: false
---

## Scrollable Area Props

<div class="component-api-table" role="region" aria-label="Scrollable Area Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>axis</code></td>
        <td><code>'inline' | 'block' | 'both'</code></td>
        <td><code>'block'</code></td>
        <td>Logical axes that may scroll. The physical axis follows writing mode and direction.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name. Required. The viewport enters the tab order only while an axis overflows.</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>'group' | 'region'</code></td>
        <td><code>'group'</code></td>
        <td>Role of the named viewport.</td>
      </tr>
      <tr>
        <td><code>overscroll</code></td>
        <td><code>'allow' | 'contain'</code></td>
        <td><code>'allow'</code></td>
        <td>Whether a gesture at the edge continues into an ancestor. Containment applies only while that axis overflows.</td>
      </tr>
      <tr>
        <td><code>stickyContainment</code></td>
        <td><code>'whenScrollable' | 'always'</code></td>
        <td><code>'whenScrollable'</code></td>
        <td><code>whenScrollable</code> passes sticky ownership outward when the content fits. <code>always</code> keeps this viewport as the sticky boundary.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td><code>0</code></td>
        <td>Content padding on every edge.</td>
      </tr>
      <tr>
        <td><code>paddingInline</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Inline-axis content padding. Overrides <code>padding</code> on that axis.</td>
      </tr>
      <tr>
        <td><code>paddingInlineStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Inline-start content padding.</td>
      </tr>
      <tr>
        <td><code>paddingInlineEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Inline-end content padding.</td>
      </tr>
      <tr>
        <td><code>paddingBlock</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Block-axis content padding. Overrides <code>padding</code> on that axis.</td>
      </tr>
      <tr>
        <td><code>paddingBlockStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Block-start content padding.</td>
      </tr>
      <tr>
        <td><code>paddingBlockEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Block-end content padding.</td>
      </tr>
      <tr>
        <td><code>isFullBleed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Lets the viewport escape an ancestor's padding. Content padding stays as set.</td>
      </tr>
      <tr>
        <td><code>scrollbars</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether this area uses the custom scrollbar when a <code>ScrollbarsProvider</code> is above it. Set <code>false</code> to keep the native scrollbar.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Viewport width. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Viewport height. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Maximum viewport width.</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Minimum viewport height.</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` accepts `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`.

## Slots

<div class="component-api-table" role="region" aria-label="Scrollable Area Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Content inside the observed content box. Inline and both-axis modes size that box with <code>max-content</code> on the inline axis.</td>
      </tr>
    </tbody>
  </table>
</div>

## useScrollableArea

Import it from <code>@astryx-vue/core</code> when a component already owns the viewport and the content box. Options are <code>axis</code>, <code>label</code>, <code>role</code>, <code>overscroll</code>, and <code>stickyContainment</code>. It returns <code>viewport</code> (a callback ref), <code>content</code>, <code>viewportAttrs</code>, <code>viewportStyle</code>, and <code>state</code>.

Overflow uses a 1px tolerance. Before a measurement, a requested axis is <code>overflow: clip</code>. Afterward, an overflowing axis is <code>auto</code>.

## useScrollOverflow

<code>useScrollOverflow()</code> watches one horizontal scroller. Bind <code>scrollRef</code> to the element. <code>overflowStart</code>, <code>overflowEnd</code>, and <code>hasOverflow</code> are refs. The tolerance is 1px.

## Native attributes

`ScrollableArea` renders a `<div>`.

The following go to the viewport:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

`class` is merged. The viewport also sets `data-scroll-axis` and, once measured, `data-scrollable-*` and `data-scroll-*-start` / `data-scroll-*-end`.
