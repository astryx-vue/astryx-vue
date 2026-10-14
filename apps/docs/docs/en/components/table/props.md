---
layout: component-docs
title: Table
outline: false
footer: false
---

## Props

### Table

<div class="component-api-table" role="region" aria-label="Table Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>T[]</code></td>
        <td>-</td>
        <td>Rows. When omitted, the default slot composes the table by hand.</td>
      </tr>
      <tr>
        <td><code>columns</code></td>
        <td><code>TableColumn&lt;T&gt;[]</code></td>
        <td>-</td>
        <td><code>key</code>, <code>header</code>, <code>width</code>, <code>align</code>, <code>verticalAlign</code>, <code>sortable</code>, <code>filter</code>, and <code>renderCell</code>.</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>string | (row: T) =&gt; string</code></td>
        <td><code>'id'</code></td>
        <td>Row identity. Grouped rows need a function so the synthetic headers stay stable.</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>Cell padding. Compact is 4×8, balanced is 8×12, spacious is 12×16.</td>
      </tr>
      <tr>
        <td><code>dividers</code></td>
        <td><code>'rows' | 'columns' | 'grid' | 'none'</code></td>
        <td><code>'rows'</code></td>
        <td>The header always keeps its bottom border. The last body row does not draw a row rule.</td>
      </tr>
      <tr>
        <td><code>isStriped</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Even body rows use the muted background.</td>
      </tr>
      <tr>
        <td><code>hasHover</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Hover fill, only when the pointer can hover.</td>
      </tr>
      <tr>
        <td><code>verticalAlign</code></td>
        <td><code>'top' | 'middle' | 'bottom'</code></td>
        <td><code>'middle'</code></td>
        <td>Default vertical alignment. A column can override it.</td>
      </tr>
      <tr>
        <td><code>textOverflow</code></td>
        <td><code>'wrap' | 'truncate'</code></td>
        <td><code>'wrap'</code></td>
        <td>Whether cell text wraps or clips to one line.</td>
      </tr>
      <tr>
        <td><code>plugins</code></td>
        <td><code>Record&lt;string, TablePlugin&lt;T&gt;&gt;</code></td>
        <td>-</td>
        <td>Sort, selection, pagination, column settings, resize, filtering, groups, trees, expansion, sticky columns, row status, and row numbers.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>localized “Table”</td>
        <td>Accessible name of the table.</td>
      </tr>
      <tr>
        <td><code>rowIndexStart</code></td>
        <td><code>number</code></td>
        <td><code>1</code></td>
        <td>Where the first visible data row sits in the full result. Setting this or the total count numbers the data rows.</td>
      </tr>
      <tr>
        <td><code>rowCount</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>How many rows the full result has. With only a start index, the total is unknown.</td>
      </tr>
    </tbody>
  </table>
</div>

### useTableGroupedRows

<div class="component-api-table" role="region" aria-label="useTableGroupedRows props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>data</code></td><td><code>T[]</code></td><td>required</td><td>Rows after filtering, sorting, and paging.</td></tr>
      <tr><td><code>groupBy</code></td><td><code>(item: T) =&gt; string</code></td><td>required</td><td>Which section a row belongs to.</td></tr>
      <tr><td><code>collapsedGroups</code></td><td><code>Set&lt;string&gt;</code></td><td>required</td><td>Sections that are collapsed. Replace the set when it changes.</td></tr>
      <tr><td><code>onToggleGroup</code></td><td><code>(groupKey: string) =&gt; void</code></td><td>required</td><td>Called from the header or its chevron.</td></tr>
      <tr><td><code>renderGroupHeader</code></td><td><code>(key, count, collapsed) =&gt; VNodeChild</code></td><td>name and count</td><td>Content to the right of the chevron.</td></tr>
      <tr><td><code>getRowKey</code></td><td><code>(item: T) =&gt; string</code></td><td>position</td><td>Stable identity for a real row.</td></tr>
      <tr><td><code>groupOrder</code></td><td><code>string[]</code></td><td>first seen</td><td>Keys listed here come first.</td></tr>
    </tbody>
  </table>
</div>

### useTableTreeState

