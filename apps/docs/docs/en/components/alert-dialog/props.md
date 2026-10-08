---
layout: component-docs
title: Alert Dialog
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="AlertDialog Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Whether the dialog is open. Required. The dialog never closes itself: a dismissal request arrives through <code>openChange</code>.</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Renders the surface in normal flow without the <code>&lt;dialog&gt;</code> element, the backdrop, or focus behavior. For documentation previews only. Because it is not modal, the root element uses <code>role="group"</code> instead.</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The question being asked. It renders as a level-2 heading and names the dialog through <code>aria-labelledby</code>. Required.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>What happens if the user confirms. Linked to the dialog through <code>aria-describedby</code>. Required.</td>
      </tr>
      <tr>
        <td><code>cancelLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Cancel'</code></td>
        <td>Label for the cancel button, rendered as a ghost button. Clicking it emits <code>openChange(false)</code>.</td>
      </tr>
      <tr>
        <td><code>actionLabel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Label for the confirming action. Say what will happen, such as "Delete project". Required.</td>
      </tr>
      <tr>
        <td><code>actionVariant</code></td>
        <td><code>AlertDialogActionVariant</code></td>
        <td><code>'destructive'</code></td>
        <td>Visual style of the confirming action, using the <code>Button</code> variants: <code>destructive</code>, <code>primary</code>, <code>secondary</code>, or <code>ghost</code>.</td>
      </tr>
      <tr>
        <td><code>isActionLoading</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Shows a spinner on the confirming action and marks it <code>aria-busy</code>. Cancel stays available and the dialog stays open until the work settles.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td><code>400</code></td>
        <td>Preferred width. Numbers are pixels, strings are used as-is. Dialog clamps it to the container and the dynamic viewport.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events and template refs

<div class="component-api-table" role="region" aria-label="AlertDialog Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Signature</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>Fires with <code>false</code> when the user cancels, through the cancel button or Escape. The parent decides whether to close; a backdrop click and the confirm action never fire it.</td>
      </tr>
      <tr>
        <td><code>action</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>Fires when the confirming action is activated. The dialog does not close itself, so close it once the work is done.</td>
      </tr>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLElement | null</code></td>
        <td>The root element — a <code>&lt;dialog&gt;</code> in the modal case, a <code>&lt;div&gt;</code> in the inline preview — exposed through a template ref.</td>
      </tr>
      <tr>
        <td><code>focus</code>, <code>blur</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Move focus into or out of the root element.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="AlertDialog Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>title</code></td>
        <td>Title content, replacing the <code>title</code> prop. The element that carries it keeps the id the dialog is named after.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td>Description content, replacing the <code>description</code> prop. It keeps the id that <code>aria-describedby</code> points at.</td>
      </tr>
      <tr>
        <td><code>actions</code></td>
        <td>Extra content in the footer, before the cancel and confirm buttons, such as a link to the guide.</td>
      </tr>
    </tbody>
  </table>
</div>

## useImperativeAlertDialog

- `show(options)`: opens the dialog with the given options — every prop except `isOpen`, plus an `onAction` callback.
- `hide()`: closes the dialog.
- `isOpen`: the open state, as a writable ref.
- `Host`: component to render once in the template.

## Native attributes

The root element is a `<dialog>` in the modal case and a `<div>` in the inline preview.

The following go to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

The component maintains `role`, `aria-modal`, `aria-labelledby`, and `aria-describedby` itself, so those keep the values it derives.
