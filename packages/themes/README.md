# @astryx-vue/themes

CSS themes for [astryx-vue](https://github.com/astryx-vue/astryx-vue), an unofficial Vue 3 port of Astryx. Not affiliated with Meta.

One package ships every theme. Structural styles stay in `@astryx-vue/core`. A theme sets color, type, radius, shadow, and motion through CSS variables and cascade layers. There is no StyleX build step.

## Install

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

A theme does not render components by itself. Install `@astryx-vue/core` with it. Peer dependency of core: `vue` `^3.5.0`.

## Use

```ts
import '@astryx-vue/themes/neutral.css'
```

```html
<html data-astryx-theme="neutral">
```

Put `data-astryx-theme` on the element that should take the theme. On `html`, that is the whole app. On a smaller element, only that subtree. Neutral also writes the same variables on `:root`, so a single-theme app can import `neutral.css` without the attribute. The other themes do not touch `:root`.

Every theme loads Figtree and JetBrains Mono (400, 500, 600, 700, and 400 italic; Figtree also includes 600 italic). Butter, Chocolate, Gothic, Matcha, Stone, and Y2K also load their own text faces.

## Entries

| Entry | What it is |
| --- | --- |
| `@astryx-vue/themes/neutral.css` | Default look. Also applies on `:root`. |
| `@astryx-vue/themes/butter.css` | Golden surfaces, blue accents. |
| `@astryx-vue/themes/chocolate.css` | Warm brown and beige. |
| `@astryx-vue/themes/gothic.css` | Dark only. Deep blue-gray surfaces. |
| `@astryx-vue/themes/matcha.css` | Earthy greens. |
| `@astryx-vue/themes/stone.css` | Warm stone and slate. |
| `@astryx-vue/themes/y2k.css` | Periwinkle, cream, and sharp corners. |

## Related packages

| Package | What it is |
| --- | --- |
| `@astryx-vue/core` | The Vue components these variables style |
| `@astryx-vue/cli` | `astryx-vue search theme` and the rest of the docs lookup |

## Resources

- [Themes](https://astryx-vue.pages.dev/en/themes/)
- [CSS variables](https://astryx-vue.pages.dev/en/themes/css-variables)
- [Repository](https://github.com/astryx-vue/astryx-vue)

## License

MIT. Astryx is copyright Meta Platforms, Inc. This package is an unofficial port and is not affiliated with or endorsed by Meta.
