---
layout: component-docs
title: Tree List
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TreeList Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>TreeListItemData[]</code></td>
        <td>-</td>
        <td>The tree. See the item fields below.</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>Block padding of a row: 4px, 8px, or 12px.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'lineGuides' | 'noGuides'</code></td>
        <td><code>'lineGuides'</code></td>
        <td>Whether parent and child rows are joined by a guide line.</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Plain title above the tree. Use the <code>header</code> slot for rich content.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name of the tree when there is no visible header.</td>
      </tr>
    </tbody>
  </table>
</div>

### TreeListItemData

| Field | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | Stable identity for focus and expansion. |
| <code>label</code> | <code>string</code> | Visible name. |
| <code>description</code> | <code>string</code> | Secondary line. |
| <code>icon</code> | <code>string</code> | Leading glyph name, or a CSS icon class starting with <code>i-</code>. |
| <code>endIcon</code> | <code>string</code> | Trailing glyph or CSS icon class. |
| <code>badge</code> | <code>string</code> | Trailing count. |
| <code>children</code> | <code>TreeListItemData[]</code> | Nested items. Present means the row can expand. |
| <code>href</code> / <code>target</code> | <code>string</code> | Renders the row as a link. <code>target="_blank"</code> adds <code>rel="noopener noreferrer"</code>. |
| <code>onClick</code> | <code>(event: MouseEvent) =&gt; void</code> | Renders a leaf as a button. |
| <code>isDisabled</code> | <code>boolean</code> | The row does not take focus or activation. |
| <code>isSelected</code> | <code>boolean</code> | Callers mark the current item. The tree has no root selection value and does not force a single selected row. |
| <code>isExpanded</code> | <code>boolean</code> | Starting expansion. Later toggles are owned by the tree. |
| <code>className</code> | <code>string</code> | Extra class on that row. |
| <code>style</code> | <code>CSSProperties</code> | Inline style on that row. |

The <code>start</code> and <code>end</code> slots receive <code>{ item }</code> and replace <code>icon</code> and <code>endIcon</code>.

A row's accessible name is its label. The description is exposed with <code>aria-describedby</code>, so the chevron and icons stay out of the name. Typeahead matches the label only. A visible <code>header</code> names the tree and wins over a passed <code>aria-label</code>. A keydown listener on the root that calls <code>preventDefault</code> keeps arrow keys from moving focus inside the tree.

## Theming

Indent is <code>--astryx-spacing-4</code>. Row content uses <code>--astryx-spacing-2</code> of inline padding and the same gap. The guide is a 1px emphasized border. Focus uses the shared focus outline tokens. A selected row uses the accent muted fill.
