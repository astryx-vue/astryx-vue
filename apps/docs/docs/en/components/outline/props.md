---
layout: component-docs
title: Outline
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Outline props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>items</code></td><td><code>OutlineItem[]</code></td><td>—</td><td>Ordered headings. Each item is <code>{ id, label, level }</code>. <code>level</code> is 1–6.</td></tr>
<tr><td><code>activeId</code></td><td><code>string</code></td><td>—</td><td>Controlled active heading. When set, built-in scroll-spy stays off. Bind with <code>v-model:active-id</code>.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td><code>Table of contents</code></td><td>Accessible name of the nav landmark. The default is localized.</td></tr>
<tr><td><code>density</code></td><td><code>'default' | 'compact'</code></td><td><code>'default'</code></td><td>Item padding. <code>compact</code> is for dense sidebars.</td></tr>
<tr><td><code>offset</code></td><td><code>number</code></td><td><code>0</code></td><td>Pixels of a fixed header covering the scroll root. Shifts the activation line and the scroll landing together.</td></tr>
<tr><td><code>scrollContainer</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>Scroll container to track. Omit it to use the nearest scrollable ancestor, or the viewport.</td></tr>
<tr><td><code>hasScrollOnClick</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether activating an item smooth-scrolls to it.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="Outline events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>update:activeId</code></td><td><code>string</code></td><td>The active id changed, from scroll-spy or from activating an item.</td></tr>
<tr><td><code>navigateStart</code></td><td><code>string</code></td><td>A click started a scroll to this id.</td></tr>
<tr><td><code>navigateEnd</code></td><td><code>string</code></td><td>That navigation finished, was interrupted, or hit the 1.2 second limit. Fires once per start.</td></tr>
</tbody></table>
</div>

## Theme

The root class is `astryx-outline`. The indicator reads `--astryx-outline-indicator-top` and `--astryx-outline-indicator-height`, which the component measures from the active link.

Indent is a 2px track plus padding-inline-start: spacing 3 at the first indent, spacing 7, spacing 11, then spacing 12. `compact` changes block padding from spacing 2 to spacing 1.
