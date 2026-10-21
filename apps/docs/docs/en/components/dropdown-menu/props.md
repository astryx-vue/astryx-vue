---
layout: component-docs
title: Dropdown Menu
outline: false
footer: false
---

## Props

### DropdownMenu

<div class="component-api-table" role="region" aria-label="DropdownMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>button</code></td>
        <td><code>DropdownMenuButtonProps</code></td>
        <td>the active locale (<code>{ label: 'Menu' }</code> in English)</td>
        <td>Props for the trigger button — every <code>Button</code> prop except <code>clickAction</code>, which would compete with the menu for the same click. <code>size</code> also sets the height of the menu rows.</td>
      </tr>
      <tr>
        <td><code>items</code></td>
        <td><code>DropdownMenuOption[]</code></td>
        <td>-</td>
        <td>Data-mode menu content. Each entry is an action, a divider, a titled group, a checkbox row (<code>type: 'checkbox'</code>, with <code>checked</code> and <code>onChange</code>), or a radio group (<code>type: 'radio'</code>, with <code>value</code>, <code>label</code>, <code>items</code>, and <code>onChange</code>). Mutually exclusive with the default slot; <code>items</code> wins when both are given.</td>
      </tr>
      <tr>
        <td><code>isMenuOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled open state, paired with <code>v-model:is-menu-open</code>. Left out, the menu manages its own state. A menu mounted already open does not move focus.</td>
      </tr>
      <tr>
        <td><code>menuWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Minimum width of the menu. A length grows for its content; an intrinsic keyword such as <code>max-content</code> becomes the preferred width. Every form is capped to the viewport. Defaults to the trigger's width, capped at 320px.</td>
      </tr>
      <tr>
        <td><code>menuMaxHeight</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Maximum height in pixels, for a menu that must fit all of its rows. This lifts the default 300px cap; the viewport still bounds the real height.</td>
      </tr>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end'</code></td>
        <td><code>'below'</code></td>
        <td>Where the menu opens relative to the trigger. It flips to the opposite side when there is no room.</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'start'</code></td>
        <td>How the menu aligns with the trigger along the placement axis.</td>
      </tr>
      <tr>
        <td><code>hasChevron</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether the trigger button shows a trailing chevron. An icon-only button never shows it.</td>
      </tr>
    </tbody>
  </table>
</div>

### DropdownMenuItem

<div class="component-api-table" role="region" aria-label="DropdownMenuItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Primary text of the row. Use the <code>label</code> slot for rich content.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Secondary line below the label. Use the <code>description</code> slot for rich content.</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>Icon before the label: a CSS icon class (an UnoCSS class such as <code>i-carbon-copy</code>, or one of your own), or a component that draws the SVG. astryx-vue ships no icons. Use the <code>icon</code> slot for arbitrary content.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disables the row. A disabled row is skipped by the arrow keys and by typeahead, and it does not respond to clicks.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'default' | 'destructive'</code></td>
        <td><code>'default'</code></td>
        <td>Visual variant. <code>destructive</code> recolors the label, description, and icon in the error color for dangerous actions such as Delete. The hover highlight stays the shared neutral, so it still matches every other row.</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether activating the row closes the menu. Set it to <code>false</code> for an action that reports its result on the row itself, such as a copy row.</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Address the row navigates to. The row then renders as one anchor carrying <code>role="menuitem"</code>, so a ⌘/Ctrl-click and a middle click keep the browser's meaning.</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>'_blank' | '_self'</code></td>
        <td>-</td>
        <td>Link target. Only used with <code>href</code>.</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Link relationship. Only used with <code>href</code>. <code>noopener</code> and <code>noreferrer</code> are added for <code>target="_blank"</code>.</td>
      </tr>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>-</td>
        <td>Called when the row is activated. On a link row it runs before the browser navigates, and it is skipped for a modified click, which the browser owns.</td>
      </tr>
    </tbody>
  </table>
</div>

### DropdownMenuGroup

<div class="component-api-table" role="region" aria-label="DropdownMenuGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>title</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Heading shown above the group's rows and used as the group's accessible name. Omit it for an unnamed group.</td>
      </tr>
    </tbody>
  </table>
</div>

`DropdownMenuDivider` takes no props. It renders a separator, so it is never a stop in the arrow-key order.

### DropdownMenuCheckboxItem

<div class="component-api-table" role="region" aria-label="DropdownMenuCheckboxItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Whether the row is checked. Pair it with <code>v-model</code>. The data array uses <code>checked</code> instead.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Primary text. Use the <code>label</code> slot for rich content.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Secondary line under the label.</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>Icon before the label: a CSS icon class, or a component that draws one. Use the <code>icon</code> slot for anything else. The examples use the built-in icon component.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disables the row. It stays in the accessibility tree, the arrows skip it, and a click does not toggle it.</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether toggling closes the menu. Checkbox rows stay open.</td>
      </tr>
    </tbody>
  </table>
</div>

The row's role is <code>menuitemcheckbox</code>, and the checked state is <code>aria-checked</code>. The mark is decorative and does not take the click.

### DropdownMenuRadioGroup

<div class="component-api-table" role="region" aria-label="DropdownMenuRadioGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The selected value. Pair it with <code>v-model</code>. Leave it unset when nothing is selected yet. The data array uses <code>value</code> as well.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name of the group, so the options are announced as one set.</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether choosing a value closes the menu. A radio group closes.</td>
      </tr>
    </tbody>
  </table>
