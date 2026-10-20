---
layout: component-docs
title: useTableRowStatus
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`, so pass a getter or a ref to keep the plugin on the current values.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableRowStatus parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>getStatus</code></td>
        <td><code>(item: T) =&gt; TableRowStatus | null</code></td>
        <td>—</td>
        <td>Derive either a semantic outcome or a custom marker. <code>{status, label}</code> accepts the closed success/error/warning vocabulary and resolves its glyph and tone through the active theme. <code>{color, icon?, label}</code> preserves the stable custom-marker path: color always selects paint, no icon renders an 8px dot, and icon renders the explicit caller glyph. Even color values named success/error/warning remain dots without icon. Valid icon names: close, chevronDown, chevronLeft, chevronRight, chevronsLeft, chevronsRight, check, success, error, warning, info, calendar, clock, externalLink, menu, moreHorizontal, search, upload, arrowUp, arrowDown, arrowsUpDown, funnel, eyeSlash, viewColumns, copy, checkDouble, wrench, stop, microphone, image. The branches are exclusive, label is required and announced via <code>role="img"</code>, and <code>null</code> leaves the row status cell empty.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="useTableRowStatus status fields" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>status</code></td>
        <td><code>'success' | 'warning' | 'error'</code></td>
        <td>Semantic outcome. The glyph and the tone come from the theme. Exclusive with <code>color</code>.</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>'accent' | 'success' | 'error' | 'warning' | 'red' | 'orange' | 'green' | 'yellow' | 'blue' | 'gray' | (string &amp; {})</code></td>
        <td>Paint for the marker. Without <code>icon</code> it paints the 8px dot; a raw CSS color is used as given.</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string</code></td>
        <td>One of the icon names above, or an Iconify id with a <code>:</code> in it. Named colors keep their Icon color mapping; a raw CSS color overrides the paint exactly.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>Accessible name for the marker, also shown as a tooltip on hover.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableRowStatus returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>Prepends the status column. Its key is <code>__rowStatus</code>, its width is <code>pixel(28)</code> and it is not resizable. The header is visually blank and carries the localized name from the message table.</td>
      </tr>
    </tbody>
  </table>
</div>
