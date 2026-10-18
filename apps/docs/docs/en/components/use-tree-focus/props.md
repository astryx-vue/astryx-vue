---
layout: component-docs
title: useTreeFocus
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useTreeFocus parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseTreeFocusOptions</code></td>
        <td>—</td>
        <td>Configuration object for tree focus behavior. Required; both of its fields are optional.</td>
      </tr>
      <tr>
        <td><code>options.onToggleExpand</code></td>
        <td><code>(id: string) =&gt; void</code></td>
        <td>—</td>
        <td>Called to expand or collapse the treeitem with the given id: ArrowRight on a collapsed parent, ArrowLeft on an expanded parent, and Enter or Space on a parent without its own action.</td>
      </tr>
      <tr>
        <td><code>options.onActivate</code></td>
        <td><code>(item: HTMLElement) =&gt; boolean</code></td>
        <td>—</td>
        <td>Called when Enter or Space activates a treeitem. Return <code>true</code> when handled; return <code>false</code> or nothing to let the hook fall back to toggling expansion.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTreeFocus returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>treeRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Ref to attach to the tree container element (<code>role="tree"</code>).</td>
      </tr>
      <tr>
        <td><code>handleKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>Key down handler to attach to the tree container.</td>
      </tr>
      <tr>
        <td><code>handleFocus</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Focus handler to attach to the container's <code>@focus</code>. It keeps the roving tab stop in sync after a click. Always safe to attach.</td>
      </tr>
    </tbody>
  </table>
</div>
