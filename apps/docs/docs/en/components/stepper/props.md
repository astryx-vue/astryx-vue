---
layout: component-docs
title: Stepper
outline: false
footer: false
---

## Stepper props

<div class="component-api-table" role="region" aria-label="Stepper Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>activeStep</code></td><td><code>number</code></td><td>-</td><td>Zero-based index of the current step.</td></tr>
      <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Layout direction.</td></tr>
      <tr><td><code>onStepClick</code></td><td><code>(index: number) =&gt; void</code></td><td>-</td><td>When set, steps are buttons. <code>@step-click</code> fills this prop.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Progress</td><td>Accessible name of the list.</td></tr>
      <tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td><code>'balanced'</code></td><td>Space around each step.</td></tr>
      <tr><td><code>indicatorPosition</code></td><td><code>'separated' | 'on-track'</code></td><td><code>'separated'</code></td><td>Whether the marker sits on the connector or beside a separate bar.</td></tr>
      <tr><td><code>hasCollapsibleLabels</code></td><td><code>boolean</code></td><td><code>false</code></td><td>In a horizontal stepper narrower than 480px, hide every label except the current one.</td></tr>
    </tbody>
  </table>
</div>

## Step props

<div class="component-api-table" role="region" aria-label="Step Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>step</code></td><td><code>number</code></td><td>-</td><td>Zero-based index of this step.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Step name.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>Supporting line under the label.</td></tr>
      <tr><td><code>status</code></td><td><code>'accent' | 'success' | 'warning' | 'error'</code></td><td>-</td><td>Recolors the indicator only. The connector stays on the progress color.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The step cannot be activated.</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Appends an Optional marker.</td></tr>
      <tr><td><code>indicator</code></td><td><code>'auto' | 'number' | 'none'</code></td><td><code>'auto'</code></td><td><code>auto</code> shows a check, a ring, or a number. <code>number</code> always shows the step number.</td></tr>
      <tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td>The stepper's density</td><td>Space for this step.</td></tr>
    </tbody>
  </table>
</div>

## Step slots

<div class="component-api-table" role="region" aria-label="Step Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>default</code></td><td>Content under the label. In a vertical separated step it sits outside the button.</td></tr>
      <tr><td><code>icon</code></td><td>Replaces the built-in indicator artwork.</td></tr>
      <tr><td><code>end</code></td><td>Trailing content on the label row.</td></tr>
    </tbody>
  </table>
</div>
