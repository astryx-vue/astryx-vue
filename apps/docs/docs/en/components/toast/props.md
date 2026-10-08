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
        <td><code>autoClose</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether the toast auto-dismisses.</td>
      </tr>
      <tr>
        <td><code>duration</code></td>
        <td><code>number</code></td>
        <td><code>5000</code></td>
        <td>Auto-dismiss duration in milliseconds.</td>
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
        <td><code>close</code></td>
        <td>Emitted when the toast is dismissed.</td>
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

const dismiss = toast({ body: 'Hello', type: 'info', duration: 3000 })
// dismiss manually
dismiss()
// dismiss all
toast.clear()
```
