---
layout: component-docs
title: Scrollbars Provider
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ScrollbarsProvider props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>enabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether the subtree uses custom scrollbars. When <code>false</code>, the subtree is not initialized and any scrollbars already attached are destroyed. In nested providers the inner one wins.</td></tr>
<tr><td><code>autoHide</code></td><td><code>'never' | 'scroll' | 'leave' | 'move'</code></td><td><code>'scroll'</code></td><td>When the scrollbar hides. <code>never</code> keeps it visible, <code>scroll</code> shows it while scrolling, <code>leave</code> hides it after the pointer leaves, <code>move</code> shows it while the pointer moves.</td></tr>
<tr><td><code>autoHideDelay</code></td><td><code>number</code></td><td><code>800</code></td><td>Milliseconds to wait before auto-hiding.</td></tr>
<tr><td><code>options</code></td><td><code>ScrollbarsOptions</code></td><td>—</td><td>Options passed to OverlayScrollbars (<code>PartialOptions</code>). Deep-merged last, so it has the highest priority.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="ScrollbarsProvider slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>Content that uses the custom scrollbars.</td></tr>
</tbody></table>
</div>

## Exports

<div class="component-api-table" role="region" aria-label="ScrollbarsProvider exports" tabindex="0">
<table><thead><tr><th>Export</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>useScrollbars</code></td><td><code>(target: MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;, options?: UseScrollbarsOptions) =&gt; UseScrollbarsResult</code></td><td>Attaches the custom scrollbar to a scroll container you wrote yourself. Does nothing without a <code>ScrollbarsProvider</code> above it. The container is the viewport and its children are not moved. Call it in a descendant of the provider.</td></tr>
<tr><td><code>UseScrollbarsOptions</code></td><td><code>{ enabled?: MaybeRefOrGetter&lt;boolean&gt; }</code></td><td>Second argument of <code>useScrollbars</code>. <code>enabled</code> defaults to <code>true</code> and controls whether this container uses it. If the outer provider is off, <code>true</code> has no effect.</td></tr>
<tr><td><code>UseScrollbarsResult</code></td><td><code>{ active: Readonly&lt;Ref&lt;boolean&gt;&gt; }</code></td><td><code>active</code> tells you whether the custom scrollbar is attached to the element right now.</td></tr>
<tr><td><code>ScrollbarsProviderProps</code></td><td>Type</td><td>The type behind the props table above.</td></tr>
<tr><td><code>ScrollbarsProviderSlots</code></td><td>Type</td><td>The type behind the slots table above.</td></tr>
<tr><td><code>ScrollbarsOptions</code></td><td><code>PartialOptions</code></td><td>OverlayScrollbars option type, used by the <code>options</code> prop.</td></tr>
<tr><td><code>ScrollbarsAutoHide</code></td><td><code>'never' | 'scroll' | 'leave' | 'move'</code></td><td>Value type of <code>autoHide</code>.</td></tr>
<tr><td><code>ScrollbarsContext</code></td><td>Type</td><td>What the provider gives its subtree: <code>enabled</code>, the merged <code>options</code>, and <code>mount</code>.</td></tr>
<tr><td><code>ScrollbarsHandle</code></td><td><code>{ update, destroy }</code></td><td>The handle <code>mount</code> returns, used to update options or destroy the scrollbar.</td></tr>
<tr><td><code>scrollbarsKey</code></td><td><code>InjectionKey&lt;ScrollbarsContext&gt;</code></td><td>The injection key the provider uses.</td></tr>
</tbody></table>
</div>

## Appearance variables

<div class="component-api-table" role="region" aria-label="Scrollbar CSS variables" tabindex="0">
<table><thead><tr><th>Variable</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>--astryx-scrollbar-size</code></td><td><code>10px</code></td><td>Scrollbar thickness.</td></tr>
<tr><td><code>--astryx-scrollbar-thumb</code></td><td>Secondary text color at 45%</td><td>Thumb color.</td></tr>
<tr><td><code>--astryx-scrollbar-thumb-hover</code></td><td>Secondary text color at 70%</td><td>Thumb color on hover and drag.</td></tr>
<tr><td><code>--astryx-scrollbar-track</code></td><td><code>transparent</code></td><td>Track background.</td></tr>
<tr><td><code>--astryx-scrollbar-radius</code></td><td><code>9999px</code></td><td>Corner radius of track and thumb.</td></tr>
</tbody></table>
</div>

## Native attributes

The component renders no element of its own, so <code>class</code> and <code>style</code> are not forwarded.
