---
layout: component-docs
title: Avatar Status Dot
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="AvatarStatusDot props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>variant</code></td><td><code>'success' | 'neutral' | 'error'</code></td><td><code>'success'</code></td><td>Semantic status, where colour comes with its own shape so the state never rests on colour alone: <code>success</code> is a filled dot, <code>neutral</code> is a hollow ring, and <code>error</code> is a dot with a minus bar across it. The older names <code>info</code> and <code>warning</code> are still accepted and draw as <code>success</code> and <code>error</code>.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the status, such as <code>Online</code>. Inside an Avatar it is composed into the avatar's own name (<code>Jane Doe, Online</code>); a standalone dot exposes <code>role="img"</code> with this name. When omitted the dot is <code>aria-hidden</code>, so it is invisible to assistive technology.</td></tr>
</tbody></table>
</div>

## Size

The dot reads the size of the enclosing Avatar and picks one of three tiers, so it stays legible at every avatar size instead of shrinking without limit. Outside an Avatar it uses the default `md` size (36px).

| Avatar size | Dot | Border | Icon |
| --- | --- | --- | --- |
| 36px and under | 10px | 1px | not shown |
| 37px to 72px | 20px | 2px | 12px |
| 73px and over | 32px | 4px | 18px |

## Slots

- `icon`: an icon drawn in the middle of the dot. A rendered icon replaces the built-in shape glyph, so use a different icon per status. Icons are not drawn at the smallest tier, where there is no room for them to be legible.

## Theming

```css
.my-avatar-status-dot {
  --astryx-avatar-status-dot-size: 12px;
  --astryx-avatar-status-dot-border-width: 2px;
  --astryx-avatar-status-dot-border-color: #ffffff;
  --astryx-avatar-status-dot-success-background: #198100;
  --astryx-avatar-status-dot-success-foreground: #ffffff;
  --astryx-avatar-status-dot-neutral-background: #ffffff;
  --astryx-avatar-status-dot-neutral-foreground: #525252;
  --astryx-avatar-status-dot-error-background: #e33f4a;
  --astryx-avatar-status-dot-error-foreground: #ffffff;
}
```

`size` overrides the size the dot derived from the avatar; the shape drawn inside keeps the size it was computed at.
