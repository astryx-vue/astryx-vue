---
layout: component-docs
title: Icon Button
outline: false
footer: false
---

## IconButton Props

IconButton inherits most Button props but does not expose <code>isIconOnly</code>, because it is always icon-only.

<div class="component-api-table" role="region" aria-label="IconButton Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>required</td><td>Accessible name for the button.</td></tr>
      <tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'ghost' | 'destructive'</code></td><td><code>'secondary'</code></td><td>Visual hierarchy and semantic variant.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Square control size.</td></tr>
      <tr><td><code>elevation</code></td><td><code>'none' | 'low' | 'med' | 'high'</code></td><td><code>'none'</code></td><td>Resting shadow depth for a standalone floating button.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables interaction. A tooltip switches this to aria-disabled so focus remains available.</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows loading state, sets aria-busy, and disables non-interruptible activation.</td></tr>
      <tr><td><code>isInterruptible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allows clickAction to run again while earlier work is pending.</td></tr>
      <tr><td><code>clickAction</code></td><td><code>(event: MouseEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Action function that automatically drives pending state.</td></tr>
      <tr><td><code>tooltip</code></td><td><code>string</code></td><td>—</td><td>Supplementary hint shown on hover and keyboard focus.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Renders the enabled root as a link when present.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Button width. Numbers become pixels; CSS strings are used as supplied.</td></tr>
    </tbody>
  </table>
</div>

These props are also inherited. See [Button props](/en/components/button/props) for their definitions.

- `type`.
- `name`.
- `value`.
- `form`.
- `loadingLabel`.
- `as`.
- `target`.
- `rel`.

## Slot

- The default slot is required.
- The default slot must contain one icon that represents the action.
- `IconButton` does not display text.
- `IconButton` does not provide an `end` slot.

:::warning Accessible name
Provide an accurate `label`. Without it, assistive technology cannot identify the button's purpose.

`tooltip` provides additional information. Do not use it instead of `label`.
:::

## Events

The `click` event passes a `MouseEvent`.

## Template ref

`IconButton` exposes `element`.
Its type is `HTMLButtonElement | HTMLAnchorElement | HTMLElement | null`.

## Native attributes

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.
