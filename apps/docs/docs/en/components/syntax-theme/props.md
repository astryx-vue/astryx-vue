---
layout: component-docs
title: Syntax Theme
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="SyntaxTheme Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>theme</code></td>
        <td><code>SyntaxThemeDefinition</code></td>
        <td>—</td>
        <td>A preset, or a theme from <code>defineSyntaxTheme()</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="SyntaxTheme slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>Code components that inherit these colors.</td></tr>
    </tbody>
  </table>
</div>

## Tokens

`keyword`, `string`, `comment`, `number`, `function`, `type`, `variable`, `operator`, `constant`, `tag`, `attribute`, `property`, `punctuation`, and `background`.

## useSyntaxTheme

Returns `null` when no `SyntaxTheme` or theme `syntax` field is present.

| Field | Description |
| --- | --- |
| <code>name</code> | Syntax theme name. |
| <code>mode</code> | Mode used to pick a <code>light-dark()</code> stop. |
| <code>token(name)</code> | One syntax token for that mode. |
| <code>tokens</code> | Every syntax token for that mode. |

## Native attributes

The root is a `div`. `class` and `style` are applied to it.
