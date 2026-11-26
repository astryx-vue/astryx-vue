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
<tr><td><code>hourFormat</code></td><td><code>'12h' | '24h'</code></td><td>The locale's hour cycle</td><td>How the value is shown. Unset, it follows the active locale: 12-hour for <code>en</code>, 24-hour for <code>en-GB</code>, <code>de-DE</code> and <code>zh-CN</code>. Digits, separators and day-period words follow the locale too. The model stays 24-hour ISO.</td></tr>
<tr><td><code>hasSeconds</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keep seconds in the value.</td></tr>
<tr><td><code>increment</code></td><td><code>number</code></td><td><code>1</code></td><td>Minutes added or removed by the arrow keys. Steps are whole minutes; a fractional value leaves the time unchanged.</td></tr>
<tr><td><code>entryErrorBehavior</code></td><td><code>'complete' | 'blur-or-enter'</code></td><td><code>'complete'</code></td><td>When a rejected entry shows. A typed time is complete once it has its hours, both minute digits, both second digits when seconds show, and, in 12-hour text, its day period (hours 0 and 13 to 23 need none). <code>complete</code> shows a complete time outside <code>min</code> or <code>max</code> at once; <code>blur-or-enter</code> waits for Enter or blur. Text that is not a time always waits for Enter or blur. The rejected text stays in the field, the field shows why, sets <code>aria-invalid</code> and announces it once. Enter commits the draft and still submits a surrounding form. A caller <code>error</code> status with a message shows in place of the field's message; a warning or success status never hides a rejection. Without a <code>FormLayout</code> default it is <code>complete</code>.</td></tr>
<tr><td><code>min</code></td><td><code>string</code></td><td>—</td><td>Earliest ISO time.</td></tr>
<tr><td><code>max</code></td><td><code>string</code></td><td>—</td><td>Latest ISO time.</td></tr>
<tr><td><code>presentation</code></td><td><code>'text-input' | 'native' | 'adaptive-native' | 'adaptive-bottom-sheet' | 'popover' | 'bottom-sheet'</code></td><td><code>'adaptive-native'</code></td><td>Typed field, platform time control, or hour and minute wheels. Omitted means typed text on a fine pointer and the platform control on a coarse pointer. adaptive-bottom-sheet uses wheels only on a coarse pointer; bottom-sheet always uses wheels. Seconds, a step other than 1, or a preset interval send the platform control back to typed text. The wheels are unaffected. An explicit value wins over nativePicker.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hides the label visually while keeping it accessible. <code>labelHidden</code> is the older name; either one hides it.</td></tr>
<tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>Class for the field container. Has no effect, and warns in development, inside InputGroup and in a horizontal-labels FormLayout.</td></tr>
<tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style for the field container. Same targeting as containerClass.</td></tr>
<tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>Class for the bordered control box. A class written on the component lands here too, not on the inner input.</td></tr>
<tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style for the bordered control box.</td></tr>
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

## TimeInput events

<div class="component-api-table" role="region" aria-label="TimeInput events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>update:modelValue</code></td><td><code>value: string | null</code></td><td>Emitted when the time changes.</td></tr>
<tr><td><code>entryErrorChange</code></td><td><code>error: { kind, text, time? } | null</code></td><td>Emitted each time the field's rejection of typed text starts, changes, or ends (<code>null</code>). <code>kind</code> is <code>unreadable</code> or <code>outOfRange</code>; <code>time</code> is the ISO time the text names, for <code>outOfRange</code>.</td></tr>
</tbody></table>
</div>
