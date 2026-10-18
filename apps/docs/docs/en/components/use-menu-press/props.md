---
layout: component-docs
title: useMenuPress
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useMenuPress parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MenuPressOptions</code></td>
        <td>—</td>
        <td>Configuration object. Required.</td>
      </tr>
      <tr>
        <td><code>options.menuRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>The menu root carrying <code>role="menu"</code>: the surface whose rows a press picks from. Required.</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>—</td>
        <td>Whether the model is live, read on each press. Pass the menu's open state. Required.</td>
      </tr>
      <tr>
        <td><code>options.onDismiss</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>A mouse was released outside the menu with nothing acting: close it. A finger released outside leaves the menu open, so this is never called then. Required.</td>
      </tr>
      <tr>
        <td><code>options.itemSelector</code></td>
        <td><code>string</code></td>
        <td>enabled <code>[role="menuitem"]</code>, <code>menuitemradio</code>, <code>menuitemcheckbox</code></td>
        <td>Selector matching the ENABLED rows. A pointer over anything else inside the menu (a divider, a heading, a disabled row) picks nothing. Rows must still sit inside a <code>[role="menu"]</code> boundary.</td>
      </tr>
      <tr>
        <td><code>options.triggerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>The control that opens the menu, when a press may start there.</td>
      </tr>
      <tr>
        <td><code>options.onTriggerPress</code></td>
        <td><code>(pointerType: 'mouse' | 'pen' | 'touch') =&gt; boolean</code></td>
        <td>—</td>
        <td>A mouse pressed the trigger, or a finger rested on it for <code>longPressDelayMs</code>: open the menu under the held pointer and return whether it opened. Return false when the press closed an open menu instead.</td>
      </tr>
      <tr>
        <td><code>options.onHighlight</code></td>
        <td><code>(row: HTMLElement | null) =&gt; void</code></td>
        <td>—</td>
        <td>Move the highlight. Defaults to moving DOM focus with <code>preventScroll</code> onto the row. A picker that highlights through <code>aria-activedescendant</code> supplies its own.</td>
      </tr>
      <tr>
        <td><code>options.onActivate</code></td>
        <td><code>(row: HTMLElement, release: PointerEvent) =&gt; void</code></td>
        <td>—</td>
        <td>Act on the row under the release. Defaults to dispatching a click on the row that carries the release button and modifier keys.</td>
      </tr>
      <tr>
        <td><code>options.longPressDelayMs</code></td>
        <td><code>number</code></td>
        <td><code>500</code></td>
        <td>How long a finger must rest on the trigger before the menu opens under it.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useMenuPress return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>menuProps</code></td>
        <td><code>{ onPointerDown, 'data-astryx-menu-press': '' }</code></td>
        <td>Spread onto the menu root (<code>v-bind="press.menuProps"</code>). Claims presses that begin inside it and marks the root as carrying the press model.</td>
      </tr>
      <tr>
        <td><code>onPointerDown</code></td>
        <td><code>(event: PointerEvent) =&gt; void</code></td>
        <td>The same handler as <code>menuProps.onPointerDown</code>, on its own. Bind it to the menu root's <code>pointerdown</code> when an object spread is not an option.</td>
      </tr>
      <tr>
        <td><code>triggerProps</code></td>
        <td><code>{ onPointerDown, onContextMenu }</code></td>
        <td>Spread onto the trigger: a primary-button press opens the menu at once; a finger held for the delay opens it with the finger still down. A right-click is left alone, so its <code>contextmenu</code> route keeps working. The <code>contextmenu</code> handler suppresses the browser's own long-press menu for a finger, and leaves a mouse's right-click to the application.</td>
      </tr>
      <tr>
        <td><code>isTriggerClickFromPress</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>Whether the click reaching the trigger belongs to the gesture that just pressed it. That press already opened or closed the menu, so the click must neither toggle nor reopen.</td>
      </tr>
      <tr>
        <td><code>cancel</code></td>
        <td><code>() =&gt; void</code></td>
        <td>End the gesture in flight with nothing acting, for when the menu closes under it.</td>
      </tr>
    </tbody>
  </table>
</div>

The module also exports `resetMenuPress()`, which forgets an armed stray-click swallower. Call it when a surface unmounts outside the hook's own teardown, and in tests.
