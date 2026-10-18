---
layout: component-docs
title: useDevWarning
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useDevWarning parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>component</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Component or hook name, used as the message prefix. Required.</td>
      </tr>
      <tr>
        <td><code>message</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>What went wrong and how to fix it. Required.</td>
      </tr>
      <tr>
        <td><code>condition</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>true</code></td>
        <td>Whether to warn. A plain boolean, a <code>ref</code>, or a getter all work. The first time it is true during a mount the warning fires once, and toggling it again in the same mount stays quiet.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useDevWarning returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>—</td>
        <td><code>void</code></td>
        <td>Nothing is returned. The watcher stops when the component or effect scope is disposed, and in a production build the function does nothing at all.</td>
      </tr>
    </tbody>
  </table>
</div>
