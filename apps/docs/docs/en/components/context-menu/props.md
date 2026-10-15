---
layout: component-docs
title: Context Menu
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ContextMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>ContextMenuOption[]</code></td>
        <td>-</td>
        <td>The data-driven menu content. An entry is an action, a divider, a section, a checkbox row (<code>type: 'checkbox'</code>), or a radio group (<code>type: 'radio'</code>). An action that carries nested entries becomes a submenu. Omit it and use the content slot.</td>
      </tr>
      <tr>
        <td><code>menuWidth</code></td>
        <td><code>number | string</code></td>
        <td><code>undefined</code></td>
        <td>Width of the menu panel. Numbers are interpreted as pixels. Without it the panel is at least 160px wide and sizes to its rows; either way it never overflows the viewport.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>Row density. It changes the rows' block padding only; type, radius, and panel styling stay the same in every size.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>'Context menu'</code></td>
        <td>Accessible name of the menu, announced through the panel's <code>aria-label</code> when it opens.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Leaves the right-click to the browser and never opens the menu; an open menu is closed. The native context menu still appears.</td>
      </tr>
      <tr>
        <td><code>triggerAs</code></td>
        <td><code>'div' | 'span'</code></td>
        <td><code>'div'</code></td>
        <td>Whether the trigger renders as a block <code>div</code> or an inline <code>span</code> for a word inside running prose.</td>
      </tr>
      <tr>
        <td><code>v-model:isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled open state. While bound the menu renders exactly this value; leave it unbound to let the menu own its state, opened by a right-click, the context-menu key, or a long press.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="ContextMenu Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The trigger area: right-clicking this content opens the menu.</td>
      </tr>
      <tr>
        <td><code>content</code></td>
        <td>Menu content composed by hand: action rows, dividers, groups, submenus, checkbox rows, and radio groups. This is the custom panel. Ignored when the data array is given.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events and template ref

<div class="component-api-table" role="region" aria-label="ContextMenu Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Signature</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>Fired when the menu opens or closes, before focus moves.</td>
      </tr>
      <tr>
        <td><code>select</code></td>
        <td><code>(item: ContextMenuItemData, event: MouseEvent) =&gt; void</code></td>
        <td>Fired when a row of the <code>items</code> data API is activated, with the row and the click that activated it. Rows inside a submenu bubble up to the same event.</td>
      </tr>
      <tr>
        <td><code>update:isOpen</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>Listened to by <code>v-model:isOpen</code>; it rarely needs handling by hand.</td>
      </tr>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLElement | null</code></td>
        <td>The trigger element, exposed through a template ref.</td>
      </tr>
      <tr>
        <td><code>open()</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Opens the menu at the trigger's top-left corner, for a caller with no pointer event to hand.</td>
      </tr>
      <tr>
        <td><code>close()</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Closes the menu and returns focus to wherever it was before the menu opened.</td>
      </tr>
      <tr>
        <td><code>focus()</code> / <code>blur()</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Focuses or blurs the trigger element.</td>
      </tr>
    </tbody>
  </table>
</div>

## Sub-components

Compound mode and data mode render the same row components, so their styling, keyboard behavior, and theme variables cannot drift apart.

