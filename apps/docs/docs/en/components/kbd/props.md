---
layout: component-docs
title: Kbd
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Kbd Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>keys</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Required. The keyboard shortcut to present, with the keys separated by <code>+</code>, such as <code>"mod+k"</code> or <code>"shift+plus"</code>. Each segment paints one key badge; whitespace around a segment is ignored, and an unrecognized segment is uppercased.</td>
      </tr>
    </tbody>
  </table>
</div>

## Key names

<div class="component-api-table" role="region" aria-label="Kbd Key Names" tabindex="0">
  <table>
    <thead>
      <tr><th>Written as</th><th>Painted as</th><th>Spoken as</th></tr>
    </thead>
    <tbody>
      <tr><td><code>mod</code></td><td><code>⌘</code> / <code>Ctrl</code></td><td>Command on Apple platforms, Control elsewhere</td></tr>
      <tr><td><code>ctrl</code></td><td><code>⌃</code></td><td>Control</td></tr>
      <tr><td><code>alt</code></td><td><code>⌥</code></td><td>Alt</td></tr>
      <tr><td><code>shift</code></td><td><code>⇧</code></td><td>Shift</td></tr>
      <tr><td><code>enter</code> / <code>return</code></td><td><code>↵</code></td><td>Enter</td></tr>
      <tr><td><code>backspace</code></td><td><code>⌫</code></td><td>Backspace</td></tr>
      <tr><td><code>tab</code></td><td><code>⇥</code></td><td>Tab</td></tr>
      <tr><td><code>escape</code> / <code>esc</code></td><td><code>Esc</code></td><td>Escape</td></tr>
      <tr><td><code>up</code></td><td><code>↑</code></td><td>Up arrow</td></tr>
      <tr><td><code>down</code></td><td><code>↓</code></td><td>Down arrow</td></tr>
      <tr><td><code>left</code></td><td><code>←</code></td><td>Left arrow</td></tr>
      <tr><td><code>right</code></td><td><code>→</code></td><td>Right arrow</td></tr>
      <tr><td><code>plus</code></td><td><code>+</code></td><td>Plus</td></tr>
    </tbody>
  </table>
</div>

A segment that is not in this table is painted uppercased as written and spoken as that same text, so `f1` paints as `F1`.

## Accessibility

The root element carries `role="img"` and an `aria-label` assembled from the spoken key names, so `keys="mod+k"` is announced as "Control + K". The badges themselves are `aria-hidden="true"`, because the glyphs they paint mean nothing to assistive technology. `role` and `aria-label` are computed by the component, and a consumer value for either is ignored; every other `aria-*` attribute passes through.

## Native attributes

The root element is a `<span>`.

The following go to the root element:

- HTML attributes.
- `aria-*` attributes, except `role` and `aria-label` (see the previous section).
- `data-*` attributes.
- `class`.
- `style`.
