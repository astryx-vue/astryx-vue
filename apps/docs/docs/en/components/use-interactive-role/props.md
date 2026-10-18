---
layout: component-docs
title: useInteractiveRole
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useInteractiveRole parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options.href</code></td>
        <td><code>string | undefined</code>, or a ref / getter of it</td>
        <td>—</td>
        <td>URL for navigation. Highest priority: with a non-empty href the component is a link.</td>
      </tr>
      <tr>
        <td><code>options.hasOnClick</code></td>
        <td><code>boolean</code>, or a ref / getter of it</td>
        <td><code>false</code></td>
        <td>Whether the component has a click handler. Resolves to a button, ahead of anything else after the href. Upstream takes the handler itself; a boolean keeps a handler and a getter apart.</td>
      </tr>
      <tr>
        <td><code>options.isDisabled</code></td>
        <td><code>boolean</code>, or a ref / getter of it</td>
        <td><code>false</code></td>
        <td>When true, href is ignored for role resolution (a disabled link is an anti-pattern), so the role comes from the click handler, then inert.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useInteractiveRole returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>role</code></td>
        <td><code>ComputedRef&lt;'link' | 'button' | 'inert'&gt;</code></td>
        <td>The element the component should render: an anchor, a button, or a non-interactive span / div.</td>
      </tr>
    </tbody>
  </table>
</div>
