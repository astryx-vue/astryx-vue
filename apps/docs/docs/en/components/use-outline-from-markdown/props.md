---
layout: component-docs
title: useOutlineFromMarkdown
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useOutlineFromMarkdown parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>markdown</code></td>
        <td><code>MaybeRefOrGetter&lt;string&gt;</code></td>
        <td>required</td>
        <td>The Markdown source. Pass the same string you render with <code>Markdown</code>, as a ref or a getter when it changes.</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;ParseOutlineFromMarkdownOptions | undefined&gt;</code></td>
        <td>—</td>
        <td>Parse options. Omit them for a document that <code>Markdown</code> renders without plugins.</td>
      </tr>
      <tr>
        <td><code>options.plugins</code></td>
        <td><code>readonly (MarkdownPlugin | MarkdownPluginEntry)[]</code></td>
        <td>—</td>
        <td>The ordered plugin list. Pass the same list to <code>Markdown</code>, so transforms, labels and ids agree. A new list recomputes the outline.</td>
      </tr>
      <tr>
        <td><code>options.isFinal</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether the source is complete. Pass <code>false</code> while <code>Markdown</code>'s <code>isStreaming</code> is on, so both apply the same transforms.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useOutlineFromMarkdown return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>ComputedRef&lt;OutlineItem[]&gt;</code></td>
        <td>One item per root heading, in document order, ready for <code>Outline</code>'s <code>items</code>. <code>id</code> is the id <code>Markdown</code> renders on the heading in a complete document without sources, <code>label</code> is the heading text, and <code>level</code> is its depth from 1 to 6.</td>
      </tr>
    </tbody>
  </table>
</div>
