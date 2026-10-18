---
layout: component-docs
title: Link Provider
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="LinkProvider props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>component</code></td><td><code>LinkComponentType</code></td><td>—</td><td>Link component to use for all link elements in the subtree (e.g. <code>RouterLink</code> or <code>NuxtLink</code>). It receives <code>href</code> and <code>to</code>. A component's own <code>as</code> prop still wins. Required.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="LinkProvider slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>Content rendered with the link provider.</td></tr>
</tbody></table>
</div>

## Exports

<div class="component-api-table" role="region" aria-label="LinkProvider exports" tabindex="0">
<table><thead><tr><th>Export</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>useLinkComponent</code></td><td><code>() =&gt; ComputedRef&lt;Component | undefined&gt;</code></td><td>The link component the nearest provider supplies, or <code>undefined</code> outside one. Use it as <code>props.as ?? linkComponent.value</code> so an explicit <code>as</code> still wins.</td></tr>
</tbody></table>
</div>

## Components that follow the provider

These render their link through the provider unless they are given their own `as`:

- `Link`, `Button`, `Avatar`, `Token`
- `NavItem`, `NavMenuItem`, `NavHeadingMenuItem`, `SideNavHeading`, `TopNavItem`, `TopNavMegaMenuItem`, `TopNavMegaMenuFeaturedCard`
- `BreadcrumbItem`, `Tab`, `Item` (List)
- `DropdownMenuItem`, `ContextMenuItem`, `MoreMenuRow`, `TreeListItem`

Not routed through the provider: the `AppShell` skip link, `Outline` links (in-page anchors), `ClickableCard` (its overlay control is a visually hidden anchor), and links rendered from Markdown.

## Native attributes

The component renders no element of its own, so <code>class</code> and <code>style</code> are not forwarded.
