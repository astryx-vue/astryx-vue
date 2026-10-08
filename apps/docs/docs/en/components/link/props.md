---
layout: component-docs
title: Link
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Link Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Link URL. When omitted, the component renders as a <code>&lt;button&gt;</code>.</td>
      </tr>
      <tr>
        <td><code>isExternalLink</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the link opens in a new tab and shows an external indicator.</td>
      </tr>
      <tr>
        <td><code>hasUnderline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the underline is always visible.</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>LinkColor</code></td>
        <td><code>'accent'</code></td>
        <td>Link color. Optional: primary, secondary, accent, inherit.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the link is disabled.</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>HTML target attribute.</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>HTML rel attribute. External links automatically add noopener noreferrer.</td>
      </tr>
      <tr>
        <td><code>download</code></td>
        <td><code>string | boolean</code></td>
        <td>-</td>
        <td>Triggers a download of the linked URL.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="Link Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>click</code></td>
        <td>Emitted on click. Not emitted when disabled.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Link Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Link text content.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is `<a>` or `<button>`.

The following are passed to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
