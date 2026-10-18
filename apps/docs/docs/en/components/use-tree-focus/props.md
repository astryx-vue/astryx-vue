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
        <td>Configuration object for tree focus behavior. Required; every field inside it is optional.</td>
      </tr>
      <tr>
        <td><code>options.itemSelector</code></td>
        <td><code>string</code></td>
        <td><code>'[role="treeitem"]'</code></td>
        <td>Selector for the visible treeitems within the tree, in DOM order.</td>
      </tr>
      <tr>
        <td><code>options.isItemDisabled</code></td>
        <td><code>(item: HTMLElement) =&gt; boolean</code></td>
        <td>—</td>
        <td>Predicate for whether a treeitem is disabled and must be skipped during navigation. Defaults to reading <code>data-tree-disabled</code> and <code>aria-disabled</code>.</td>
      </tr>
      <tr>
        <td><code>options.getLevel</code></td>
        <td><code>(item: HTMLElement) =&gt; number</code></td>
        <td>—</td>
        <td>Reads the 1-based nesting level of a treeitem. Defaults to the <code>aria-level</code> attribute.</td>
      </tr>
      <tr>
        <td><code>options.onToggleExpand</code></td>
        <td><code>(id: string) =&gt; void</code></td>
        <td>—</td>
        <td>Called to expand or collapse the treeitem with the given id: ArrowRight on a collapsed parent, ArrowLeft on an expanded parent, and Enter or Space on a parent without its own action. The id is the item's <code>data-tree-id</code>, or its <code>id</code> attribute when that is absent.</td>
      </tr>
      <tr>
        <td><code>options.onActivate</code></td>
        <td><code>(item: HTMLElement, id: string | undefined) =&gt; boolean | void</code></td>
        <td>—</td>
        <td>Called when Enter or Space activates a treeitem. Return <code>true</code> when handled; return <code>false</code> or nothing to let the hook fall back to toggling expansion.</td>
      </tr>
      <tr>
        <td><code>options.onActiveChange</code></td>
        <td><code>(id: string | undefined) =&gt; void</code></td>
        <td>—</td>
        <td>Notified when the hook moves focus to a treeitem. Consumers use this to move a single roving tab stop when the hook does not own it, and to keep their own active state in step.</td>
      </tr>
      <tr>
        <td><code>options.hasRovingTabIndex</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>When true, the hook owns a single roving tab stop across the visible treeitems: it stamps <code>tabindex</code> 0/-1, repairs the stop on mount, and moves it with navigation. An existing <code>tabindex="0"</code> seed is preserved on mount. Attach the returned <code>handleFocus</code> to keep the stop in sync after clicks.</td>
      </tr>
      <tr>
        <td><code>options.typeahead</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether typeahead is enabled: a printable character jumps to the next item whose text starts with the typed characters.</td>
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
        <td><code>(event?: FocusEvent) =&gt; void</code></td>
        <td>Focus handler to attach to the container's <code>@focus</code>. Keeps the roving tab stop in sync when <code>hasRovingTabIndex</code> is on, and does nothing otherwise, so it is always safe to attach.</td>
      </tr>
      <tr>
        <td><code>focusFirst</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Focus the first enabled visible treeitem.</td>
      </tr>
      <tr>
        <td><code>focusLast</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Focus the last enabled visible treeitem.</td>
      </tr>
    </tbody>
  </table>
</div>
