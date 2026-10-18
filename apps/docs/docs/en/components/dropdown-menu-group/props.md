---
layout: component-docs
title: Dropdown Menu Group
outline: false
footer: false
---

## DropdownMenuGroup Props

<div class="component-api-table" role="region" aria-label="DropdownMenuGroup Props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string | number</code></td><td>—</td><td>Heading shown above the group's rows and used as the group's accessible name. Omit it for an unnamed group.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the rows of the group — action rows, checkbox rows, radio groups, submenus, and dividers.
- `title`: rich content replacing the `title` prop. The slot content is still the group's accessible name.

## Native attributes

Attributes fall through to the group wrapper, the element carrying `role="group"`, so `class` and `style` reach it. The heading gets a generated id that `aria-labelledby` points at; an unnamed group has no `aria-labelledby`.
