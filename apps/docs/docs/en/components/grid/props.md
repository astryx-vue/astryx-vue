---
layout: component-docs
title: Grid
outline: false
footer: false
---

## Grid Props

<div class="component-api-table" role="region" aria-label="Grid Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columns</code></td>
        <td><code>number | GridResponsiveColumns</code></td>
        <td>-</td>
        <td>Column configuration. A number is a fixed count of equal-width columns; an object <code>{ minWidth, max?, repeat? }</code> creates responsive columns that reflow with the available width. A missing, zero, or negative value falls back to a single column.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Width of the container. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Height of the container. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Maximum width of the container. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Minimum height of the container. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>gap</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Spacing between items on both axes, using the Astryx spacing scale.</td>
      </tr>
      <tr>
        <td><code>rowGap</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Spacing between rows; overrides <code>gap</code> on that axis.</td>
      </tr>
      <tr>
        <td><code>columnGap</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Spacing between columns; overrides <code>gap</code> on that axis. It also takes precedence over <code>gap</code> when the responsive column count is capped.</td>
      </tr>
      <tr>
        <td><code>rowHeight</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Height in pixels of each implicit row (<code>grid-auto-rows</code>). Use it together with <code>GridSpan</code>'s <code>rows</code>.</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>GridAlignment</code></td>
        <td><code>'stretch'</code></td>
        <td>Vertical alignment of items inside their row (<code>align-items</code>): start, center, end, or stretch.</td>
      </tr>
      <tr>
        <td><code>justify</code></td>
        <td><code>GridAlignment</code></td>
        <td><code>'stretch'</code></td>
        <td>Horizontal alignment of items within their row (<code>justify-items</code>): start, center, end, or stretch.</td>
      </tr>
    </tbody>
  </table>
</div>

`GridResponsiveColumns` has this shape:

```ts
interface GridResponsiveColumns {
  minWidth: number
  max?: number
  repeat?: 'fill' | 'fit'
}
```

`SpacingStep` accepts these values:

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## Grid Span Props

<div class="component-api-table" role="region" aria-label="Grid Span Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columns</code></td>
        <td><code>number | 'full'</code></td>
        <td>-</td>
        <td>Columns to span. <code>'full'</code> renders <code>grid-column: 1 / -1</code>, which spans the row whatever the column count is.</td>
      </tr>
      <tr>
        <td><code>rows</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Rows to span, rendered as <code>grid-row: span N</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Grid Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The items to lay out. Place children directly, or wrap one in <code>GridSpan</code> to change how many columns or rows it occupies.</td>
      </tr>
    </tbody>
  </table>
</div>

`GridSpan` has a single default slot as well:

<div class="component-api-table" role="region" aria-label="Grid Span Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The content of the spanning item.</td>
      </tr>
    </tbody>
  </table>
</div>

## CSS variables

`Grid` writes these variables to its root element. They are an implementation detail, but a theme or an application may override them:

<div class="component-api-table" role="region" aria-label="Grid CSS Variables" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--astryx-grid-template-columns</code></td>
        <td>The computed column template. It lives in a variable rather than an inline <code>grid-template-columns</code> declaration, so a media query can still override it.</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-auto-rows</code></td>
        <td>The implicit row height derived from <code>rowHeight</code>.</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-gap</code></td>
        <td>The spacing token for <code>gap</code>, shared by both axes.</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-row-gap</code></td>
        <td>The spacing token for <code>rowGap</code>, which overrides <code>--astryx-grid-gap</code> on the row axis.</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-column-gap</code></td>
        <td>The spacing token for <code>columnGap</code>, which overrides <code>--astryx-grid-gap</code> on the column axis.</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-default-gap</code></td>
        <td>A theme token used as the spacing when no gap prop is given. The neutral theme sets it to <code>--astryx-spacing-0</code>, which leaves no space between items.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

`Grid` and `GridSpan` both render a `<div>` at the root.

The following go to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

`class` is merged with the component's own classes. When <code>style</code> and the size props (<code>width</code>, <code>height</code>, <code>maxWidth</code>, <code>minHeight</code>) are both given, the props win; the same holds for <code>GridSpan</code>'s <code>columns</code> and <code>rows</code>.

`Grid` also writes `data-columns` (only when `columns` is a number), `data-gap`, `data-row-gap`, `data-column-gap`, `data-align`, and `data-justify`, so a theme can target it by attribute.
