---
layout: component-docs
title: Empty State
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="EmptyState Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>required</td>
        <td>The primary message, rendered as the heading of the empty state. Say what is empty ("No projects yet") instead of something generic like "No data".</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Secondary text below the title that explains why the area is empty or what the user can do next. Rendered as a <code>&lt;div&gt;</code>.</td>
      </tr>
      <tr>
        <td><code>headingLevel</code></td>
        <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
        <td><code>3</code></td>
        <td>The semantic level of the title. It controls only the rendered HTML tag (h1–h6) so the title fits the document outline; the visual size of the title is the same at every level.</td>
      </tr>
      <tr>
        <td><code>isCompact</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Reduces the spacing and the text sizes for constrained areas such as cards and sidebars, and stacks the actions in a column.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="EmptyState Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>icon</code></td>
        <td>The icon or illustration above the title. Its wrapper carries <code>aria-hidden="true"</code>, so an icon placed here needs no <code>label</code>.</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td>Rich content for the title. Overrides the <code>title</code> prop, for example to place a link inside the heading.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td>Rich content for the description. Overrides the <code>description</code> prop; because it renders as a <code>&lt;div&gt;</code>, it can hold block content such as a list.</td>
      </tr>
      <tr>
        <td><code>actions</code></td>
        <td>The actions below the text, usually one or two buttons. They sit in a row that wraps, and become a column when <code>isCompact</code> is true.</td>
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

The root element carries `role="status"` by default, and an explicit `role` overrides it.

## Theme tokens

`packages/themes/neutral/empty-state.css` provides these tokens, which a theme can override:

<div class="component-api-table" role="region" aria-label="EmptyState Tokens" tabindex="0">
  <table>
    <thead>
      <tr><th>Token</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--astryx-empty-state-title-foreground</code></td>
        <td>Color of the title, which matches the primary text color by default.</td>
      </tr>
      <tr>
        <td><code>--astryx-empty-state-description-foreground</code></td>
        <td>Color of the description, which matches the secondary text color by default.</td>
      </tr>
      <tr>
        <td><code>--astryx-empty-state-text-width</code></td>
        <td>Maximum width of the text column formed by the title and the description. 360px by default.</td>
      </tr>
    </tbody>
  </table>
</div>
