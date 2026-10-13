---
layout: component-docs
title: Lightbox
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Lightbox props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Whether the dialog is open. Bind with <code>v-model:is-open</code>.</td></tr>
<tr><td><code>media</code></td><td><code>LightboxMedia | readonly LightboxMedia[]</code></td><td>—</td><td>One item, or a gallery. An array shows previous, next, and a counter.</td></tr>
<tr><td><code>index</code></td><td><code>number</code></td><td>—</td><td>Controlled gallery index. Bind with <code>v-model:index</code>.</td></tr>
<tr><td><code>defaultIndex</code></td><td><code>number</code></td><td><code>0</code></td><td>Initial index when <code>index</code> is omitted.</td></tr>
<tr><td><code>hasZoom</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Double-click, Enter, Space, <code>+</code>, and <code>-</code> zoom images. Arrow keys pan while zoomed.</td></tr>
<tr><td><code>hasAutoPlay</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Start video playback when a video item is shown.</td></tr>
</tbody></table>
</div>

`LightboxMedia` is `{ src, alt, caption?, type? }`. `type` is `image` or `video`, and defaults to `image`.

## Events

<div class="component-api-table" role="region" aria-label="Lightbox events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>update:isOpen</code></td><td><code>boolean</code></td><td>Close, Escape, or a backdrop click asks to change the open state.</td></tr>
<tr><td><code>update:index</code></td><td><code>number</code></td><td>Previous, next, or an arrow key while zoomed out asks for a new gallery index.</td></tr>
</tbody></table>
</div>

## useLightbox

```ts
const { bindings, open, close, isOpen, index, getTriggerProps } = useLightbox({
  media,
  hasZoom: false,
  hasAutoPlay: false,
})
```

`bindings` is the set of props and update listeners for `v-bind`. `open(index)` sets the index and opens the dialog. `getTriggerProps(index)` returns `role="button"`, `tabindex="0"`, `aria-haspopup="dialog"`, and keyboard activation for a custom trigger.

## Theme

The dialog class is `astryx-lightbox`. Caption text uses the large type, `on-dark`, a max width of 600px, and padding of spacing 2 on the block start and spacing 3 on the inline sides. Close and navigation sit at spacing 3 from the frame.
