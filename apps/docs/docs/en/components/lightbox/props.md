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
<tr><td><code>hasZoom</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable zoom (images only). A pinch or a ctrl-wheel zooms about the fingers or the pointer. A double tap fills the viewer and a double-click zooms 2×, about that point, and the next goes back. Enter, Space, <code>+</code>, and <code>-</code> zoom 2× about the centre and back, and <code>0</code> returns to the fitted size. When zoomed, drag, scroll a trackpad, or press the arrow keys to pan; on a phone or a tablet the pan has momentum.</td></tr>
<tr><td><code>hasAutoPlay</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Start video playback when a video item is shown in an open viewer.</td></tr>
</tbody></table>
</div>

`LightboxMedia` is `{ src, alt, caption?, type? }`. `type` is `image` or `video`, and defaults to `image`. The whole caption is always the viewer's accessible description. In a gallery every page has a caption band two lines tall under its photo, so the photo keeps one size from page to page; a page without a caption keeps the band's space without its backing. A longer caption shows two lines and ends in an inline "more" that opens it in full over the photo; "less" and paging close it.

## Events

<div class="component-api-table" role="region" aria-label="Lightbox events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>update:isOpen</code></td><td><code>boolean</code></td><td>Close, Escape, a backdrop click, or a drag down on a touch screen asks to change the open state.</td></tr>
<tr><td><code>update:index</code></td><td><code>number</code></td><td>Previous, next, an arrow key while zoomed out, or a swipe on a touch screen asks for a new gallery index.</td></tr>
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

The dialog class is `astryx-lightbox`. A single item's caption text uses the large type, `on-dark`, a max width of 600px, and padding of spacing 2 on the block start and spacing 3 on the inline sides. A gallery's caption uses the body type on a backing at 90% of the controls' overlay color, and its band clears the bottom safe area. Close and navigation sit at spacing 3 from the frame.
