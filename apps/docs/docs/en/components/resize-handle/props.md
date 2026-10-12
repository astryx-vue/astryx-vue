---
layout: component-docs
title: Resize Handle
outline: false
footer: false
---

## Resize Handle Props

<div class="component-api-table" role="region" aria-label="Resize Handle Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>direction</code></td>
        <td><code>'horizontal' | 'vertical'</code></td>
        <td><code>'horizontal'</code></td>
        <td><code>horizontal</code> changes width. <code>vertical</code> changes height. A horizontal handle sets <code>aria-orientation="vertical"</code>.</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>'inline' | 'overlay'</code></td>
        <td><code>'inline'</code></td>
        <td><code>inline</code> takes a track. <code>overlay</code> sits on the parent edge.</td>
      </tr>
      <tr>
        <td><code>isReversed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Flips the drag when the panel is on the end edge.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Turns pointer and keyboard resizing off.</td>
      </tr>
      <tr>
        <td><code>hasDivider</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Draws the 1px line. The line is the handle.</td>
      </tr>
      <tr>
        <td><code>isAlwaysVisible</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Keeps the grip visible at rest.</td>
      </tr>
      <tr>
        <td><code>pillPlacement</code></td>
        <td><code>'auto' | 'start' | 'end' | 'center'</code></td>
        <td><code>'auto'</code></td>
        <td>Where the grip sits on the line. <code>auto</code> stays on the panel side, and flips when the panel size is 0.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>locale string</td>
        <td>Accessible name. The English default is “Resize handle”.</td>
      </tr>
      <tr>
        <td><code>resizable</code></td>
        <td><code>ResizableProps</code></td>
        <td>-</td>
        <td>The <code>props</code> object returned by <code>useResizable</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Resize Handle Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Replaces the grip. The separator role and keyboard behavior stay on the handle.</td>
      </tr>
    </tbody>
  </table>
</div>

## useResizable

Import it from <code>@astryx-vue/core</code>. A single region returns <code>{ size, isCollapsed, collapse, expand, resize, props }</code>. A <code>regions</code> map returns one of those objects per key.

<div class="component-api-table" role="region" aria-label="useResizable options" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>defaultSize</code></td>
        <td><code>number | string | ResizablePercentSize</code></td>
        <td><code>250</code></td>
        <td>Starting size. A number is pixels. When <code>snaps</code> is set, the start value moves to the nearest snap.</td>
      </tr>
      <tr>
        <td><code>minSize</code></td>
        <td><code>number | string | ResizablePercentSize</code></td>
        <td><code>50</code></td>
        <td>Smallest expanded size.</td>
      </tr>
      <tr>
        <td><code>maxSize</code></td>
        <td><code>number | string | ResizablePercentSize</code></td>
        <td><code>Infinity</code></td>
        <td>Largest size.</td>
      </tr>
      <tr>
        <td><code>collapsible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Allows the region to collapse to 0.</td>
      </tr>
      <tr>
        <td><code>collapsedSize</code></td>
        <td><code>number</code></td>
        <td><code>40</code></td>
        <td>A drag below this pixel value collapses the region.</td>
      </tr>
      <tr>
        <td><code>snaps</code></td>
        <td><code>number[]</code></td>
        <td>-</td>
        <td>Pixel values to snap to. An equal distance keeps the first value.</td>
      </tr>
      <tr>
        <td><code>direction</code></td>
        <td><code>'horizontal' | 'vertical'</code></td>
        <td><code>'horizontal'</code></td>
        <td>Which container axis the percentage sizes read.</td>
      </tr>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>-</td>
        <td>Element used to resolve percentages. An unmeasured container uses 1200 and does not persist.</td>
      </tr>
      <tr>
        <td><code>autoSaveId</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Stores <code>{ size, isCollapsed }</code> at <code>astryx-resizable:</code> plus this id. A regions map appends <code>:key</code>.</td>
      </tr>
      <tr>
        <td><code>defaultIsCollapsed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Starts collapsed when <code>collapsible</code> is true.</td>
      </tr>
      <tr>
        <td><code>isCollapsed</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled collapsed state. Changes are reported through <code>onCollapseChange</code>.</td>
      </tr>
      <tr>
        <td><code>onSizeChange</code></td>
        <td><code>(size: number) =&gt; void</code></td>
        <td>-</td>
        <td>Called after a resize settles on a size.</td>
      </tr>
      <tr>
        <td><code>onCollapseChange</code></td>
        <td><code>(isCollapsed: boolean) =&gt; void</code></td>
        <td>-</td>
        <td>Called when the collapsed state changes.</td>
      </tr>
      <tr>
        <td><code>regions</code></td>
        <td><code>Record&lt;string, ResizableRegionConfig&gt;</code></td>
        <td>-</td>
        <td>Several regions. Each entry accepts the size fields above.</td>
      </tr>
    </tbody>
  </table>
</div>

<code>percent(value, { min })</code> or <code>percent(value, { max })</code> builds a percentage size. <code>min</code> and <code>max</code> use <code>{ type: 'pixel', value }</code>.

Arrow keys move 10px. Shift moves 50px. Home, End, and Enter jump to the minimum, the maximum, and the expanded size.

## Native attributes

`ResizeHandle` renders a `<div role="separator">`. HTML attributes, <code>aria-*</code>, <code>data-*</code>, <code>class</code>, and <code>style</code> go to that element. <code>class</code> is merged.
