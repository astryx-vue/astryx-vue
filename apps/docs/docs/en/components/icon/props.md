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
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>A semantic name, a CSS icon class, or your own component. A semantic name resolves to an Iconify id from the nearest theme, and falls back to the built-in glyph until that icon is registered. Ignored when <code>name</code> is set.</td></tr>
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

## Semantic names

`defineTheme({ icons })` overrides by name. Entries merge shallowly with the theme this one extends, and this theme wins. A name that is not listed keeps the default id. The collection has to be registered, or the built-in glyph stays.

<div class="component-api-table" role="region" aria-label="Semantic icons" tabindex="0">
<table><thead><tr><th>Name</th><th>Default Iconify id</th></tr></thead><tbody>
<tr><td><code>close</code></td><td><code>lucide:x</code></td></tr>
<tr><td><code>chevronDown</code></td><td><code>lucide:chevron-down</code></td></tr>
<tr><td><code>chevronLeft</code></td><td><code>lucide:chevron-left</code></td></tr>
<tr><td><code>chevronRight</code></td><td><code>lucide:chevron-right</code></td></tr>
<tr><td><code>chevronsLeft</code></td><td><code>lucide:chevrons-left</code></td></tr>
<tr><td><code>chevronsRight</code></td><td><code>lucide:chevrons-right</code></td></tr>
<tr><td><code>check</code></td><td><code>lucide:check</code></td></tr>
<tr><td><code>success</code></td><td><code>lucide:circle-check</code></td></tr>
<tr><td><code>error</code></td><td><code>lucide:circle-x</code></td></tr>
<tr><td><code>warning</code></td><td><code>lucide:triangle-alert</code></td></tr>
<tr><td><code>info</code></td><td><code>lucide:info</code></td></tr>
<tr><td><code>calendar</code></td><td><code>lucide:calendar</code></td></tr>
<tr><td><code>clock</code></td><td><code>lucide:clock</code></td></tr>
<tr><td><code>externalLink</code></td><td><code>lucide:external-link</code></td></tr>
<tr><td><code>menu</code></td><td><code>lucide:menu</code></td></tr>
<tr><td><code>moreHorizontal</code></td><td><code>lucide:ellipsis</code></td></tr>
<tr><td><code>search</code></td><td><code>lucide:search</code></td></tr>
<tr><td><code>upload</code></td><td><code>lucide:upload</code></td></tr>
<tr><td><code>arrowUp</code></td><td><code>lucide:arrow-up</code></td></tr>
<tr><td><code>arrowDown</code></td><td><code>lucide:arrow-down</code></td></tr>
<tr><td><code>arrowsUpDown</code></td><td><code>lucide:arrow-up-down</code></td></tr>
<tr><td><code>funnel</code></td><td><code>lucide:funnel</code></td></tr>
<tr><td><code>eyeSlash</code></td><td><code>lucide:eye-off</code></td></tr>
<tr><td><code>viewColumns</code></td><td><code>lucide:columns-3</code></td></tr>
<tr><td><code>copy</code></td><td><code>lucide:copy</code></td></tr>
<tr><td><code>checkDouble</code></td><td><code>lucide:check-check</code></td></tr>
<tr><td><code>wrench</code></td><td><code>lucide:wrench</code></td></tr>
<tr><td><code>stop</code></td><td><code>lucide:square</code></td></tr>
<tr><td><code>microphone</code></td><td><code>lucide:mic</code></td></tr>
<tr><td><code>image</code></td><td><code>lucide:image</code></td></tr>
</tbody></table>
</div>

These are the **shared names**. Every component draws from the same set. The `IconRegistry` type describes a complete registry that draws every shared name, and `upload` is required like the rest. A theme that supplies a whole icon set must give `upload` its own upload drawing instead of reusing `arrowUp`. Redrawing `upload` leaves the `arrowUp` used by sortable tables and the send button alone.

An icon that only one component draws does not become a shared name. It gets a namespaced key, `component:role`, typed as `NamespacedIconName`. There is one today:

<div class="component-api-table" role="region" aria-label="Component-owned icons" tabindex="0">
<table><thead><tr><th>Key</th><th>Used by</th></tr></thead><tbody>
<tr><td><code>numberInput:stepperDown</code></td><td>NumberInput's step buttons. A small down chevron; the increment button flips it.</td></tr>
</tbody></table>
</div>

A theme overrides it through the same `icons` map: `defineTheme({ icons: { 'numberInput:stepperDown': 'carbon:chevron-down' } })`. Without an override the built-in glyph is drawn. Adding a namespaced key never adds a required entry to `IconRegistry`.

`useSemanticIcon(name)` comes from `@astryx-vue/core/Icon` and from the package root. An unknown string with no theme entry returns empty, so the caller can still treat it as a CSS class.

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
