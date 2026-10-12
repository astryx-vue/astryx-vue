---
title: Dark mode
---

# Dark mode

Neutral does not ship a separate dark stylesheet. Each color is `light-dark(light, dark)`, and the element's `color-scheme` picks the stop.

After `@astryx-vue/themes/neutral.css` loads, `:root` and `[data-astryx-theme='neutral']` set `color-scheme` to `light dark`. The result follows the system, and it follows a `color-scheme` an ancestor already set.

To force one side, set the attribute on an element that wraps the UI:

```html
<html data-astryx-color-mode="dark">
```

```html
<html data-astryx-color-mode="light">
```

Those attributes set `color-scheme` to `dark` or `light`. You do not swap stylesheets.

The docs site's switch is VitePress `appearance`. Dark mode adds `dark` on `html` and sets `color-scheme: dark`, so Neutral's `light-dark()` uses the dark stop. That class belongs to the docs site. It is not an API the components require. In an app, use `data-astryx-color-mode` or set `color-scheme` yourself.

There is no JavaScript theme object, and there is no parallel set of dark token names. To change a stop, override the original variable and write both sides inside `light-dark()`. See [Extending a theme](/en/themes/extending).
