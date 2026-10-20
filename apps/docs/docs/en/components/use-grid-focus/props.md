---
layout: component-docs
title: useGridFocus
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useGridFocus parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseGridFocusOptions</code></td>
        <td>—</td>
        <td>Configuration object for grid focus behavior. Required.</td>
      </tr>
      <tr>
        <td><code>options.columns</code></td>
        <td><code>number | MaybeRefOrGetter&lt;number&gt;</code></td>
        <td>—</td>
        <td>Number of columns in the grid. Used for up/down navigation (moves by this many cells). Required.</td>
      </tr>
      <tr>
        <td><code>options.cellSelector</code></td>
        <td><code>string</code></td>
        <td><code>'button:not([disabled]), [tabindex]:not([tabindex="-1"])'</code></td>
        <td>Selector for cells within the grid. Should match ALL cell positions in DOM order (including disabled/empty) so grid geometry is preserved.</td>
      </tr>
      <tr>
        <td><code>options.isCellFocusable</code></td>
        <td><code>(cell: HTMLElement) =&gt; boolean</code></td>
        <td>every matched cell is focusable</td>
        <td>Predicate for whether a matched cell can receive focus. Omit to treat every matched cell as focusable.</td>
      </tr>
      <tr>
        <td><code>options.getFocusTarget</code></td>
        <td><code>(cell: HTMLElement) =&gt; HTMLElement | null</code></td>
        <td>the cell itself</td>
        <td>Resolves the element to focus for a cell, e.g. a button inside a <code>role="gridcell"</code> wrapper.</td>
      </tr>
      <tr>
        <td><code>options.onNavigateBefore</code></td>
        <td><code>(column: number, offset: number) =&gt; void</code></td>
        <td>—</td>
        <td>Callback when navigation would go before the first cell. Receives the current column index and the offset (1 for horizontal, columns for vertical).</td>
      </tr>
      <tr>
        <td><code>options.onNavigateAfter</code></td>
        <td><code>(column: number, offset: number) =&gt; void</code></td>
        <td>—</td>
        <td>Callback when navigation would go after the last cell. Receives the current column index and the offset.</td>
      </tr>
      <tr>
        <td><code>options.onPageUp</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Callback for Page Up (e.g., navigate to the previous month in calendars). Without it the key is left alone.</td>
      </tr>
      <tr>
        <td><code>options.onPageDown</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Callback for Page Down (e.g., navigate to the next month in calendars). Without it the key is left alone.</td>
      </tr>
      <tr>
        <td><code>options.hasRovingTabIndex</code></td>
        <td><code>boolean | MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>Owns a single roving tab stop across the grid: one focusable cell (its resolved focus target) carries <code>tabindex="0"</code>, the rest <code>-1</code>. Stamped and repaired after mount and moved with arrow navigation.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useGridFocus returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>gridRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Ref to attach to the grid container element.</td>
      </tr>
      <tr>
        <td><code>handleKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>Key down handler to attach to the grid container.</td>
      </tr>
      <tr>
        <td><code>handleFocus</code></td>
        <td><code>(event: FocusEvent) =&gt; void</code></td>
        <td>Focus handler for the grid container, bound to <code>focusin</code>. Keeps the roving tab stop in sync when <code>hasRovingTabIndex</code> is enabled; a no-op otherwise, so it is always safe to attach.</td>
      </tr>
      <tr>
        <td><code>focusCell</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>Focus a specific cell by index (clamped to the valid range). A cell that cannot take focus is left alone.</td>
      </tr>
      <tr>
        <td><code>focusFirst</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Focus the first focusable cell in the grid.</td>
      </tr>
      <tr>
        <td><code>focusLast</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Focus the last focusable cell in the grid.</td>
      </tr>
    </tbody>
  </table>
</div>
