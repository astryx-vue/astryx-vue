---
layout: component-docs
title: Segmented Control Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="SegmentedControlItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Unique value of this segment, matched against the parent control's <code>v-model</code>. Required.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Name of the segment: its visible text, and its accessible name when <code>isLabelHidden</code> is set. Required.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Visually hides the label so only the icon shows. The label still names the segment through <code>aria-label</code>.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables this segment. It keeps its place in the row, but it can no longer be selected or reached with the arrow keys.</td></tr>
</tbody></table>
</div>

## Slots

- `icon`: artwork shown before the label. An `Icon` placed here follows the size of the parent control.
