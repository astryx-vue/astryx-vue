---
layout: component-docs
title: Media Theme
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="MediaTheme Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>mode</code></td>
        <td><code>'dark' | 'light' | 'auto' | 'off'</code></td>
        <td>—</td>
        <td>Surface luminance. <code>auto</code> measures the parent. <code>off</code> keeps the surrounding theme.</td>
      </tr>
      <tr>
        <td><code>fallback</code></td>
        <td><code>'dark' | 'light'</code></td>
        <td><code>'dark'</code></td>
        <td>Side <code>auto</code> uses before the surface can be measured, and when it cannot. Ignored for the other modes.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="MediaTheme slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>Content rendered with the surface colors.</td></tr>
    </tbody>
  </table>
</div>

## useMediaTheme

| Field | Description |
| --- | --- |
| <code>mode</code> | Resolved <code>dark</code>, <code>light</code>, or <code>off</code>. Outside a MediaTheme, the mode is <code>off</code>. |

## Template ref

The component exposes `element` with type `HTMLElement | null`.

## Native attributes

The root is a `div` with `display: contents`. `class` and `style` are applied to it. Other attributes are not forwarded.
