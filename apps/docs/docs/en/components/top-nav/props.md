---
layout: component-docs
title: Top Nav
outline: false
footer: false
---

## TopNav Props

<div class="component-api-table" role="region" aria-label="TopNav Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Localized “Top navigation”</td><td>Accessible name of the landmark.</td></tr>
      <tr><td><code>mobileQuery</code></td><td><code>string</code></td><td>-</td><td>When this media query matches, leading and center content moves into the mobile nav.</td></tr>
    </tbody>
  </table>
</div>

## TopNav slots

<div class="component-api-table" role="region" aria-label="TopNav slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>heading</code></td><td>Brand title. Stays on the bar at narrow widths.</td></tr>
      <tr><td><code>start</code></td><td>Content after the title.</td></tr>
      <tr><td><code>default</code></td><td>Items and menus laid out with <code>start</code>.</td></tr>
      <tr><td><code>center</code></td><td>Centered region. Turns the bar into three columns.</td></tr>
      <tr><td><code>end</code></td><td>Trailing actions. Stays on the bar at narrow widths.</td></tr>
    </tbody>
  </table>
</div>

## TopNavMenu Props

<div class="component-api-table" role="region" aria-label="TopNavMenu Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Trigger label.</td></tr>
      <tr><td><code>items</code></td><td><code>TopNavMenuItem[]</code></td><td>-</td><td>Data items. The default slot can render <code>NavMenuItem</code> instead.</td></tr>
      <tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>Hover open delay, in milliseconds.</td></tr>
      <tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>Pointer-leave close delay, in milliseconds.</td></tr>
    </tbody>
  </table>
</div>

## TopNavMegaMenu Props

<div class="component-api-table" role="region" aria-label="TopNavMegaMenu Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Trigger label and accessible name of the panel.</td></tr>
      <tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>Hover open delay, in milliseconds.</td></tr>
      <tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>250</code></td><td>Pointer-leave close delay, in milliseconds.</td></tr>
    </tbody>
  </table>
</div>

Put `TopNavMegaMenuItem` in the default slot and `TopNavMegaMenuFeaturedCard` in `featured`. Inside the drawer the same content becomes an accordion and is not a menu.
