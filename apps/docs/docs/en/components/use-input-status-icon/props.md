---
layout: component-docs
title: useInputStatusIcon
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useInputStatusIcon parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>status</code></td>
        <td><code>FieldStatusInput | undefined</code> or a ref / getter of it</td>
        <td>—</td>
        <td>The input's status (type plus message), or undefined when there is none.</td>
      </tr>
      <tr>
        <td><code>statusVariant</code></td>
        <td><code>'attached' | 'detached' | 'tooltip'</code> or a ref / getter of it</td>
        <td><code>'attached'</code></td>
        <td>How the status is presented relative to the input. <code>tooltip</code> without a message falls back to the plain glyph.</td>
      </tr>
      <tr>
        <td><code>isInGroup</code></td>
        <td><code>boolean</code> or a ref / getter of it</td>
        <td><code>false</code></td>
        <td>Whether the input sits inside an <code>InputGroup</code>, which owns status rendering itself.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useInputStatusIcon returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>statusIcon</code></td>
        <td><code>ComputedRef&lt;Component | null&gt;</code></td>
        <td>The affordance to render inside the input container: <code>FieldIcon</code> for a plain glyph, <code>FieldInfoTip</code> for a focusable info-tip button with its tooltip. <code>null</code> when no icon should render.</td>
      </tr>
      <tr>
        <td><code>statusIconProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>The props for that component: <code>type</code>, plus <code>text</code> for the info-tip variant.</td>
      </tr>
    </tbody>
  </table>
</div>
