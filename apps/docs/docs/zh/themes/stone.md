---
aside: false
title: Stone 主题
---

# Stone（原石极简板岩主题）

Stone 是一套克制、坚韧、极富现代建筑质感的主题。它融合了温暖的天然石材色与冷静的板岩灰，质朴而高级，适合设计工作室官网、高品质文档站、技术博客或极简作品集。

- **字体配置：** 正文沿用优秀的现代无衬线字体 Figtree，标题采用几何感强烈的经典字体 Montserrat。
- **作用范围：** 仅对带有 `data-astryx-theme="stone"` 的元素及其子树生效，不会污染全局 `:root`。

## 引入与使用

在项目中引入 Stone 主题样式表：

```ts
import '@astryx-vue/themes/stone.css'
```

在需要使用该风格的容器标签上加上主题标记即可：

```html
<div data-astryx-theme="stone">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Stone 风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="stone" />
