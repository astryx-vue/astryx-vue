---
layout: component-docs
title: Text
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Text Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>type</code></td>
        <td><code>TextType</code></td>
        <td><code>'body'</code></td>
        <td>Semantic text type. Determines default size, weight, and line-height. Optional: body, large, label, supporting, code, display-1, display-2, display-3.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>TextSize</code></td>
        <td>-</td>
        <td>Explicit font size override. Optional: sm, md, lg, xl.</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>TextColor</code></td>
        <td><code>'primary'</code></td>
        <td>Text color. Optional: primary, secondary, accent, disabled, placeholder, inherit.</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>TextWeight</code></td>
        <td>-</td>
        <td>Font weight override. Optional: regular, normal, medium, semibold, bold. normal is the same weight as regular.</td>
      </tr>
      <tr>
        <td><code>textWrap</code></td>
        <td><code>TextWrap</code></td>
        <td>-</td>
        <td>Wrapping behavior: wrap, nowrap, balance, or pretty.</td>
      </tr>
      <tr>
        <td><code>wordBreak</code></td>
        <td><code>TextWordBreak</code></td>
        <td>-</td>
        <td>How a long unbroken string breaks: normal, break-word, or break-all.</td>
      </tr>
      <tr>
        <td><code>hasStrikethrough</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Draws a line through the text.</td>
      </tr>
      <tr>
        <td><code>hasTabularNumbers</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Uses tabular figures so digits line up across rows.</td>
      </tr>
      <tr>
        <td><code>display</code></td>
        <td><code>TextDisplay</code></td>
        <td><code>'inline'</code></td>
        <td>Display type: <code>inline</code> or <code>block</code>.</td>
      </tr>
      <tr>
        <td><code>as</code></td>
        <td><code>TextAs</code></td>
        <td><code>'span'</code></td>
        <td>HTML element to render. Optional: span, p, div, label.</td>
      </tr>
      <tr>
        <td><code>justify</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'start'</code></td>
        <td>Text alignment. <code>start</code> and <code>end</code> follow the writing direction.</td>
      </tr>
      <tr>
        <td><code>hasTruncateTooltip</code></td>
        <td><code>boolean | 'above' | 'below' | 'start' | 'end'</code></td>
        <td><code>true</code></td>
        <td>Puts the full text in a tooltip after truncation. <code>false</code> turns it off. It stays closed when the text fits.</td>
      </tr>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>Maximum lines before truncation. 0 means no truncation. A positive value forces block layout so the ellipsis has a width.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is determined by `as`, defaulting to `<span>`.

The following are passed to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
