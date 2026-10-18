---
layout: component-docs
title: useTableTreeData
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`, so pass a getter to keep the row meta, the expand-all state, and the toggles live.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableTreeData parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>getRowMeta</code></td>
        <td><code>(item: T) =&gt; TableTreeRowMeta | undefined</code></td>
        <td>—</td>
        <td>Structural meta for a visible row: <code>{ id, level (0-based), hasChildren, isExpanded }</code>. Return <code>undefined</code> for a row that is not part of the tree.</td>
      </tr>
      <tr>
        <td><code>onToggleItem</code></td>
        <td><code>(item: T) =&gt; void</code></td>
        <td>—</td>
        <td>Toggle a row's expansion.</td>
      </tr>
      <tr>
        <td><code>hasExpandableRows</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>Whether any row in the dataset is expandable. When false the plugin is a no-op: no expanders, no indent, no tree ARIA.</td>
      </tr>
      <tr>
        <td><code>hasExpandAllControl</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Show an expand-all/collapse-all toggle in the tree column header. Requires <code>isAllExpanded</code> plus <code>onExpandAll</code> / <code>onCollapseAll</code>.</td>
      </tr>
      <tr>
        <td><code>isAllExpanded</code></td>
        <td><code>boolean | 'indeterminate'</code></td>
        <td>—</td>
        <td>Aggregate expansion state across every expandable row, driving the header expand-all toggle. <code>true</code> when all are expanded, <code>false</code> when none are, <code>'indeterminate'</code> when some are.</td>
      </tr>
      <tr>
        <td><code>onExpandAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Expand every expandable row. Wired to the header control.</td>
      </tr>
      <tr>
        <td><code>onCollapseAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Collapse every row. Wired to the header control.</td>
      </tr>
      <tr>
        <td><code>indent</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>Indent step per level, mapped to the spacing-3 / spacing-4 / spacing-6 tokens.</td>
      </tr>
      <tr>
        <td><code>treeColumnKey</code></td>
        <td><code>string</code></td>
        <td>the first column no plugin added</td>
        <td>Column that carries the indent + expander. When the key is not found, the first column that did not come from a plugin is used.</td>
      </tr>
      <tr>
        <td><code>hasRowClickExpansion</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>When true, clicking anywhere on an expandable row toggles its expansion, in addition to the chevron. A pointer-only convenience: keyboard and assistive-tech users toggle via the chevron button. Clicks on interactive cell content (buttons, links, form controls) or a text selection do not toggle. Leaf rows stay inert, and it is a no-op on flat data.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableTreeData returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>Wraps the cell renderer of the tree column so it draws the level indent, the chevron, and the cell content. Columns come back untouched while <code>hasExpandableRows</code> is false or no tree column is found.</td>
      </tr>
      <tr>
        <td><code>headerPatch</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; TableHeaderPatch | null</code></td>
        <td>Puts the expand-all / collapse-all button in front of the tree column header text. Returns <code>null</code> for other columns, when <code>hasExpandAllControl</code> is off, or when the three expand-all fields are missing.</td>
      </tr>
      <tr>
        <td><code>rowPatch</code></td>
        <td><code>(row: T, index: number, columnCount: number) =&gt; TableRowPatch | null</code></td>
        <td>Sets <code>aria-level</code> (level + 1) and, for rows with children, <code>aria-expanded</code>. With <code>hasRowClickExpansion</code> it also adds the click-to-toggle handler and the <code>astryx-table__clickable</code> class on expandable rows.</td>
      </tr>
    </tbody>
  </table>
</div>
