---
layout: component-docs
title: Tooltip
outline: false
footer: false
---

## Tooltip Props

<div class="component-api-table" role="region" aria-label="Tooltip props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>content</code></td><td><code>string</code></td><td>—</td><td>Tooltip text. Use the <code>content</code> slot for rich content.</td></tr>
<tr><td><code>placement</code></td><td><code>'above' | 'below' | 'start' | 'end'</code></td><td><code>'above'</code></td><td>Side of the trigger. Flips when there is no room.</td></tr>
<tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'center'</code></td><td>Alignment along the placement axis.</td></tr>
<tr><td><code>delay</code></td><td><code>number</code></td><td><code>200</code></td><td>Milliseconds before showing on hover.</td></tr>
<tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>0</code></td><td>Milliseconds before hiding. 0 uses a 100ms bridge so the pointer can reach the bubble.</td></tr>
<tr><td><code>focusTrigger</code></td><td><code>'auto' | 'always' | 'never'</code></td><td><code>'auto'</code></td><td>Whether focus shows the tooltip. auto listens only when the trigger is focusable.</td></tr>
<tr><td><code>touchTrigger</code></td><td><code>'auto' | 'tap' | 'none'</code></td><td><code>'auto'</code></td><td>Tap behavior on touch. auto skips buttons, links, and form controls.</td></tr>
<tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Disables hover and focus triggers when false.</td></tr>
<tr><td><code>hasHoverIndication</code></td><td><code>'auto' | boolean</code></td><td><code>'auto'</code></td><td>Dashed underline on a text-only trigger. auto applies it only to text.</td></tr>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. Hover and focus are ignored when set.</td></tr>
<tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show on mount.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires when the tooltip shows or hides. With `isOpen`, it fires with `false` on Escape and the parent decides whether to close.

## Slots

- `default`: the trigger.
- `content`: rich tooltip content. Replaces the `content` prop text.

## Theme

```css
.my-tooltip {
  --astryx-tooltip-background: #000;
  --astryx-tooltip-foreground: #fff;
}
```

- `--astryx-tooltip-background`: bubble background.
- `--astryx-tooltip-foreground`: bubble text color.
- `--astryx-tooltip-indication-color`: dashed underline color.
- `--astryx-tooltip-z-index`: stacking order of the bubble.
