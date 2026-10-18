---
layout: component-docs
title: Typeahead
outline: false
footer: false
---

## Typeahead Props

<div class="component-api-table" role="region" aria-label="Typeahead Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>Selected item. An item has at least <code>id</code> and <code>label</code>.</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>Required</td><td>Static or async source. An empty query prefers <code>bootstrap</code>.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Field label. Always available to assistive technology.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text under the label.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip text on an info icon next to the label.</td></tr>
      <tr><td><code>labelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hides the label visually while keeping it accessible.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code> / <code>搜索…</code></td><td>Placeholder. English unless a locale is provided.</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>Wait after typing before searching. Use 0 for local data.</td></tr>
      <tr><td><code>minQueryLength</code></td><td><code>number</code></td><td><code>1</code></td><td>Shortest query that gets searched, counted in visible characters. Below it nothing is searched and the menu stays closed, so a query nobody searched never reports "no results". An empty query is not "too short": it still bootstraps.</td></tr>
      <tr><td><code>hasEntriesOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show bootstrap results on focus before the user types.</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Legacy name for <code>hasEntriesOnFocus</code>. Either one turns it on.</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focus the input on mount.</td></tr>
      <tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>Maximum rows in the menu.</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show a clear button that deselects the current value.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Legacy name for <code>hasClear</code>. Turning either one off removes the button.</td></tr>
      <tr><td><code>emptySearchText</code></td><td><code>string | null</code></td><td><code>'No results found'</code> / <code>'未找到结果'</code></td><td>Text shown when the query matched nothing. <code>null</code> means "not given" and falls through to the default; an empty string renders nothing. For rich content use the <code>empty</code> slot.</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string | null</code></td><td>—</td><td>Legacy name for <code>emptySearchText</code>.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the field.</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Explains why the field is disabled. With <code>disabled</code>, the control stays focusable through <code>aria-disabled</code> and <code>readonly</code> instead of the native <code>disabled</code>, and the message shows as a tooltip on hover or keyboard focus.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Legacy name for <code>disabledMessage</code>.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>Status style.</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>Status text under the field.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input and token size.</td></tr>
      <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the field as required.</td></tr>
      <tr><td><code>optional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows an optional indicator on the label.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name. Submits the selected id.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the whole field (number = pixels, string used as-is).</td></tr>
    </tbody>
  </table>
</div>

## Typeahead Emits

<div class="component-api-table" role="region" aria-label="Typeahead Emits" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T | null</code></td><td>Emitted when the selection is set or cleared.</td></tr>
      <tr><td><code>change</code></td><td><code>value: T | null</code></td><td>Emitted when the selection is set or cleared.</td></tr>
      <tr><td><code>changeQuery</code></td><td><code>query: string</code></td><td>Emitted when the query text changes.</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>Legacy name for <code>changeQuery</code>. Both fire.</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>Emitted when the menu opens or closes.</td></tr>
    </tbody>
  </table>
</div>

## Typeahead Slots

<div class="component-api-table" role="region" aria-label="Typeahead Slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>Icon at the start of the input.</td></tr>
      <tr><td><code>item</code></td><td><code>{ item, isActive, isSelected }</code></td><td>Custom menu row. Replaces the default <code>TypeaheadItem</code>.</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>Custom empty state.</td></tr>
    </tbody>
  </table>
</div>

## createStaticSource

<div class="component-api-table" role="region" aria-label="createStaticSource" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>items</code></td><td><code>T[]</code></td><td>Local items.</td></tr>
      <tr><td><code>keywords</code></td><td><code>(item: T) =&gt; string[]</code></td><td>Extra words included in the substring match.</td></tr>
    </tbody>
  </table>
</div>

## Grouping results

Put a group name on `item.auxiliaryData.group`. Rows that share a name are rendered as one `role="group"` block with a visible heading, in the order the groups first appear. Rows without a group stay at their own position.

```ts
const items = [
  { id: 'apple', label: 'Apple', auxiliaryData: { group: 'Fruit' } },
  { id: 'carrot', label: 'Carrot', auxiliaryData: { group: 'Vegetable' } },
]
```

## BaseTypeahead

No field label, description, or validation message. Use it where the surrounding surface already has a title, such as a command palette. `label` here is the input's accessible name; omit it when an outside `<label for>` already names the input. The default menu row is `TypeaheadItem`, and the `item` slot replaces it.

