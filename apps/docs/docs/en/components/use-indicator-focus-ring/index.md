---
layout: component-docs
title: useIndicatorFocusRing
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Draws the standard focus ring on the indicator of a control whose real input is visually hidden; a checkbox or radio focuses an opacity-0 input, so the ring has to appear on the picture beside it. The ring is painted on the indicator's own element, which is the only element whose border-radius can shape it, and only on `:focus-visible`, so pointer clicks stay quiet. Owning it here means a theme-supplied indicator cannot ship a control with no visible focus (WCAG 2.4.7) by ignoring a prop.

```ts
import { useIndicatorFocusRing } from '@astryx-vue/core'
```

The ring is drawn by the `styles/indicator-focus-ring.css` stylesheet that this hook brings along: the hook marks the indicator with `data-astryx-focus-ring` and the stylesheet paints the outline from the theme's focus tokens. In a template, bind `focusProps.onFocus` to `@focusin` and `focusProps.onBlur` to `@focusout` on the wrapper, because a `focus` event does not bubble in the DOM.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Wrap only the indicator in the ref'd element; a wrapper holding label text would ring the whole row. |
| <Badge variant="success">Do</Badge> | Bind `focusProps` on the element that contains the hidden input (`@focusin` / `@focusout`), not on the input itself. |
| <Badge variant="error">Don't</Badge> | Ask a themeable indicator to draw its own focus ring; a replacement that ignores the prop leaves the control with no visible focus. |
