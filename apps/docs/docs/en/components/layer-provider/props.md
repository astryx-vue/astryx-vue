---
layout: component-docs
title: Layer Provider
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="LayerProvider props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>toast</code></td><td><code>LayerToastConfig</code></td><td>—</td><td>Toast viewport configuration: <code>position</code>, <code>maxVisible</code>, and a toast-only <code>inset</code> that overrides the provider inset per edge for toasts shown through <code>useToast()</code>.</td></tr>
<tr><td><code>inset</code></td><td><code>LayerInset</code></td><td>every edge <code>0</code></td><td>A persistent bar floating over a viewport edge, declared once: <code>blockStart</code>, <code>blockEnd</code>, <code>inlineStart</code>, <code>inlineEnd</code> as pixel numbers or CSS lengths. Each edge adds to the gutter every anchored layer keeps from that edge and moves the toast viewport by the same amount.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="LayerProvider slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>Application subtree that can use the shared layer context.</td></tr>
</tbody></table>
</div>

## LayerToastConfig

<div class="component-api-table" role="region" aria-label="LayerToastConfig fields" tabindex="0">
<table><thead><tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>position</code></td><td><code>ToastPlacement</code></td><td><code>'bottom-end'</code></td><td>Corner the toast viewport sits in: <code>top-start</code>, <code>top-center</code>, <code>top-end</code>, <code>bottom-start</code>, <code>bottom-center</code>, or <code>bottom-end</code>. A <code>placement</code> on <code>ToastViewport</code> still wins.</td></tr>
<tr><td><code>maxVisible</code></td><td><code>number</code></td><td>no limit</td><td>How many toasts stay on screen at once. When more are queued, only the newest ones render.</td></tr>
<tr><td><code>inset</code></td><td><code>LayerInset</code></td><td>—</td><td>Per-edge offset for the toast viewport only. An edge written here replaces the provider <code>inset</code> for that edge; edges left out keep the provider value.</td></tr>
</tbody></table>
</div>

## LayerInset

<div class="component-api-table" role="region" aria-label="LayerInset fields" tabindex="0">
<table><thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>blockStart</code></td><td><code>number | string</code></td><td>Offset added to the gutter at the top edge. A number is pixels; a string is any CSS length, such as <code>'4rem'</code> or <code>'env(safe-area-inset-top, 0px)'</code>.</td></tr>
<tr><td><code>blockEnd</code></td><td><code>number | string</code></td><td>Same, for the bottom edge.</td></tr>
<tr><td><code>inlineStart</code></td><td><code>number | string</code></td><td>Same, for the inline-start edge.</td></tr>
<tr><td><code>inlineEnd</code></td><td><code>number | string</code></td><td>Same, for the inline-end edge.</td></tr>
</tbody></table>
</div>

## Exports

<div class="component-api-table" role="region" aria-label="LayerProvider exports" tabindex="0">
<table><thead><tr><th>Export</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>useLayerConfig</code></td><td><code>() =&gt; ComputedRef&lt;LayerContextValue&gt; | null</code></td><td>The nearest provider configuration, or <code>null</code> outside one.</td></tr>
<tr><td><code>useLayerGutter</code></td><td><code>() =&gt; ComputedRef&lt;LayerGutter&gt;</code></td><td>Distance an anchored layer keeps from each viewport edge: the larger of the spacing-4 step and the device safe area, plus the provider inset.</td></tr>
<tr><td><code>resolveInset</code></td><td><code>(inset?: LayerInset) =&gt; ResolvedLayerInset</code></td><td>Turns an inset into pixels.</td></tr>
<tr><td><code>mergeInset</code></td><td><code>(primary?: LayerInset, fallback?: LayerInset) =&gt; ResolvedLayerInset</code></td><td>Merges two insets edge by edge: an edge set on <code>primary</code> wins, the rest come from <code>fallback</code>.</td></tr>
</tbody></table>
</div>

## Native attributes

The component renders no element of its own, so <code>class</code> and <code>style</code> are not forwarded.
