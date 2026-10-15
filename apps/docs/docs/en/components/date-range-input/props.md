---
layout: component-docs
title: Date Range Input
outline: false
footer: false
---

## DateRangeInput Props

<div class="component-api-table" role="region" aria-label="DateRangeInput props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>DateRange | null</code></td><td><code>null</code></td><td><code>{ start, end }</code> ISO dates.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required accessible name.</td></tr>
<tr><td><code>presets</code></td><td><code>{ label, getRange }[]</code></td><td>—</td><td>Shortcut buttons. <code>getRange</code> returns a range.</td></tr>
<tr><td><code>monthCount</code></td><td><code>number</code></td><td><code>2</code></td><td>How many months the popover shows.</td></tr>
<tr><td><code>numberOfMonths</code></td><td><code>1 | 2</code></td><td>—</td><td>Months side by side. This wins over monthCount.</td></tr>
<tr><td><code>dateConstraints</code></td><td><code>Array&lt;(date: Date) =&gt; boolean&gt;</code></td><td>—</td><td>A day is disabled when any function returns false.</td></tr>
<tr><td><code>min</code> / <code>max</code></td><td><code>string</code></td><td>—</td><td>ISO dates that cannot be selected outside.</td></tr>
<tr><td><code>minRangeSpan</code></td><td><code>number</code></td><td><code>1</code></td><td>Shortest span in days, including both ends.</td></tr>
<tr><td><code>maxRangeSpan</code></td><td><code>number</code></td><td>—</td><td>Longest span in days, including both ends.</td></tr>
<tr><td><code>weekStartsOn</code></td><td><code>0-6 | 'sun' | 'mon' | ...</code></td><td>Sunday, Monday for zh-CN</td><td>First column of the calendar.</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows a clear button.</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Select date range</code></td><td>Empty-state text. Follows the locale.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning, or success.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>Where the status message sits.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the field.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The field cannot be edited while a change is saving.</td></tr>
<tr><td><code>changeAction</code></td><td><code>(value) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Runs after the range is committed. A promise keeps the field busy.</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>—</td><td>Marks the label as optional.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>—</td><td>Marks the field required.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Hint shown from the info icon at the end of the label.</td></tr>
</tbody></table>
</div>
