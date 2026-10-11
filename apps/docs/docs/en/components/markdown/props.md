---
layout: component-docs
title: Markdown
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Markdown Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>content</code></td><td><code>string</code></td><td>—</td><td>Markdown source. When omitted, text in the default slot is used.</td></tr>
      <tr><td><code>contentAlign</code></td><td><code>'start' | 'center'</code></td><td><code>'start'</code></td><td>Horizontal alignment of the prose measure when <code>contentWidth</code> is set.</td></tr>
      <tr><td><code>contentWidth</code></td><td><code>number | string</code></td><td>—</td><td>Maximum width of prose. A number is pixels. Tables and code blocks still fill the container.</td></tr>
      <tr><td><code>components</code></td><td><code>MarkdownComponents</code></td><td>—</td><td>Replaces the renderer for a node kind. Keys: <code>blockquote</code>, <code>code</code>, <code>heading</code>, <code>hr</code>, <code>image</code>, <code>inlineCode</code>, <code>link</code>, <code>list</code>, <code>paragraph</code>, <code>table</code>.</td></tr>
      <tr><td><code>density</code></td><td><code>'default' | 'compact'</code></td><td><code>'default'</code></td><td><code>compact</code> tightens the space between blocks.</td></tr>
      <tr><td><code>display</code></td><td><code>'block' | 'inline'</code></td><td><code>'block'</code></td><td><code>inline</code> renders the source as phrasing content inside a <code>span</code>.</td></tr>
      <tr><td><code>headingLevelStart</code></td><td><code>1 | 2 | 3 | 4 | 5 | 6</code></td><td><code>1</code></td><td>The heading level a markdown <code>#</code> maps to. Deeper headings shift with it and stop at <code>h6</code>.</td></tr>
      <tr><td><code>isStreaming</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Reveals appended source smoothly and re-parses only the last unfinished block.</td></tr>
      <tr><td><code>onLinkClick</code></td><td><code>(href: string, event: MouseEvent) =&gt; void | false</code></td><td>—</td><td>Called when a link is activated. Return <code>false</code> to cancel navigation.</td></tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Markdown slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>Text used as the Markdown source when <code>content</code> is omitted.</td></tr>
    </tbody>
  </table>
</div>

## Expose

<div class="component-api-table" role="region" aria-label="Markdown expose" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>element</code></td><td><code>HTMLElement | null</code></td><td>The root element.</td></tr>
    </tbody>
  </table>
</div>

## Composable

`useStreamingText(targetText, isStreaming?, options?)` turns a growing string into a steady reveal. `options.speed` is `natural`, `fast`, or `instant`. When streaming is off, or the user prefers reduced motion, the full source is returned.

## Native attributes

A block root is a `<div role="document">`. An inline root is a `<span>`.

The following are passed to the root:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

A provided `role` is used as given.
