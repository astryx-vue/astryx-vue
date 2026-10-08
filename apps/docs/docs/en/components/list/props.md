---
layout: component-docs
title: List
outline: false
footer: false
---

## Props

### List

<div class="component-api-table" role="region" aria-label="List Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>density</code></td>
        <td><code>ListDensity</code></td>
        <td><code>'balanced'</code></td>
        <td>Spacing density for the rows: compact (4px of block padding), balanced (8px), or spacious (12px, which also widens the inline padding by one step). A single row can override it with its own <code>density</code>.</td>
      </tr>
      <tr>
        <td><code>hasDividers</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether to rule a line between neighbouring rows. The last row never draws one, and rows lose their rounded corners while dividers are on.</td>
      </tr>
      <tr>
        <td><code>edgeCompensation</code></td>
        <td><code>'inline'</code></td>
        <td>-</td>
        <td>Cancels each row's inline inset, up to the container padding published on each edge, so row text lines up with a sibling heading. It reads <code>--container-padding-inline-start</code> and <code>--container-padding-inline-end</code> and treats a missing value as zero, so a row is never pulled outside its container. Omitting the prop leaves row positions unchanged.</td>
      </tr>
      <tr>
        <td><code>listStyle</code></td>
        <td><code>ListMarkerStyle</code></td>
        <td><code>'none'</code></td>
        <td>The marker drawn in front of each row: none, disc (filled bullet), circle (outlined bullet), or decimal (numbers). <code>decimal</code> renders the list as an <code>&lt;ol&gt;</code>.</td>
      </tr>
      <tr>
        <td><code>start</code></td>
        <td><code>number</code></td>
        <td><code>1</code></td>
        <td>The first number of an ordered list, only used when <code>listStyle="decimal"</code>. It is written both to the <code>start</code> attribute of the <code>&lt;ol&gt;</code> and to the CSS counter.</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Plain-text title rendered above the list and associated with it through <code>aria-labelledby</code>. Use the <code>header</code> slot for rich content.</td>
      </tr>
    </tbody>
  </table>
</div>

### ListItem

<div class="component-api-table" role="region" aria-label="ListItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>The primary text identifying the row. A string or a number truncates to one line; use the <code>label</code> slot for rich content.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Secondary text below the label, also truncated to one line. Use the <code>description</code> slot for multiple lines or rich content.</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>ItemDensity</code></td>
        <td>-</td>
        <td>Overrides the density of the surrounding <code>List</code>. When omitted the row inherits the list's density, or balanced outside a list.</td>
      </tr>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>-</td>
        <td>Click handler. It renders a button that fills the row's content area and enables the hover and pressed states. Write <code>@click</code> in a template.</td>
      </tr>
      <tr>
        <td><code>interactiveRef</code></td>
        <td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td>
        <td>-</td>
        <td>A ref to a control inside the row that already carries its keyboard access and action, such as a checkbox in <code>startContent</code>. The row becomes an enlarged click target that forwards surface clicks to that control and renders no button of its own, so it adds no second tab stop. Mutually exclusive with <code>onClick</code> and <code>href</code>, which are ignored while it is set.</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Link URL. A link element is rendered inside the row.</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>'_blank' | '_self'</code></td>
        <td>-</td>
        <td>Where the link opens, only used with <code>href</code>. <code>_blank</code> automatically adds <code>noopener</code> and <code>noreferrer</code>.</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Link relationship tokens, merged and de-duplicated with the ones added automatically.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disabled state. The row becomes inert, its content dims, and <code>aria-disabled="true"</code> is written. A row that carries its own <code>role</code> is left non-inert, because its parent owns the interaction.</td>
      </tr>
      <tr>
        <td><code>isSelected</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Selected state. Written as <code>aria-selected="true"</code> when the role permits it, and as <code>aria-current="true"</code> otherwise. An <code>aria-current</code> you pass yourself wins.</td>
      </tr>
    </tbody>
  </table>
