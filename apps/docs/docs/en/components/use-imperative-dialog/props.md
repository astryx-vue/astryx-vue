---
layout: component-docs
title: useImperativeDialog
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useImperativeDialog parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>defaultOptions</code></td>
        <td><code>ImperativeDialogOptions</code></td>
        <td><code>{}</code></td>
        <td>Options used by every <code>show()</code> call: the same as <code>Dialog</code> props minus <code>isOpen</code>. A call can pass its own options, which are merged over these.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useImperativeDialog returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>show</code></td>
        <td><code>(content: () =&gt; VNodeChild, options?: ImperativeDialogOptions) =&gt; void</code></td>
        <td>Show the dialog with the given content. Options are the same as <code>Dialog</code> props minus <code>isOpen</code> and the content.</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Hide the dialog.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td>
        <td>Whether the dialog is currently open.</td>
      </tr>
      <tr>
        <td><code>Host</code></td>
        <td><code>Component</code></td>
        <td>The dialog element. Render it once in your template: <code>&lt;component :is="dialog.Host" /&gt;</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Options

<div class="component-api-table" role="region" aria-label="useImperativeDialog options" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>Preferred width. Numbers are pixels, strings are used as-is. The fullscreen variant ignores it.</td>
      </tr>
      <tr>
        <td><code>maxHeight</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>Maximum height. Numbers are pixels, strings are used as-is. The fullscreen variant ignores it.</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>DialogPosition</code></td>
        <td>centered</td>
        <td>Static position. Inline edges use <code>start</code> and <code>end</code>, which mirror under RTL.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'standard' | 'fullscreen'</code></td>
        <td><code>'standard'</code></td>
        <td>A standard dialog is sized by <code>width</code> and <code>maxHeight</code>; a fullscreen one fills the viewport.</td>
      </tr>
      <tr>
        <td><code>purpose</code></td>
        <td><code>'info' | 'form' | 'required'</code></td>
        <td><code>'info'</code></td>
        <td>How the dialog closes. <code>required</code> disables Escape and the backdrop; <code>form</code> keeps Escape and disables the backdrop; <code>info</code> allows both.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>DialogPadding</code></td>
        <td>theme default</td>
        <td>Padding step, matching the <code>--astryx-spacing-*</code> tokens.</td>
      </tr>
    </tbody>
  </table>
</div>
