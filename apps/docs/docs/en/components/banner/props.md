---
layout: component-docs
title: Banner
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Properties" tabindex="0">
<table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>status</code></td><td><code>&#x27;info&#x27; | &#x27;success&#x27; | &#x27;warning&#x27; | &#x27;error&#x27;</code></td><td>—</td><td>Required. Message status.</td></tr>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Required. Message title.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Supporting text below the title.</td></tr>
<tr><td><code>icon</code></td><td><code>Component</code></td><td>—</td><td>Custom decorative icon.</td></tr>
<tr><td><code>isDismissable</code></td><td><code>boolean</code></td><td>false</td><td>Shows the dismiss button. Dismissal hides the component.</td></tr>
<tr><td><code>dismissLabel</code></td><td><code>string</code></td><td>Dismiss {title}</td><td>Accessible name for the dismiss button. The tooltip stays the short word Dismiss unless this is set.</td></tr>
<tr><td><code>container</code></td><td><code>&#x27;card&#x27; | &#x27;section&#x27;</code></td><td>card</td><td>card has rounded corners. section has square corners.</td></tr>
<tr><td><code>elevation</code></td><td><code>&#x27;none&#x27; | &#x27;low&#x27; | &#x27;med&#x27; | &#x27;high&#x27;</code></td><td>none</td><td>Shadow depth for the whole banner.</td></tr>
<tr><td><code>collapsible</code></td><td><code>boolean</code></td><td>true</td><td>Whether detail content can collapse.</td></tr>
<tr><td><code>defaultIsOpen</code></td><td><code>boolean</code></td><td>false</td><td>Initial expansion when isOpen is not bound.</td></tr>
<tr><td><code>v-model:isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Controls expansion from the parent.</td></tr>
<tr><td><code>expandLabel</code></td><td><code>string</code></td><td>Expand</td><td>Accessible name and tooltip for the expand button. Follows the active locale.</td></tr>
<tr><td><code>collapseLabel</code></td><td><code>string</code></td><td>Collapse</td><td>Accessible name and tooltip for the collapse button. Follows the active locale.</td></tr>
</tbody></table>
</div>

## Slots

- Default: details below the header.
- `title`: replaces the visible title. The `title` prop remains required.
- `description`: replaces the supporting text.
- `icon`: replaces the decorative status icon.
- `end`: action buttons at the end of the header.

Title, description and detail slots accept block content.

## Expanding and collapsing

- Detail content enables the expand button.
- Details start collapsed by default.
- `defaultIsOpen` sets the initial state only.
- `v-model:isOpen` controls the current state.
- `collapsible` set to `false` keeps details visible.
- Collapsing unmounts the details.
- If a parent closes focused details, focus returns to the expand button.

```vue
<Banner v-model:is-open="open" status="info" title="Configuration changes">
  <p>Review the updated settings before continuing.</p>
</Banner>
```

## Dismissal

- `isDismissable` shows a dismiss button.
- Clicking it hides the component.
- The component emits `dismiss`.
- Dismissal tries to restore focus to the element used before entering the banner.
- Remount the component or change its `key` to show it again.

## Events and template references

- `update:isOpen(value)`: requests an expansion change.
- `dismiss()`: dismisses the banner.
- `element`: the root `HTMLDivElement | null`. It becomes `null` after dismissal.

## Localization

Provide translated control labels:

- `dismissLabel`: dismiss button.
- `expandLabel`: expand button.
- `collapseLabel`: collapse button.

## Theme

```css
.my-banner {
  --astryx-banner-info-background: #ecfdf5;
  --astryx-banner-info-foreground: #065f46;
}
```

- `--astryx-banner-info-background`: information background.
- `--astryx-banner-info-foreground`: information text and icon.
- `--astryx-banner-success-background`: success background.
- `--astryx-banner-success-foreground`: success text and icon.
- `--astryx-banner-warning-background`: warning background.
- `--astryx-banner-warning-foreground`: warning text and icon.
- `--astryx-banner-error-background`: error background.
- `--astryx-banner-error-foreground`: error text and icon.
- `--astryx-banner-content-background`: detail background.
- `--astryx-banner-border`: detail border.
- `--astryx-radius-container`: card corner radius.

Neutral follows the active light or dark mode.
