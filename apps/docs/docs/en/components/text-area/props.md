---
layout: component-docs
title: Text Area
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Props list" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string</code></td><td>—</td><td>Required. Text content.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. Field name.</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Prefix for associated IDs. Auto-generated when omitted.</td></tr>
<tr><td><code>size</code></td><td><code>&#x27;sm&#x27; | &#x27;md&#x27; | &#x27;lg&#x27;</code></td><td>md</td><td>Text area height.</td></tr>
<tr><td><code>rows</code></td><td><code>number</code></td><td>—</td><td>Native textarea rows.</td></tr>
<tr><td><code>cols</code></td><td><code>number</code></td><td>—</td><td>Native textarea cols.</td></tr>
<tr><td><code>minlength</code></td><td><code>number | string</code></td><td>—</td><td>Native textarea minlength.</td></tr>
<tr><td><code>maxlength</code></td><td><code>number | string</code></td><td>—</td><td>Native textarea maxlength. When set, a live character count is shown. It turns red when the value is longer than the limit.</td></tr>
<tr><td><code>wrap</code></td><td><code>&#x27;soft&#x27; | &#x27;hard&#x27;</code></td><td>soft</td><td>Native textarea wrap.</td></tr>
<tr><td><code>resize</code></td><td><code>&#x27;none&#x27; | &#x27;both&#x27; | &#x27;horizontal&#x27; | &#x27;vertical&#x27;</code></td><td>vertical</td><td>Native textarea resize. Vertical dragging is enabled by default.</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Placeholder text.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description below the label.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Hide the visual label. Keep the accessible name.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Prevent edits. Do not submit the form value.</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Reason for disabling. The disabled text area stays focusable when provided.</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>Prevent edits. Include the value in form submission.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Show a required description. Does not run native required validation.</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Show an optional description. Takes precedence over isRequired.</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Required description text.</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Optional description text.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the whole field. Numbers are treated as px.</td></tr>
<tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Native textarea name.</td></tr>
<tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>ID of the associated form.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning, or success status.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>&#x27;attached&#x27; | &#x27;detached&#x27; | &#x27;tooltip&#x27;</code></td><td>detached</td><td>How the status message is displayed. Text area defaults to below the control.</td></tr>
<tr><td><code>changeAction</code></td><td><code>(value: string, event) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Action to run after content changes.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>Show a loading indicator.</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td>false</td><td>Show a clear button.</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>Focus on mount.</td></tr>
<tr><td><code>clearLabel</code></td><td><code>string</code></td><td>—</td><td>Accessible label for the clear button.</td></tr>
<tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Loading</td><td>Accessible label for the loading indicator.</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative icon before the label.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Info tooltip beside the label.</td></tr>
</tbody></table>
</div>

## Events

- `update:modelValue(value)`：update text content.
- `change(value, event)`：fired when content changes.
- `clear(event)`：fired when the clear button is clicked.
- `enter(event)`：fired on Enter. Shift + Enter does not fire it.
- `keydown(event)`：fired on any key press.
- `actionError(error, value, event)`：fired when changeAction throws.

When content changes, `update:modelValue` and `change` fire before `changeAction`.
Cancelling the `change` event prevents `changeAction` from running.

## Native attributes

- `class`, `style`, and other attributes are applied to the field wrapper.
- `aria-labelledby` and `aria-describedby` are merged into the native textarea.
- The component manages `disabled`, `readonly`, and `aria-invalid`.
- The `icon` slot shows a decorative icon on the left.
- The `end` slot shows extra content on the right.
- The `labelIcon` slot replaces the icon before the label.

## Theming

```css
.my-text-area {
  --astryx-text-area-min-height-md: 120px;
}
```

- `--astryx-text-area-min-height-sm`: minimum height for the sm size.
- `--astryx-text-area-min-height-md`: minimum height for the md size.
- `--astryx-text-area-min-height-lg`: minimum height for the lg size.

Other color and border variables are shared with TextInput. Neutral adapts to light and dark modes.
