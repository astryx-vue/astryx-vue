---
layout: component-docs
title: Size Context
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="SizeProvider props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>'sm' | 'md' | 'lg' | null</code></td><td><code>null</code></td><td>The default size provided to descendants. <code>null</code> provides nothing, so children use their own default.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="SizeProvider slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>The subtree that reads this default size.</td></tr>
</tbody></table>
</div>

## Other exports

<div class="component-api-table" role="region" aria-label="SizeContext exports" tabindex="0">
<table><thead><tr><th>Export</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>useSize</code></td><td><code>(sizeProp, default = 'md') =&gt; ComputedRef</code></td><td>Resolves the final size: explicit prop &gt; context &gt; default.</td></tr>
<tr><td><code>provideSize</code></td><td><code>(size) =&gt; void</code></td><td>Provides a size from <code>setup</code>; used inside container components.</td></tr>
<tr><td><code>SizeContext</code></td><td>injection key</td><td>The underlying context key.</td></tr>
<tr><td><code>ElementSize</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td>The size type.</td></tr>
</tbody></table>
</div>

## Native attributes

The component renders no element, so <code>class</code> and <code>style</code> are not forwarded.
