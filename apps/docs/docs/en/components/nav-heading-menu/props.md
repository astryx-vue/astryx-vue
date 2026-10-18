---
layout: component-docs
title: Nav Heading Menu
outline: false
footer: false
---

## NavHeadingMenu Props

<div class="component-api-table" role="region" aria-label="NavHeadingMenu Props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name of the menu, written to <code>aria-label</code>. Set it when the heading text alone does not say what the menu is.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Width of the menu, which also sets the padding of each item.</td></tr>
<tr><td><code>minWidth</code></td><td><code>number | string</code></td><td>—</td><td>Overrides the minimum width that the size would give. A number is pixels.</td></tr>
<tr><td><code>focusRequest</code></td><td><code>'first' | 'last' | null</code></td><td><code>null</code></td><td>Moves focus to the first or the last item once the menu opens. The heading's disclosure passes this in, so a keyboard open lands on an item.</td></tr>
</tbody></table>
</div>

## NavHeadingMenu events

<div class="component-api-table" role="region" aria-label="NavHeadingMenu events" tabindex="0">
<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>
<tr><td><code>close</code></td><td>Fired on Escape. <code>SideNavHeading</code> and <code>TopNavHeading</code> already listen for it and close the popover.</td></tr>
</tbody></table>
</div>

## NavHeadingMenu slots

<div class="component-api-table" role="region" aria-label="NavHeadingMenu slots" tabindex="0">
<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>The menu items.</td></tr>
</tbody></table>
</div>

## NavHeadingMenuItem Props

<div class="component-api-table" role="region" aria-label="NavHeadingMenuItem Props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Primary text of the item. The default slot renders rich content instead.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Supporting line under the text.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Renders the item as a link when set.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root, for example <code>RouterLink</code>. The item then sets both <code>href</code> and <code>to</code>.</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>CSS icon class drawn before the text.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled. A click does nothing, and the arrow keys and typeahead skip the item.</td></tr>
</tbody></table>
</div>

## NavHeadingMenuItem events

<div class="component-api-table" role="region" aria-label="NavHeadingMenuItem events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>Fired when the item is activated, before the menu closes.</td></tr>
</tbody></table>
</div>

## NavHeadingMenuItem slots

<div class="component-api-table" role="region" aria-label="NavHeadingMenuItem slots" tabindex="0">
<table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>Rich content replacing the <code>label</code> prop.</td></tr>
<tr><td><code>icon</code></td><td>Icon content, used ahead of the glyph from <code>iconClass</code>.</td></tr>
</tbody></table>
</div>

The whole menu is one `role="menu"`: arrow keys move between items and wrap at both ends, typing a letter jumps to the next item that starts with it, and Escape closes the popover and returns focus to the heading.
