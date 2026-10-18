---
layout: component-docs
title: useTableRowExpansion
outline: false
footer: false
---

## Parameters

`useTableRowExpansion()` takes one config object. Wrap it in a getter or a `ref` so the panels follow the current expanded set: `useTableRowExpansion(() => ({ ... }))`.

<div class="component-api-table" role="region" aria-label="useTableRowExpansion parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>expandedKeys</code></td>
        <td><code>ReadonlySet&lt;string&gt;</code></td>
        <td>—</td>
        <td>Required. Set of currently-expanded row keys. Consumer-owned.</td>
      </tr>
      <tr>
        <td><code>onToggle</code></td>
        <td><code>(key: string) =&gt; void</code></td>
        <td>—</td>
        <td>Required. Called with a row key when its expansion is toggled, by the chevron or by the context-menu action.</td>
      </tr>
      <tr>
        <td><code>getRowKey</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>Required. Derive a stable unique key from a row item.</td>
      </tr>
      <tr>
        <td><code>renderExpanded</code></td>
        <td><code>(item: T) =&gt; VNodeChild</code></td>
        <td>—</td>
        <td>Required. Render the detail content shown in a full-width panel below the row when it is expanded. Receives the row item.</td>
      </tr>
      <tr>
        <td><code>getIsItemExpandable</code></td>
        <td><code>(item: T) =&gt; boolean</code></td>
        <td>—</td>
        <td>Control which rows are expandable. Non-expandable rows show no chevron, no context-menu action, and never render a panel. Defaults to all rows expandable.</td>
      </tr>
      <tr>
        <td><code>panelVariant</code></td>
        <td><code>'muted' | 'transparent'</code></td>
        <td><code>'transparent'</code></td>
        <td>Background behind the detail panel. <code>'transparent'</code> paints nothing: the panel is the row's continuation and takes whatever surface the table sits on, so a Card shows through and a striped table's zebra reads on unchanged. <code>'muted'</code> washes it, marking it as commentary rather than another row of data — reach for it in a bare table with no card, dividers or striping, where nothing else makes that distinction. The wash is a low-alpha near-black, so it is close to invisible over a dark card: <code>'muted'</code> is largely a light-theme effect.</td>
      </tr>
      <tr>
        <td><code>hasRowClickExpansion</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Toggle a row by clicking anywhere on it, not only on its chevron. A pointer-only convenience layered over the chevron, which stays the accessible control for keyboard and assistive tech. Clicks on interactive cell content (buttons, links, form controls) or on a text selection do not toggle, and non-expandable rows stay inert.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

`useTableRowExpansion()` returns one `TablePlugin&lt;T&gt;`. Pass it to `Table` in `plugins`. The plugin fills three fields of the plugin contract:

<div class="component-api-table" role="region" aria-label="useTableRowExpansion returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>Prepends the <code>__expansion</code> column with the chevron.</td>
      </tr>
      <tr>
        <td><code>rowPatch</code></td>
        <td><code>(row: T, index: number, columnCount: number) =&gt; TableRowPatch | null</code></td>
        <td>Adds the expand action to the row's context menu, the optional whole-row click, and the panel when the row is open. Returns <code>null</code> for a row that is not expandable.</td>
      </tr>
      <tr>
        <td><code>cellPatch</code></td>
        <td><code>(input: TableCellPatchInput&lt;T&gt;) =&gt; TableCellPatch | null</code></td>
        <td>Marks the chevron cells with the <code>astryx-table__expansion</code> class so they keep their 40px width.</td>
      </tr>
    </tbody>
  </table>
</div>

### TableRowPatch

<div class="component-api-table" role="region" aria-label="TableRowPatch fields" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>attrs</code></td>
        <td><code>Record&lt;string, string | undefined&gt;</code></td>
        <td><code>data-expanded</code> is set on an open row.</td>
      </tr>
      <tr>
        <td><code>class</code></td>
        <td><code>string</code></td>
        <td><code>astryx-table__clickable</code> when <code>hasRowClickExpansion</code> is on.</td>
      </tr>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>Toggles the row, unless the click landed on an interactive element or on a text selection.</td>
      </tr>
      <tr>
        <td><code>menu</code></td>
        <td><code>TableRowMenuItem[]</code></td>
        <td>One item that expands or collapses the row. Its label is localized.</td>
      </tr>
      <tr>
        <td><code>panel</code></td>
        <td><code>TablePanelPatch</code></td>
        <td>The detail panel below the row. Carries <code>variant</code> and <code>render</code>, and is only present while the row is open.</td>
      </tr>
    </tbody>
  </table>
</div>
