---
title: 主题概览
---

# 主题概览

主题决定组件用哪一套颜色、字体、圆角、阴影和动画时长。组件自己的结构样式在 `@astryx-vue/core`，主题在 `@astryx-vue/themes`。两边分开装、分开引入。

目前提供 Neutral 主题作为默认外观：中性灰底色，明暗两套颜色写在同一批 CSS 变量里，不绑定特定品牌色。所有的样式定制与扩展都沿着统一的 CSS 变量名展开。

选用时做这三件事：

1. 安装 `@astryx-vue/themes`。
2. 在应用入口引入一次 `@astryx-vue/themes/neutral.css`。
3. 需要改某一项时，覆盖对应的 `--astryx-*` 变量，而不是改组件的结构样式。

```ts
import '@astryx-vue/themes/neutral.css'
```

引入上面这一行就会带上 JetBrains Mono。正文和标题的字体栈写的是 Figtree，再落到系统无衬线字体。Figtree 本身不在主题包里，要用它就在应用里自己加载。

接下来可以看 [Neutral](/themes/neutral) 现在具体覆盖了什么，看 [Design token](/themes/tokens) 和 [CSS 变量](/themes/css-variables) 这两套名字怎么对应，或者直接看 [颜色](/themes/color)、[排版与字体](/themes/typography)、[动画](/themes/motion)。想改出自己的外观，读 [扩展主题](/themes/extending)。
