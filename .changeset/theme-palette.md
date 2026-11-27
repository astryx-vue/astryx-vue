---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

`defineTheme({ palette })`：主题可以从几个种子色拿到整套颜色。新入口 `@astryx-vue/core/palette` 的 `themePalette({ accent, neutral, success, warning, danger, info, vibrancy, recipe })` 生成调色板，映射成表面、文字、边框、图标、强调色和四种状态色的 token，并把强调色浅底、中性色轨道和彩色卡片上的次要文字提亮一档；显式的 `tokens` 和 `components` 仍然逐项优先。没写 `recipe` 时按 `astryx-oklch-v1` 生成。入口还导出 `generateTonalPalette()` 和它的类型，只有引入这个入口的应用才会带上生成器。
