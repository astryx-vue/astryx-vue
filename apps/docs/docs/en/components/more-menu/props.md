---
layout: component-docs
title: More menu
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="MoreMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>MoreMenuOption[]</code></td>
        <td>-</td>
        <td>What the menu holds: actions (<code>MoreMenuItem</code>), hairlines (<code>{ type: 'divider' }</code>), and groups (<code>{ type: 'section', title, items }</code>). Required.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>the active locale (<code>More options</code> in English)</td>
        <td>The trigger's accessible name, which is also the name of the menu itself and the text of its tooltip.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>ButtonVariant</code></td>
        <td><code>'ghost'</code></td>
        <td>Visual variant of the trigger button: primary, secondary, ghost, or destructive.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>ButtonSize</code></td>
        <td><code>'md'</code></td>
        <td>Size of the trigger button: sm, md, or lg. The density of every menu row follows it.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the trigger is disabled. A disabled trigger is dimmed, announces itself as disabled, and opens nothing from a click or the keyboard.</td>
      </tr>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end'</code></td>
        <td><code>'below'</code></td>
        <td>Where the anchored surface sits relative to the trigger. The direction is logical: start and end resolve against the menu's own direction, so RTL mirrors them. The surface flips when there is no room.</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'start'</code></td>
        <td>Alignment along the placement axis. An overflow menu usually wants end, so the surface lines up with the trigger's trailing edge.</td>
      </tr>
      <tr>
        <td><code>presentation</code></td>
        <td><code>'popover' | 'bottom-sheet' | 'adaptive'</code></td>
        <td><code>'popover'</code></td>
        <td>Shape the actions arrive in. popover anchors the surface to the trigger; bottom-sheet is a modal panel at the bottom of the screen; adaptive uses the bottom panel at 768px and below when the primary pointer is coarse, and the anchored surface otherwise.</td>
      </tr>
      <tr>
        <td><code>isMenuOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled open state, meant for <code>v-model:isMenuOpen</code>. Leave it unbound to let the component own its state.</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Renders the surface in place instead of moving it to the top of the document. It then flows with the page and is not positioned against the viewport. Intended for documentation previews and for surfaces that must not escape their container.</td>
      </tr>
    </tbody>
  </table>
</div>

### MoreMenuItem

An action entry in `items` carries:

<div class="component-api-table" role="region" aria-label="MoreMenu Item" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The row's primary text. Required.</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Stable identity of the row within its level. Omit it and the row is matched by position; set it when <code>items</code> can reorder, filter, or grow, so a row keeps its DOM node — and its keyboard focus — as the array changes.</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>Icon shown before the label: a CSS icon class (an UnoCSS class such as <code>i-carbon-copy</code>, or one of your own), or a component that draws the SVG. astryx-vue ships no icons.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>A supporting line below the label, for telling near neighbours apart.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the row is unavailable. A disabled row is dimmed, announces itself as disabled, and is skipped by the arrow keys and by type-ahead.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'default' | 'destructive'</code></td>
        <td><code>'default'</code></td>
        <td>destructive paints the label, description, and icon in the error color for dangerous actions such as deletion.</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Address the row navigates to. With it the row is a real link, so a modified click and a middle click keep their browser meaning, such as opening a new tab.</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>'_blank' | '_self'</code></td>
        <td>-</td>
        <td>Where the link opens. Only used with <code>href</code>.</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Link relationship tokens. <code>noopener noreferrer</code> is added when <code>target</code> is <code>_blank</code>.</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Trailing content of the row, such as a shortcut hint.</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether activating the row closes the menu. Set it to false for an action that reports its result on the row itself, such as a copy row that swaps to "Copied".</td>
      </tr>
      <tr>
        <td><code>items</code></td>
        <td><code>MoreMenuOption[]</code></td>
        <td>-</td>
        <td>Nested entries. With them the row becomes a submenu entry: it opens a flyout on a pointer layout and shows its own view in the bottom panel.</td>
      </tr>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>-</td>
        <td>The row's action. On a link row it runs before the browser navigates, and is skipped for a modified click, which belongs to the browser.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="MoreMenu Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>Fired whenever an open or close is requested. In uncontrolled usage it reports the change; in controlled usage it is the request to update the bound state.</td>
      </tr>
      <tr>
        <td><code>update:isMenuOpen</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>The update event of <code>v-model:isMenuOpen</code> in controlled usage.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="MoreMenu Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>icon</code></td>
        <td>Artwork of the trigger, replacing the default three-dot icon. The trigger stays icon-only and takes its accessible name from <code>label</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Exposed

<div class="component-api-table" role="region" aria-label="MoreMenu Exposed" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLElement | null</code></td>
        <td>The trigger button element.</td>
      </tr>
      <tr>
        <td><code>focus</code></td>
        <td><code>(options?: FocusOptions) =&gt; void</code></td>
        <td>Moves focus onto the trigger button.</td>
      </tr>
      <tr>
        <td><code>blur</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Removes focus from the trigger button.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is a `<span>`, and the trigger button is the `<button>` inside it.

Attributes passed to the component — <code>class</code>, <code>style</code>, <code>data-*</code>, and the rest — fall through to the root element. The trigger button takes its accessible name from <code>label</code>, and its <code>aria-expanded</code>, <code>aria-haspopup</code>, and <code>aria-controls</code> are maintained by the component from the open state and the presentation.

While the menu is open its surface moves to the end of the document, under `<body>`, and is presented as a floating layer. Set <code>is-inline</code> to keep it where it is.
