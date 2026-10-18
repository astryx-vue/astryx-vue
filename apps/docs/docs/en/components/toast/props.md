---
layout: component-docs
title: Toast
outline: false
footer: false
---

## Toast Props

<div class="component-api-table" role="region" aria-label="Toast Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>type</code></td>
        <td><code>ToastType</code></td>
        <td><code>'info'</code></td>
        <td>Visual type. Optional: info, success, warning, error.</td>
      </tr>
      <tr>
        <td><code>body</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Toast message text.</td>
      </tr>
      <tr>
        <td><code>isAutoHide</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code> for every type except <code>error</code></td>
        <td>Whether the toast dismisses itself. Error toasts stay until they are dismissed unless this is set.</td>
      </tr>
      <tr>
        <td><code>autoHideDuration</code></td>
        <td><code>number</code></td>
        <td><code>5000</code></td>
        <td>Auto-dismiss duration in milliseconds. A pause on hover, focus, or window blur keeps at least one second on the clock.</td>
      </tr>
      <tr>
        <td><code>autoClose</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Older name of <code>isAutoHide</code>. Both work; <code>isAutoHide</code> wins.</td>
      </tr>
      <tr>
        <td><code>duration</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Older name of <code>autoHideDuration</code>. Both work; <code>autoHideDuration</code> wins.</td>
      </tr>
      <tr>
        <td><code>uniqueID</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Identity shared by toasts that collapse into one.</td>
      </tr>
      <tr>
        <td><code>collisionBehavior</code></td>
        <td><code>'ignore' | 'overwrite'</code></td>
        <td><code>'overwrite'</code></td>
        <td>What happens when a toast reuses a visible <code>uniqueID</code>.</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td><code>Component</code></td>
        <td>-</td>
        <td>Trailing action, such as an undo button. Use the <code>end</code> slot for one-off content.</td>
      </tr>
      <tr>
        <td><code>onDismiss</code></td>
        <td><code>(reason: 'auto' | 'manual') =&gt; void</code></td>
        <td>-</td>
        <td>Runs when the toast is dismissed from inside the card: the timer, the close button, or custom content. Options for <code>useToast()</code> only.</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>(reason: 'auto' | 'manual') =&gt; void</code></td>
        <td>-</td>
        <td>Runs when the toast is removed, however it was dismissed, including the dismiss function returned by <code>useToast()</code>. Options for <code>useToast()</code> only.</td>
      </tr>
    </tbody>
  </table>
</div>

## Toast Events

<div class="component-api-table" role="region" aria-label="Toast Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>dismiss</code></td>
        <td>Emitted with the reason (<code>'auto'</code> or <code>'manual'</code>) when the card dismisses itself.</td>
      </tr>
      <tr>
        <td><code>close</code></td>
        <td>Older name of <code>dismiss</code>, emitted at the same time without the reason.</td>
      </tr>
    </tbody>
  </table>
</div>

## Toast Slots

<div class="component-api-table" role="region" aria-label="Toast Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Custom toast content. Defaults to <code>body</code>.</td>
      </tr>
      <tr>
        <td><code>end</code></td>
        <td>Trailing content, replacing <code>endContent</code>.</td>
      </tr>
      <tr>
        <td><code>content</code></td>
        <td>Replaces the whole card content and receives <code>{ body, endContent, type, isAutoHide, autoHideDuration, dismiss }</code>. The empty-state close button is not rendered, so the custom layout owns every control.</td>
      </tr>
    </tbody>
  </table>
</div>

## ToastViewport Props

<div class="component-api-table" role="region" aria-label="ToastViewport Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placement</code></td>
        <td><code>ToastPlacement</code></td>
        <td><code>'bottom-center'</code></td>
        <td>Position of the toast stack in the viewport. Optional: top-start, top-center, top-end, bottom-start, bottom-center, bottom-end.</td>
      </tr>
    </tbody>
  </table>
</div>

## useToast

```ts
const toast = useToast()

const dismiss = toast({
  body: 'Hello',
  type: 'info',
  autoHideDuration: 3000,
  onDismiss: reason => console.log('dismissed', reason),
  onHide: reason => console.log('removed', reason),
})
// dismiss manually
dismiss()
// dismiss all
toast.clear()
```
