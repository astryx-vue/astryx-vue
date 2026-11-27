---
layout: component-docs
title: useResizable
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useResizable parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>defaultSize</code></td>
        <td><code>ResizableSize | string</code></td>
        <td><code>250</code></td>
        <td>Initial size. Numbers, exact <code>"Npx"</code>, and <code>pixel(value)</code> are pixels. Exact <code>"N%"</code> has no additional pixel bound. <code>percent(value, { min: pixel(value) })</code> or <code>percent(value, { max: pixel(value) })</code> adds one pixel floor or ceiling. A percentage resolves once into pixels, against <code>containerRef</code> when supplied and against the viewport otherwise, and does not track its basis afterwards.</td>
      </tr>
      <tr>
        <td><code>minSize</code></td>
        <td><code>ResizableSize | string</code></td>
        <td><code>50</code></td>
        <td>Minimum size. Numbers, exact <code>"Npx"</code>, and <code>pixel(value)</code> remain pixels; exact <code>"N%"</code> has no additional pixel bound; <code>percent()</code> adds exactly one. Percentage minimums re-resolve when their basis changes and clamp the current pixel selection.</td>
      </tr>
      <tr>
        <td><code>maxSize</code></td>
        <td><code>ResizableSize | string</code></td>
        <td><code>Infinity</code></td>
        <td>Maximum size. Numbers, exact <code>"Npx"</code>, and <code>pixel(value)</code> remain pixels; exact <code>"N%"</code> has no additional pixel bound; <code>percent()</code> adds exactly one. Percentage maximums re-resolve when their basis changes and clamp the current pixel selection.</td>
      </tr>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>The element a percentage is a share of. Caller-owned: the hook never infers one. Omitted, percentages use the viewport. The ref may point at a different element over time and the basis follows it. Until that element is laid out (not yet mounted, <code>display:none</code>, detached) percentages use a temporary 1200px basis and nothing is persisted from it.</td>
      </tr>
      <tr>
        <td><code>direction</code></td>
        <td><code>'horizontal' | 'vertical'</code></td>
        <td><code>'horizontal'</code></td>
        <td>Which axis this region resizes along. Selects the container's inline or block content-box size as the percentage basis, and must match the direction given to <code>ResizeHandle</code>.</td>
      </tr>
      <tr>
        <td><code>collapsible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether a lift or a key step below the collapsed threshold collapses the region to zero.</td>
      </tr>
      <tr>
        <td><code>collapsedSize</code></td>
        <td><code>number</code></td>
        <td><code>40</code></td>
        <td>Pixel threshold under which a lift or a key step collapses the region. Mid-drag the region stays at its minimum, and a quick flick toward closing also collapses it.</td>
      </tr>
      <tr>
        <td><code>snaps</code></td>
        <td><code>number[]</code></td>
        <td><code>[]</code></td>
        <td>The size stops only on these pixel points. An equal distance stays on the earlier point.</td>
      </tr>
      <tr>
        <td><code>autoSaveId</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Key for localStorage persistence of size and collapse state across sessions, stored under <code>astryx-resizable:</code>.</td>
      </tr>
      <tr>
        <td><code>defaultIsCollapsed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Initial collapse state (uncontrolled). A persisted entry wins over it.</td>
      </tr>
      <tr>
        <td><code>isCollapsed</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>Controlled collapse state. <code>collapse()</code>, <code>expand()</code>, a lift or a key step past the threshold, and a drag that reopens the region then report through <code>onCollapseChange</code> instead of changing state internally.</td>
      </tr>
      <tr>
        <td><code>onSizeChange</code></td>
        <td><code>(size: number) =&gt; void</code></td>
        <td>—</td>
        <td>Called with the resolved pixel size after every drag, resize, or collapse.</td>
      </tr>
      <tr>
        <td><code>onCollapseChange</code></td>
        <td><code>(isCollapsed: boolean) =&gt; void</code></td>
        <td>—</td>
        <td>Called once per collapse state change: a lift or a key step that closes the region, a drag or a key that reopens it, Enter, a double-click, or a call to <code>collapse()</code>, <code>expand()</code> or <code>resize()</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

`useResizable({ regions })` instead takes <code>regions</code> (a map of key to <code>ResizableRegionConfig</code>) plus <code>direction</code>, <code>containerRef</code>, and <code>autoSaveId</code>. Each region accepts the size, collapse, and snap fields above, and <code>shrinkOrder</code>: a lower number gives up space first when the container is narrower than the regions.

## Returns

<div class="component-api-table" role="region" aria-label="useResizable returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>size</code></td>
        <td><code>number</code></td>
        <td>Current size in pixels. Reactive.</td>
      </tr>
      <tr>
        <td><code>isCollapsed</code></td>
        <td><code>boolean</code></td>
        <td>Whether the region is currently collapsed. Reactive.</td>
      </tr>
      <tr>
        <td><code>collapse</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Programmatically collapse the region.</td>
      </tr>
      <tr>
        <td><code>expand</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Expand from collapsed state.</td>
      </tr>
      <tr>
        <td><code>resize</code></td>
        <td><code>(size: number) =&gt; void</code></td>
        <td>Resize to a specific pixel value.</td>
      </tr>
      <tr>
        <td><code>props</code></td>
        <td><code>ResizableProps</code></td>
        <td>Props to spread on the resizable component or pass to <code>ResizeHandle</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

With a <code>regions</code> map, the return value is <code>Record&lt;string, ResizableRegion&gt;</code>: one object of the same shape per key.