<div class="component-api-table" role="region" aria-label="BaseTypeahead Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>Selected item.</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>Required</td><td>Static or async source.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name of the input.</td></tr>
      <tr><td><code>inputId</code></td><td><code>string</code></td><td>Generated</td><td>Id of the input, so an outside label can point at it.</td></tr>
      <tr><td><code>describedBy</code></td><td><code>string</code></td><td>—</td><td>Ids of the description and status the caller already computed.</td></tr>
      <tr><td><code>ariaDescribedBy</code></td><td><code>string</code></td><td>—</td><td>Input-specific alias for <code>aria-describedby</code>. Takes precedence over the native attribute.</td></tr>
      <tr><td><code>ariaLabelledBy</code></td><td><code>string</code></td><td>—</td><td>Input-specific alias for <code>aria-labelledby</code>. Takes precedence over the native attribute.</td></tr>
      <tr><td><code>anchorRef</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>Element the dropdown hangs from and measures itself against. Defaults to the input's own wrapper.</td></tr>
      <tr><td><code>inputTabIndex</code></td><td><code>number</code></td><td>—</td><td>Tab order of the input. Defaults to <code>-1</code> while the selected token covers the input, so the invisible input is not a tab stop.</td></tr>
      <tr><td><code>isFocusableDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keep a disabled input focusable through <code>aria-disabled</code> and <code>readonly</code> so a caller-owned disabled reason stays discoverable. Text entry stays blocked.</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focus the input on mount.</td></tr>
      <tr><td><code>hasEntriesOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show bootstrap results on focus before the user types.</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Legacy name for <code>hasEntriesOnFocus</code>. Either one turns it on.</td></tr>
      <tr><td><code>minQueryLength</code></td><td><code>number</code></td><td><code>1</code></td><td>Shortest query that gets searched, counted in visible characters. Below it nothing is searched and the menu stays closed.</td></tr>
      <tr><td><code>menuWidth</code></td><td><code>number</code></td><td>—</td><td>Requested dropdown width in pixels. Never narrower than the anchor, and clamped to the viewport.</td></tr>
      <tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>Maximum rows in the menu.</td></tr>
      <tr><td><code>emptySearchText</code></td><td><code>string | null</code></td><td><code>'No results found'</code> / <code>'未找到结果'</code></td><td>Text shown when the query matched nothing. <code>null</code> falls through to the default; an empty string renders nothing.</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string | null</code></td><td>—</td><td>Legacy name for <code>emptySearchText</code>.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code></td><td>Input placeholder.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the input.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Why the input is disabled. Shown as a tooltip and announced as the description while the input stays focusable.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>Border color of the control.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input and token size.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show a clear button.</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>Wait after typing before searching. Use 0 for local data.</td></tr>
      <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the input as required.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name. Submits the selected id.</td></tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="BaseTypeahead Emits" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T | null</code></td><td>Emitted when the selection is set or cleared.</td></tr>
      <tr><td><code>change</code></td><td><code>value: T | null</code></td><td>Emitted when the selection is set or cleared.</td></tr>
      <tr><td><code>changeQuery</code></td><td><code>query: string</code></td><td>Emitted when the query text changes.</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>Legacy name for <code>changeQuery</code>. Both fire.</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>Emitted when the menu opens or closes.</td></tr>
    </tbody>
  </table>
</div>

Native attributes and listeners that are not listed above land on the input element, so `@keydown`, `@focus`, `@blur` and `aria-*` work as they would on a plain `<input>`. A `keydown` listener runs before the internal keyboard navigation; call `event.preventDefault()` to skip it.

## TypeaheadItem

<div class="component-api-table" role="region" aria-label="TypeaheadItem props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>item</code></td><td><code>SearchableItem</code></td><td>Required</td><td>The search result this row shows.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Overrides the item's own description.</td></tr>
      <tr><td><code>group</code></td><td><code>string</code></td><td>—</td><td>Accepted for API parity; the row itself draws no heading. Grouping is done by the menu from <code>item.auxiliaryData.group</code>.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Paints the row as unavailable.</td></tr>
      <tr><td><code>icon</code> (slot)</td><td>—</td><td>—</td><td>Icon or avatar shown before the label.</td></tr>
    </tbody>
  </table>
</div>
