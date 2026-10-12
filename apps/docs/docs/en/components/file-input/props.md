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
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the field required.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a spinner, for an upload in progress.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Help text under the label.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the whole field. Numbers are pixels.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="FileInput events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>update:modelValue</code></td><td><code>File | File[] | null</code></td><td>Emitted when the selection changes.</td></tr>
<tr><td><code>change</code></td><td><code>File | File[] | null</code></td><td>Emitted with the same value.</td></tr>
</tbody></table>
</div>
