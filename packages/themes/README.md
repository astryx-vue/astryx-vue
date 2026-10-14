# @astryx-vue/themes

Themes for astryx-vue.

Docs: <https://astryx-vue.pages.dev>

```bash
pnpm add @astryx-vue/core @astryx-vue/themes
```

```ts
import '@astryx-vue/themes/neutral.css'
```

Neutral, Butter, Chocolate, Gothic, Matcha, Stone, and Y2K each have an entry: `@astryx-vue/themes/<name>.css`. Set `data-astryx-theme="<name>"` on the element that should use it. Neutral also applies on `:root`.

Every entry loads Figtree and JetBrains Mono at 400, 500, 600, 700, and 400 italic. Figtree also includes 600 italic. The other themes also load their text faces. Component styles come from `@astryx-vue/core`; import `@astryx-vue/core/styles.css` once if you want the full structural sheet.
