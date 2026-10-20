---
layout: component-docs
title: Time Input
outline: false
footer: false
---

## TimeInput Props

<div class="component-api-table" role="region" aria-label="TimeInput props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string | null</code></td><td><code>null</code></td><td>ISO time, <code>HH:MM</code> or <code>HH:MM:SS</code>.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required accessible name.</td></tr>
<tr><td><code>hourFormat</code></td><td><code>'12h' | '24h'</code></td><td><code>'12h'</code></td><td>How the value is shown. The model stays 24-hour ISO.</td></tr>
<tr><td><code>hasSeconds</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keep seconds in the value.</td></tr>
<tr><td><code>increment</code></td><td><code>number</code></td><td><code>1</code></td><td>Minutes added or removed by the arrow keys.</td></tr>
<tr><td><code>min</code></td><td><code>string</code></td><td>—</td><td>Earliest ISO time.</td></tr>
<tr><td><code>max</code></td><td><code>string</code></td><td>—</td><td>Latest ISO time.</td></tr>
<tr><td><code>presentation</code></td><td><code>'text-input' | 'native' | 'adaptive-native' | 'adaptive-bottom-sheet' | 'popover' | 'bottom-sheet'</code></td><td><code>'adaptive-native'</code></td><td>Typed field, or the platform time input on a coarse pointer. Seconds and a non-1 increment stay typed.</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear button.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Field height.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning, or success.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>Where the status message sits.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the field.</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Explains why the field is disabled. With <code>isDisabled</code>, the message shows in a tooltip on hover or keyboard focus and the input stays focusable with <code>aria-disabled</code>; the value still cannot change.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The field cannot be edited and shows a spinner.</td></tr>
<tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>Loading</code> / <code>加载中</code></td><td>Screen-reader text for the spinner.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Hint shown from the info icon at the end of the label.</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Select a time</code></td><td>Empty-state text. While the field is focused and empty, a format hint replaces it.</td></tr>
</tbody></table>
</div>
