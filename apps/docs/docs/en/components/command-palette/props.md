---
layout: component-docs
title: Command Palette
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="CommandPalette Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Whether the palette is open.</td>
      </tr>
      <tr>
        <td><code>searchSource</code></td>
        <td><code>SearchSource</code></td>
        <td>-</td>
        <td>Where commands come from. An empty query calls <code>bootstrap</code>.</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Render in the page flow instead of a modal dialog.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>Command palette</td>
        <td>Accessible name of the dialog.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td><code>640</code></td>
        <td>Width of the dialog. Numbers are pixels.</td>
      </tr>
      <tr>
        <td><code>maxHeight</code></td>
        <td><code>number | string</code></td>
        <td><code>480</code></td>
        <td>Maximum height of the dialog. Numbers are pixels.</td>
      </tr>
      <tr>
        <td><code>emptySearchText</code></td>
        <td><code>string</code></td>
        <td>No results</td>
        <td>Shown when a query returns nothing.</td>
      </tr>
      <tr>
        <td><code>emptyBootstrapText</code></td>
        <td><code>string</code></td>
        <td>Type to search</td>
        <td>Shown before the source has anything to list.</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Selected id in picker mode. Bind with <code>v-model:value</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="CommandPalette Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>boolean</code></td>
        <td>The next open state. Escape and a selection both close the palette.</td>
      </tr>
      <tr>
        <td><code>update:value</code></td>
        <td><code>string</code></td>
        <td>The id of the row that was selected.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="CommandPalette Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Props</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>input</code></td>
        <td>-</td>
        <td>Replaces <code>CommandPaletteInput</code>.</td>
      </tr>
      <tr>
        <td><code>item</code></td>
        <td><code>{ item, isSelected }</code></td>
        <td>Row content. <code>isSelected</code> is the picker match, not the keyboard highlight.</td>
      </tr>
      <tr>
        <td><code>footer</code></td>
        <td>-</td>
        <td>Replaces the default hint row. Put a <code>CommandPaletteFooter</code> here when the replacement should keep the footer chrome.</td>
      </tr>
    </tbody>
  </table>
</div>

## CommandPaletteInput

<div class="component-api-table" role="region" aria-label="CommandPaletteInput Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placeholder</code></td>
        <td><code>string</code></td>
        <td>Search…</td>
        <td>Placeholder and the fallback accessible name.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name of the combobox. Falls back to <code>placeholder</code>.</td>
      </tr>
      <tr>
        <td><code>hasAutoFocus</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Focus the field when the palette opens. Inline palettes skip this.</td>
      </tr>
    </tbody>
  </table>
</div>

The input's default slot is trailing content, after the field.

## CommandPaletteList

`label` names the listbox. The default is Commands.

## CommandPaletteGroup

`heading` is the visible group label and the group's accessible name.

## CommandPaletteItem

`value` is the command id. `isDisabled` blocks selection. The default slot is the row content.

## CommandPaletteEmpty

The default slot is the empty message.

## CommandPaletteFooter

The default slot replaces the Navigate, Select, and Close hints. The footer chrome stays.
