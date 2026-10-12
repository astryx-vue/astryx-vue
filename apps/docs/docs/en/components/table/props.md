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
        <td><code>string</code></td>
        <td><code>'id'</code></td>
        <td>Field used as the row identity.</td>
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
        <td>Sort, selection, pagination, column settings, resize, and filtering.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>localized “Table”</td>
        <td>Accessible name of the table.</td>
      </tr>
    </tbody>
  </table>
</div>

`proportional(value)` shares leftover width. Its default minimum is 120px. A column with no width is flexible with a 60px floor. `pixel(value)` sets both width and minimum width.

### TableSelectionToolbar

`count` is the number of selected rows. The `clear` event asks the caller to drop the selection. The default slot is the bulk actions. The count, the clear label, and the region name come from the table messages.

## Theming

Header text uses the label size, semibold weight, and the secondary text color. Body text uses the body size. A selected row uses the accent muted fill. Stripes use the muted background. Hover uses the hover overlay. Inside a card, the scroll area uses the card’s container padding so the first and last cells line up with the heading.
