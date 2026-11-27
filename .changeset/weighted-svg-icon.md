---
'@astryx-vue/lab': minor
'@astryx-vue/cli': patch
---

新增 `WeightedSVGIcon`：每个字重（300-700）带一张图的 SVG 图标，显示和周围文字字重对得上的那一张，粗体文字里的图标自己画粗的版本，不用传属性；`weight` 可以固定字重，`WeightedIconSprite` 加 `sprite` 让重复的图标只在页面上出现一次。附带 `buildWeightedIcon()`（相邻字重相同的图合成一层、只保留用得到的字重）、`registerWeightProbe()` 和 15 个演示图标 `weightedStarterIcons`。
