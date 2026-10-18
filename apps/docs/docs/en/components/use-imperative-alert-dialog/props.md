---
layout: component-docs
title: useImperativeAlertDialog
outline: false
footer: false
---

## Returns

<div class="component-api-table" role="region" aria-label="useImperativeAlertDialog returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>show</code></td>
        <td><code>(options: ImperativeAlertDialogOptions) =&gt; void</code></td>
        <td>Show the alert dialog with the given options. Options are the same as <code>AlertDialog</code> props minus <code>isOpen</code>, plus <code>onAction</code>.</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Hide the alert dialog.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the dialog is currently open.</td>
      </tr>
      <tr>
        <td><code>Host</code></td>
        <td><code>Component</code></td>
        <td>The dialog element. Render it once in your template: <code>&lt;component :is="alert.Host" /&gt;</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Options

<div class="component-api-table" role="region" aria-label="useImperativeAlertDialog options" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>The question being asked. It names the dialog through <code>aria-labelledby</code>. Required.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>What happens if the user confirms. It is linked through <code>aria-describedby</code>. Required.</td>
      </tr>
      <tr>
        <td><code>actionLabel</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Label for the confirming action. Say what will happen, such as <code>'Delete project'</code>. Required.</td>
      </tr>
      <tr>
        <td><code>onAction</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>—</td>
        <td>Called when the confirming action is activated. The dialog is not closed for you: call <code>hide()</code> once the work settles.</td>
      </tr>
      <tr>
        <td><code>cancelLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Cancel'</code></td>
        <td>Label for the cancel button.</td>
      </tr>
      <tr>
        <td><code>actionVariant</code></td>
        <td><code>AlertDialogActionVariant</code></td>
        <td><code>'destructive'</code></td>
        <td>Visual style of the confirming action.</td>
      </tr>
      <tr>
        <td><code>isActionLoading</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Shows a spinner on the confirming action while its work is in flight.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td><code>400</code></td>
        <td>Preferred width. Numbers are pixels, strings are used as-is.</td>
      </tr>
    </tbody>
  </table>
</div>
