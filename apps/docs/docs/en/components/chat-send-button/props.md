---
layout: component-docs
title: Chat Send Button
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatSendButton props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>isStopShown</code></td><td><code>boolean</code></td><td>Composer's value</td><td>Shows stop instead of send. Leave it unset inside a composer and the shell decides.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>Inverse of whether the draft can be sent</td><td>Disables send. Does not disable stop. Leave it unset inside a composer to follow the shell's readiness.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Button size, forwarded to <code>Button</code>.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ChatSendButton events" tabindex="0">
<table><thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>send</code></td><td>—</td><td>Send was activated. Inside a composer without this listener the current draft is submitted for you.</td></tr>
<tr><td><code>stop</code></td><td>—</td><td>Stop was activated. Inside a composer without this listener the shell's stop action runs.</td></tr>
<tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>Follows the send or stop action.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="ChatSendButton slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td><code>sendIcon</code></td><td>Replaces the up arrow.</td></tr>
<tr><td><code>stopIcon</code></td><td>Replaces the stop square.</td></tr>
</tbody></table>
</div>
