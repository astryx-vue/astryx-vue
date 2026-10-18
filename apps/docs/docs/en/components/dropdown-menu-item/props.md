---
layout: component-docs
title: Dropdown Menu Item
outline: false
footer: false
---

## DropdownMenuItem Props

<div class="component-api-table" role="region" aria-label="DropdownMenuItem Props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>Primary text of the row. Use the <code>label</code> slot for rich content.</td></tr>
<tr><td><code>description</code></td><td><code>string | number</code></td><td>—</td><td>Secondary line below the label. Use the <code>description</code> slot for rich content.</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>Icon before the label: a CSS icon class (an UnoCSS class such as <code>i-carbon-copy</code>, or one of your own), or a component that draws the SVG. astryx-vue ships no icons. Use the <code>icon</code> slot for arbitrary content.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the row. A disabled row is skipped by the arrow keys and by typeahead, and it does not respond to clicks.</td></tr>
<tr><td><code>variant</code></td><td><code>'default' | 'destructive'</code></td><td><code>'default'</code></td><td>Visual variant. <code>destructive</code> recolors the label, description, and icon in the error color for dangerous actions such as Delete. The hover highlight stays the shared neutral, so it still matches every other row.</td></tr>
<tr><td><code>hasCloseOnSelect</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether activating the row closes the menu. Set it to <code>false</code> for an action that reports its result on the row itself, such as a copy row.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Address the row navigates to. The row then renders as one anchor carrying <code>role="menuitem"</code>, so a ⌘/Ctrl-click and a middle click keep the browser's meaning.</td></tr>
<tr><td><code>target</code></td><td><code>'_blank' | '_self'</code></td><td>—</td><td>Link target. Only used with <code>href</code>.</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>Link relationship. Only used with <code>href</code>. <code>noopener</code> and <code>noreferrer</code> are added for <code>target="_blank"</code>.</td></tr>
<tr><td><code>onClick</code></td><td><code>(event: MouseEvent) =&gt; void</code></td><td>—</td><td>Called when the row is activated. On a link row it runs before the browser navigates, and it is skipped for a modified click, which the browser owns.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="DropdownMenuItem events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>Fired when the row is activated, with the click that activated it. <code>@click</code> and <code>onClick</code> reach the same handler, so a row never runs one twice.</td></tr>
</tbody></table>
</div>

## Slots

- `icon`: arbitrary leading content, replacing the `icon` prop.
- `label`: rich content replacing the `label` prop.
- `description`: rich content replacing the `description` prop.
- `endContent`: trailing content, such as a `Kbd` shortcut hint.

## Native attributes

The row root is the element carrying `role="menuitem"`: an `<a>` when `href` is set, otherwise the `Item` root. Attributes and DOM event handlers fall through to it, so `id`, `data-*`, `aria-*`, and drag-and-drop handlers all land on the row. `class` and `style` also reach that root, which is how a preview marks one row as highlighted.

The row takes its height from the menu's `size`, so it matches the trigger button without extra props.
