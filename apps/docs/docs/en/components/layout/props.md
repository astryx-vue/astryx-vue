---
layout: component-docs
title: Layout
outline: false
footer: false
---

## Layout Props

<div class="component-api-table" role="region" aria-label="Layout Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>contentWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Maximum width of the aligned content. Dividers stay full width. Numbers are pixels. A percentage, <code>fit-content</code>, <code>max-content</code>, <code>min-content</code>, or a bare <code>var()</code> uses constrained width.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>'fill' | 'auto'</code></td>
        <td><code>'fill'</code></td>
        <td><code>fill</code> stretches to the container and scrolls the content. <code>auto</code> grows with the content.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Outer inset for this layout only. It does not pass to a nested layout. <code>0</code> is full bleed.</td>
      </tr>
      <tr>
        <td><code>defaultHasDividers</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Fallback for a header or footer that does not set <code>hasDivider</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` accepts `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`.

## Layout Slots

<div class="component-api-table" role="region" aria-label="Layout Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The content region. Put a <code>LayoutContent</code> here.</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td>The top region. Put a <code>LayoutHeader</code> here.</td>
      </tr>
      <tr>
        <td><code>start</code></td>
        <td>The inline-start region. Put a <code>LayoutPanel</code> here, and a <code>ResizeHandle</code> beside it when the panel resizes.</td>
      </tr>
      <tr>
        <td><code>end</code></td>
        <td>The inline-end region.</td>
      </tr>
      <tr>
        <td><code>footer</code></td>
        <td>The bottom region. Put a <code>LayoutFooter</code> here.</td>
      </tr>
    </tbody>
  </table>
</div>

## Layout Header Props

<div class="component-api-table" role="region" aria-label="Layout Header Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hasDivider</code></td>
        <td><code>boolean</code></td>
        <td>inherited</td>
        <td>Border on the bottom edge. Omit it to use <code>defaultHasDividers</code>, which is false when the layout does not set one.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Height. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Padding. <code>0</code> lets the content own its inset.</td>
      </tr>
      <tr>
        <td><code>paddingBlockEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Bottom padding only, so a tab underline can meet the divider.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name when <code>role</code> is set.</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>AriaRole</code></td>
        <td>-</td>
        <td>ARIA landmark role.</td>
      </tr>
    </tbody>
  </table>
</div>

`LayoutHeader` has a default slot for its content.

## Layout Footer Props

`LayoutFooter` accepts <code>hasDivider</code>, <code>height</code>, <code>padding</code>, <code>label</code>, and <code>role</code> with the same meaning as the header. <code>hasDivider</code> draws the border on the top edge. It has a default slot.

## Layout Content Props

<div class="component-api-table" role="region" aria-label="Layout Content Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Padding. <code>0</code> lets a child such as <code>Section</code> reach the edges.</td>
      </tr>
      <tr>
        <td><code>isScrollable</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Scroll this region when the content overflows.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name when <code>role</code> is set.</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>AriaRole</code></td>
        <td>-</td>
        <td>ARIA landmark role.</td>
      </tr>
    </tbody>
  </table>
</div>

`LayoutContent` has a default slot.

## Layout Panel Props

<div class="component-api-table" role="region" aria-label="Layout Panel Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hasDivider</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Border on the edge that faces the content. Leave it off when a <code>ResizeHandle</code> draws that line.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Padding. Omit it and a panel without a divider collapses the margin that faces the content.</td>
      </tr>
      <tr>
        <td><code>isScrollable</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Scroll this panel when the content overflows.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Width. Numbers are pixels. Ignored while <code>resizable</code> is set.</td>
      </tr>
      <tr>
        <td><code>resizable</code></td>
        <td><code>LayoutResizable</code></td>
        <td>-</td>
        <td>The <code>props</code> object from <code>useResizable</code>. The panel width follows <code>_size</code>, and the object also carries the region's axis as <code>_direction</code> (<code>'horizontal' | 'vertical'</code>), which must match the adjacent <code>ResizeHandle</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name when <code>role</code> is set.</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>AriaRole</code></td>
        <td>-</td>
        <td>ARIA landmark role, for example <code>navigation</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

`LayoutPanel` has a default slot.

## Native attributes

Each piece renders a `<div>`.

The following go to its root:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

`class` is merged. `Layout` sets `data-height`.
