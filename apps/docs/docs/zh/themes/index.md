---
aside: false
title: 主题概览
---

# 主题概览

主题决定组件的颜色、字体、圆角、阴影和动画时长。组件的结构样式在 `@astryx-vue/core`。

```ts
import '@astryx-vue/themes/neutral.css'
```

把 `data-astryx-theme="neutral"` 写在要使用这套主题的元素上。写在 `html` 上就是整站，写在更小的元素上就只影响那一块。Neutral 还会把同一批变量写到 `:root`，所以只使用 Neutral 时，引入 `neutral.css` 即可。其余主题不会改 `:root`。

每套主题都会带上 Figtree 和 JetBrains Mono。Butter、Chocolate、Gothic、Matcha、Stone 和 Y2K 还会加载各自的正文字体。

<ThemeGallery />

各套主题的引入方式见 [Neutral](/themes/neutral)、[Butter](/themes/butter)、[Chocolate](/themes/chocolate)、[Gothic](/themes/gothic)、[Matcha](/themes/matcha)、[Stone](/themes/stone)、[Y2K](/themes/y2k)。变量名是共用的，说明在 [CSS 变量](/themes/css-variables)。[Design token](/themes/tokens) 和这些变量怎么对应，以及 [颜色](/themes/color)、[排版与字体](/themes/typography)、[动画](/themes/motion)，都写在旁边。只改个别取值时，看 [扩展主题](/themes/extending)。要把一份主题对象套到某一棵子树上，用 [主题](/components/theme)、[媒体主题](/components/media-theme) 和 [语法主题](/components/syntax-theme)。
