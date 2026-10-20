---
layout: component-docs
title: useToast
outline: false
footer: false
---

## Returns

<div class="component-api-table" role="region" aria-label="useToast returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>show</code></td>
        <td><code>(options: ToastOptions) =&gt; () =&gt; void</code></td>
        <td>Show a toast notification. The returned function dismisses that toast. The hook itself is callable, so <code>toast({ body })</code> and <code>toast.show({ body })</code> are the same.</td>
      </tr>
      <tr>
        <td><code>dismiss</code></td>
        <td><code>(id: string) =&gt; void</code></td>
        <td>Dismiss a toast by id. It hangs off the returned function: <code>toast.dismiss(id)</code>.</td>
      </tr>
      <tr>
        <td><code>clear</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Dismiss every visible toast. Called as <code>toast.clear()</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Toast options

<div class="component-api-table" role="region" aria-label="Toast options" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>body</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>The message. Required.</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>'info' | 'success' | 'warning' | 'error'</code></td>
        <td><code>'info'</code></td>
        <td>Visual type of the toast.</td>
      </tr>
      <tr>
        <td><code>isAutoHide</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether the toast dismisses itself. <code>error</code> toasts stay until they are dismissed.</td>
      </tr>
      <tr>
        <td><code>autoHideDuration</code></td>
        <td><code>number</code></td>
        <td><code>5000</code></td>
        <td>Auto-dismiss duration in milliseconds.</td>
      </tr>
      <tr>
        <td><code>uniqueID</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Identity shared by toasts that should collapse into one.</td>
      </tr>
      <tr>
        <td><code>collisionBehavior</code></td>
        <td><code>'ignore' | 'overwrite'</code></td>
        <td><code>'overwrite'</code></td>
        <td>How a <code>uniqueID</code> clash is resolved.</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td><code>Component</code></td>
        <td>—</td>
        <td>Trailing action rendered after the message, such as an undo button.</td>
      </tr>
      <tr>
        <td><code>onDismiss</code></td>
        <td><code>(reason: 'auto' | 'manual') =&gt; void</code></td>
        <td>—</td>
        <td>Runs when the toast card dismisses itself: the timer, the close button, or a swipe.</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>(reason: 'auto' | 'manual') =&gt; void</code></td>
        <td>—</td>
        <td>Runs when the toast is removed, however it was dismissed.</td>
      </tr>
    </tbody>
  </table>
</div>
