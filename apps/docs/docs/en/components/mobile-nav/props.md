---
layout: component-docs
title: Mobile Nav
outline: false
footer: false
---

## MobileNav Props

<div class="component-api-table" role="region" aria-label="MobileNav Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>isOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Open state for <code>v-model:is-open</code>.</td></tr>
      <tr><td><code>header</code></td><td><code>string</code></td><td>-</td><td>Drawer title. The <code>header</code> slot can replace it.</td></tr>
      <tr><td><code>width</code></td><td><code>number</code></td><td><code>320</code></td><td>Drawer width in pixels.</td></tr>
      <tr><td><code>side</code></td><td><code>'start' | 'end' | 'auto'</code></td><td><code>'auto'</code></td><td>Which edge the drawer enters from.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>The title, or localized “Navigation”</td><td>Accessible name when there is no title.</td></tr>
    </tbody>
  </table>
</div>

## MobileNav events

<div class="component-api-table" role="region" aria-label="MobileNav events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:isOpen</code></td><td>Open state change for <code>v-model:is-open</code>.</td></tr>
      <tr><td><code>openChange</code></td><td>Fired whenever the open state changes.</td></tr>
    </tbody>
  </table>
</div>

## MobileNavToggle Props

<div class="component-api-table" role="region" aria-label="MobileNavToggle Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>isOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shares <code>v-model:is-open</code> with the drawer.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>“Close” while open, otherwise “Open menu”</td><td>Accessible name of the button.</td></tr>
      <tr><td><code>controls</code></td><td><code>string</code></td><td>-</td><td>Drawer id written to <code>aria-controls</code>.</td></tr>
    </tbody>
  </table>
</div>
