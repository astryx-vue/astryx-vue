---
layout: component-docs
title: useHotkeys
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useHotkeys parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hotkeys</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly Hotkey[]&gt;</code></td>
        <td>—</td>
        <td>Shortcut registrations. A plain array, a ref, or a getter all work; the list is read on each key press. Required.</td>
      </tr>
      <tr>
        <td><code>hotkeys[].keys</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>A <code>"+"</code>-separated combo like <code>"mod+k"</code>, <code>"shift+/"</code>, <code>"escape"</code>. <code>mod</code> is ⌘ on macOS and Ctrl elsewhere. Aliases: <code>esc</code>, <code>space</code>, <code>up</code>, <code>down</code>, <code>left</code>, <code>right</code>, <code>return</code>, and <code>plus</code> for a literal <code>+</code>. Without <code>shift</code> in the combo, the shift state is ignored, so a single letter does not care about case.</td>
      </tr>
      <tr>
        <td><code>hotkeys[].onPress</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>—</td>
        <td>Called when the combo matches, after <code>preventDefault()</code>.</td>
      </tr>
      <tr>
        <td><code>hotkeys[].allowInInputs</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Lets the hotkey fire while typing in an input, textarea, select, or contenteditable region.</td>
      </tr>
      <tr>
        <td><code>hotkeys[].isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Temporarily disables this entry without removing the listener.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useHotkeys return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>—</td>
        <td><code>void</code></td>
        <td>Nothing is returned. The window listener is removed when the component unmounts.</td>
      </tr>
    </tbody>
  </table>
</div>
