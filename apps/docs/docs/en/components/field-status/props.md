---
layout: component-docs
title: Field Status
outline: false
footer: false
---

## FieldStatus Props

<div class="component-api-table" role="region" aria-label="FieldStatus props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>type</code></td><td><code>'error' | 'warning' | 'success'</code></td><td>—</td><td>Required. Chooses the icon and the color.</td></tr>
<tr><td><code>message</code></td><td><code>string</code></td><td>—</td><td>Required. The text. An empty string renders nothing visible.</td></tr>
<tr><td><code>variant</code></td><td><code>'attached' | 'detached'</code></td><td><code>'attached'</code></td><td>Attached overlaps the control above it. Detached is a separate block.</td></tr>
<tr><td><code>isVisuallyHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keeps the message available without showing the box.</td></tr>
</tbody></table>
</div>

The type `FieldStatusProps` is exported from `@astryx-vue/core/Field` together with `FieldStatusInput`.
