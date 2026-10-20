---
layout: component-docs
title: useMediaQuery
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useMediaQuery parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>query</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>CSS media query string to evaluate, e.g. <code>'(max-width: 640px)'</code>. Read once per call, so pass a stable string. Required.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useMediaQuery return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>matches</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the media query currently matches. Read during setup on the client, and <code>false</code> on the server.</td>
      </tr>
    </tbody>
  </table>
</div>
