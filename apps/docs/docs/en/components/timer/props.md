---
layout: component-docs
title: Timer
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Timer props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>startTime</code></td><td><code>number</code></td><td>—</td><td>Unix time in milliseconds when the operation began. Omit it to start at mount.</td></tr>
<tr><td><code>format</code></td><td><code>'elapsed' | 'clock'</code></td><td><code>'elapsed'</code></td><td><code>elapsed</code> uses compact units and drops seconds after one hour. <code>clock</code> stays second-precise.</td></tr>
<tr><td><code>type</code></td><td><code>TextType | 'inherit'</code></td><td><code>'supporting'</code></td><td>Semantic text type, matching Timestamp. <code>inherit</code> skips the Text wrapper.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg' | 'xl'</code></td><td>—</td><td>Explicit font size. Overrides the size that comes from <code>type</code>.</td></tr>
<tr><td><code>color</code></td><td><code>'primary' | 'secondary' | 'accent' | 'inherit' | 'disabled'</code></td><td><code>'secondary'</code></td><td>Text color. <code>disabled</code> uses the disabled text token.</td></tr>
<tr><td><code>weight</code></td><td><code>'regular' | 'medium' | 'semibold' | 'bold'</code></td><td>—</td><td>Font weight override.</td></tr>
</tbody></table>
</div>

## Theme

The root class is `astryx-timer`. Digits use tabular numbers. `data-color` selects `primary`, `secondary`, `accent`, or `disabled`.
