---
layout: component-docs
title: Divider
outline: false
footer: false
---

## Divider Props

<div class="component-api-table" role="region" aria-label="Divider props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Orientation of the divider.</td></tr>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>Text centered on the divider. Also used as the accessible name. Numeric zero stays visible; an empty string does not.</td></tr>
<tr><td><code>variant</code></td><td><code>'subtle' | 'strong'</code></td><td><code>'subtle'</code></td><td>Line weight. strong uses the emphasized border color.</td></tr>
<tr><td><code>isFullBleed</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Extend to the container edges with negative margins.</td></tr>
</tbody></table>
</div>

## Slots

- `label`: rich content in the middle of the divider. Replaces the `label` prop text.

## Theme

```css
.my-divider {
  --astryx-divider-color-subtle: #00000014;
}
```

- `--astryx-divider-color-subtle`: color of the `subtle` line.
- `--astryx-divider-color-strong`: color of the `strong` line.
- `--astryx-divider-label-color`: label text color.
- `--astryx-border-width`: line thickness.
