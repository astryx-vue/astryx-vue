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
        <td><code>as</code></td>
        <td><code>LinkRoot</code></td>
        <td>-</td>
        <td>Root used instead of <code>&lt;a&gt;</code> when the link has an address and is enabled. It receives <code>href</code> and <code>to</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name. Use it when the visible content is not the name, such as an icon-only link. It replaces the link text for assistive technology.</td>
      </tr>
      <tr>
        <td><code>newTabLabel</code></td>
        <td><code>string</code></td>
        <td>Localized “(opens in new tab)”</td>
        <td>Screen-reader text after an external link.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>LinkSize</code></td>
        <td>-</td>
        <td>Font size, the same steps as body text: sm, md, lg, xl.</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>LinkWeight</code></td>
        <td>-</td>
        <td>Font weight. normal is the same as regular.</td>
      </tr>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>Maximum visible lines. 0 does not truncate.</td>
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

The root element is an `<a>`, a `<button>`, or the component passed to `as`. A disabled link is always an `<a>` without an address.

The following are passed to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
