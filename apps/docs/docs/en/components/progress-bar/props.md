---
layout: component-docs
title: Progress Bar
outline: false
footer: false
---

## ProgressBar Props

<div class="component-api-table" role="region" aria-label="ProgressBar props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Required. Current value.</td></tr>
<tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum value.</td></tr>
<tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum value.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Track height.</td></tr>
<tr><td><code>variant</code></td><td><code>'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info'</code></td><td><code>'accent'</code></td><td>Fill color.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Progress bar label. Used as the accessible name.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Supplementary description.</td></tr>
<tr><td><code>isIndeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Indeterminate state. Shows a looping animation and omits aria-valuenow, aria-valuemin, aria-valuemax, and aria-valuetext.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled look: the fill, label, value and marks all drop to the muted colors. Use it for canceled or inactive work.</td></tr>
<tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show the percentage next to the label.</td></tr>
<tr><td><code>valueText</code></td><td><code>string</code></td><td>—</td><td>Custom aria-valuetext and display text. Overrides the default percentage.</td></tr>
<tr><td><code>marks</code></td><td><code>{ value: number, label: string }[]</code></td><td>—</td><td>Target ticks on the track. Hidden while indeterminate. <code>label</code> is the accessible name and the hover or focus tooltip.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Component width. Numbers are treated as px.</td></tr>
</tbody></table>
</div>

## Theme

```css
.my-progress-bar {
  --astryx-progress-bar-track-background: #e5e5e5;
  --astryx-progress-bar-fill-background: #171717;
}
```

- `--astryx-progress-bar-track-background`: track background.
- `--astryx-progress-bar-fill-background`: default fill color.
- `--astryx-progress-bar-track-height`: default track height.
- `--astryx-progress-bar-track-height-sm`: sm track height.
- `--astryx-progress-bar-track-height-lg`: lg track height.
