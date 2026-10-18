---
layout: component-docs
title: Step
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Step props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>step</code></td><td><code>number</code></td><td>—</td><td>Zero-based index of this step. Compared with the stepper's <code>activeStep</code> to derive the progress. Required.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Step name. Required.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Supporting line under the label.</td></tr>
<tr><td><code>status</code></td><td><code>'accent' | 'success' | 'warning' | 'error'</code></td><td>—</td><td>Recolors the indicator only. The connector stays on the progress color.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the step can be skipped over. Its label is dimmed, and the stepper's controls step past it.</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Appends an Optional marker after the label.</td></tr>
<tr><td><code>indicator</code></td><td><code>'auto' | 'number' | 'none'</code></td><td><code>'auto'</code></td><td><code>auto</code> shows a check when done, a ring while in progress, and a number after that. <code>number</code> always shows the step number. <code>none</code> leaves the indicator empty.</td></tr>
<tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td>The stepper's density</td><td>Space around this step.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: content under the description. In a vertical separated step it sits outside the clickable label row.
- `icon`: replaces the built-in indicator artwork. A `Spinner` makes it live.
- `end`: trailing content on the label row, such as a duration.
