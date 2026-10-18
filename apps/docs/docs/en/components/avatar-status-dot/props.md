---
layout: component-docs
title: Avatar Status Dot
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="AvatarStatusDot props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>variant</code></td><td><code>'neutral' | 'info' | 'success' | 'warning' | 'error'</code></td><td><code>'neutral'</code></td><td>Colour of the dot. <code>neutral</code> is grey, <code>info</code> blue, <code>success</code> green, <code>warning</code> yellow, and <code>error</code> red.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the status, such as <code>Online</code>. The dot then exposes <code>role="img"</code> with this name. When omitted the dot is <code>aria-hidden</code>, so it is invisible to assistive technology.</td></tr>
</tbody></table>
</div>

## Slots

None. The dot paints itself.

## Theming

```css
.my-avatar-status-dot {
  --astryx-avatar-status-dot-size: 12px;
  --astryx-avatar-status-dot-border-color: #ffffff;
  --astryx-avatar-status-dot-neutral-background: #a3a3a3;
  --astryx-avatar-status-dot-info-background: #0074e2;
  --astryx-avatar-status-dot-success-background: #198100;
  --astryx-avatar-status-dot-warning-background: #ffce2f;
  --astryx-avatar-status-dot-error-background: #e33f4a;
}
```