<div class="component-api-table" role="region" aria-label="ContextMenu sub-components" tabindex="0">
  <table>
    <thead>
      <tr><th>Component</th><th>Props</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>ContextMenuItem</code></td>
        <td><code>icon</code>, <code>label</code>, <code>description</code>, <code>endContent</code>, <code>href</code>, <code>target</code>, <code>rel</code>, <code>isDisabled</code>, <code>hasCloseOnSelect</code>, <code>variant</code></td>
        <td>One action row, rendered as <code>role="menuitem"</code>. With <code>href</code> the root becomes a real <code>&lt;a&gt;</code>, so a modified click and a middle click keep the browser's meaning. Slots: <code>label</code>, <code>icon</code>, <code>description</code>, <code>endContent</code>; emits <code>click</code> when activated.</td>
      </tr>
      <tr>
        <td><code>ContextMenuDivider</code></td>
        <td><code>variant</code></td>
        <td>A rule between groups of rows, rendered as <code>role="separator"</code> so it is never a stop in the arrow order.</td>
      </tr>
      <tr>
        <td><code>ContextMenuGroup</code></td>
        <td><code>title</code></td>
        <td>A titled group, rendered as <code>role="group"</code> named by its heading. Slot: <code>default</code>.</td>
      </tr>
      <tr>
        <td><code>ContextMenuCheckboxItem</code></td>
        <td><code>v-model</code>, <code>label</code>, <code>description</code>, <code>icon</code>, <code>isDisabled</code>, <code>hasCloseOnSelect</code></td>
        <td>A checkbox row with role <code>menuitemcheckbox</code>. Toggling leaves the menu open. It is the same component as the dropdown menu's checkbox row.</td>
      </tr>
      <tr>
        <td><code>ContextMenuRadioGroup</code></td>
        <td><code>v-model</code>, <code>label</code>, <code>hasCloseOnSelect</code></td>
        <td>A radio group. Choosing a value closes the menu. <code>label</code> is the group's accessible name.</td>
      </tr>
      <tr>
        <td><code>ContextMenuRadioItem</code></td>
        <td><code>value</code>, <code>label</code>, <code>description</code>, <code>icon</code>, <code>isDisabled</code></td>
        <td>One radio option. It must sit inside a radio group, and its role is <code>menuitemradio</code>.</td>
      </tr>
      <tr>
        <td><code>ContextMenuSubMenu</code></td>
        <td><code>icon</code>, <code>label</code>, <code>description</code>, <code>isDisabled</code>, <code>items</code>, <code>hasSpinner</code>, <code>menuWidth</code>, <code>presentation</code></td>
        <td>A row that reveals the next level. By default a wide screen flies out and a compact touch surface replaces the current rows with a Back row. Either form can be forced. <code>hasSpinner</code> replaces the caret, and <code>menuWidth</code> sizes the flyout. Emits <code>openChange</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Theming

```css
.my-context-menu {
  --astryx-context-menu-background: #ffffff;
  --astryx-context-menu-item-focus-background: #0536590c;
}
```

- `--astryx-context-menu-background`: panel background.
- `--astryx-context-menu-foreground`: panel text color.
- `--astryx-context-menu-shadow`: panel shadow.
- `--astryx-context-menu-item-foreground`: row text color.
- `--astryx-context-menu-item-focus-background`: background of the highlighted row, for both hover and keyboard focus.
- `--astryx-context-menu-item-pressed-background`: background of a row while a mouse holds it down, painted only where hover exists.
- `--astryx-context-menu-item-description-foreground`: row description color.
- `--astryx-context-menu-item-error-foreground`: label and icon color of a `variant="destructive"` row.
- `--astryx-context-menu-section-foreground`: section heading color.
- `--astryx-context-menu-block-cap`: maximum panel height, resolved against the viewport; the default takes the smaller of 300px and the viewport height.
- `--astryx-spacing-1`, `--astryx-radius-container`, `--astryx-text-label-size`: padding, radius, and type reuse the global tokens.

The neutral theme adapts to light and dark mode on its own.

## Native attributes

The root element is the trigger: a `<div>`, or a `<span>` with `triggerAs="span"`.

The following go to the trigger element:

- HTML attributes such as `id` or `data-*`.
- `aria-*` attributes.

`class` and `style`, on the other hand, go to the menu panel: the panel is the painted, themeable surface (the `astryx-context-menu` class), which mirrors how upstream hands `className` and `style` to the menu.

The trigger itself carries no `role`, `aria-haspopup`, or `aria-expanded`: it is not a button, the right-click is a system-level gesture, and the menu is named by its own `label` only while it is open. The menu panel is teleported to `document.body`, so it inherits nothing from the trigger; the panel carries its own `data-size`, `data-placement`, `data-overflow`, `data-width`, and `data-astryx-menu-press` for styling and tests.
