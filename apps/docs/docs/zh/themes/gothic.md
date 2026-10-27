---
aside: false
title: Gothic 主题
---

# Gothic（哥特冷峻深色主题）

Gothic 是一套专为沉浸式夜间体验打造的纯深色主题。它采用深邃的冷感蓝灰色作为表面底色。即使你的外部宿主页面当前处于浅色白天模式，应用了 Gothic 的容器依然会坚定地保持冷峻的深色暗夜质感。

- **字体配置：** 正文采用 Fustat 字体，展示型大字号采用极具视觉冲击力的 Manufacturing Consent。
- **纯深色特性：** 不受外部浅色模式影响，始终保持暗色调。
- **作用范围：** 仅对带有 `data-astryx-theme="gothic"` 的元素及其子树生效，不会污染全局 `:root`。

## 引入与使用

在项目中引入 Gothic 主题样式表：

```ts
import '@astryx-vue/themes/gothic.css'
```

在需要使用该风格的容器标签上加上主题标记即可：

```html
<div data-astryx-theme="gothic">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Gothic 纯深色风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="gothic" />
