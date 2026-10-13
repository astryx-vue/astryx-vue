---
layout: component-docs
title: Carousel
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Carousel props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>gap</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4</code></td><td><code>1</code></td><td>Space between items, as a spacing step.</td></tr>
<tr><td><code>hasButtons</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Previous and next buttons when the row overflows.</td></tr>
<tr><td><code>hasEdgeFade</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Fade the edges that still hide overflow.</td></tr>
<tr><td><code>hasLoop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Wrap from the last item to the first. Buttons stay available at both ends while the row overflows.</td></tr>
<tr><td><code>hasSnap</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Snap each direct child to the start edge.</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline padding inside the scrollport, with matching scroll-padding.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td><code>Carousel</code></td><td>Accessible name of the region. The default is localized.</td></tr>
</tbody></table>
</div>

## Exposed

<div class="component-api-table" role="region" aria-label="Carousel exposed" tabindex="0">
<table><thead><tr><th>Name</th><th>Signature</th><th>Description</th></tr></thead><tbody>
<tr><td><code>scrollNext</code></td><td><code>() =&gt; void</code></td><td>Scroll forward by about one viewport. With <code>hasLoop</code>, wraps to the start at the end.</td></tr>
<tr><td><code>scrollPrev</code></td><td><code>() =&gt; void</code></td><td>Scroll backward by about one viewport. With <code>hasLoop</code>, wraps to the end at the start.</td></tr>
<tr><td><code>scrollTo</code></td><td><code>(index: number) =&gt; void</code></td><td>Scroll the 0-based item to the start edge. The index is clamped. Only the carousel scrolls.</td></tr>
<tr><td><code>canScrollNext</code></td><td><code>() =&gt; boolean</code></td><td>Whether a forward scroll is available. With <code>hasLoop</code>, true whenever the content overflows.</td></tr>
<tr><td><code>canScrollPrev</code></td><td><code>() =&gt; boolean</code></td><td>Whether a backward scroll is available. With <code>hasLoop</code>, true whenever the content overflows.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: carousel items. Each top-level node is one slide. Fragments are flattened, and empty text is skipped.

## Theme

The root class is `astryx-carousel`. The scrollport is `astryx-carousel-scroller` in the theme layer through `.astryx-carousel__scroller`.

- `--astryx-carousel-gap`: space between items. Set from `gap`.
- `--astryx-carousel-padding`: inline padding and scroll-padding. Set from `padding`.
