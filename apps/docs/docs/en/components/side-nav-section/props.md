---
layout: component-docs
title: Side Nav Section
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="SideNavSection props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Group name. Hidden visually while the rail is collapsed, and still read by screen readers. Required.</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>Second, smaller line under the title.</td></tr>
<tr><td><code>isHeaderHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hides the header at any width. It stays available to screen readers.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the items of the section.
- `end`: content at the trailing edge of the header row, such as an add button.
