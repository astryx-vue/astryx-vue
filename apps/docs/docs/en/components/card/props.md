---
layout: component-docs
title: Card
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Card Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Width of the card. Numbers are read as pixels and strings are used as they are. In a flex row or a grid track this is the preferred width: the card still yields when the row is narrower.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Height of the card. Numbers are read as pixels and strings are used as they are. A fixed height makes the card scroll its own content; <code>auto</code> and an omitted height leave the height to the content.</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Maximum width of the card.</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Minimum height of the card.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Padding on all four sides, as one step of the spacing scale: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Omit it and the card uses the theme's card padding — spacing step 4 with no theme — so passing a step overrides the theme instead of restating the default.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>CardVariant</code></td>
        <td><code>'default'</code></td>
        <td>Background variant. <code>default</code> uses the standard card surface and draws the border, <code>transparent</code> drops the background and the border, and <code>muted</code> uses the muted surface. The non-semantic hues are blue, cyan, gray, green, orange, pink, purple, red, teal, and yellow.</td>
      </tr>
      <tr>
        <td><code>elevation</code></td>
        <td><code>CardElevation</code></td>
        <td><code>'none'</code></td>
        <td>Resting shadow depth: none, low, med, or high. Raise a card only when it has to float above the content around it.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Card Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The card's content, usually a <code>Stack</code> holding a heading, text, and actions.</td>
      </tr>
    </tbody>
  </table>
</div>

## Theme variables

<div class="component-api-table" role="region" aria-label="Card Theme Variables" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--astryx-card-padding</code></td>
        <td><code>--astryx-spacing-4</code></td>
        <td>The theme's card padding. The <code>padding</code> prop bypasses it when it is set. <code>--astryx-card-padding-inline</code>, <code>--astryx-card-padding-inline-start</code>, <code>--astryx-card-padding-inline-end</code>, <code>--astryx-card-padding-block-start</code>, and <code>--astryx-card-padding-block-end</code> refine it per axis.</td>
      </tr>
      <tr>
        <td><code>--astryx-card-background</code></td>
        <td>-</td>
        <td>Background of the <code>default</code> variant.</td>
      </tr>
      <tr>
        <td><code>--astryx-card-muted-background</code></td>
        <td>-</td>
        <td>Background of the <code>muted</code> variant.</td>
      </tr>
      <tr>
        <td><code>--astryx-card-border</code></td>
        <td>-</td>
        <td>Border colour of the <code>default</code> variant. Its width comes from <code>--astryx-border-width</code>.</td>
      </tr>
      <tr>
        <td><code>--astryx-card-&lt;hue&gt;-background</code></td>
        <td>-</td>
        <td>Background of each hue variant, for example <code>--astryx-card-blue-background</code>.</td>
      </tr>
      <tr>
        <td><code>--astryx-card-shadow-low</code>, <code>-med</code>, <code>-high</code></td>
        <td>built-in shadow</td>
        <td>The three elevation shadows, used by <code>elevation</code> low, med, and high. A built-in shadow is used when the theme defines none.</td>
      </tr>
      <tr>
        <td><code>--_card-radius</code></td>
        <td><code>--astryx-radius-container</code></td>
        <td>The card's corner radius. Private, and a theme may override it.</td>
      </tr>
      <tr>
        <td><code>--_card-elevation</code></td>
        <td><code>0 0 transparent</code></td>
        <td>The resting shadow, written from <code>elevation</code>. It composes with <code>--_card-ring</code> inside the card's <code>box-shadow</code>, so a ring and an elevation can coexist.</td>
      </tr>
      <tr>
        <td><code>--_card-ring</code></td>
        <td><code>0 0 transparent</code></td>
        <td>An inset ring drawn in the card's shadow list, for a composing component that shows selection.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is a `<div>`.

The following go to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

`variant`, `elevation`, and `padding` are also reflected as `data-variant`, `data-elevation`, and `data-padding` on the root, and a fixed `height` adds `data-scrollable="true"`.
