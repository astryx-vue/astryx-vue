---
layout: component-docs
title: Date Time Input
outline: false
footer: false
---

## DateTimeInput Props

<div class="component-api-table" role="region" aria-label="DateTimeInput props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string | null</code></td><td><code>null</code></td><td><code>YYYY-MM-DDTHH:MM</code>. Null until both parts exist.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required accessible name of the pair.</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Placeholder for the date field.</td></tr>
<tr><td><code>hourFormat</code></td><td><code>'12h' | '24h'</code></td><td><code>'12h'</code></td><td>Display format of the time. The model stays ISO.</td></tr>
<tr><td><code>presentation</code></td><td><code>TimePresentation</code></td><td>—</td><td>Passed through to the time field.</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Clears the date and the time together.</td></tr>
<tr><td><code>min</code> / <code>max</code></td><td><code>string</code></td><td>—</td><td>ISO bounds for the time portion.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Height of both fields.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning, or success for the pair.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>Where the status message sits.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables both fields.</td></tr>
</tbody></table>
</div>
