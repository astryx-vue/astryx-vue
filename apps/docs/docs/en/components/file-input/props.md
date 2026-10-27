---
layout: component-docs
title: File Input
outline: false
footer: false
---

## FileInput Props

<div class="component-api-table" role="region" aria-label="FileInput props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>File | File[] | null</code></td><td><code>null</code></td><td>The selected file. An array when <code>isMultiple</code> is set.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required accessible name.</td></tr>
<tr><td><code>accept</code></td><td><code>string</code></td><td>—</td><td>HTML accept list, such as <code>.pdf,.docx</code> or <code>image/*</code>.</td></tr>
<tr><td><code>isMultiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allow more than one file.</td></tr>
<tr><td><code>maxSize</code></td><td><code>number</code></td><td>—</td><td>Maximum size of one file, in bytes.</td></tr>
<tr><td><code>maxFiles</code></td><td><code>number</code></td><td>—</td><td>Maximum number of files when <code>isMultiple</code> is set.</td></tr>
<tr><td><code>mode</code></td><td><code>'input' | 'dropzone'</code></td><td><code>'input'</code></td><td>Compact field, or a dashed drop target.</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Choose file</code></td><td>Text shown when nothing is selected. Follows the locale.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Field height. 28, 32, or 36px.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning, or success. A rejected file supplies an error when this is omitted.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>Where the status message sits.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Blocks the picker and drops.</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Explains why the field is disabled. With <code>isDisabled</code>, the message shows in a tooltip on hover or keyboard focus and the trigger stays focusable with <code>aria-disabled</code>; the picker still cannot open.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Hint shown from the info icon at the end of the label.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the field required.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a spinner, for an upload in progress.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Help text under the label.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the whole field. Numbers are pixels.</td></tr>
<tr><td><code>changeAction</code></td><td><code>(files) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Called after a selection and after a clear. A rejection emits <code>actionError</code>. A spinner shows while it is pending.</td></tr>
<tr><td><code>clearLabel</code></td><td><code>string</code></td><td>—</td><td>Accessible name of the clear button. It includes the field label by default. The tooltip only says “Clear”.</td></tr>
<tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>Class for the field container. Has no effect, and warns in development, inside InputGroup and in a horizontal-labels FormLayout.</td></tr>
<tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style for the field container.</td></tr>
<tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>Class for the file field box. A class written on the component lands here too, with no warning.</td></tr>
<tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style for the file field box. A style written on the component lands here too.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="FileInput events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>update:modelValue</code></td><td><code>File | File[] | null</code></td><td>Emitted when the selection changes.</td></tr>
<tr><td><code>change</code></td><td><code>File | File[] | null</code></td><td>Emitted with the same value, before <code>changeAction</code>.</td></tr>
<tr><td><code>actionError</code></td><td><code>unknown, File | File[] | null</code></td><td>Emitted when <code>changeAction</code> rejects.</td></tr>
</tbody></table>
</div>
