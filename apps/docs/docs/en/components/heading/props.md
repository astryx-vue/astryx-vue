---
layout: component-docs
title: Heading
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Heading Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>level</code></td>
        <td><code>HeadingLevel</code></td>
        <td>-</td>
        <td>Heading level (1–6). Determines the semantic element (h1–h6).</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>HeadingType</code></td>
        <td>-</td>
        <td>Visual type variant that overrides the default level styling. Optional: <code>display-1</code>, <code>display-2</code>, <code>display-3</code>, <code>body</code>, <code>large</code>, <code>label</code>, <code>supporting</code>.</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>HeadingColor</code></td>
        <td><code>'primary'</code></td>
        <td>Text color. Optional: <code>primary</code>, <code>secondary</code>, <code>accent</code>, <code>inherit</code>.</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>HeadingWeight</code></td>
        <td>-</td>
        <td>Font weight override. Optional: <code>regular</code>, <code>medium</code>, <code>semibold</code>, <code>bold</code>.</td>
      </tr>
      <tr>
        <td><code>display</code></td>
        <td><code>HeadingDisplay</code></td>
        <td><code>'block'</code></td>
        <td>Display type: <code>block</code> or <code>inline</code>.</td>
      </tr>
      <tr>
        <td><code>accessibilityLevel</code></td>
        <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
        <td>-</td>
        <td>Outline level for assistive technology when it should differ from the visual <code>level</code>. The element stays <code>h{level}</code>.</td>
      </tr>
      <tr>
        <td><code>textWrap</code></td>
        <td><code>'wrap' | 'nowrap' | 'balance' | 'pretty'</code></td>
        <td>-</td>
        <td>CSS <code>text-wrap</code>.</td>
      </tr>
      <tr>
        <td><code>wordBreak</code></td>
        <td><code>'break-word' | 'break-all'</code></td>
        <td><code>break-all</code> for one line, <code>break-word</code> for more</td>
        <td>How long unbroken strings break.</td>
      </tr>
      <tr>
        <td><code>justify</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'start'</code></td>
        <td>Text alignment. <code>start</code> and <code>end</code> follow the writing direction.</td>
      </tr>
      <tr>
        <td><code>hasCapsize</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Trims the leading above the cap height and below the baseline with <code>text-box-trim</code>, so glyphs sit flush with the box edges. Forces block layout.</td>
      </tr>
      <tr>
        <td><code>hasStrikethrough</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Draws a line through the text.</td>
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
        <td>Maximum lines before truncation. 0 means no truncation.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is `<h1>` through `<h6>`.

The following are passed to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
