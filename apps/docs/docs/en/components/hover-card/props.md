---
layout: component-docs
title: Hover Card
outline: false
footer: false
---

## HoverCard Props

<div class="component-api-table" role="region" aria-label="HoverCard props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>content</code></td><td><code>string</code></td><td><code>''</code></td><td>Plain-text card content. Use the <code>content</code> slot for rich content.</td></tr>
<tr><td><code>placement</code></td><td><code>'above' | 'below' | 'start' | 'end'</code></td><td><code>'above'</code></td><td>Side of the trigger. The card flips to the opposite side when there is no room.</td></tr>
<tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'center'</code></td><td>Alignment along the placement axis.</td></tr>
<tr><td><code>delay</code></td><td><code>number</code></td><td><code>300</code></td><td>Milliseconds before showing on hover.</td></tr>
<tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>Milliseconds before hiding. The pointer entering the card within this window cancels the hide.</td></tr>
<tr><td><code>focusTrigger</code></td><td><code>'auto' | 'always' | 'never'</code></td><td><code>'auto'</code></td><td>Whether focus opens the card. auto listens only when the trigger is itself focusable.</td></tr>
<tr><td><code>touchTrigger</code></td><td><code>'auto' | 'tap' | 'none'</code></td><td><code>'auto'</code></td><td>Tap behavior on touch. auto opens on a trigger that performs no action of its own and leaves the tap to buttons and links; tap always opens; none never opens. A tap-opened card closes on a tap outside.</td></tr>
<tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enables the hover and focus triggers. Setting it to false also closes an open card.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the card. With it the card is a named <code>role="dialog"</code>; without it, a <code>role="group"</code>.</td></tr>
<tr><td><code>hasHoverIndication</code></td><td><code>'auto' | boolean</code></td><td><code>'auto'</code></td><td>Dashed underline on the trigger. auto applies it only to a text-only trigger.</td></tr>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. Hover and focus are ignored when set.</td></tr>
<tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show the card on mount. Only applies when <code>isOpen</code> is unset.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires when the card shows or hides. In the controlled mode, Escape emits `false` and the parent decides whether to close.

## Slots

<div class="component-api-table" role="region" aria-label="HoverCard slots" tabindex="0">
<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>The trigger. Plain text gains a dashed underline and becomes focusable; an element becomes the trigger that receives the events and ARIA attributes.</td></tr>
<tr><td><code>content</code></td><td>The card content, rich markup included. Replaces the <code>content</code> prop.</td></tr>
</tbody></table>
</div>

## Methods

- `show()`: shows the card immediately, skipping the hover delay.
- `hide()`: hides the card immediately.
- `element`: the card layer element, or `null` before it mounts.

## Native attributes

The component renders a fragment: a trigger wrapper `<span class="astryx-hover-card__trigger">` plus a layer teleported to `body`. Attributes land on the wrapper; the layer receives none.

- HTML attributes, `aria-*`, `data-*`, `class`, and `style` all go to the wrapper.
- The wrapper is a `display: contents` box when the trigger is an element, and the trigger itself, `display: inline`, when the trigger is plain text. Put layout attributes on the trigger element directly; on a text trigger you can put them on the component.
- The `aria-haspopup`, `aria-controls`, `aria-expanded`, and `aria-describedby` the component manages are written onto the real trigger element and restored to their previous values when it unmounts.

## Theme

```css
.my-hover-card {
  --astryx-hover-card-background: #fff;
  --astryx-hover-card-foreground: #171717;
}
```

- `--astryx-hover-card-background`: card background.
- `--astryx-hover-card-foreground`: card text color.
- `--astryx-hover-card-shadow`: card elevation.
- `--astryx-hover-card-radius`: card radius, defaulting to `--astryx-radius-container`.
- `--astryx-hover-card-indication-color`: dashed underline color.
- `--astryx-hover-card-z-index`: stacking order of the card.
