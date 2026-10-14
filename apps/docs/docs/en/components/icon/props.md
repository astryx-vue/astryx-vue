---
layout: component-docs
title: Icon
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Icon props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Iconify id, <code>collection:icon</code>. <code>carbon-settings</code> is the same as <code>carbon:settings</code> after the carbon collection is registered. Hyphenated collection names should keep the colon.</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>A CSS icon class, or your own component. Ignored when <code>name</code> is set. Built-in names such as <code>chevronDown</code> are the library's own chrome.</td></tr>
<tr><td><code>color</code></td><td><code>'inherit' | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'success' | 'error' | 'warning' | 'blue' | 'cyan' | 'green' | 'gray' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'</code></td><td><code>'inherit'</code></td><td>Sets the color the icon's <code>currentColor</code> resolves to. <code>inherit</code> keeps the surrounding text color.</td></tr>
<tr><td><code>size</code></td><td><code>'xsm' | 'sm' | 'md' | 'lg'</code></td><td>—</td><td>12px, 16px, 20px, or 24px at a 16px root. When omitted, a <code>name</code> icon is <code>1em</code>. Any other icon falls back to <code>md</code> unless a parent provides a size.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for a meaningful icon. Sets <code>role="img"</code> and <code>aria-label</code>. Omit it for decoration (<code>aria-hidden="true"</code>). An empty string stays decorative.</td></tr>
</tbody></table>
</div>

## Slots

- Default: SVG written inline, used when neither <code>name</code> nor <code>icon</code> is set.

## Registration

<div class="component-api-table" role="region" aria-label="Icon registration" tabindex="0">
<table><thead><tr><th>Name</th><th>From</th><th>Description</th></tr></thead><tbody>
<tr><td><code>astryxIcons()</code></td><td><code>@astryx-vue/core/icons</code></td><td>Vite plugin. Scans static names and bundles only those icons from installed <code>@iconify-json/*</code> packages. Pass <code>collections</code> to limit which prefixes are read.</td></tr>
<tr><td><code>addIcon(name, data)</code></td><td><code>@astryx-vue/core/Icon</code></td><td>Register one icon. <code>name</code> is <code>collection:icon</code>. <code>data.body</code> is the SVG inner markup.</td></tr>
<tr><td><code>addCollection(collection)</code></td><td><code>@astryx-vue/core/Icon</code></td><td>Register an <code>@iconify-json</code> document. The whole collection is included in the bundle.</td></tr>
</tbody></table>
</div>

## Theme

Color follows the icon tokens. A theme replaces one by setting the variable on the theme root.

```css
.my-theme {
  --astryx-icon-accent-foreground: #0074e2;
}
```

- `--astryx-icon-primary-foreground`
- `--astryx-icon-secondary-foreground`
- `--astryx-icon-disabled-foreground`
- `--astryx-icon-accent-foreground`
- `--astryx-icon-success-foreground`
- `--astryx-icon-error-foreground`
- `--astryx-icon-warning-foreground`
- `--astryx-icon-blue-foreground`, and the same pattern for cyan, green, gray, orange, pink, purple, red, teal, and yellow.

## Accessibility

The root is a `<span>`. Without `label` it is `aria-hidden="true"`. With a non-empty `label` it is `role="img"` and that string is the accessible name. The SVG inside is always `aria-hidden`.

`class` and `style` fall through to the root. `name` does not: it selects the icon.