</div>

### Item

<div class="component-api-table" role="region" aria-label="Item Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>as</code></td>
        <td><code>string | Component</code></td>
        <td><code>'div'</code></td>
        <td>The root element. Give a component only when the row carries a <code>role</code>, so the parent keeps keyboard access and the row adds no second tab stop.</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>'center' | 'start'</code></td>
        <td><code>'center'</code></td>
        <td>Vertical alignment of the start and end content slots. Use <code>start</code> when either end is taller than one line of text.</td>
      </tr>
      <tr>
        <td><code>labelLines</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Maximum lines before the label truncates. A string label truncates to one line when this is omitted; slot content is never truncated.</td>
      </tr>
      <tr>
        <td><code>descriptionLines</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Maximum lines before the description truncates. A string description truncates to one line when this is omitted; slot content is left alone in a stacked layout.</td>
      </tr>
      <tr>
        <td><code>layout</code></td>
        <td><code>'stacked' | 'inline'</code></td>
        <td><code>'stacked'</code></td>
        <td>How the label and description sit together. <code>inline</code> shares one line and ellipsizes the description first, keeping the row height fixed for hosts such as a trigger.</td>
      </tr>
      <tr>
        <td><code>isHighlighted</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>The highlighted appearance, which is what keyboard focus and hover paint. Menu-like components use it for the row they have moved to.</td>
      </tr>
    </tbody>
  </table>
</div>

`Item` also accepts everything `ListItem` accepts: `label`, `description`, `density`, `onClick`, `interactiveRef`, `href`, `target`, `rel`, `isDisabled`, and `isSelected`.

## Slots

### List

<div class="component-api-table" role="region" aria-label="List Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The entries of the list, usually <code>ListItem</code>.</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td>Content rendered above the list, associated with it through <code>aria-labelledby</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

### ListItem / Item

<div class="component-api-table" role="region" aria-label="ListItem Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>startContent</code></td>
        <td>Content before the label: an icon, an avatar, or a checkbox.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td>Rich content replacing the <code>label</code> prop. It is exempt from the automatic truncation.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td>Rich content replacing the <code>description</code> prop.</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td>Content after the label: a badge, a timestamp, or a chevron.</td>
      </tr>
      <tr>
        <td><code>marker</code></td>
        <td>The marker drawn at the head of the row as a direct child. <code>Item</code> exposes it; <code>ListItem</code> fills it from the list's <code>listStyle</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Exposed

<div class="component-api-table" role="region" aria-label="List Exposed" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Signature</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>element</code></td>
        <td><code>ComputedRef&lt;HTMLUListElement | HTMLOListElement | null&gt;</code></td>
        <td>The list element itself. A list with a header is wrapped, and this is still the list element inside the wrapper.</td>
      </tr>
    </tbody>
  </table>
</div>

`ListItem` and `Item` also expose <code>element</code> (the root element), <code>focus()</code>, and <code>blur()</code>; focusing lands on the control inside the row that can actually take focus.

## Native attributes

### List

The root element is a `<ul>`, or an `<ol>` when <code>listStyle="decimal"</code>. A header adds a wrapper element around it.

The following go to the list element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

The component writes `role="list"`, `data-density`, `data-dividers`, `data-list-style`, and `data-edge-compensation`. Without a rendered header an `aria-labelledby` you pass is kept; with one, the list's own header takes over.

### ListItem / Item

The root element is a `<div>` by default, and an `<li>` for `ListItem`.

The following go to the root element:

- HTML attributes such as `role` and `id`.
- `aria-*` attributes. An `aria-current` you pass wins over the one derived from the selected state.
- `data-*` attributes.
- `class`.
- `style`.

The component writes `data-density`, `data-align`, `data-interactive`, `data-selected`, `data-disabled`, `data-highlighted`, `data-inert`, `aria-disabled`, and the derived `aria-selected` / `aria-current`. Those are not overridden by an attribute of the same name passed in.
