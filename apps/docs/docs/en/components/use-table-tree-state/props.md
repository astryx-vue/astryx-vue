---
layout: component-docs
title: useTableTreeState
outline: false
footer: false
---

`data` is a `MaybeRefOrGetter`; pass a getter or a ref when the tree can change. The other fields are read from the config object you pass.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableTreeState parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly T[]&gt;</code></td>
        <td>—</td>
        <td>Nested data: rows may carry child rows under <code>childrenKey</code>. Flat data (no children anywhere) makes the plugin a no-op, so it can be adopted before the data becomes hierarchical.</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>(keyof T &amp; string) | ((item: T) =&gt; string | number)</code></td>
        <td>—</td>
        <td>Row ID accessor: property name or function returning a unique id.</td>
      </tr>
      <tr>
        <td><code>childrenKey</code></td>
        <td><code>string</code></td>
        <td><code>'children'</code></td>
        <td>Property holding each row's children array.</td>
      </tr>
      <tr>
        <td><code>defaultExpandedIds</code></td>
        <td><code>Iterable&lt;string&gt;</code></td>
        <td>—</td>
        <td>Initial expanded row ids for uncontrolled mode, read once at setup. Ignored when <code>expandedIds</code> is provided.</td>
      </tr>
      <tr>
        <td><code>expandedIds</code></td>
        <td><code>ReadonlySet&lt;string&gt;</code></td>
        <td>—</td>
        <td>Controlled set of expanded row ids. Pair with <code>onExpandedIdsChange</code>.</td>
      </tr>
      <tr>
        <td><code>onExpandedIdsChange</code></td>
        <td><code>(ids: ReadonlySet&lt;string&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>Called with the next expanded set whenever expansion changes (both modes). In lazy-loading setups, trigger the children fetch here.</td>
      </tr>
      <tr>
        <td><code>isItemExpandable</code></td>
        <td><code>(item: T) =&gt; boolean</code></td>
        <td>non-empty children</td>
        <td>Should this row show an expander? Overrides the default non-empty-children check; use for lazy loading, where a row is expandable before its children have been fetched.</td>
      </tr>
      <tr>
        <td><code>sortSiblings</code></td>
        <td><code>(siblings: T[]) =&gt; T[]</code></td>
        <td>—</td>
        <td>Sort each sibling group independently during flattening; children always stay directly under their parent. Use it to compose column sorting with the tree order.</td>
      </tr>
      <tr>
        <td><code>indent</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>Indent step per level (spacing-3 / spacing-4 / spacing-6), forwarded to <code>useTableTreeData</code>.</td>
      </tr>
      <tr>
        <td><code>treeColumnKey</code></td>
        <td><code>string</code></td>
        <td>the first column no plugin added</td>
        <td>Column that carries the indent + expander, forwarded to <code>useTableTreeData</code>.</td>
      </tr>
      <tr>
        <td><code>hasExpandAllControl</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Show the expand-all/collapse-all toggle in the tree column header.</td>
      </tr>
      <tr>
        <td><code>hasRowClickExpansion</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Let a click anywhere on an expandable row toggle it, forwarded to <code>useTableTreeData</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableTreeState returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>visibleData</code></td>
        <td><code>ComputedRef&lt;T[]&gt;</code></td>
        <td>The rows to render, parents followed by the children of expanded rows. Pass it as <code>data</code> to the table.</td>
      </tr>
      <tr>
        <td><code>plugin</code></td>
        <td><code>TablePlugin&lt;T&gt;</code></td>
        <td>The tree plugin, already wired to the visible rows and the expanded set. Put it under any key of the <code>plugins</code> prop.</td>
      </tr>
      <tr>
        <td><code>expandedIds</code></td>
        <td><code>ComputedRef&lt;ReadonlySet&lt;string&gt;&gt;</code></td>
        <td>The expanded set in use: your controlled value, or the internal one.</td>
      </tr>
      <tr>
        <td><code>isAllExpanded</code></td>
        <td><code>ComputedRef&lt;boolean | 'indeterminate'&gt;</code></td>
        <td>Aggregate expansion state over every expandable row.</td>
      </tr>
      <tr>
        <td><code>expandAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Expands every expandable row and reports the new set through <code>onExpandedIdsChange</code>.</td>
      </tr>
      <tr>
        <td><code>collapseAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Collapses every row and reports the empty set through <code>onExpandedIdsChange</code>.</td>
      </tr>
    </tbody>
  </table>
</div>
