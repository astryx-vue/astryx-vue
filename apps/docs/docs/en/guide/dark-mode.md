---
title: Dark mode
---

# Dark mode

Neutral does not ship a separate dark stylesheet. Each color is `light-dark(light, dark)`, and the element's `color-scheme` picks the stop.

After `@astryx-vue/themes/neutral.css` loads, `:root` sets `color-scheme` to `light dark`. The page follows the system, and a `color-scheme` your own CSS sets on `html` wins over it. A theme's wrapper element declares no scheme, so it takes the one around it.

To force one side, set the attribute on an element that wraps the UI:

```html
<html data-astryx-color-mode="dark">
```

```html
<html data-astryx-color-mode="light">
```

Those attributes set `color-scheme` to `dark` or `light`. You do not swap stylesheets.

A `system` `Theme` takes the scheme of the page around it, not the device's setting directly. The page root's `color-scheme` decides: `light` or `dark` there is what the `Theme` shows, and `light dark` (what `reset.css` and Neutral's `:root` rule write) follows the reader. With no `color-scheme` on the root and no `<meta name="color-scheme">`, the page is light. A host that draws the page dark therefore gets the dark theme inside the `Theme` too, and `useTheme().mode` reports the same scheme. A theme's own `@dark` and `@light` component styles follow it as well: the root `Theme` names the scheme it draws in on `<html data-astryx-scheme>`. Inside a `Theme` that forces light or dark, a `system` `Theme` follows the reader's setting again.

The docs site's switch is VitePress `appearance`. Dark mode adds `dark` on `html` and sets `color-scheme: dark`, so Neutral's `light-dark()` uses the dark stop. That class belongs to the docs site. It is not an API the components require. In an app, use `data-astryx-color-mode` or set `color-scheme` yourself.

`Theme` can force one side for a subtree with `mode="dark"` or `mode="light"`. See [Theme](/en/components/theme). There is no parallel set of dark token names. To change a stop, override the original variable and write both sides inside `light-dark()`. See [Extending a theme](/en/guide/extending-themes).
