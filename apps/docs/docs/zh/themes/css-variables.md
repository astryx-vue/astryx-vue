---
title: CSS 变量
---

# CSS 变量

主题和组件样式都走 CSS 变量和 CSS 分层。使用方不需要安装 UnoCSS 或 StyleX。

`packages/themes/neutral/base.css` 开头声明层的顺序：

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

语义 token 写在 `astryx.tokens`。组件的结构样式写在 `astryx.components`，由 `@astryx-vue/core` 提供。应用自定义覆盖属于最后一层 `astryx.overrides`。未分层的样式，以及排在更后面的层，都会压过前面的层。

变量名跟原版 token 走，前面加 `--astryx-`。例如原版的文本主色，这里是 `--astryx-color-text-primary`。颜色值写成：

```css
--astryx-color-text-primary: light-dark(#171717, #fafafa);
```

`light-dark()` 看的是元素的 `color-scheme`。Neutral 在 `:root` 和 `[data-astryx-theme='neutral']` 上把 `color-scheme` 设成 `light dark`，于是跟随系统或文档站自己的明暗开关。强制一边的写法在 [深色模式](/guide/dark-mode)。[`Theme`](/components/theme) 可以把同一批变量写到某一棵子树上。

组件还会有自己的变量，例如按钮的 `--astryx-button-primary-background`。这些名字定义在 `packages/themes/neutral/<组件>.css`，通常引用语义 token。换外观时优先改语义 token；只有某个组件要单独偏离时，再改它自己的变量。

`@astryx-vue/core/reset.css` 目前只有一行，用来声明 `@layer astryx.reset`。它不是一份完整的浏览器重置。需要这份层存在时再引入。

一次引入全部结构样式：

```ts
import '@astryx-vue/core/styles.css'
```

只从 `@astryx-vue/core/Button` 这类子路径引入组件时，那个入口会带上自己的结构样式。主题样式仍然要单独引入，见 [主题与样式](/guide/styling)。