<div class="component-api-table" role="region" aria-label="useTableTreeState props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>data</code></td><td><code>T[]</code></td><td>required</td><td>Nested rows.</td></tr>
      <tr><td><code>idKey</code></td><td><code>string | (item) =&gt; string</code></td><td>required</td><td>Node identity. It remembers expansion and skips a cycle.</td></tr>
      <tr><td><code>childrenKey</code></td><td><code>string</code></td><td><code>children</code></td><td>Field that holds child rows.</td></tr>
      <tr><td><code>expandedIds</code></td><td><code>Set&lt;string&gt;</code></td><td>-</td><td>Controlled expansion. Omit it and the state stays inside the composable.</td></tr>
      <tr><td><code>defaultExpandedIds</code></td><td><code>Iterable&lt;string&gt;</code></td><td>empty</td><td>Nodes open on the first render.</td></tr>
      <tr><td><code>onExpandedIdsChange</code></td><td><code>(ids) =&gt; void</code></td><td>-</td><td>Called when the open set changes.</td></tr>
      <tr><td><code>hasExpandAllControl</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Puts an expand-all button on the tree column header.</td></tr>
      <tr><td><code>hasRowClickExpansion</code></td><td><code>boolean</code></td><td><code>false</code></td><td>A row click toggles a node that has children. Clicks on controls or a text selection do not.</td></tr>
      <tr><td><code>indent</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>md</code></td><td>How far each level steps in.</td></tr>
      <tr><td><code>treeColumnKey</code></td><td><code>string</code></td><td>first ordinary column</td><td>Column that shows the indent and chevron.</td></tr>
      <tr><td><code>sortSiblings</code></td><td><code>(siblings: T[]) =&gt; T[]</code></td><td>-</td><td>Order for one level.</td></tr>
    </tbody>
  </table>
</div>

### useTableRowExpansion

<div class="component-api-table" role="region" aria-label="useTableRowExpansion props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>expandedKeys</code></td><td><code>Set&lt;string&gt;</code></td><td>required</td><td>Rows that are open. The caller owns the set.</td></tr>
      <tr><td><code>onToggle</code></td><td><code>(key: string) =&gt; void</code></td><td>required</td><td>Called from the chevron, a row click, or the context menu.</td></tr>
      <tr><td><code>getRowKey</code></td><td><code>(item: T) =&gt; string</code></td><td>required</td><td>Row identity.</td></tr>
      <tr><td><code>renderExpanded</code></td><td><code>(item: T) =&gt; VNodeChild</code></td><td>required</td><td>Detail content. It lines up with the first column, past the chevron.</td></tr>
      <tr><td><code>getIsItemExpandable</code></td><td><code>(item: T) =&gt; boolean</code></td><td>every row</td><td>Which rows can open.</td></tr>
      <tr><td><code>panelVariant</code></td><td><code>'muted' | 'transparent'</code></td><td><code>transparent</code></td><td>Panel surface. Transparent continues the table surface. Muted separates the detail from the data.</td></tr>
      <tr><td><code>hasRowClickExpansion</code></td><td><code>boolean</code></td><td><code>false</code></td><td>A row click toggles the panel. Clicks on controls or a text selection do not.</td></tr>
    </tbody>
  </table>
</div>

### useTableStickyColumns

<div class="component-api-table" role="region" aria-label="useTableStickyColumns props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>startKeys</code></td><td><code>string[]</code></td><td>empty</td><td>Pin from the first column through the last listed key.</td></tr>
      <tr><td><code>endKeys</code></td><td><code>string[]</code></td><td>empty</td><td>Pin from the first listed key through the last column.</td></tr>
    </tbody>
  </table>
</div>

### useTableRowStatus

`getStatus` returns null for an empty cell. A semantic status draws the success, warning, or error icon. A custom status takes a color: an icon when one is given, otherwise a dot. The label is in the tooltip and in the accessible name.

### useTableRowIndex

`data` is the rows the table is painting, after grouping. `startFrom` begins at 1. `getRowKey` recognizes the same row; without it, identity is the object itself. `label` is the column header, and the default is a hash mark.

`proportional(value)` shares leftover width. Its default minimum is 120px. A column with no width is flexible with a 60px floor. `pixel(value)` sets both width and minimum width.

### TableSelectionToolbar

`count` is the number of selected rows. The `clear` event asks the caller to drop the selection. The default slot is the bulk actions. The count, the clear label, and the region name come from the table messages.

## Theming

Header text uses the label size, semibold weight, and the secondary text color. Body text uses the body size. A selected row uses the accent muted fill. Stripes use the muted background. Hover uses the hover overlay. Inside a card, the scroll area uses the card’s container padding so the first and last cells line up with the heading.
