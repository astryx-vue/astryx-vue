---
layout: component-docs
title: Dialog
outline: false
footer: false
---

## Dialog Props

<div class="component-api-table" role="region" aria-label="Dialog props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Whether the dialog is open. Required.</td></tr>
<tr><td><code>isInline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders content in normal flow without the modal dialog, backdrop, or focus behavior. For documentation previews only.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td><code>400</code></td><td>Preferred width. Numbers are pixels. Clamped to the viewport on narrow screens. Ignored by <code>fullscreen</code>.</td></tr>
<tr><td><code>maxHeight</code></td><td><code>number | string</code></td><td><code>'75vh'</code></td><td>Maximum height. Numbers are pixels. Ignored by <code>fullscreen</code>.</td></tr>
<tr><td><code>position</code></td><td><code>DialogPosition</code></td><td>Centered</td><td>Static offsets: <code>top</code>, <code>bottom</code>, <code>start</code>, <code>end</code>. Logical <code>start</code> and <code>end</code> mirror under RTL. Ignored by <code>fullscreen</code>.</td></tr>
<tr><td><code>variant</code></td><td><code>'standard' | 'fullscreen'</code></td><td><code>'standard'</code></td><td>Standard dialog or a dialog that fills the viewport.</td></tr>
<tr><td><code>purpose</code></td><td><code>'required' | 'form' | 'info'</code></td><td><code>'info'</code></td><td><code>required</code> disables Escape and backdrop dismissal. <code>form</code> allows Escape only. <code>info</code> allows both.</td></tr>
<tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td>Theme default (16px)</td><td>Inner padding, mapped to the <code>--astryx-spacing-*</code> tokens.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires with `false` when the user requests dismissal through Escape or a backdrop click, depending on `purpose`. The parent sets `isOpen` to close.

## Slots

- `default`: dialog content. Usually a `DialogHeader` followed by body content and actions.

## DialogHeader Props

<div class="component-api-table" role="region" aria-label="DialogHeader props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Dialog title. Receives default focus on open and names the dialog. Required.</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>Secondary text below the title. Not rendered when empty.</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a close button that emits <code>openChange(false)</code>.</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>'Close'</code></td><td>Accessible name of the close button.</td></tr>
</tbody></table>
</div>

## DialogHeader Events and Slots

- `openChange(isOpen: boolean)`: fires with `false` from the close button.
- `startContent`: content before the title, such as a back button.
- `endContent`: content after the title, before the close button.

## useImperativeDialog

- `show(content, options?)`: opens the dialog with content. Options merge with the defaults passed to the hook.
- `hide()`: closes the dialog.
- `isOpen`: readonly ref of the open state.
- `Host`: component to render once in the template.

## Theme

```css
.my-dialog {
  --astryx-dialog-background: #fff;
  --astryx-dialog-foreground: #000;
}
```

- `--astryx-dialog-background`: surface color.
- `--astryx-dialog-foreground`: text color.
- `--astryx-dialog-overlay`: backdrop color.
- `--astryx-dialog-shadow`: surface shadow.
- `--astryx-dialog-padding`: default inner padding when the `padding` prop is not set.
- `--astryx-dialog-title-color`: header title color.
