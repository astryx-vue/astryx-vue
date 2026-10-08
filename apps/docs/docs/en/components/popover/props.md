---
layout: component-docs
title: Popover
outline: false
footer: false
---

## Popover Props

<div class="component-api-table" role="region" aria-label="Popover props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>placement</code></td><td><code>'above' | 'below' | 'start' | 'end'</code></td><td><code>'below'</code></td><td>Side of the trigger. Flips when there is no room.</td></tr>
<tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'start'</code></td><td>Alignment along the placement axis.</td></tr>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. When unset, the trigger manages visibility.</td></tr>
<tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Prevents the trigger from opening the surface when false.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>Trigger width</td><td>Surface width. Numbers are pixels. When unset, the surface is at least as wide as the trigger and at most 320px (and never wider than the viewport).</td></tr>
<tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td><code>3</code></td><td>Inner padding, mapped to the <code>--astryx-spacing-*</code> tokens.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name of the dialog. Provide it when <code>role</code> is <code>dialog</code>.</td></tr>
<tr><td><code>role</code></td><td><code>'dialog' | 'none'</code></td><td><code>'dialog'</code></td><td>Use <code>dialog</code> for interactive content. Use <code>none</code> when the content already has its own role.</td></tr>
<tr><td><code>isModal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Keeps Tab focus inside the surface while it is open. Applies to <code>dialog</code> only.</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows a close button that is visible only when focused.</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>'Close'</code></td><td>Text and accessible name of the close button.</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Moves focus into the surface when it opens.</td></tr>
<tr><td><code>hasLightDismiss</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes when the user presses outside the surface and the trigger.</td></tr>
<tr><td><code>hasEscapeDismiss</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes when the user presses Escape.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires when the surface opens or closes, including when the user dismisses it.

## Slots

- `default`: the trigger. Use a `button` or an element with `role="button"`.
- `content`: the surface content.

## Theme

```css
.my-popover {
  --astryx-popover-background: #fff;
  --astryx-popover-foreground: #000;
}
```

- `--astryx-popover-background`: surface background color.
- `--astryx-popover-foreground`: surface text color.
- `--astryx-popover-shadow`: surface shadow.
- `--astryx-popover-z-index`: stacking order of the surface.
