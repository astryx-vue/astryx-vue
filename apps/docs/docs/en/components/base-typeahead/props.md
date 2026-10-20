---
layout: component-docs
title: Base Typeahead
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="BaseTypeahead props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>modelValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>Currently selected item. An empty value means nothing is selected yet.</td></tr>
<tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>—</td><td>Static or async source with <code>search</code> and optional <code>bootstrap</code>. Required.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name of the input. Omit it when an outside <code>&lt;label for&gt;</code> already names the input.</td></tr>
<tr><td><code>inputId</code></td><td><code>string</code></td><td>generated</td><td>Id of the input, so an outside label can point at it.</td></tr>
<tr><td><code>describedBy</code></td><td><code>string</code></td><td>—</td><td>Ids of the description and status the caller already computed.</td></tr>
<tr><td><code>ariaDescribedBy</code></td><td><code>string</code></td><td>—</td><td>Input-specific alias for <code>aria-describedby</code>. Takes precedence over the native attribute.</td></tr>
<tr><td><code>ariaLabelledBy</code></td><td><code>string</code></td><td>—</td><td>Input-specific alias for <code>aria-labelledby</code>. Takes precedence over the native attribute.</td></tr>
<tr><td><code>anchorRef</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>Element the dropdown hangs from and measures itself against. Defaults to the input's own wrapper.</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code></td><td>Placeholder text, shown while nothing is selected.</td></tr>
<tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the input.</td></tr>
<tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Why the input is disabled, shown as a tooltip and announced as the description while the input stays focusable.</td></tr>
<tr><td><code>isFocusableDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keeps a disabled input focusable through <code>aria-disabled</code> and <code>readonly</code> so a caller-owned disabled reason stays discoverable. Text entry stays blocked.</td></tr>
<tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>Border color of the control. The message itself belongs to the caller's field.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size of the input and of the dropdown rows.</td></tr>
<tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear button.</td></tr>
<tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>Wait after typing before searching. Use 0 for local data.</td></tr>
<tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>Maximum rows in the dropdown.</td></tr>
<tr><td><code>menuWidth</code></td><td><code>number</code></td><td>—</td><td>Requested dropdown width in pixels. Never narrower than the anchor, and clamped to the viewport.</td></tr>
<tr><td><code>minQueryLength</code></td><td><code>number</code></td><td><code>1</code></td><td>Shortest query that gets searched, counted in visible characters. Below it nothing is searched and the menu stays closed.</td></tr>
<tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows bootstrap results on focus before typing. Legacy name of <code>hasEntriesOnFocus</code>; either one turns it on.</td></tr>
<tr><td><code>hasEntriesOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows bootstrap results on focus before typing.</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focuses the input on mount.</td></tr>
<tr><td><code>emptyText</code></td><td><code>string | null</code></td><td>—</td><td>Text shown when the source has nothing at all.</td></tr>
<tr><td><code>emptySearchText</code></td><td><code>string | null</code></td><td>localized “No results found”</td><td>Text shown when the query matched nothing. <code>null</code> counts as not given and falls through to the default; pass an empty string to render nothing.</td></tr>
<tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the input as required.</td></tr>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name. Submits the selected item's id.</td></tr>
<tr><td><code>inputTabIndex</code></td><td><code>number</code></td><td>—</td><td>Tab order of the input.</td></tr>
</tbody></table>
</div>

## Events

- `update:modelValue(value: T | null)` / `change(value: T | null)`: the selection was set or cleared.
- `search(query: string)` / `changeQuery(query: string)`: the query text changed. Both fire; `search` is the legacy name.
- `openChange(isOpen: boolean)`: the dropdown opened or closed.

Native attributes and listeners that are not listed above land on the input element, so `@keydown`, `@focus`, `@blur`, and `aria-*` work as they would on a plain `<input>`. A `keydown` listener runs before the internal keyboard navigation; call `event.preventDefault()` to skip it.

## Slots

- `icon`: artwork at the start of the input. The wrapper is hidden from assistive technology.
- `item`: replaces the default row, and receives `item`, `isActive`, and `isSelected`. The row wrapper that owns highlight, selection, pointer, and keyboard behavior stays.
- `empty`: replaces the no-results content.
