---
layout: component-docs
title: Spinner
outline: false
footer: false
---

## Spinner Props

<div class="component-api-table" role="region" aria-label="Spinner props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg' | 'xl'</code></td><td><code>'md'</code></td><td>Ring diameter: 10px, 14px, 18px, or 28px.</td></tr>
<tr><td><code>shade</code></td><td><code>'default' | 'subtle' | 'onMedia' | 'inherit'</code></td><td><code>'default'</code></td><td>Color shade for light backgrounds, dark backgrounds, or inherited text color.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Text shown below the spinner. Also used as the accessible name.</td></tr>
</tbody></table>
</div>

## Slots

- `label`: rich content below the spinner. Replaces the `label` prop text. With no visible text and no `aria-label`, the accessible name follows the locale: Loading in English, 加载中 in Simplified Chinese.

## Theme

```css
.my-spinner {
  --astryx-spinner-color-accent: #0074e2;
}
```

- `--astryx-spinner-diameter-{sm|md|lg|xl}`: ring diameter per size.
- `--astryx-spinner-stroke-width-{sm|md|lg|xl}`: stroke width per size.
- `--astryx-spinner-arc-fraction`: fraction of the ring covered by the moving arc.
- `--astryx-spinner-color-accent`: arc color for the `default` shade.
- `--astryx-spinner-color-subtle`: arc color for the `subtle` shade.
- `--astryx-spinner-color-track`: track color for the `default` and `subtle` shades.
- `--astryx-spinner-color-on-dark`: arc and track color for the `onMedia` shade.
- `--astryx-spinner-group-gap`: space between the ring and the label.
- `--astryx-spinner-label-color`: label text color.
