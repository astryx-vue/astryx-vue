---
title: 深色模式
---

# 深色模式

Neutral 不提供单独的深色样式表。每条颜色写成 `light-dark(浅色, 深色)`，用元素的 `color-scheme` 决定取哪一边。

引入 `@astryx-vue/themes/neutral.css` 之后，`:root` 和 `[data-astryx-theme='neutral']` 上的 `color-scheme` 是 `light dark`，因此跟随系统，也跟随祖先已经设定的 `color-scheme`。

只要一边时，写在会包住界面的元素上：

```html
<html data-astryx-color-mode="dark">
```

```html
<html data-astryx-color-mode="light">
```

这两个属性分别把 `color-scheme` 设成 `dark` 或 `light`。不用再换一份 CSS。

文档站的明暗开关是 VitePress 的 `appearance`。打开深色时，站点在 `html` 上加 `dark`，并把 `color-scheme` 设成 `dark`，Neutral 的 `light-dark()` 就取深色那一档。这是文档站的做法，不是组件要求的 class 名。应用里用 `data-astryx-color-mode` 或自己设置 `color-scheme` 即可。

没有 JavaScript 主题对象，也不要同时维护一套深色 token 名字。要改某一档的颜色，仍覆盖原来的变量，并在 `light-dark()` 里写下两边。见 [扩展主题](/themes/extending)。
