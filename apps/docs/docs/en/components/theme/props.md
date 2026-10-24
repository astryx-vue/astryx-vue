---
layout: component-docs
title: Theme
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Theme Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>theme</code></td>
        <td><code>ThemeDefinition</code></td>
        <td>—</td>
        <td>Theme from <code>defineTheme()</code>.</td>
      </tr>
      <tr>
        <td><code>mode</code></td>
        <td><code>'light' | 'dark' | 'system'</code></td>
        <td><code>'system'</code></td>
        <td>Color mode. <code>system</code> follows the page and the OS.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Theme slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>Content that inherits this theme.</td></tr>
    </tbody>
  </table>
</div>

## defineTheme

| Field | Description |
| --- | --- |
| <code>name</code> | Theme name. Written to <code>data-astryx-theme</code>. |
| <code>tokens</code> | Semantic token overrides. A tuple is the light stop, then the dark stop. A listed name wins over a generated value. |
| <code>localTokens</code> | Values only this theme family uses, by full custom-property name. Names stay as written. A shared token name is refused. |
| <code>color</code> | Palette from an accent. Omit the accent to recolor only the neutrals. |
| <code>typography</code> | Fonts, and a type scale from base and ratio. |
| <code>radius</code> | Radius steps from base and multiplier. |
| <code>motion</code> | Durations from fast, medium, slow, and ratio. |
| <code>components</code> | Styles by theme target, <code>&lt;component-kebab&gt;-&lt;part&gt;</code>. The compiled sheet is <code>css</code> on the theme. |
| <code>adaptations</code> | Ordered rules that apply by width, pointer, contrast, or reduced motion. A later matching rule wins. |
| <code>extends</code> | Another theme from <code>defineTheme()</code>. Everything it resolved carries over. This theme's own values win. |
| <code>syntax</code> | Syntax colors for code in this subtree, unless a <code>SyntaxTheme</code> is closer. |
| <code>onDark</code> | Extra tokens and component styles for a dark <code>MediaTheme</code> surface. |
| <code>onLight</code> | Extra tokens and component styles for a light <code>MediaTheme</code> surface. |
| <code>icons</code> | Semantic icon name to Iconify id. Overrides by name and merges shallowly with the extended theme. |
| <code>indicators</code> | Indicator graphics, replaced by check, checkbox, or radio. One entry reaches every place that draws that name. |

## useTheme

`useTheme()` reads the nearest theme. Outside a `Theme`, the name is `neutral` and `token()` reads the document's custom properties. Values are the theme's root values; adaptation rules apply through CSS only. The returned object and `token` are created once, and `tokens` changes only when the theme or the mode does.

| Field | Description |
| --- | --- |
| <code>name</code> | Nearest theme name. |
| <code>mode</code> | Resolved <code>light</code> or <code>dark</code>. <code>system</code> is resolved. |
| <code>token(name)</code> | One token for the effective mode. A local token is read by its exact name. A chart color nobody set falls back to its default. |
| <code>tokens</code> | Tokens and local tokens declared by the nearest theme, resolved for the effective mode. |

## Template ref

The component exposes `element` with type `HTMLElement | null`.

## Native attributes

The root is a `div` with `display: contents`. `class` and `style` are applied to it. Other attributes are not forwarded.
