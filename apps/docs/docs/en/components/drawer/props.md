---
layout: component-docs
title: Drawer
outline: false
footer: false
---

## Drawer Props

<div class="component-api-table" role="region" aria-label="Drawer props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Whether the drawer is open. The caller owns this state. Required.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name of the drawer. Required.</td></tr>
<tr><td><code>placement</code></td><td><code>'start' | 'end'</code></td><td><code>'end'</code></td><td>Logical edge, mirrored under RTL. The exit always slides out the side it entered; a change while open takes effect on the next open.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td><code>400</code></td><td>Preferred width. Numbers are pixels. On phones it leaves at least 56px of the page showing.</td></tr>
<tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td>Theme default (16px)</td><td>Content padding, mapped to the <code>--astryx-spacing-*</code> tokens.</td></tr>
<tr><td><code>purpose</code></td><td><code>'required' | 'form' | 'info'</code></td><td><code>'info'</code></td><td><code>required</code> disables Escape and scrim dismissal. <code>form</code> allows Escape only. <code>info</code> allows both.</td></tr>
<tr><td><code>hasScrim</code></td><td><code>boolean</code></td><td><code>true</code></td><td><code>true</code> is modal: scroll lock and a focus trap. <code>false</code> is non-modal: the page beside it stays clickable and scrollable, Escape still closes it, and you should include a visible close button.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires with `false` when the user requests dismissal through Escape or a scrim click, depending on `purpose`. The parent sets `isOpen` to close.

## Slots

- `default`: drawer body, scrollable. Usually starts with a `DrawerHeader`.
- `footer`: bottom content, such as actions.

## DrawerHeader Props

<div class="component-api-table" role="region" aria-label="DrawerHeader props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Title. Also names the drawer. Required.</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>Secondary text below the title. Not rendered when empty and no <code>subtitle</code> slot is set.</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td>Shown when <code>openChange</code> has a listener</td><td>Shows a close button that emits <code>openChange(false)</code>.</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td>Active language</td><td>Accessible name of the close button. Defaults to Close in English and 关闭 in Chinese.</td></tr>
</tbody></table>
</div>

## DrawerHeader Events and Slots

- `openChange(isOpen: boolean)`: fires with `false` when the close button is clicked.
- `title`: inline content replacing the title text.
- `subtitle`: inline content for the subtitle.
- `startContent`: content before the title, such as a back button.
- `endContent`: content after the title, before the close button.