</div>

### DropdownMenuRadioItem

<div class="component-api-table" role="region" aria-label="DropdownMenuRadioItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The value this option represents. The item must sit inside a radio group; otherwise it throws while it is set up.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Primary text.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Secondary line under the label.</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>Icon before the label. Use the <code>icon</code> slot for anything else.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disables this option. It stays in the group and cannot be selected.</td>
      </tr>
    </tbody>
  </table>
</div>

The row's role is <code>menuitemradio</code>.

### DropdownMenuSubMenu

<div class="component-api-table" role="region" aria-label="DropdownMenuSubMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>The row's text, and the parent name used by the Back row of the next level.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Secondary line under the label.</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>Icon before the label.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>The row cannot open the next level.</td>
      </tr>
      <tr>
        <td><code>hasSpinner</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Replaces the caret with a spinner while the next level is loading. The spinner is decorative and does not block opening.</td>
      </tr>
      <tr>
        <td><code>menuWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Width of the flyout. A number is pixels, used as a minimum and capped to the viewport. An intrinsic keyword becomes the preferred width. Unused while drilled in.</td>
      </tr>
      <tr>
        <td><code>presentation</code></td>
        <td><code>'flyout' | 'drill-in' | 'adaptive'</code></td>
        <td><code>'adaptive'</code></td>
        <td>How the next level appears: beside the row, in place of the current rows, or chosen when the menu opens from whether the surface is a compact touch screen.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="DropdownMenu Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>update:isMenuOpen</code></td>
        <td><code>boolean</code></td>
        <td>The open state changed; drives <code>v-model:is-menu-open</code>.</td>
      </tr>
      <tr>
        <td><code>openChange</code></td>
        <td><code>boolean</code></td>
        <td>Fired together with <code>update:isMenuOpen</code> when the open state changes.</td>
      </tr>
      <tr>
        <td><code>click</code></td>
        <td>-</td>
        <td>Fired when the trigger is activated, for both opening and closing.</td>
      </tr>
      <tr>
        <td><code>click</code> (<code>DropdownMenuItem</code>)</td>
        <td><code>MouseEvent</code></td>
        <td>Fired when the row is activated.</td>
      </tr>
      <tr>
        <td><code>update:modelValue</code> / <code>change</code> (checkbox row, radio group)</td>
        <td><code>boolean</code> or <code>string</code></td>
        <td>The selection changed. A checkbox row reports the next boolean; a radio group reports the next string. <code>v-model</code> listens to <code>update:modelValue</code>.</td>
      </tr>
      <tr>
        <td><code>openChange</code> (<code>DropdownMenuSubMenu</code>)</td>
        <td><code>boolean</code></td>
        <td>Fired when the flyout or the drilled view opens or closes.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="DropdownMenu Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Menu content written by hand: action rows, checkbox rows, radio groups, groups, dividers, and submenus. Mutually exclusive with <code>items</code>.</td>
      </tr>
      <tr>
        <td><code>trigger</code></td>
        <td>A custom control for the trigger. The slot props carry <code>id</code>, <code>aria-haspopup</code>, <code>aria-expanded</code>, <code>aria-controls</code>, <code>onClick</code> and <code>onKeyDown</code>; spread all of them onto the control.</td>
      </tr>
      <tr>
        <td><code>icon</code> (<code>DropdownMenuItem</code>)</td>
        <td>Arbitrary leading content, replacing the <code>icon</code> prop.</td>
      </tr>
      <tr>
        <td><code>label</code> / <code>description</code> (<code>DropdownMenuItem</code>)</td>
        <td>Rich content replacing the prop of the same name.</td>
      </tr>
      <tr>
        <td><code>endContent</code> (<code>DropdownMenuItem</code>)</td>
        <td>Trailing content, such as a <code>Kbd</code> shortcut hint.</td>
      </tr>
      <tr>
        <td><code>title</code> / <code>default</code> (<code>DropdownMenuGroup</code>)</td>
        <td>A rich heading for the group, and the group's rows.</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td>Content above the rows and outside the menu, such as a filter. Typing there does not move by letter.</td>
      </tr>
      <tr>
        <td><code>footer</code></td>
        <td>Content below the rows and outside the menu, such as a create button.</td>
      </tr>
      <tr>
        <td><code>icon</code> / <code>label</code> / <code>description</code> / <code>endContent</code> (checkbox and radio rows)</td>
        <td>The same rich-content positions as an action row. The check mark and radio dot are drawn by the row and do not use these slots.</td>
      </tr>
      <tr>
        <td><code>default</code> (radio group, submenu)</td>
        <td>Radio options inside a group, or the next level's rows inside a submenu.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

Apart from the props above, native attributes fall through to the menu panel element:

- HTML and <code>data-*</code> attributes.
- <code>aria-*</code> attributes.
- <code>class</code> and <code>style</code>.

The panel carries a generated <code>id</code> that the trigger's <code>aria-controls</code> points at. Passing <code>id</code> explicitly replaces both that generated id and the value of <code>aria-controls</code>, so the two cannot drift apart. Passing <code>aria-label</code> or <code>aria-labelledby</code> overrides the menu's default name, which comes from the trigger button's label, or from the control itself when the <code>trigger</code> slot is used.

The trigger button carries <code>aria-haspopup="menu"</code>, <code>aria-expanded</code> and <code>aria-controls</code>. It sits inside a <code>span.astryx-dropdown-menu-trigger</code> that anchors the panel.
