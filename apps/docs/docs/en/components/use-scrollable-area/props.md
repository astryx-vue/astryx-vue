---
layout: component-docs
title: useScrollableArea
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useScrollableArea Parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseScrollableAreaOptions</code></td>
        <td>—</td>
        <td>Logical scroll intent, overscroll policy, and Sticky containment.</td>
      </tr>
      <tr>
        <td><code>options.axis</code></td>
        <td><code>'inline' | 'block' | 'both'</code></td>
        <td><code>'block'</code></td>
        <td>Which logical axis may scroll.</td>
      </tr>
      <tr>
        <td><code>options.keyboardAccess</code></td>
        <td><code>ScrollKeyboardAccess</code></td>
        <td><code>{ owner: 'viewport', label, role }</code></td>
        <td>Where the keyboard enters a scrolling area. <code>{ owner: 'content' }</code>: the content has its own focusable cells, so the viewport stays out of the Tab order and unnamed. <code>{ owner: 'viewport', label, role? }</code>: the viewport becomes a Tab stop while it scrolls. <code>{ owner: 'contentOrViewport', label, role? }</code>: the same, but a Tab into it hands focus straight to a plain leading button or link inside; arrow-key scrolling stays with the browser.</td>
      </tr>
      <tr>
        <td><code>options.label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Accessible name for the viewport. Used when <code>keyboardAccess</code> is not given.</td>
      </tr>
      <tr>
        <td><code>options.role</code></td>
        <td><code>'group' | 'region'</code></td>
        <td><code>'group'</code></td>
        <td>Role of the viewport.</td>
      </tr>
      <tr>
        <td><code>options.overscroll</code></td>
        <td><code>'allow' | 'contain'</code></td>
        <td><code>'allow'</code></td>
        <td>Overscroll policy for an axis that is actually scrollable.</td>
      </tr>
      <tr>
        <td><code>options.stickyContainment</code></td>
        <td><code>'whenScrollable' | 'always'</code></td>
        <td><code>'whenScrollable'</code></td>
        <td>Whether the viewport is a Sticky containing block only while it scrolls, or in every state.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useScrollableArea Returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>viewport</code></td>
        <td><code>(element: unknown) =&gt; void</code></td>
        <td>Function ref for the viewport element. It attaches the scroll listener and the ResizeObserver.</td>
      </tr>
      <tr>
        <td><code>content</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Template ref for the content box. Its size changes are observed too.</td>
      </tr>
      <tr>
        <td><code>viewportAttrs</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, string | number | undefined&gt;&gt;</code></td>
        <td><code>role</code>, <code>aria-label</code>, <code>tabindex</code>, and the <code>data-scroll-*</code> attributes for the current measurement.</td>
      </tr>
      <tr>
        <td><code>viewportStyle</code></td>
        <td><code>ComputedRef&lt;CSSProperties&gt;</code></td>
        <td><code>overflow</code> for both axes, plus <code>overscroll-behavior</code> for the requested axes.</td>
      </tr>
      <tr>
        <td><code>state</code></td>
        <td><code>ComputedRef&lt;ScrollableAreaState&gt;</code></td>
        <td><code>inline</code> and <code>block</code>, each with <code>isScrollable</code>, <code>atStart</code>, and <code>atEnd</code>.</td>
      </tr>
    </tbody>
  </table>
</div>
