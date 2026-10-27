---
title: Theme and styles
---

# Theme and styles

An app imports two things at minimum: a theme, and structural styles for the components it uses.

```ts
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
```

The `Button` entry loads the structural sheet for `button`. The theme entry loads Neutral's variables, including the `--astryx-button-*` names that button reads. Without the theme, the structure is there and the color and metrics are not. Without the structural sheet, the variables have no rules to feed.

To load every structural sheet once, add this at the entry:

```ts
import '@astryx-vue/core/styles.css'
import '@astryx-vue/themes/neutral.css'
```

`styles.css` gathers the sheets in `packages/core/styles/`, including the shared motion in `motion.css`. `neutral.css` gathers the theme files in `packages/themes/neutral/` and loads Figtree and JetBrains Mono.

The layer order is:

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

Application overrides belong in `astryx.overrides`. Unlayered global CSS beats these layers, so a bare `button { }` will paint over the component unless that is what you want.

## Using Tailwind or UnoCSS alongside

They work together as long as the layer order is fixed.

One rule matters: the position of every layer on the page is set by **where it first appears**. The reliable way is to declare all the layers in one statement at the top of your app entry.

```css
@layer theme, base, astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides, components, utilities;

@import 'tailwindcss';
@import '@astryx-vue/core/styles.css';
@import '@astryx-vue/themes/neutral.css';
```

Earlier layers are weaker and later layers win. The utilities layer sits after `astryx.components`, so `class="p-0"` beats the padding a component sets. `astryx.overrides` sits before utilities, so it cannot beat them. When one rule must win over a utility class, do not reach for `overrides`; reorder the layers, or write the rule unlayered.

One note on syntax: an `@layer` statement may come before `@import`. That is one of the few orders CSS allows; the other way round the whole block is discarded as invalid.

### Use our variables in utility classes

No config needed; arbitrary values work as they are.

```html
<div class="p-[var(--astryx-spacing-4)] text-[var(--astryx-color-text-primary)]">
  ...
</div>
```

Tailwind v4 can also register the variables as its own tokens, which reads shorter.

```css
@theme inline {
  --color-surface: var(--astryx-color-background-card);
  --color-body: var(--astryx-color-text-primary);
}
```

Then write `bg-surface` and `text-body`. Do not drop `inline`. Tailwind's guidance is that a theme value pointing at another variable needs it; without it the generated utility reads `--color-surface` itself rather than our variable, and colors scoped to a theme stop following.

### UnoCSS

UnoCSS emits utilities as ordinary rules with no layer. Unlayered rules beat any `@layer`, so utilities win over component styles with no ordering work.

The cost is the mirror image: layered CSS you write cannot beat a UnoCSS class. To override one, write a more specific selector, or write unlayered CSS.

If you turn on UnoCSS's CSS layer output (`outputToCssLayers`), treat it like Tailwind and place its layers after `astryx.components`.

## Using CSS Modules or plain CSS

Both work. Three things to keep in mind.

**Class names do not collide.** `<style module>` and `*.module.css` rename your classes, so name them freely.

**Reaching inside a component takes a doorway.** Scoped styles use `:deep()`; CSS Modules use `:global`.

```vue
<style module>
/* Change the width of one element inside the component */
.panel :global(.astryx-layout__panel) {
  width: 420px;
}
</style>
```

**Values still come from variables.** Your own class names are fine; colors and spacing are still `var(--astryx-*)`. Slipping a `#171717` in breaks both dark mode and theming.

If the project uses no layers at all, write specific selectors. Avoid bare element selectors such as `button { }`, and avoid a global `* { }`.

These styles do not require UnoCSS. The docs site uses UnoCSS only so example classes such as `i-carbon-*` can draw icons. That is the icon approach, not a styling dependency. See [Icons](/en/guide/icons).

Variable names, `light-dark()`, and what the theme covers today are in [CSS variables](/en/themes/css-variables) and [Neutral](/en/themes/neutral).
