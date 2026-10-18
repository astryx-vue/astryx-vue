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
        <td><code>onPointerDown</code></td>
        <td><code>(event: PointerEvent) =&gt; void</code></td>
        <td>Bind to the menu root's <code>pointerdown</code>. Claims presses that begin on a row inside the root, then tracks that pointer to its release.</td>
      </tr>
    </tbody>
  </table>
</div>

The module also exports `resetMenuPress()`, which forgets an armed stray-click swallower. Call it when a surface unmounts outside the hook's own teardown, and in tests.
