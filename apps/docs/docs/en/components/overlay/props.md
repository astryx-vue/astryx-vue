---
layout: component-docs
title: Overlay
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Overlay Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>showOn</code></td>
        <td><code>OverlayShowOn</code></td>
        <td><code>'always'</code></td>
        <td>What reveals the overlay while <code>isOpen</code> stays unbound, driven entirely by CSS. <code>always</code> keeps it visible, <code>hover</code> reveals it on hover or when focus enters the container, <code>focus</code> only on focus, and <code>hover-or-focus</code> is an alias of <code>hover</code>. On a touch device <code>hover</code> becomes tap-to-toggle.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Visibility controlled from JavaScript, taking precedence over <code>showOn</code> and over the tap toggle. Bind it with <code>v-model:isOpen</code>; leaving it unbound hands visibility back to <code>showOn</code>. While it is <code>false</code> the scrim is hidden and made <code>inert</code>, so its buttons leave the tab order.</td>
      </tr>
      <tr>
        <td><code>scrim</code></td>
        <td><code>OverlayScrimMode</code></td>
        <td><code>'dark'</code></td>
        <td>The scrim background, which also decides the surface theme the content inside it uses. <code>dark</code> and <code>light</code> resolve the content against a dark and a light surface respectively; <code>false</code> draws no background and leaves the content on the ambient theme.</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>OverlayPosition</code></td>
        <td><code>'fill'</code></td>
        <td>How much of the base surface the scrim covers. <code>fill</code> covers all of it, while <code>bottom</code> and <code>top</code> are strips pinned to one edge that slide in from and out to that edge.</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>OverlayAlign</code></td>
        <td><code>'end'</code></td>
        <td>Alignment of the content inside the scrim. The scrim lays content out in a column, so this is the horizontal axis: <code>start</code> at the leading edge, <code>end</code> at the trailing edge, and <code>center</code> on both axes.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Overlay Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The base content: media, video, artwork, or any bounded block. The scrim covers it.</td>
      </tr>
      <tr>
        <td><code>content</code></td>
        <td>The content drawn inside the scrim. Keep it short — one action or one label. Without this slot the component renders only the base content and draws no scrim.</td>
      </tr>
    </tbody>
  </table>
</div>

## OverlayScrim

`OverlayScrim` is the rendering component of the scrim itself, exported from `@astryx-vue/core/Overlay` for the consumers of `useOverlay`. `Overlay` renders it internally, and the props mean the same as above.

<div class="component-api-table" role="region" aria-label="OverlayScrim Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>scrim</code></td>
        <td><code>OverlayScrimMode</code></td>
        <td><code>'dark'</code></td>
        <td>The scrim background and the surface theme its content uses.</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>OverlayPosition</code></td>
        <td><code>'fill'</code></td>
        <td>How much of the base surface the scrim covers.</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>OverlayAlign</code></td>
        <td><code>'end'</code></td>
        <td>Alignment of the content inside the scrim.</td>
      </tr>
      <tr>
        <td><code>showOn</code></td>
        <td><code>OverlayShowOn</code></td>
        <td><code>'always'</code></td>
        <td>What reveals the overlay while <code>isOpen</code> stays unbound.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled visibility. When set, <code>showOn</code> is ignored and a <code>false</code> value marks the scrim <code>inert</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

Its default slot is the overlay content. The root carries <code>data-position</code>, <code>data-align</code>, <code>data-scrim</code>, and <code>data-visibility</code> for theming, and the content is wrapped in a <code>data-astryx-media="dark | light"</code> element that switches the surface theme without affecting layout.

## useOverlay

`useOverlay` adds the same overlay behavior to a container that already exists. Its options match the props of `Overlay`, except that it accepts a `ref` or a `computed` for any of them.

<div class="component-api-table" role="region" aria-label="useOverlay Result" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Attach it to the container element with <code>ref="containerRef"</code>.</td>
      </tr>
      <tr>
        <td><code>containerProps</code></td>
        <td><code>ComputedRef&lt;OverlayContainerProps&gt;</code></td>
        <td>The attributes the container needs (scope class, tap toggle), spread with <code>v-bind</code>. They bring the positioning, the clipping, and the tap toggle on a touch device.</td>
      </tr>
      <tr>
        <td><code>scrimProps</code></td>
        <td><code>ComputedRef&lt;OverlayScrimProps&gt;</code></td>
        <td>Pass them to the <code>OverlayScrim</code> rendered inside the container.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>ComputedRef&lt;boolean | undefined&gt;</code></td>
        <td>The visibility the scrim actually uses: the bound <code>isOpen</code>, the tap toggle state, or <code>undefined</code> when CSS decides.</td>
      </tr>
      <tr>
        <td><code>hasTouchToggle</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether the container currently toggles by tap (a touch device in hover mode).</td>
      </tr>
      <tr>
        <td><code>toggle</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Flips the tap toggle state. Ignored while <code>isOpen</code> is bound.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is a `<div>`.

The following go to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

`class` is merged with <code>astryx-overlay</code>, and `style` with the border radius the component writes. A click handler you pass runs alongside the tap toggle.
