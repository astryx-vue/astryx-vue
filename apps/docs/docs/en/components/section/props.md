---
layout: component-docs
title: Section
outline: false
footer: false
---

## Section Props

<div class="component-api-table" role="region" aria-label="Section Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'section' | 'transparent' | 'muted'</code></td>
        <td><code>'section'</code></td>
        <td>Background. <code>section</code> uses the surface, <code>muted</code> uses the wash, and <code>transparent</code> paints nothing.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td><code>4</code></td>
        <td>Padding on every edge. <code>0</code> is edge-to-edge content.</td>
      </tr>
      <tr>
        <td><code>paddingInline</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Inline-axis padding. Overrides <code>padding</code> on that axis.</td>
      </tr>
      <tr>
        <td><code>paddingInlineStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Inline-start padding. Overrides the broader values on that edge. The physical edge follows writing direction.</td>
      </tr>
      <tr>
        <td><code>paddingInlineEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Inline-end padding. Overrides the broader values on that edge.</td>
      </tr>
      <tr>
        <td><code>paddingBlock</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Block-axis padding. Overrides <code>padding</code> on that axis.</td>
      </tr>
      <tr>
        <td><code>paddingBlockStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Block-start padding. Overrides the broader values on that edge.</td>
      </tr>
      <tr>
        <td><code>paddingBlockEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Block-end padding. Overrides the broader values on that edge.</td>
      </tr>
      <tr>
        <td><code>dividers</code></td>
        <td><code>Array&lt;'top' | 'bottom' | 'start' | 'end'&gt;</code></td>
        <td>-</td>
        <td>Edges that draw a 1px border. <code>start</code> and <code>end</code> follow writing direction.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Width. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Height. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Maximum width. Numbers are pixels, strings are used as they are.</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Minimum height. Numbers are pixels, strings are used as they are.</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` accepts `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`.

## Slots

<div class="component-api-table" role="region" aria-label="Section Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Content inside the section.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

`Section` renders a `<div>`.

The following go to that element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

`class` is merged. The inner element sets `data-variant` and `data-divider-*` for each requested edge.
