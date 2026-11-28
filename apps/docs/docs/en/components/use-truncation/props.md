---
layout: component-docs
title: useTruncation
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useTruncation parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>MaybeRefOrGetter&lt;number&gt;</code></td>
        <td>required</td>
        <td>The most lines the text may show. <code>1</code> compares widths; above 1 measures the real content height with a Range, bypassing the <code>scrollHeight</code> that <code>-webkit-line-clamp</code> clips; <code>0</code> measures nothing.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTruncation return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>bind</code></td>
        <td><code>(element: Element | null) =&gt; void</code></td>
        <td>Bind it to the measured element with <code>:ref="truncation.bind"</code>. Binding another element releases the previous one.</td>
      </tr>
      <tr>
        <td><code>isTruncated</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the text is cut off now. Render the full-text tooltip only while it is true.</td>
      </tr>
      <tr>
        <td><code>fullText</code></td>
        <td><code>Ref&lt;string&gt;</code></td>
        <td>The element's current text, updated at each measurement, including content changes that resize nothing.</td>
      </tr>
    </tbody>
  </table>
</div>
