---
layout: component-docs
title: Center
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Center Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>axis</code></td>
        <td><code>'both' | 'horizontal' | 'vertical'</code></td>
        <td><code>'both'</code></td>
        <td>Which axis to center. both centers the main and the cross axis, horizontal centers the inline direction only, and vertical centers the block direction only. A single-axis value ends up on flex alignment, so outside horizontal writing it follows the flex main and cross axes.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>Container width. Numbers are interpreted as pixels, strings pass through as CSS values.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>Container height. Numbers are interpreted as pixels. Vertical centering needs height to distribute, so the default both and vertical usually use it.</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>Maximum container width. Numbers are interpreted as pixels.</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>Minimum container height. Numbers are interpreted as pixels.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>Inner padding on all four edges, using the Astryx spacing scale.</td>
      </tr>
      <tr>
        <td><code>paddingInline</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>Inline-axis padding; overrides padding on that axis.</td>
      </tr>
      <tr>
        <td><code>paddingInlineStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>Inline-start padding; overrides that edge only, and takes precedence over paddingInline and padding. The physical edge follows writing mode and direction.</td>
      </tr>
      <tr>
        <td><code>paddingInlineEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>Inline-end padding; overrides that edge only, and takes precedence over paddingInline and padding. The physical edge follows writing mode and direction.</td>
      </tr>
      <tr>
        <td><code>paddingBlock</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>Block-axis padding; overrides padding on that axis.</td>
      </tr>
      <tr>
        <td><code>paddingBlockStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>Block-start padding; overrides that edge only, and takes precedence over paddingBlock and padding. The physical edge follows writing mode.</td>
      </tr>
      <tr>
        <td><code>paddingBlockEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>Block-end padding; overrides that edge only, and takes precedence over paddingBlock and padding. The physical edge follows writing mode.</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Render as inline-flex, so the container stays in a line of text. Useful for centering small elements such as icons and badges.</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` accepts these values:

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## Slots

<div class="component-api-table" role="region" aria-label="Center Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The content to center. It is centered as one block: Center adds no space between several children and changes none of their semantics, colors, or reading order.</td>
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
- Native event listeners.

`Center` writes its own `data-axis` on the root element to reflect the axis in effect; a `data-axis` passed in by a consumer does not replace it.
